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
Ext.define('muzkatMap.baseMap', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.muzkatBaseMap',

    region: 'center',
    layout: 'fit',
    title: 'Map'
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

Ext.define('muzkat.pi.camera.Api', {
    singleton: true,

    getPromise: function (url) {
        return new Ext.Promise(function (resolve, reject) {
            Ext.Ajax.request({
                url: url,
                success: function (response) {
                    resolve(Ext.decode(response.responseText, true));
                },

                failure: function (response) {
                    reject(response.status);
                }
            });
        });
    },

    takePhoto: function () {
        return muzkat.pi.camera.Api.getPromise('/photos/take');
    },

    getPhotos: function () {
        return muzkat.pi.camera.Api.getPromise('/photos');
    }
});
Ext.define('muzkat.pi.camera.Main', {
    extend: 'Ext.container.Container',
    alias: 'widget.mzkPiCameraMain',

    title: 'Muzkat Pi Camera',

    layout: 'center',

    items: [{
        xtype: 'panel',

        width: '80%',
        height: '80%',
        layout: 'fit',

        items: [{
            xtype: 'panel',
            itemId: 'preview',
            layout: 'fit',
            items: [{
                xtype: 'container',
                defaultHtmlHeadline: '<h3>Muzkat Pi Camera</h3>',
                html: '<h3>Muzkat Pi Camera</h3>',
                updateHtmlContent: function (html) {
                    this.setHtml(this.defaultHtmlHeadline + html);
                },
                updateImage: function (imageUrl) {
                    var html = '<img src="/serve/' + imageUrl + '" height="480" width="640">';
                    this.updateHtmlContent(html);
                }
            }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                overflowHandler: 'scroller',
                items: []
            }]
        }],

        bbar: [{
            text: 'Take Picture',
            scale: 'medium',
            iconCls: 'x-fa fa-photo',
            handler: function (btn) {
                var mainView = btn.up('mzkPiCameraMain');
                muzkat.pi.camera.Api.takePhoto().then(function (success) {
                    mainView.refreshGui();
                }, function (error) {
                    Ext.toast(error);
                });
            }
        }, {
            text: 'Gallery',
            scale: 'medium',
            iconCls: 'x-fa fa-file-image-o'
        }, {
            xtype: 'tbfill'
        }, {
            text: 'API',
            scale: 'medium',
            iconCls: 'x-fa fa-file-image-o'
        }, {
            text: 'About',
            scale: 'medium',
            iconCls: 'x-fa fa-file-image-o'
        }]
    }],

    initComponent: function () {
        this.callParent(arguments);
        this.refreshGui();
    },

    refreshGui: function () {
        var me = this;
        muzkat.pi.camera.Api.getPhotos().then(function (array) {
            var preview = me.down('#preview');
            if (array.length > 0) {
                array = array.reverse();
                var imgContainer = preview.down('container');
                imgContainer.updateImage(array[0].name);
                var dockedItems = preview.getDockedItems('toolbar[dock="bottom"]');
                dockedItems[0].removeAll();

                Ext.Array.each(array, function (imgObj) {
                    dockedItems[0].add({
                        xtype: 'image',
                        src: '/serve/' + imgObj.name,
                        height: 90,
                        width: 120
                    })
                });
            }
        }, function (error) {
            Ext.toast(error);
        });
    }
});
Ext.define('mzk.textviewer.Editor', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.muzkatJsonTextArea',

    title: 'Editor',

    layout: 'fit',

    space: function (a) {
        var b = [], e;
        for (e = 0; e < a; e++) b.push(" ");
        return b.join("")
    },

    initComponent: function () {
        this.jsonField = Ext.create({
            xtype: 'textareafield',
            grow: true,
            emptyText: 'Paste your JSON here',
            maxLength: 100000000000000000000,
            anchor: '100%'
        });

        this.items = [this.jsonField];

        this.tbar = [{
            iconCls: 'x-fa fa-tree',
            text: 'Tree',
            handler: function (btn) {
                var jsonString = this.jsonField.getValue(),
                    jsonObject = Ext.JSON.decode(jsonString, true);
                if (jsonObject) {
                    Ext.log({dump: jsonObject, msg: 'valid Json Obj'});
                    this.mainView.tabPanel.add({
                        xtype: 'muzkatJsonTreeView',
                        jsonData: this.json2leaf(jsonObject)
                    });
                } else {
                    Ext.log({msg: 'Json Obj not valid'});
                }

            }
        }, {
            iconCls: 'x-fa fa-copy',
            text: 'Copy'
        }, {
            iconCls: 'x-fa fa-paint-brush',
            text: 'Format',
            handler: function (btn) {
                for (var b = this.jsonField.getValue().replace(/\n/g, " ").replace(/\r/g, " "), e = [], c = 0, d = !1, f = 0, i = b.length; f < i; f++) {
                    var g = b.charAt(f);
                    if (d && g === d) b.charAt(f - 1) !== "\\" && (d = !1);
                    else if (!d && (g === '"' || g === "'")) d = g;
                    else if (!d && (g === " " || g === "\t")) g = "";
                    else if (!d && g === ":") g += " ";
                    else if (!d && g === ",") g += "\n" + this.space(c * 2); else if (!d && (g === "[" || g === "{")) c++, g += "\n" + this.space(c * 2);
                    else if (!d && (g === "]" || g === "}")) c--, g = "\n" + this.space(c * 2) + g;
                    e.push(g)
                }

                this.jsonField.setValue(e.join(""));
            }
        }, {
            iconCls: 'x-fa fa-compress',
            text: 'Remove white space',
            handler: function (btn) {
                var a = this.jsonField;
                for (var b = a.getValue().replace(/\n/g, " ").replace(/\r/g, " "), e = [], c = !1, d = 0, f = b.length; d < f; d++) {
                    var i = b.charAt(d);
                    if (c && i === c) b.charAt(d - 1) !== "\\" && (c = !1);
                    else if (!c && (i === '"' || i === "'")) c = i; else if (!c && (i === " " || i === "\t")) i = "";
                    e.push(i)
                }
                a.setValue(e.join(""));
            }
        }, {
            iconCls: 'x-fa fa-times',
            text: 'Clear'
        }, {
            iconCls: 'x-fa fa-cloud-upload',
            text: 'Load JSON data'
        }].map(btn => {
            btn.scope = this;
            return btn;
        });

        this.callParent(arguments);
    },

    json2leaf: function (a) {
        var b = [], c;
        for (c in a) a.hasOwnProperty(c) && (a[c] === null ? b.push({
            text: c + " : null",
            leaf: !0,
            iconCls: "x-fa fa-bug"
        }) : typeof a[c] === "string" ? b.push({
            text: c + ' : "' + a[c] + '"',
            leaf: !0,
            iconCls: "x-fa fa-bug"
        }) : typeof a[c] === "number" ? b.push({
            text: c + " : " + a[c],
            leaf: !0,
            iconCls: "x-fa fa-bug"
        }) : typeof a[c] === "boolean" ? b.push({
            text: c + " : " + (a[c] ? "true" : "false"),
            leaf: !0,
            iconCls: "x-fa fa-file"
        }) : typeof a[c] === "object" ? b.push({
            text: c,
            children: this.json2leaf(a[c]),
            iconCls: Ext.isArray(a[c]) ? "x-fa fa-folder" : "x-fa fa-file"
        }) : typeof a[c] === "function" && b.push({
            text: c + " : function",
            leaf: !0,
            iconCls: "x-fa fa-superscript"
        }));
        return b
    }
});
Ext.define('mzk.textviewer.Main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mzkJsonViewerMain',

    layout: 'fit',
    header: false,

    initComponent: function () {
        var defaults = {
            mainView: this,
            padding: '5 5 5 5'
        };

        this.treePanel = Ext.create(Ext.apply({xtype: 'muzkatJsonTreeView'}, defaults));
        this.editorPanel = Ext.create(Ext.apply({xtype: 'muzkatJsonTextArea'}, defaults));
        this.tabPanel = Ext.create({xtype: 'tabpanel', items: [this.treePanel, this.editorPanel]});
        this.tabPanel.setActiveTab(this.editorPanel);

        this.items = [
            this.tabPanel
        ];

        this.callParent(arguments);
    },

    prettifyXml: function (sourceXml) {
        var xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');

        var xsltDoc = new DOMParser().parseFromString([
            '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
            '  <xsl:output omit-xml-declaration="yes" indent="yes"/>',
            '    <xsl:template match="node()|@*">',
            '      <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
            '    </xsl:template>',
            '</xsl:stylesheet>',
        ].join('\n'), 'application/xml');

        var xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsltDoc);
        var resultDoc = xsltProcessor.transformToDocument(xmlDoc);
        return new XMLSerializer().serializeToString(resultDoc);
    }
});
Ext.define('mzk.textviewer.Viewer', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.muzkatJsonTreeView',

    title: 'Viewer',

    rootVisible: false,

    listeners: {
        /*render: function (a) {
            a.getSelectionModel().on("selectionchange", function (a, b) {
                d.gridbuild(b)
            })
        },*/
        cellcontextmenu: function (view, td, cellIndex, record, tr, rowIndex, e, eOpts) {
            e.preventDefault();
            var b = e;
            (new Ext.menu.Menu({
                items: [{
                    text: "Expand", handler: function () {
                        a.expand()
                    }
                }, {
                    text: "Expand all", handler: function () {
                        a.expand(!0)
                    }
                }, "-", {
                    text: "Collapse", handler: function () {
                        a.collapse()
                    }
                },
                    {
                        text: "Collapse all", handler: function () {
                            a.collapse(!0)
                        }
                    }]
            })).showAt(b.getXY())
        }
    },

    jsonData: undefined,

    initComponent: function () {
        Ext.log({dump: this.jsonData, msg: 'json data'});

        this.store = Ext.create('Ext.data.TreeStore', {
            root: {
                expanded: false,
                children: this.jsonData || []
            }
        });

        // this.columns = [{
        //     xtype: 'treecolumn',
        //     text: 'Flight Endpoints',
        //     dataIndex: 'text',
        //     flex: 1,
        //     renderer: function (val, meta, rec) {
        //         if (rec.get('isLayover')) {
        //             meta.tdStyle = 'color: gray; font-style: italic;';
        //         }
        //         return val;
        //     }
        // }, {
        //     text: 'Duration',
        //     dataIndex: 'duration',
        //     width: 100
        // }];

        this.callParent(arguments);
    }
});
Ext.define('Playground.view.weather.Weather', {
  extend: 'Ext.panel.Panel',
  xtype: 'bnz-weather',

  controller: 'weather-main',
  viewModel: 'weather-main',

  title: 'Weather Forecast',
  header: false,
  width: 600,
  height: 'auto',
  border: 0,
  items: [{
    xtype: 'panel',
    title: 'Weather Forecast',
    //  tools: [{
    //    type: 'close'
    //  }],
    border: 1,
    reference: 'winamp-eq',
    layout: {
      type: 'hbox',
      align: 'stretch'
    },
    tbar: [{
      text: 'ON'
    }, {
      text: 'AUTO'
    }],
    defaults: {
      // defaults are applied to items, not the container
      //flex: 1
    },
    items: []
  }],

  initComponent: function() {
    this.callParent();
  }
});

