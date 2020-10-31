Ext.define('muzkatMap.mapDetails', {
    extend: 'Ext.container.Container',
    alias: 'widget.muzkatMapDetails',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    addMarkerToStore: function (markerObj) {
        this.down('#markerGrid').getStore().add(markerObj);
    },

    items: [
        {
            xtype: 'grid',
            itemId: 'markerGrid',
            store: Ext.create('Ext.data.Store', {
                data: []
            }),
            hideHeaders: true,
            columns: [
                {text: 'Typ', dataIndex: 'type'},
                {text: 'Name', dataIndex: 'desc', flex: 1},
                {
                    xtype: 'actioncolumn',
                    width: 50,
                    items: [{
                        iconCls: 'x-fa fa-eye',
                        tooltip: 'Ein/ausblenden',
                        handler: function (grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            var map = grid.up('muzkatOsm').getMapReference();
                            var markerRef = rec.get('ref');
                            var hidden = rec.get('hidden');
                            if (Ext.isDefined(hidden) && hidden === true) {
                                markerRef.addTo(map);
                                rec.set('hidden', false);
                            } else {
                                markerRef.remove();
                                rec.set('hidden', true);
                            }
                        }
                    }, {
                        iconCls: 'x-fa fa-remove',
                        tooltip: 'Eintrag entfernen',
                        handler: function (grid, rowIndex, colIndex) {
                            var store = grid.getStore();
                            var rec = store.getAt(rowIndex);
                            var markerRef = rec.get('ref');
                            markerRef.remove();
                            store.remove(rec);
                        }
                    }]
                }
            ],
            flex: 1,
            tbar: [
                {
                    value: 'Marker and other Overlays',
                    xtype: 'displayfield'
                }
            ],
            bbar: [
                {
                    iconCls: 'x-fa fa-plus',
                    menu: {
                        plain: true,
                        items: [
                            {
                                iconCls: 'x-fa fa-map-marker', text: 'Marker'
                            },
                            {
                                iconCls: 'x-fa fa-circle-o', text: 'Umkreis'
                            }
                        ]
                    }
                }, {
                    iconCls: 'x-fa fa-trash'
                }, {
                    iconCls: 'x-fa fa-download'
                }, {
                    value: 'Actions',
                    xtype: 'displayfield'
                }
            ]
        }
    ]
});