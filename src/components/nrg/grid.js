Ext.define('Mzk.Nrg.Helper', {
    singleton: true,
    dataStoreUrl: '', // /gas/marketpartner
    tooltipRenderer: function (value, metaData, record, rowIndex, colIndex) {
        if (Ext.isDefined(record)) {
            var recordData = record.getData();
            if (recordData['_source'] && recordData['_source']['contact']) {
                var contactData = recordData['_source']['contact'];
                if (contactData.ansprechpartner) {
                    var tooltip = '<table>';
                    Ext.iterate(contactData.ansprechpartner, function (key, val) {
                        tooltip += '<tr></tr><td>' + key + '</td><td>' + val + '</td></tr>';
                    });
                    tooltip += '</table>';
                    metaData.tdAttr = 'data-qtip=' + Ext.encode(tooltip);
                }
            }
        }
        return value;
    }
});

Ext.define('Mzk.Nrg.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.accountGrid',
    iconCls: 'x-fa fa-group',
    controller: 'accountGridController',
    listeners: {
        select: 'onSelect'
    },
    bind: {
        title: 'DVGW Marktpartner - {storeRecordCount}'
    },
    hideHeaders: true,
    tbar: [{
        xtype: 'container',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        flex: 1,
        padding: '15 20 15 20',
        items: [
            {
                xtype: 'textfield',
                flex: 1,
                emptyText: 'Marktpartnersuche',
                listeners: {
                    'change': function (cmp, newVal, oldVal, eOpts) {
                        var store = cmp.up('accountGrid').getStore();
                        store.getProxy().setExtraParam('q', newVal);
                        store.load();
                    }
                }
            }]
    }],
    columns: [
        {
            text: 'Code',
            dataIndex: 'code',
            flex: 2,
            renderer: Mzk.Nrg.Helper.tooltipRenderer
        },
        {
            text: 'Typ',
            flex: 1,
            dataIndex: 'type',
            renderer: Mzk.Nrg.Helper.tooltipRenderer

        },
        {
            text: 'Funktion',
            flex: 1,
            dataIndex: 'function',
            renderer: Mzk.Nrg.Helper.tooltipRenderer

        }, {
            text: 'Status',
            flex: 1,
            dataIndex: 'status',
            renderer: Mzk.Nrg.Helper.tooltipRenderer

        },
        {
            text: 'Firma',
            flex: 1,
            dataIndex: 'company',
            renderer: Mzk.Nrg.Helper.tooltipRenderer

        },
        {
            text: 'Ort',
            flex: 1,
            dataIndex: 'city',
            renderer: Mzk.Nrg.Helper.tooltipRenderer

        },
        {
            xtype: 'actioncolumn',
            width: 50,
            items: [{
                iconCls: 'x-fa fa-map',
                tooltip: 'Firmenstandort auf Karte anzeigen',
                handler: function (grid, rowIndex, colIndex) {
                    var record = grid.getStore().getAt(rowIndex);
                    if (Ext.isDefined(record) && record !== null) {
                        var recordData = record.getData();
                        if (recordData['_source'] && recordData['_source']['geo']) {
                            var geo = recordData['_source']['geo'];
                            if (geo && geo.status && geo.status === 'OK') {
                                var loc = geo['results'][0]['geometry']['location'];
                                if (loc.lat && loc.lng && Ext.isDefined(loc.lat) && Ext.isDefined(loc.lng)) {
                                    try {
                                        Ext.create('Ext.window.Window', {
                                            title: 'DVGW Map',
                                            height: document.body.clientHeight * 0.8,
                                            width: document.body.clientHeight * 0.8,
                                            layout: 'fit',
                                            items: {
                                                xtype: 'muzkatBpcWrapperMain',
                                                point: {
                                                    lat: loc.lat,
                                                    lng: loc.lng
                                                },
                                                defaultCenter: record.get('code')
                                            }
                                        }).show();
                                    } catch (e) {
                                        Ext.log('Error.... looks like the class was not found.');
                                    }
                                }
                            }
                        }

                    }
                },
                isDisabled: function (view, rowIndex, colIndex, item, record) {
                    var disabled = true;
                    if (Ext.isDefined(record) && record !== null) {
                        var recordData = record.getData();
                        if (recordData['_source'] && recordData['_source']['geo']) {
                            var geo = recordData['_source']['geo'];
                            if (geo && geo.status && geo.status === 'OK') {
                                var loc = geo['results'][0]['geometry']['location'];
                                if (loc.lat && loc.lng && Ext.isDefined(loc.lat) && Ext.isDefined(loc.lng)) {
                                    disabled = false;
                                }
                            }
                        }

                    }
                    return disabled;
                }
            }]
        }],
    initComponent: function () {
        this.store = Ext.create('Ext.data.BufferedStore', {
            proxy: {
                type: 'ajax',
                url: Mzk.Nrg.Helper.dataStoreUrl,
                useDefaultHeader: false,
                reader: {
                    type: 'json',
                    rootProperty: 'hits.hits',
                    totalProperty: 'hits.total'
                }
            },
            pageSize: 100,
            autoLoad: true,
            model: 'Mzk.Nrg.GridLine'
        });
        this.callParent(arguments);
        this.store.on('load', function (store) {
            this.up('#issueWrapper').getViewModel().set('storeRecordCount', store.getTotalCount());
        }.bind(this));
    }
});