Ext.define('Playground.view.weather.WeatherController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.weather-main',

  audioContext: undefined,
  source: undefined,
  gainNode: undefined,
  panNode: undefined,
  splitter: undefined,
  gainL: undefined,
  gainR: undefined,

  mainFilter: undefined,

  control: {
/*
    tool:{
      click: 'onCloseClick'
    },
    'bnz-winampslider': {
      change: 'onSliderMove'
    },
      '#playBtn': {
        click: 'playSound'
      },
    '#volumeSilder': {
      change: 'setVolume'
    },
    '#panSlider': {
      change: 'setPan'
    },
    '#freqSilder': {
      change: 'setMainFilter'
    },
    '#pl': {
      click: 'showHide'
    },
    '#eq': {
      click: 'showHide'
    },
    grid: {
      itemdblclick: 'onItemClick'
    }*/
  },

  init: function(){

    Ext.Ajax.request({
            url: 'http://api.openweathermap.org/data/2.5/find?q=Berlin&units=metric&appid=44db6a862fba0b067b1930da0d769e98&mode=json',
            method: 'GET',
        //    headers: {'X-Requested-With': 'XMLHttpRequest'},
          //  params : Ext.JSON.encode(formPanel.getValues()),
            success: function(conn, response, options, eOpts) {
                var result = response.responseText;
                if (result.success) {
                  Ext.log({dump:result});
                  //  Packt.util.Alert.msg('Success!', 'Stock was saved.');
                  //  store.load();
                  //  win.close();
                } else {
                  //  Packt.util.Util.showErrorMsg(result.msg);
                }
            },
            failure: function(conn, response, options, eOpts) {
                // TODO get the 'msg' from the json and display it
                //Packt.util.Util.showErrorMsg(conn.responseText);
            }
        });
  }

});

