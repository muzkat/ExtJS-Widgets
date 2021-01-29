Ext.define('muzkatMap.baseMap', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.muzkatBaseMap',

    region: 'center',
    layout: 'fit',
    title: 'Map'
});

Ext.define('muzkatMap.contextmenu.MapContextmenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.muzkatOsmCm',

    parentCmpReference: undefined,
    mapEventReference: undefined,

    margin: '0 0 10 0',
    plain: true,
    items: [{
        iconCls: 'x-fa fa-map-marker',
        text: 'Marker platzieren',
        handler: function (btn) {
            var muzkatOsmCm = btn.up('muzkatOsmCm');
            var me = muzkatOsmCm.parentCmpReference,
                e = muzkatOsmCm.mapEventReference;
            me.placeMarker({
                id: new Date().getTime(),
                lat: e.latlng.lat,
                lng: e.latlng.lng,
                desc: 'dummy'
            })
        }
    }, {
        iconCls: 'x-fa fa-circle-o',
        text: 'Umkreis setzen',
        handler: function (btn) {
            var muzkatOsmCm = btn.up('muzkatOsmCm');
            var me = muzkatOsmCm.parentCmpReference,
                e = muzkatOsmCm.mapEventReference;
            L.circle(e.latlng, 500, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5
            }).addTo(me.map).bindPopup("Umkreis");
        }
    }]
});


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
Ext.define('muzkatMap.maps.osm', {
    extend: 'muzkatMap.baseMap',
    alias: 'widget.muzkatOsmMap',

    viewModel: {
        data: {
            lastLatLng: 'nothing clicked'
        }
    },

    header: false,

    bind: {
        title: 'Open Street / Open Sea Map - Last click: {lastLatLng}'
    },

    coords: {
        berlin: {
            lat: 52.5,
            lng: 13.4,
            zoom: 12
        },
        trogir: {
            lat: 43.51561484804046,
            lng: 16.250463724136356,
            zoom: 15
        }
    },

    markers: [{
        id: 'hotel',
        desc: 'Bifora Hotel',
        lat: 43.51386,
        lng: 16.25036
    }],

    point: undefined,

    placeMarkers: function () {
        var me = this;
        Ext.Array.each(this.markers, function (markerObj) {
            me.placeMarker(markerObj);
        });
    },

    placeMarker: function (markerObj) {
        var marker = L.marker([markerObj.lat, markerObj.lng]).addTo(this.map);
        marker.bindTooltip(markerObj.desc).openTooltip();
        markerObj.type = 'marker';
        markerObj.ref = marker;
        this.up('muzkatOsm').addMarker(markerObj);
    },

    defaultCenter: 'trogir',

    map: undefined, // map reference

    listeners: {
        afterrender: function (cmp) {
            if (Ext.isDefined(cmp.point)) {
                cmp.coords[cmp.defaultCenter] = cmp.point;
                cmp.coords[cmp.defaultCenter]['zoom'] = 12;
                cmp.markers = [{
                    id: 'tbd',
                    desc: cmp.defaultCenter,
                    lat: cmp.point.lat,
                    lng: cmp.point.lng
                }];
            }
            cmp.initMap(cmp.coords[cmp.defaultCenter]);
        },
        resize: function (cmp) {
            cmp.reLayoutMap();
        }
    },

    reLayoutMap: function () {
        if (Ext.isDefined(this.map)) {
            this.map.invalidateSize();
        }
    },

    onMapClick: function (e) {
        var me = this,
            vm = me.getViewModel(),
            lastLatLng = e.latlng.toString();

        vm.set('lastLatLng', lastLatLng);
    },

    onMapContextmenu: function (e) {
        var xy = [100, 100];
        if (e.originalEvent) {
            xy[0] = e.originalEvent.clientX;
            xy[1] = e.originalEvent.clientY;
        }

        var position = xy;
        var m = Ext.createByAlias('widget.muzkatOsmCm', {
            parentCmpReference: this,
            mapEventReference: e
        });

        m.showAt(position);
    },

    addMapToCmp: function (loc) {
        var me = this;

        var tileLayer = 'OpenStreetMap.BlackAndWhite';
        var layer = L.tileLayer.provider(tileLayer);

        me.map = L.map(me.body.dom.id, {
            center: [loc.lat, loc.lng],
            zoom: loc.zoom,
            zoomControl: false,
            preferCanvas: false,
            layers: [layer]
        });

        // me.toggleLayer('OpenStreetMap.BlackAndWhite');
        me.reLayoutMap();
        me.placeMarkers();
        me.map.on('click', me.onMapClick.bind(me));
        me.map.on('contextmenu', me.onMapContextmenu.bind(me));
        me.setLoading(false);
    },

    initMap: function (loc) {
        var me = this;
        this.setLoading('Map wird geladen...');
        if (!muzkatMap.Module.filesLoaded) {
            muzkatMap.Module.loadAssets().then(function (success) {
                muzkatMap.Module.filesLoaded = true;
                Ext.defer(function () {
                    me.addMapToCmp(loc);
                }, 1500);

            }, function (error) {
                console.log('errrror');
            });
        } else {
            Ext.log({msg: 'Asset loading skipped...'});
            me.addMapToCmp(loc);
        }

    },

    addTileLayer: function (tileLayer) {
        this.activeLayers[tileLayer] = L.tileLayer.provider(tileLayer).addTo(this.map);
    },

    activeLayers: {},

    toggleLayer: function (tileLayer) {
        if (tileLayer in this.activeLayers) {
            this.map.removeLayer(this.activeLayers[tileLayer]);
            delete this.activeLayers[tileLayer];
            Ext.log('layer ' + tileLayer + ' removed');
        } else {
            Ext.log('layer ' + tileLayer + ' added');
            this.addTileLayer(tileLayer);
        }
    },

    cssPaths: [],

    getMapInfo: function () {
        var array = [];
        array.push(
            {key: 'Map Center', value: this.getMapCenter().toString()},
            {key: 'Map Zoom', value: this.map.getZoom()},
            {key: 'Zoom Max', value: this.map.getMaxZoom()},
            {key: 'Zoom Min', value: this.map.getMinZoom()},
            {key: 'Map Bounds', value: JSON.stringify(this.map.getBounds())});
        return array;
    },

    getMapCenter: function () {
        return this.map.getCenter();
    },

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            iconCls: 'x-fa fa-plus',
            tooltip: 'ZoomIn',
            handler: function (btn) {
                btn.up('muzkatOsmMap').map.zoomIn();
            }
        }, {
            iconCls: 'x-fa fa-minus',
            tooltip: 'ZoomOut',
            handler: function (btn) {
                btn.up('muzkatOsmMap').map.zoomOut();
            }
        }, {
            value: 'Map Controls',
            xtype: 'displayfield'
        }, {
            xtype: 'tbfill'
        }, {
            value: 'Map Settings',
            xtype: 'displayfield'
        }, {
            iconCls: 'x-fa fa-bullseye',
            tooltip: 'Map zurücksetzen'
        }, {
            iconCls: 'x-fa fa-info',
            listeners: {
                'render': function (cmp) {
                    Ext.create({
                        xtype: 'tooltip',
                        target: cmp.getEl(),
                        listeners: {
                            scope: this,
                            beforeshow: function (tip) {
                                var infoArray = cmp.up('muzkatOsmMap').getMapInfo();
                                var html = '<table>';
                                Ext.Array.each(infoArray, function (item) {
                                    html += '<tr><td>' + item.key + '</td>' + '<td>' + item.value + '</td></tr>';
                                });
                                html += '<tr><td> Uhrzeit </td>' + '<td>' + new Date().toTimeString() + '</td></tr>';
                                html += '</table>';
                                tip.setHtml(html);
                            }
                        }
                    });
                }
            }
        }, {
            iconCls: 'x-fa fa-cog',
            tooltip: 'Map konfigurieren'
        }]
    }, {
        xtype: 'toolbar',
        dock: 'bottom',
        items: [{
            iconCls: 'x-fa fa-map-marker',
            tooltip: 'Marker ein/ausblenden',
            handler: function (btn) {
                // btn.up('muzkatOsmMap').toggleLayer('Esri.WorldImagery');
            }
        }, {
            value: 'Map Interaktionen',
            xtype: 'displayfield'
        }, {
            xtype: 'tbfill'
        }, {
            value: 'Map Layer',
            xtype: 'displayfield'
        }, {
            iconCls: 'x-fa fa-map',
            tooltip: 'Bildkarte einblenden',
            handler: function (btn) {
                btn.up('muzkatOsmMap').toggleLayer('Esri.WorldImagery');
            }
        }, {
            iconCls: 'x-fa fa-ship',
            tooltip: 'Open Sea Map ein/ausblenden',
            handler: function (btn) {
                btn.up('muzkatOsmMap').toggleLayer('OpenSeaMap');
            }
        }]
    }]
});

