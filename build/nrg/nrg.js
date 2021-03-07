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

        this.columns = [
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
            }];

        this.callParent(arguments);
        this.store.on('load', function (store) {
            this.up('#issueWrapper').getViewModel().set('storeRecordCount', store.getTotalCount());
        }.bind(this));
    }
});
Ext.define('Mzk.Nrg.GridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.accountGridController',

    onSelect: function (rowModel, record, index, eOpts) {
        if (rowModel.view) {
            var view = rowModel.view;
            view.up('#issueWrapper').updateIssue(record);
        }
    }
});

Ext.define('Mzk.Nrg.Main', {
    extend: 'Ext.container.Container',
    alias: 'widget.muzkatNrgMain',
    layout: 'fit',
    items: [{
        xtype: 'container',
        itemId: 'issueWrapper',
        viewModel: {
            data: {
                storeRecordCount: 0,
                activeItem: null,
                recordActive: null,
                activeContact: {
                    ansprechpartner: {
                        anrede: null,
                        email: null,
                        fax: null,
                        nachname: null,
                        telefon: null,
                        vorname: null
                    },
                    codenummer: {
                        bis: null,
                        codenummer: null,
                        codetyp: null,
                        von: null,
                        marktfunktion: null
                    },
                    firmenanschrift: {
                        ort: null,
                        plz: null,
                        unternehmen: null,
                        url: null
                    }
                }
            },
            formulas: {}
        },
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [
            {
                xtype: 'accountGrid',
                flex: 4
            },
            {
                xtype: 'container',
                flex: 3,
                layout: 'fit',
                defaults: {
                    padding: '10 10 10 10'
                },
                padding: '25 25 25 25',
                items: [
                    {
                        xtype: 'panel', layout: {
                            type: 'vbox',
                            align: 'stretch'
                        }, flex: 4, header: false,
                        tbar: [{
                            iconCls: 'x-fa fa-phone', tooltip: 'Anrufen', scale: 'medium'
                        }, {
                            iconCls: 'x-fa fa-fax', tooltip: 'Fax an Partner versenden', scale: 'medium'
                        }, {
                            iconCls: 'x-fa fa-envelope-o', tooltip: 'Mail an Partner verschicken', scale: 'medium'
                        }, {
                            iconCls: 'x-fa fa-desktop', tooltip: 'Webseite aufrufen', scale: 'medium'
                        }, {
                            xtype: 'tbfill'
                        }, {
                            iconCls: 'x-fa fa-bookmark', tooltip: 'Als Favorit ablegen', scale: 'medium'
                        }, {
                            iconCls: 'x-fa fa-camera', tooltip: 'Screenshot erstellen', scale: 'medium'
                        }, {
                            iconCls: 'x-fa fa-print', tooltip: 'Kontaktinformationen ausdrucken', scale: 'medium'
                        }],
                        defaults: {
                            flex: 1,
                            padding: '3 3 3 3'
                        }, items: [{
                            xtype: 'fieldset',
                            bind: {
                                title: 'Ansprechpartner - {activeContact.firmenanschrift.unternehmen}'
                            },
                            collapsible: true,
                            defaultType: 'textfield',
                            defaults: {anchor: '100%', padding: '0 0 0 0'},
                            layout: 'anchor',
                            items: [{
                                fieldLabel: 'Name',
                                bind: {
                                    value: '{activeContact.ansprechpartner.vorname} {activeContact.ansprechpartner.nachname}'
                                }
                            }, {
                                fieldLabel: 'E-Mail',
                                bind: {
                                    value: '{activeContact.ansprechpartner.email}'
                                }
                            }, {
                                fieldLabel: 'Telefon',
                                bind: {
                                    value: '{activeContact.ansprechpartner.telefon}'
                                }
                            }, {
                                fieldLabel: 'Fax',
                                bind: {
                                    value: '{activeContact.ansprechpartner.fax}'
                                }
                            }]
                        }, {
                            xtype: 'fieldset',
                            bind: {
                                title: 'Code Informationen - {activeContact.codenummer.codenummer} - {activeContact.codenummer.marktfunktion}'
                            },
                            collapsible: true,
                            defaultType: 'textfield',
                            defaults: {anchor: '100%', padding: '0 0 0 0'},
                            layout: 'anchor',
                            items: [{
                                fieldLabel: 'CodeTyp',
                                bind: {
                                    value: '{activeContact.codenummer.codetyp}'
                                }
                            }, {
                                fieldLabel: 'CodeNummer',
                                bind: {
                                    value: '{activeContact.codenummer.codenummer}'
                                }
                            }, {
                                fieldLabel: 'Von',
                                bind: {
                                    value: '{activeContact.codenummer.von}'
                                }
                            }, {
                                fieldLabel: 'Bis',
                                bind: {
                                    value: '{activeContact.codenummer.bis}'
                                }
                            }]

                        }, {
                            xtype: 'fieldset',
                            title: 'Firmendetails',
                            collapsible: true,
                            defaultType: 'textfield',
                            defaults: {anchor: '100%', padding: '0 0 0 0'},
                            layout: 'anchor',
                            items: [{
                                fieldLabel: 'Ort',
                                bind: {
                                    value: '{activeContact.firmenanschrift.plz} {activeContact.firmenanschrift.ort}'
                                }
                            }, {
                                fieldLabel: 'Unternehmen',
                                bind: {
                                    value: '{activeContact.firmenanschrift.unternehmen}'
                                }
                            }, {
                                fieldLabel: 'Web',
                                bind: {
                                    value: '{activeContact.firmenanschrift.url}'
                                }
                            }]

                        }]
                    }]
            }],
        updateIssue: function (record) {
            if (Ext.isDefined(record)) {
                var recordData = record.getData();
                if (recordData['_source'] && recordData['_source']['contact']) {
                    var contactData = recordData['_source']['contact'];
                    if (contactData['code-nummern-vergabe']) {
                        contactData.codenummer = contactData['code-nummern-vergabe'];
                        delete contactData['code-nummern-vergabe'];
                        if (contactData.codenummer['code typ']) {
                            contactData.codenummer.codetyp = contactData.codenummer['code typ'];
                            delete contactData.codenummer['code typ'];
                        }
                    }

                    var me = this;
                    Ext.iterate(contactData, function (key, obj) {
                        Ext.iterate(obj, function (subkey, val) {
                            me.getViewModel().set('activeContact.' + key + '.' + subkey, val);
                        });
                    });
                    Ext.log({dump: contactData, msg: 'data..'});
                    // this.getViewModel().set('activeContact', contactData);
                }
                this.getViewModel().set('activeItem', JSON.stringify(recordData));
                this.getViewModel().set('recordActive', record);
            }


        }
    }]
});
Ext.define('Mzk.Nrg.GridLine', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id'
        },
        {
            name: 'code',
            mapping: '_source.Code'
        },
        {
            name: 'codeenum',
            mapping: '_source.CodeTypeEnum'
        },
        {
            name: 'type',
            mapping: '_source.CodeType'
        },
        {
            name: 'function',
            mapping: '_source.MarketFunction'
        },
        {
            name: 'status',
            mapping: '_source.LocalizedStatus'
        },
        {
            name: 'city',
            mapping: '_source.city'
        },
        {
            name: 'company',
            mapping: '_source.companyName'
        },
        {
            name: 'zip',
            mapping: '_source.zipCode'
        }]
});