Ext.define('Playground.view.weather.WeatherModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.weather-main',
    data: {
        name: 'Playground',
        track: undefined,
        actualTrack: {},
        actualhms: '00:00:00'
    }
});

Ext.define('muzkat.player.Config', {
    singleton: true,

    welcomeTrack: 'https://soundcloud.com/bnzlovesyou/daktari-preview',
    initialPlaylist: '/users/1672444/tracks'

});

Ext.define('muzkat.player.Player', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.muzkatPlayer',

    requires: ['muzkat.player.Config', 'muzkat.player.Util'],

    border: 0,
    tools: [{
        type: 'close'
    }],

    // audio vars
    audioContext: undefined,
    source: undefined,
    gainNode: undefined,

    panNode: undefined,
    splitter: undefined,
    gainL: undefined,
    gainR: undefined,
    merger: undefined,
    balL: undefined,
    balR: undefined,

    mainFilter: undefined,

    initComponent: function () {
        this.title = muzkat.player.Util.playerTitle;

        this.items = [{
            xtype: 'container',
            items: [{
                xtype: 'container',
                layout: {
                    type: 'column',
                    align: 'left'
                },
                items: [{
                    bind: {
                        title: '{actualhms}'
                    },
                    columnWidth: 0.25
                }, {
                    columnWidth: 0.75,
                    xtype: 'textfield',
                    width: '100%',
                    height: '100%',
                    allowBlank: true,
                    bind: {
                        value: '{actualTrack.title}'
                    }
                }]
            }, {
                xtype: 'container',
                layout: {
                    type: 'column',
                    align: 'left'
                },
                items: [{
                    title: 'Column 1',
                    columnWidth: 0.25
                }, {
                    columnWidth: 0.55,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [Ext.apply(muzkat.player.Util.getHorizontalSlider(), {
                        itemId: 'volumeSilder',
                        listeners: {
                            change: this.setVolume.bind(this)
                        },
                        flex: 2
                    }), Ext.apply(muzkat.player.Util.getHorizontalSlider(), {
                        itemId: 'panSlider',
                        value: 0,
                        increment: 1,
                        minValue: -10,
                        maxValue: 10,
                        flex: 1,
                        listeners: {
                            change: this.setPan.bind(this)
                        }
                    })]
                }, {
                    columnWidth: 0.20,
                    items: [{
                        text: muzkat.player.Util.playerEqBtn,
                        xtype: 'button',
                        cmp: 'eq',
                        handler: (b) => {
                            this.toggleView(b.cmp);
                        }
                    }, {
                        text: muzkat.player.Util.playerPlBtn,
                        xtype: 'button',
                        cmp: 'playlist',
                        handler: (b) => {
                            this.toggleView(b.cmp);
                        }
                    }]
                }]
            }, {
                xtype: 'container',
                items: [Ext.apply(muzkat.player.Util.getHorizontalSlider(), {
                    width: '100%'
                })]
            }]
        }];

        this.bbar = [{
            iconCls: 'x-fa fa-step-backward', disabled: true
        }, {
            iconCls: 'x-fa fa-play',
            itemId: 'playBtn',
            handler: (b) => {
                this.playSound();
            }
        }, {
            iconCls: 'x-fa fa-pause',
            handler: 'stopPlay'
        }, {
            iconCls: 'x-fa fa-stop', disabled: true
        }, {
            iconCls: 'x-fa fa-step-forward', disabled: true
        }, {
            iconCls: 'x-fa fa-eject', disabled: true
        }];

        this.callParent(arguments);
    },

    toggleView: function (cmp) {
        let item = this.main[cmp];
        item.setVisible(!item.isVisible())
    },

    initAudio: function () {
        this.audioContext = new AudioContext(),
            this.gainR = this.audioContext.createGain(),
            this.gainL = this.audioContext.createGain(),
            this.balR = this.audioContext.createGain(),
            this.balL = this.audioContext.createGain(),
            this.gainNode = this.audioContext.createGain(),
            this.merger = this.audioContext.createChannelMerger(2),
            this.mainFilter = this.audioContext.createBiquadFilter(),
            this.panNode = this.audioContext.createStereoPanner(),
            this.splitter = this.audioContext.createChannelSplitter(2);


        this.gainNode.gain.value = 0.5;

        this.gainR.gain.value = 0.5;
        this.gainL.gain.value = 0.5;

        this.balR.gain.value = 1;
        this.balL.gain.value = 1;

        this.gainNode.connect(this.audioContext.destination);

        this.mainFilter.type = 'lowpass';
        this.mainFilter.frequency.value = 100;

        this.mainFilter.connect(this.panNode);
        this.panNode.connect(this.gainNode);

        Ext.Loader.loadScript({
            url: 'https://connect.soundcloud.com/sdk/sdk-3.0.0.js',
            onLoad: () => {
                SC.initialize({
                    client_id: '40493f5d7f709a9881675e26c824b136'
                });
                this.updatePlaylist(muzkat.player.Config.initialPlaylist);
            },
            onError: function () {
            }
        });
    },

    updatePlaylist: function (playlistPath) {
        return SC.get(playlistPath).then((tracks) => {
            let s = this.main.playlist.store;
            s.removeAll();
            s.add((tracks || []));
        });
    },

    defaultRouting: function () {
        this.merger.disconnect();
        this.splitter.disconnect();
        this.mainFilter.connect(this.panNode);
        this.panNode.connect(this.gainNode);
        /*
        this.mainFilter.connect(this.splitter);


        this.splitter.connect(this.gainL, 0);
        this.splitter.connect(this.gainR, 1);
        this.gainL.connect(this.merger, 0, 0);
        this.gainR.connect(this.merger, 0, 1);

        this.merger.connect(this.gainNode);
        */
    },

    detachDefaultRouting: function () {
        this.mainFilter.disconnect();
        this.panNode.disconnect();
        this.mainFilter.connect(this.splitter);


        this.splitter.connect(this.gainL, 0);
        this.splitter.connect(this.gainR, 1);
        this.gainL.connect(this.balL);
        this.gainR.connect(this.balR);
        this.balL.connect(this.merger, 0, 0)
        this.balR.connect(this.merger, 0, 1)

        this.merger.connect(this.gainNode);
    },

    changeBalance: function (cmp, x, y, eOpts) {
        this.detachDefaultRouting();
        if (x > 0) {
            this.setLeftGain(0, 10 - x)
        }
        if (x < 0) {
            x = Math.abs(x);
            this.setRightGain(0, 10 - x);
        }
    },

    setLeftGain: function (cmp, x, y, eOpts) {
        this.detachDefaultRouting();
        this.gainL.gain.value = x / 10;
    },

    setRightGain: function (cmp, x, y, eOpts) {
        this.detachDefaultRouting();
        this.gainR.gain.value = x / 10;
    },

    separateChannel: function (container, button, pressed) {
        this.detachDefaultRouting();
        if (button.text === 'LEFT') {
            this.gainL.gain.value = 1.0;
            this.gainR.gain.value = 0.0;
        }
        if (button.text === 'RIGHT') {
            this.gainL.gain.value = 0.0;
            this.gainR.gain.value = 1.0;
        }
        if (button.text === 'BOTH') {
            this.gainL.gain.value = 1.0;
            this.gainR.gain.value = 1.0;
        }
    },

    setPan: function (cmp, x, y, eOpts) {
        this.defaultRouting();
        this.panNode.pan.value = x / 10;
    },

    setActualTrack: function (TrackInfo) {
        this.stopPlay();
        this.main.getViewModel().set("actualTrack", TrackInfo);
        this.main.getViewModel().set("actualhms", muzkat.player.Util.createhmsString(TrackInfo.duration));
        this.getData(TrackInfo.stream_url);
    },

    onSliderMove: function (cmp, x, y, eOpts) {
        Ext.log({dump: cmp});
        Ext.log({dump: x});
        Ext.log({dump: y});
        Ext.log({dump: eOpts});
    },

    setVolume: function (cmp, x) {
        this.gainNode.gain.value = x / 100;
    },

    setMainFilter: function (cmp, x, y, eOpts) {
        this.mainFilter.frequency.value = x;
    },

    volumeReset: function () {
        this.gainNode.gain.value = 0.5;
    },

    stopPlay: function () {
        if (this.source) this.source.stop();
    },

    playSound: function () {
        if (this.source) {
            this.source.stop();
            var actualSound = this.main.getViewModel().get("actualTrack");
            this.getData(actualSound.stream_url);
            return;
        }
        this.soundcloud();
    },

    soundcloud: function () {
        SC.get('/resolve', {
            url: muzkat.player.Util.welcomeTrack
        }).then((sound) => {
            this.main.getViewModel().set("actualTrack", sound);
            this.main.getViewModel().set("actualhms", Playground.view.webamp.Util.createhmsString(sound.duration));
            this.getData(sound.stream_url);
        });
    },

    getData: function (sample) {
        this.source = this.audioContext.createBufferSource();
        this.source.connect(this.mainFilter);
        fetch((sample + '?client_id=' + this.main.clientId))
            .then((response) => {
                return response.arrayBuffer();
            }).then((buffer) => {
            this.audioContext.decodeAudioData(buffer).then((decodedBuffer) => {
                console.log('sample loaded:' + sample);
                this.source.buffer = decodedBuffer;
                this.source.start();
            }).catch((e) => {
                console.log('decode error');
            })
        })
    }
});