Ext.define('muzkatMap.Module', {
    singleton: true,

    loadAssets: function () {
        return this.loadMapScripts();
    },

    filesLoaded: false,

    scriptPaths: [
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.css',
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.js',
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet-providers/1.1.17/leaflet-providers.js'
    ],

    loadMapScripts: function () {
        var loadingArray = [], me = this;
        return new Ext.Promise(function (resolve, reject) {
            Ext.Array.each(me.scriptPaths, function (url) {
                loadingArray.push(me.loadMapScript(url));
            });

            Ext.Promise.all(loadingArray).then(function (success) {
                    console.log('artefacts were loaded successfully');
                    resolve('Loading was successful');
                },
                function (error) {
                    reject('Error during artefact loading...');
                });
        });
    },

    loadMapScript: function (url) {
        return new Ext.Promise(function (resolve, reject) {
            Ext.Loader.loadScript({
                url: url,
                onLoad: function () {
                    console.log(url + ' was loaded successfully');
                    resolve();
                },
                onError: function (error) {
                    reject('Loading was not successful for: ' + url);
                }
            });
        });
    }

});
Ext.define('muzkatMap.muzkatMap', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.muzkatMap',

    layout: 'fit',
    title: 'ExtJs Universal Map component by muzkat',
    header: true,
    hideDetails: false,
    defaultCenter: 'berlin',
    point: undefined,

    initComponent: function () {

        this.items = [
            {
                xtype: 'muzkatOsm',
                defaultCenter: this.defaultCenter,
                header: this.header,
                hideDetails: this.hideDetails,
                point: this.point
            }
        ];

        this.callParent(arguments);
    }
});

Ext.define('muzkatMap.muzkatMapWidget', {
    extend: 'muzkatMap.muzkatMap',
    alias: 'widget.muzkatMapWidget',

    header: true,
    hideDetails: true
});

Ext.define('muzkatMap.muzkatosm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.muzkatOsm',

    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    title: 'Muzkat Open Street Map',

    hideDetails: undefined, // set by constructor - default: false
    defaultCenter: undefined,
    point: undefined,

    initComponent: function () {
        this.items =
            [
                {xtype: 'muzkatMapDetails', flex: 1, hidden: this.hideDetails},
                {xtype: 'muzkatOsmMap', flex: 5, defaultCenter: this.defaultCenter, point: this.point}
            ];
        this.callParent(arguments);
    },

    addMarker: function (markerObj) {
        this.down('muzkatMapDetails').addMarkerToStore(markerObj);
    },

    getMapReference: function () {
        return this.down('muzkatOsmMap').map;
    }
});
