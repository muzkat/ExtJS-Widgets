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