Ext.define('muzkat.player.Playlist', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.muzkatPlaylist',

    tools: [{
        type: 'close'
    }],

    viewConfig: {
        plugins: {
            ptype: 'gridviewdragdrop',
            dragText: 'Drag and drop to reorganize'
        }
    },
    hideHeaders: true,

    columns: [{
        xtype: 'rownumberer'
    }, {
        dataIndex: 'title',
        flex: 1
    }, {
        dataIndex: 'duration',
        renderer: function (value, meta, record) {
            return muzkat.player.Util.createhmsString(value);
        }
    }],

    bbar: [{
        text: 'ADD',
        menu: [{
            text: 'ADD URL'
        }, {
            text: 'ADD LIST'
        }, {
            text: 'ADD FILE'
        }]
    }, {
        text: 'REM'
    }, {
        text: 'SEL'
    }, {
        text: 'MISC'
    }],

    initComponent: function () {
        this.title = muzkat.player.Util.playerTitle + ' ' + muzkat.player.Util.playlistTitle;
        this.store = Ext.create('Ext.data.Store', {
            storeId: 'playList',
            fields: ['id', 'title', 'user', 'duration']
        });

        this.listeners = {
            itemdblclick: (view, r) => {
                this.player.setActualTrack(r.data);
            }
        }

        this.callParent();
    }
});

Ext.define('muzkat.player.Util', {
    singleton: true,

    playerTitle: 'WEBAMP',
    playerEqBtn: 'EQ',
    playerPlBtn: 'PL',
    playlistTitle: 'PLAYLIST',

    // create duration h-m-s string from milliseconds
    createhmsString: function (milli) {
        var hours = Math.floor(milli / 36e5),
            mins = Math.floor((milli % 36e5) / 6e4),
            secs = Math.floor((milli % 6e4) / 1000);
        return this.pad(hours) + ':' + this.pad(mins) + ':' + this.pad(secs);
    },

    // add leading zeros
    pad: function (number, size) {
        var s = String(number);
        while (s.length < (size || 2)) {
            s = "0" + s;
        }
        return s;
    },

    getHorizontalSlider: function () {
        return {
            xtype: 'slider',
            value: 50,
            increment: 10,
            minValue: 0,
            maxValue: 100,
            vertical: false
        }
    },

    getVerticalSlider: function () {
        return {
            xtype: 'slider',
            value: 100,
            increment: 100,
            minValue: 0,
            maxValue: 5000,
            vertical: true,
            height: 100
        }
    },

});

Ext.define('muzkat.player.webamp', {
    extend: 'Ext.panel.Panel',
    xtype: 'muzkatWebamp',

    controller: 'webamp-main',

    viewModel: {
        data: {
            name: 'Playground',
            track: undefined,
            actualTrack: {},
            actualhms: '00:00:00'
        }
    },

    title: 'Multimedia Player',
    header: false,
    width: 600,
    height: 'auto',
    border: 0,

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    initComponent: function () {
        this.player = Ext.create({
            xtype: 'muzkatPlayer',
            main: this
        });

        let eqs = [], eqCount = 0;
        while (eqCount <= 12) {
            eqs.push(Ext.apply(muzkat.player.Util.getVerticalSlider(), (eqCount === 0 ? {
                itemId: 'freqSilder',
                listeners: {
                    change: this.player.setMainFilter.bind(this.player)
                }
            } : {
                eqRangeButton: eqCount
            })))
            eqCount++
        }

        this.eq = Ext.create({
            xtype: 'panel',
            player: this.player,
            title: 'webamp EQUALIZER',
            tools: [{
                type: 'close'
            }],
            border: 1,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            tbar: [{
                text: 'ON', disabled: true
            }, {
                text: 'AUTO', disabled: true
            }, {
                xtype: 'tbfill'
            }, {
                text: 'LEFT', disabled: true
            }, {
                text: 'RIGHT', disabled: true
            }, {
                text: 'BOTH', disabled: true
            }],
            items: eqs.map((e) => {
                return { // wrap in container for flex - slider extends a cmp !== container
                    xtype: 'container', flex: 1,
                    layout: 'center',
                    items: [e]
                }
            })
        });

        this.playlist = Ext.create({
            xtype: 'muzkatPlaylist',
            player: this.player,
            flex: 1
        })

        this.clientId = '17a992358db64d99e492326797fff3e8';

        this.items = [this.player, this.eq, this.playlist];
        this.callParent();
        this.player.initAudio();
    }
});

Ext.define('muzkat.player.webampController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.webamp-main',

    control: {
        tool: {
            click: 'onCloseClick'
        },
        // 'bnz-webampslider': {
        //     change: 'onSliderMove'
        // },
        // '#LeftRight': {
        //     toggle: 'separateChannel'
        // },
        // '#sliderL': {
        //     change: 'setLeftGain'
        // },
        // '#sliderR': {
        //     change: 'setRightGain'
        // },
        // '#balanceSliderLR': {
        //     change: 'changeBalance'
        // }
    },

    onCloseClick: function (tool, e, owner, eOpts) {
        if (!(owner.reference === 'webamp-player')) {
            owner.hide();
        }
    }
});

Ext.define('Playground.view.main.config', {
    singleton: true,

    /**
     * xtypes which should be loaded into the nav bar left
     */
    components: ['mzkJsonViewerMain', 'muzkatMap', 'mzkPiCameraMain', 'bnz-weather', 'muzkatWebamp']
});

Ext.define('Playground.view.main.Main', {
    extend: 'Ext.container.Container',
    alias: 'widget.app-main',

    requires: ['Playground.view.main.config'],

    titleRotation: 0,
    tabRotation: 0,

    defaults: {
        xtype: 'panel',
        layout: 'center'
    },

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    initComponent: function () {
        this.nav = Ext.create({
            xtype: 'toolbar',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            flex: 1,
            defaults: {
                textAlign: 'left'
            },
            items: [{
                iconCls: 'fas fa-info',
                text: 'Info',
                style: {
                    marginBottom: '15px'
                }
            }, {
                xtype: 'tbfill'
            }, {
                iconCls: 'fas fa-cogs',
                text: 'Settings'
            }]
        });

        let components = Playground.view.main.config.components.map(xtype => {
            let i = {};
            i.title = xtype.toUpperCase();
            i.items = [{xtype: xtype}];
            return i;
        }).map((item, i) => {
            item._cmp = item.items;
            item.text = item.title;
            item.handler = function (b) {
                this.setComponentActive(b._cmp[0].xtype);
            }
            item.scope = this
            if (!Ext.isDefined(item._cmp)) {
                delete item.handler;
                item.disabled = true;
            }
            this.nav.insert(i + 1, item);
        });

        this.mainFrame = Ext.create({
            xtype: 'panel',
            header: false,
            flex: 8,
            layout: 'card',
            padding: '15 15 15 15',
            items: [{xtype: 'container', html: 'hello'}]
        });

        this.items = [this.nav, this.mainFrame];
        this.callParent(arguments);
    },

    setComponentActive: function (xtype, config) {
        let cmpCfg = {} || config;
        if (xtype) cmpCfg = Ext.apply(cmpCfg, {
            xtype: xtype
        })
        this.mainFrame.removeAll();
        this.mainFrame.add(cmpCfg);
    }
});
