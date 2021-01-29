(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
Ext.define('Playground.view.main.Main', {
    //extend: 'Ext.tab.Panel',
    extend: 'Ext.container.Container',
    alias: 'widget.app-main',

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

        let components = ['muzkatJsonViewer', 'devbnzJsonMain', 'muzkatMap', 'muzkatNrgMain', 'mzkPiCameraMain', 'bnz-weather', 'bnz-winamp'].map(xtype => {
            var i = {};
            i.title = xtype.toUpperCase();
            i.items = [{xtype: xtype}];
            return i;
        });

        var temp = components.concat([] /*[{
            title: 'Webamp',
            iconCls: 'fas fa-play',
            items: [{
                xtype: 'bnz-winamp'
            }]
        }, {
            title: 'Weather',
            iconCls: 'fas fa-sun',
            items: [{
                xtype: 'bnz-weather'
            }]
        }, {
            title: 'JSONViewer Online',
            iconCls: 'fas fa-edit',
            items: [{
                xtype: 'devbnzJsonMain',
                height: 600,
                width: 800
            }]
        }, {
            title: 'Muzkat Map',
            iconCls: 'fas fa-map',
            items: undefined
        }, {
            title: 'Muzkat Energy Codes',
            iconCls: 'fas fa-bolt',
            items: undefined
        }, {
            title: 'Raspberry Pi Camera',
            iconCls: 'fas fa-camera',
            items: undefined
        }]
        */
        ).map((item, i) => {
            item._cmp = item.items;
            item.text = item.title;
            // delete item.items;
            // delete item.title;
            item.handler = function (b) {
                Ext.toast(b._cmp[0].xtype);
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

    setComponentActive: function (xtype) {
        this.mainFrame.removeAll();
        this.mainFrame.add({xtype: xtype});
    }
});

},{}],2:[function(require,module,exports){
Ext.define('jsonviewer.view.JsonTextArea', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.muzkatJsonTextArea',

    title: 'Muzkat Json Online Viewer',

    layout: 'fit',

    // requires: ['sysmon.view.restclient.RestMain'],

    tbar: [{
        iconCls: 'x-fa fa-bug',
        text: 'edit',
        handler: function (btn) {
            var field = btn.up('muzkatJsonTextArea').down('textareafield'),
                jsonString = field.getValue(),
                jsonObject = Ext.JSON.decode(jsonString, true);
            if (jsonObject !== null) {
                Ext.log({dump: jsonObject, msg: 'valid Json Obj'});
                var leaf = btn.up('muzkatJsonTextArea').json2leaf(jsonObject);

                btn.up('muzkatJsonViewer').down('tabpanel').add({
                    xtype: 'muzkatJsonTreeView',
                    jsonTreeConfig: leaf
                });
            } else {
                Ext.log({msg: 'Json Obj not valid'});
            }

        }
    }, {
        text: 'Copy'
    }, {
        text: 'Format',
        handler: function (btn) {
            var a = btn.up('muzkatJsonTextArea').down('textareafield');
            var spaceFn = btn.up('muzkatJsonTextArea').space;
            for (var b = a.getValue().replace(/\n/g, " ").replace(/\r/g, " "), e = [], c = 0, d = !1, f = 0, i = b.length; f < i; f++) {
                var g = b.charAt(f);
                if (d && g === d) b.charAt(f - 1) !== "\\" && (d = !1);
                else if (!d && (g === '"' || g === "'")) d = g;
                else if (!d && (g === " " || g === "\t")) g = "";
                else if (!d && g === ":") g += " ";
                else if (!d && g === ",") g += "\n" + spaceFn(c * 2); else if (!d && (g === "[" || g === "{")) c++, g += "\n" + spaceFn(c * 2);
                else if (!d && (g === "]" || g === "}")) c--, g = "\n" + spaceFn(c * 2) + g;
                e.push(g)
            }

            a.setValue(e.join(""));
        }
    }, {
        text: 'Remove white space',
        handler: function (btn) {
            var a = btn.up('muzkatJsonTextArea').down('textareafield');
            for (var b = a.getValue().replace(/\n/g, " ").replace(/\r/g, " "), e = [], c = !1, d = 0, f = b.length; d < f; d++) {
                var i = b.charAt(d);
                if (c && i === c) b.charAt(d - 1) !== "\\" && (c = !1);
                else if (!c && (i === '"' || i === "'")) c = i; else if (!c && (i === " " || i === "\t")) i = "";
                e.push(i)
            }
            a.setValue(e.join(""));
        }
    }, {
        text: 'Clear'
    }, {
        text: 'Load JSON Data'
    }],

    space: function (a) {
        var b = [], e;
        for (e = 0; e < a; e++)b.push(" ");
        return b.join("")
    },

    initComponent: function () {

        this.items = [
            {
                xtype: 'textareafield',
                grow: true,
                fieldLabel: 'JsonString',
                maxLength: 100000000000000000000,
                anchor: '100%'
            }
        ];

        this.callParent(arguments);
    },

    json2leaf: function (a) {
        var b = [], c;
        for (c in a)a.hasOwnProperty(c) && (a[c] === null ? b.push({
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
                            iconCls: "x-fa fa-bug"
                        }) : typeof a[c] === "object" ? b.push({
                                text: c,
                                children: this.json2leaf(a[c]),
                                icon: Ext.isArray(a[c]) ? "x-fa fa-folder" : "x-fa fa-file"
                            }) : typeof a[c] === "function" && b.push({
                                text: c + " : function",
                                leaf: !0,
                                iconCls: "x-fa fa-bug"
                            }));
        return b
    }
});
Ext.define('jsonviewer.view.JsonTreeView', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.muzkatJsonTreeView',

    viewModel: {



    },

    title: 'Simple Tree',

    rootVisible: false,
    jsonTreeConfig: undefined, // set by constructor

    listeners: {

        /*render: function (a) {
            a.getSelectionModel().on("selectionchange", function (a, b) {
                d.gridbuild(b)
            })
        },*/
        cellcontextmenu: function (view, td, cellIndex, record, tr, rowIndex, e, eOpts )  {
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

    initComponent: function () {

        var jsonTree = [
            {text: 'detention', leaf: true},
            {
                text: 'homework', expanded: true, children: [
                {text: 'book report', leaf: true},
                {text: 'algebra', leaf: true}
            ]
            },
            {text: 'buy lottery tickets', leaf: true}
        ];

        if (this.jsonTreeConfig){
            jsonTree = this.jsonTreeConfig;
        }

        this.store = Ext.create('Ext.data.TreeStore', {
            root: {
                expanded: true,
                children: jsonTree
            }
        });

        this.callParent(arguments);
    }
});
Ext.define('jsonviewer.view.Main', {
    extend: 'Ext.container.Container',
    alias: 'widget.muzkatJsonViewer',

    layout: 'fit',

    initComponent: function () {

        this.items = [
            {
                xtype: 'tabpanel',
                items: [{
                    xtype: 'muzkatJsonTreeView'
                },
                    {
                        xtype: 'muzkatJsonTextArea'
                    }]
            }
        ];

        this.callParent(arguments);
    }
});
},{}],3:[function(require,module,exports){
Ext.define('devbnz.jsonviewer.components.TextArea', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.devbnzJsonTextArea',

    title: 'Text',
    iconCls: 'fas fa-font',

    layout: 'fit',

    controller: 'devbnzJsonTextAreaController',

    tbar: [{
        iconCls: 'fas fa-paste',
        text: 'Paste',
        handler: 'pasteJson'
    }, {
        iconCls: 'fas fa-copy',
        text: 'Copy'
    }, {
        xtype: 'tbseparator'
    }, {
        text: 'Format',
        iconCls: 'fas fa-file-signature',
        handler: 'formatJson'
    }, {
        text: 'Remove white space',
        iconCls: 'fas fa-edit',
        handler: 'removeWhitespace'
    }, {
        xtype: 'tbseparator'
    }, {
        text: 'Clear',
        iconCls: 'fas fa-eraser',
    }, {
        xtype: 'tbseparator'
    }, {
        text: 'Load JSON Data',
        iconCls: 'fas fa-file',
    }],

    padding: '10 10 10 10',

    items: [
        {
            xtype: 'textareafield',
            emptyText: 'Paste / Load JSON Data',
            grow: true,
            maxLength: 100000000000000000000
        }
    ]
});
Ext.define('devbnz.jsonviewer.components.TextAreaController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.devbnzJsonTextAreaController',

    pasteJson: function () {
        var view = this.getView();
        var field = view.down('textareafield'),
            jsonString = field.getValue(),
            jsonObject = Ext.JSON.decode(jsonString, true);
        if (jsonObject !== null) {
            var leaf = this.json2leaf(jsonObject);
            view.up('devbnzJsonMain').add({
                xtype: 'devbnzJsonTreeView',
                jsonTreeConfig: leaf
            });
        } else {
            Ext.log({msg: 'Json Obj not valid'});
        }
    },

    formatJson: function () {
        var view = this.getView();
        var a = view.down('textareafield');
        var spaceFn = this.space;
        for (var b = a.getValue().replace(/\n/g, " ").replace(/\r/g, " "), e = [], c = 0, d = !1, f = 0, i = b.length; f < i; f++) {
            var g = b.charAt(f);
            if (d && g === d) b.charAt(f - 1) !== "\\" && (d = !1);
            else if (!d && (g === '"' || g === "'")) d = g;
            else if (!d && (g === " " || g === "\t")) g = "";
            else if (!d && g === ":") g += " ";
            else if (!d && g === ",") g += "\n" + spaceFn(c * 2); else if (!d && (g === "[" || g === "{")) c++, g += "\n" + spaceFn(c * 2);
            else if (!d && (g === "]" || g === "}")) c--, g = "\n" + spaceFn(c * 2) + g;
            e.push(g)
        }

        a.setValue(e.join(""));
    },

    removeWhitespace: function () {
        var view = this.getView();
        var a = view.down('textareafield');
        for (var b = a.getValue().replace(/\n/g, " ").replace(/\r/g, " "), e = [], c = !1, d = 0, f = b.length; d < f; d++) {
            var i = b.charAt(d);
            if (c && i === c) b.charAt(d - 1) !== "\\" && (c = !1);
            else if (!c && (i === '"' || i === "'")) c = i; else if (!c && (i === " " || i === "\t")) i = "";
            e.push(i)
        }
        a.setValue(e.join(""));
    },

    space: function (a) {
        var b = [], e;
        for (e = 0; e < a; e++) b.push(" ");
        return b.join("")
    },

    json2leaf: function (a) {
        var b = [], c;
        for (c in a) a.hasOwnProperty(c) && (a[c] === null ? b.push({
            text: c + " : null",
            leaf: !0,
            iconCls: "fas fa-bug"
        }) : typeof a[c] === "string" ? b.push({
            text: c + ' : "' + a[c] + '"',
            leaf: !0,
            iconCls: "fas fa-bug"
        }) : typeof a[c] === "number" ? b.push({
            text: c + " : " + a[c],
            leaf: !0,
            iconCls: "fas fa-bug"
        }) : typeof a[c] === "boolean" ? b.push({
            text: c + " : " + (a[c] ? "true" : "false"),
            leaf: !0,
            iconCls: "fas fa-bug"
        }) : typeof a[c] === "object" ? b.push({
            text: c,
            children: this.json2leaf(a[c]),
            icon: Ext.isArray(a[c]) ? "fas fa-folder" : "fas fa-file"
        }) : typeof a[c] === "function" && b.push({
            text: c + " : function",
            leaf: !0,
            iconCls: "fas fa-bug"
        }));
        return b
    }

});

Ext.define('devbnz.jsonviewer.TreeView', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.devbnzJsonTreeView',

    rootVisible: false,
    jsonTreeConfig: undefined, // set by constructor

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

    initComponent: function () {

        var jsonTree = [
            {text: 'detention', leaf: true},
            {
                text: 'homework', expanded: true, children: [
                    {text: 'book report', leaf: true},
                    {text: 'algebra', leaf: true}
                ]
            },
            {text: 'buy lottery tickets', leaf: true}
        ];

        if (this.jsonTreeConfig) {
            jsonTree = this.jsonTreeConfig;
        }

        this.store = Ext.create('Ext.data.TreeStore', {
            root: {
                expanded: true,
                children: jsonTree
            }
        });

        this.callParent(arguments);
    }
});
Ext.define('devbnz.jsonviewer.JsonMain', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.devbnzJsonMain',

    controller: 'devbnzJsonMainController',

    items:
        [
            {
                xtype: 'panel',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                title: 'Viewer',
                iconCls: 'fas fa-eye',
                items:
                    [
                        {xtype: 'devbnzJsonTreeView', flex: 6, header: false},
                        {
                            xtype: 'container',
                            html: 'more soon', flex: 2
                        }]
            },
            {xtype: 'devbnzJsonTextArea'}
        ]
});
Ext.define('devbnz.jsonviewer.JsonMainController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.devbnzJsonMainController',


});

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
Ext.define('Playground.view.winamp.assets.Strings', {
  singleton: true,

  playerTitle: 'WEBAMP',
  playerEqBtn: 'EQ',
  playerPlBtn: 'PL',
  playlistTitle: 'PLAYLIST'

});

Ext.define('Playground.view.winamp.player.Player', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.bnz-player',

  title: Playground.view.winamp.assets.Strings.playerTitle,
  border: 0,
  reference: 'winamp-player',
  tools: [{
      type: 'close'
  }],

  items: [{
    xtype: 'panel',
    header: false,
    border: false,
    items: [{
      xtype: 'panel',
      header: false,
      border: false,
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
      xtype: 'panel',
      header: false,
      border: false,
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
        items: [{
          xtype: 'bnz-hslider',
          itemId: 'volumeSilder',
          flex: 2
        }, {
          xtype: 'bnz-hslider',
          itemId: 'panSlider',
          value: 0,
          increment: 1,
          minValue: -10,
          maxValue: 10,
          flex: 1
        }]
      }, {
        columnWidth: 0.20,
        items: [{
          text: Playground.view.winamp.assets.Strings.playerEqBtn,
          xtype: 'button',
          itemId: 'eq'
        }, {
          text: Playground.view.winamp.assets.Strings.playerPlBtn,
          xtype: 'button',
          itemId: 'pl'
        }]
      }]
    }, {
      xtype: 'panel',
      header: false,
      border: false,
      items: [{
        xtype: 'bnz-hslider',
        width: '100%'
      }]
    }]
  }],


  bbar: [{
    iconCls: 'x-fa fa-step-backward'
  }, {
    iconCls: 'x-fa fa-play',
    itemId: 'playBtn'
//    handler: 'playSound' // TODO listen to event in controller
  }, {
    iconCls: 'x-fa fa-pause',
    handler: 'stopPlay'
  }, {
    iconCls: 'x-fa fa-stop'
  }, {
    iconCls: 'x-fa fa-step-forward'
  }, {
    iconCls: 'x-fa fa-eject'
  }]

});

Ext.define('Playground.view.winamp.playlist.Playlist', {
  extend: 'Ext.grid.Panel',
  alias: 'widget.bnz-winamp-playlist',

  title: Playground.view.winamp.assets.Strings.playerTitle+ ' ' + Playground.view.winamp.assets.Strings.playlistTitle,
  border: 1,
  reference: 'winamp-playlist',
  tools: [{
      type: 'close'
  }],
  layout: {
    type: 'fit'
  },
  store: undefined,

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
    renderer: function(value, meta, record) {
      return Playground.view.winamp.Util.createhmsString(value);
    }
  }],

  bbar: [{
    text: 'ADD',
    menu: [{
      text: 'ADD URL'
    },{
      text: 'ADD LIST'
    },{
      text: 'ADD FILE'
    }]
  }, {
    text: 'REM'
  }, {
    text: 'SEL'
  }, {
    text: 'MISC'
  }],

  initComponent: function() {

    this.store = Ext.create('Ext.data.Store', {
      storeId: 'playList',
      fields: ['id', 'title', 'user', 'duration']
    });
    this.callParent();
  }
});

Ext.define('Playground.view.winamp.slider.Hslider', {
  extend: 'Ext.slider.Single',
  alias: 'widget.bnz-hslider',

  value: 50,
  increment: 10,
  minValue: 0,
  maxValue: 100,
  vertical: false
});

Ext.define('Playground.view.winamp.slider.Vslider', {
  extend: 'Ext.slider.Single',
  alias: 'widget.bnz-winampslider',

  value: 100,
  increment: 100,
  minValue: 0,
  maxValue: 5000,
  vertical: true,
  height: 100
});

Ext.define('Playground.view.winamp.Util', {
  singleton: true,

  welcomeTrack: 'https://soundcloud.com/bnzlovesyou/daktari-preview',
  initialPlaylist: '/users/1672444/tracks',

  // create duration h-m-s string from milliseconds
  createhmsString: function(milli) {
    var hours = Math.floor(milli / 36e5),
      mins = Math.floor((milli % 36e5) / 6e4),
      secs = Math.floor((milli % 6e4) / 1000);
    var hmsString = this.pad(hours) + ':' + this.pad(mins) + ':' + this.pad(secs);
    return hmsString;
  },

  // add leading zeros
  pad: function(number, size) {
    var s = String(number);
    while (s.length < (size || 2)) {
      s = "0" + s;
    }
    return s;
  }

});

Ext.define('Playground.view.winamp.Winamp', {
  extend: 'Ext.panel.Panel',
  xtype: 'bnz-winamp',

  controller: 'winamp-main',
  viewModel: 'winamp-main',

  title: 'Multimedia Player',
  header: false,
  width: 600,
  height: 'auto',
  border: 0,
  items: [{
    xtype: 'bnz-player'
  }, {
    xtype: 'panel',
    title: 'WINAMP EQUALIZER',
    tools: [{
      type: 'close'
    }],
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
    items: [{
      xtype: 'bnz-winampslider',
      itemId: 'freqSilder'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }]
  }, {
    xtype: 'bnz-winamp-playlist'
  }, {
    xtype: 'panel',
    title: Playground.view.winamp.assets.Strings.playerTitle + ' MONO MODE',
    items: [{
        /**
        Balance-Slider Left/Right
        -> aber ohne ALLES nach links/rechts zu ziehen,
        sondern den entsprechend anderen Stereokanal
        auszublenden (->ganz links bedeutet also nur noch
        linker Speaker ist aktiv, aber auch nur mit
        Inhalt des linken Stereo-Kanals)
        */
    }, {
      /*
           Stereo-Mono-Switch:
           beide Kanäle werden zu einem Monosignal zusammen
           gemischt und der Downmix auf einem/beiden
           Kanälen ausgegeben
           */
    }, {
      xtype: 'panel',
      title: 'Channel Selektor',
      items: [{
          xtype: 'segmentedbutton',
          allowMultiple: false,
          itemId: 'LeftRight',
          items: [{
            text: 'LEFT'
          }, {
            text: 'RIGHT',
          }, {
            text: 'BOTH',
          }]
        }, {
          xtype: 'container',
          items: [{
            xtype: 'bnz-hslider',
            itemId: 'balanceSliderLR',
            width: '100%',
            value: 0,
            increment: 1,
            minValue: -10,
            maxValue: 10,
            vertical: false
          }]
        },{
          xtype: 'container',
          layout: {
            type: 'hbox',
            align: 'stretch'
          },
          items: [{
            xtype: 'bnz-winampslider',
            itemId: 'sliderL',
            value: 5,
            increment: 1,
            minValue: 0,
            maxValue: 10,
            vertical: true,
            height: 100
          }, {
            xtype: 'bnz-winampslider',
            itemId: 'sliderR',
            value: 5,
            increment: 1,
            minValue: 0,
            maxValue: 10,
            vertical: true,
            height: 100
          }]
        }]
        /*
        Stereo-Signlechanel-Mono-Switch: man kann einen
        Stereo-Kanal auswählen welcher dann ausschließlich
        (dann aber auf beiden Kanälen) ausgegeben wird
        */
    }]
  }],

  initComponent: function() {
    this.callParent();
  }
});

Ext.define('Playground.view.winamp.WinampController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.winamp-main',

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

  control: {
    tool: {
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
    '#LeftRight': {
      toggle: 'separateChannel'
    },
    '#sliderL': {
      change: 'setLeftGain'
    },
    '#sliderR': {
      change: 'setRightGain'
    },
    '#balanceSliderLR':{
      change: 'changeBalance'
    },
    grid: {
      itemdblclick: 'onItemClick'
    }
  },

  onCloseClick: function(tool, e, owner, eOpts) {
    if (!(owner.reference === 'winamp-player')) {
      owner.hide();
    }

  },

  defaultRouting: function(){
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

  detachDefaultRouting: function(){
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

  changeBalance: function(cmp, x, y, eOpts){
    this.detachDefaultRouting();
   if (x >0 )
   {this.setLeftGain(0, 10-x)}
   if (x < 0)
   { x = Math.abs(x);
     this.setRightGain(0, 10-x);
   }
  },

  setLeftGain: function(cmp, x, y, eOpts) {
    this.detachDefaultRouting();
    this.gainL.gain.value = x / 10;
  },

  setRightGain: function(cmp, x, y, eOpts) {
    this.detachDefaultRouting();
    this.gainR.gain.value = x / 10;
  },

  separateChannel: function(container, button, pressed) {
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

  //TODO refactoring needed
  showHide: function(cmp) {
    if (cmp.itemId === 'eq') {
      eq = this.lookupReference('winamp-eq')
      if (eq.hidden) {
        eq.show();
      } else {
        eq.hide();
      }
    }
    if (cmp.itemId === 'pl') {
      pl = this.lookupReference('winamp-playlist')
      if (pl.hidden) {
        pl.show();
      } else {
        pl.hide();
      }
    }
  },

  onItemClick: function(view, record, item, index, e, eOpts) {
    me = this;
    me.setActualTrack(record.data);
  },

  setPan: function(cmp, x, y, eOpts) {
    this.defaultRouting();
    this.panNode.pan.value = x / 10;
  },

  setActualTrack: function(TrackInfo) {
    if (this.source != undefined) {
      this.source.stop();
    }
    me.getView().getViewModel().set("actualTrack", TrackInfo);
    me.getView().getViewModel().set("actualhms", Playground.view.winamp.Util.createhmsString(TrackInfo.duration));
    this.getData(TrackInfo.stream_url);
  },

  onSliderMove: function(cmp, x, y, eOpts) {
    Ext.log({dump: cmp });
    Ext.log({dump: x});
    Ext.log({dump: y});
    Ext.log({dump: eOpts});
  },

  setVolume: function(cmp, x, y, eOpts) {
    this.gainNode.gain.value = x / 100;
  },

  setMainFilter: function(cmp, x, y, eOpts) {
    this.mainFilter.frequency.value = x;
  },

  volumeReset: function() {
    this.gainNode.gain.value = 0.5;
  },

  init: function(view) {
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


    //  this.splitter.connect(this.merger, 1, 0);

    this.mainFilter.connect(this.panNode);
    this.panNode.connect(this.gainNode);
    //    this.gainR.connect(this.audioContext.destination)
    //    this.splitter.connect(this.gainNode,0);

    me = this;
    Ext.Loader.loadScript({
      url: 'https://connect.soundcloud.com/sdk/sdk-3.0.0.js',
      onLoad: function() {
        console.log('SoundCloud libary successfully loaded.');
        me.initSoundcloud();

      },
      onError: function() {
        console.log('Error while loading the SoundCloud libary');
      }
    });
  },

  initSoundcloud: function() {
    SC.initialize({
      client_id: '40493f5d7f709a9881675e26c824b136'
    });

    SC.get(Playground.view.winamp.Util.initialPlaylist).then(function(tracks) {
      var store = Ext.data.StoreManager.lookup('playList');
      store.add(tracks);
    });
  },

  stopPlay: function() {
    this.source.stop();
  },

  playSound: function() {
    if (this.source != undefined) {
      this.source.stop();
      var actualSound = this.getView().getViewModel().get("actualTrack");
      this.getData(actualSound.stream_url);
      return;
    }
    this.soundcloud();
    //source.start(0);
  },

  soundcloud: function() {
    me = this;
    url = Playground.view.winamp.Util.welcomeTrack;
    SC.get('/resolve', {
      url: url
    }).then(function(sound) {
      me.getView().getViewModel().set("actualTrack", sound);
      me.getView().getViewModel().set("actualhms", Playground.view.winamp.Util.createhmsString(sound.duration));
      me.getData(sound.stream_url);
    });
  },

  getData: function(sample) {
    me = this.audioContext;

    source = me.createBufferSource(),
    this.source = source;

    source.connect(this.mainFilter);

    var url = new URL(sample + '?client_id=17a992358db64d99e492326797fff3e8');

    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = function() {
      me.decodeAudioData(request.response,
        function(buffer) {
          console.log("sample loaded!");
          sample.loaded = true;
          source.buffer = buffer;
          source.start();
        },
        function() {
          console.log("Decoding error! ");
        });
    }
    sample.loaded = false;
    request.send();
  }
});

Ext.define('Playground.view.winamp.WinampModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.winamp-main',
    data: {
        name: 'Playground',
        track: undefined,
        actualTrack: {},
        actualhms: '00:00:00'
    }
});

},{}],9:[function(require,module,exports){
/**
 *
 * @param name
 * @param mainComponent
 * @param loginNeeded
 * @param file
 * @returns {{app: undefined, appMainComponent: *, appName: string, appLoginNeeded: *, start: (function(): *), defineBaseClass: (function(): void), launchApp: launchApp}}
 */
function muzkatApp(name, mainComponent, loginNeeded, file) {

    return {
        app: undefined,
        appName: 'mzk',
        appMainComponent: mainComponent,
        appLoginNeeded: loginNeeded,

        /**
         *
         * @returns {*}
         */
        launchApp: function () {
            if (typeof window.Ext !== 'undefined') {
                //this.defineBaseClass(); // TODO async + singleton Api
                this.app = this.start();
                return this.app;
            } else {
                alert('Framework is not available. Application cannot be startet.');
                return false;
            }
        },

        /**
         *
         */
        defineBaseClass: function () {
            var me = this;
            return Ext.define(me.appName + '.MainApplication', {
                extend: 'Ext.container.Container',
                alias: 'widget.' + me.appName + 'Main',
                layout: 'fit',

                requestLogin: me.appLoginNeeded,
                mainComponent: me.appMainComponent,
                appName: me.appName,

                fileArray: [],

                initComponent: function () {
                    var items = [];
                    if (this.requestLogin) {
                        items = [{
                            xtype: 'container',
                            html: 'login required...'
                        }]
                    } else {
                        if (this.mainComponent !== false) {
                            items = [{xtype: this.mainComponent}]
                        } else {
                            this.fileArray.push(file.url);
                            items = [{
                                xtype: 'button',
                                layout: 'fit',
                                text: 'Muzkat Frame was loaded without module OR supplied with a module url.'
                            }];
                        }
                    }
                    this.items = items;
                    this.callParent(arguments);
                },

                changeComponent: function () {
                    var me = this;
                    this.loadScripts(this.fileArray).then(function (success) {
                        Ext.defer(function () {
                            me.removeAll();
                            me.add({xtype: file.cmp});
                        }, 300);
                    });
                },

                loadScripts: function (jsCssArray) {
                    var loadingArray = [], me = this;
                    return new Ext.Promise(function (resolve, reject) {
                        Ext.Array.each(jsCssArray, function (url) {
                            loadingArray.push(me.loadScript(url));
                        });

                        Ext.Promise.all(loadingArray).then(function (success) {
                                console.log('artefacts were loaded successfully');
                                resolve('');
                            },
                            function (error) {
                                reject('Error during artefact loading...');
                            });
                    });
                },

                loadScript: function (url) {
                    return new Ext.Promise(function (resolve, reject) {
                        Ext.Loader.loadScript({
                            url: url,
                            onLoad: function () {
                                console.log(url + ' was loaded successfully');
                                resolve('Loading was successful');
                            },
                            onError: function (error) {
                                reject('Loading was not successful for: ' + url);
                            }
                        });
                    });
                }
            });
        },

        /**
         *
         * @returns {*}
         */
        start: function () {
            var me = this;
            return Ext.application({
                name: 'mzk',
                mainView: {xtype: me.appMainComponent},
                launch: function () {
                    Ext.log('Mzk wrapper booted!');
                }
            });
        }
    };
}

module.exports = muzkatApp;
},{}],10:[function(require,module,exports){
const muzkatApp = require('muzkat-ext-app');
let pt = new muzkatApp('Muzkat ExtJS6 Widgets', 'app-main', false);
pt.launchApp();
},{"muzkat-ext-app":9}]},{},[2,3,4,5,6,7,8,1,10])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9qcy9hcHAuZGVidWcuanMiLCJidWlsZC9qcy9qc29uLXZpZXdlci5kZWJ1Zy5qcyIsImJ1aWxkL2pzL2pzb252aWV3ZXIuZGVidWcuanMiLCJidWlsZC9qcy9tdXprYXRNYXAuZGVidWcuanMiLCJidWlsZC9qcy9ucmcuZGVidWcuanMiLCJidWlsZC9qcy9waS1jYW1lcmEuZGVidWcuanMiLCJidWlsZC9qcy93ZWF0aGVyLmRlYnVnLmpzIiwiYnVpbGQvanMvd2luYW1wLmRlYnVnLmpzIiwibm9kZV9tb2R1bGVzL211emthdC1leHQtYXBwL2FwcC5qcyIsInNyYy93cmFwcGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Z0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM2FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1ckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiRXh0LmRlZmluZSgnUGxheWdyb3VuZC52aWV3Lm1haW4uTWFpbicsIHtcbiAgICAvL2V4dGVuZDogJ0V4dC50YWIuUGFuZWwnLFxuICAgIGV4dGVuZDogJ0V4dC5jb250YWluZXIuQ29udGFpbmVyJyxcbiAgICBhbGlhczogJ3dpZGdldC5hcHAtbWFpbicsXG5cbiAgICB0aXRsZVJvdGF0aW9uOiAwLFxuICAgIHRhYlJvdGF0aW9uOiAwLFxuXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgeHR5cGU6ICdwYW5lbCcsXG4gICAgICAgIGxheW91dDogJ2NlbnRlcidcbiAgICB9LFxuXG4gICAgbGF5b3V0OiB7XG4gICAgICAgIHR5cGU6ICdoYm94JyxcbiAgICAgICAgYWxpZ246ICdzdHJldGNoJ1xuICAgIH0sXG5cbiAgICBpbml0Q29tcG9uZW50OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdGhpcy5uYXYgPSBFeHQuY3JlYXRlKHtcbiAgICAgICAgICAgIHh0eXBlOiAndG9vbGJhcicsXG4gICAgICAgICAgICBsYXlvdXQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAndmJveCcsXG4gICAgICAgICAgICAgICAgYWxpZ246ICdzdHJldGNoJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZsZXg6IDEsXG4gICAgICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgICAgIHRleHRBbGlnbjogJ2xlZnQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaXRlbXM6IFt7XG4gICAgICAgICAgICAgICAgaWNvbkNsczogJ2ZhcyBmYS1pbmZvJyxcbiAgICAgICAgICAgICAgICB0ZXh0OiAnSW5mbycsXG4gICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnMTVweCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgeHR5cGU6ICd0YmZpbGwnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgaWNvbkNsczogJ2ZhcyBmYS1jb2dzJyxcbiAgICAgICAgICAgICAgICB0ZXh0OiAnU2V0dGluZ3MnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgY29tcG9uZW50cyA9IFsnbXV6a2F0SnNvblZpZXdlcicsICdkZXZibnpKc29uTWFpbicsICdtdXprYXRNYXAnLCAnbXV6a2F0TnJnTWFpbicsICdtemtQaUNhbWVyYU1haW4nLCAnYm56LXdlYXRoZXInLCAnYm56LXdpbmFtcCddLm1hcCh4dHlwZSA9PiB7XG4gICAgICAgICAgICB2YXIgaSA9IHt9O1xuICAgICAgICAgICAgaS50aXRsZSA9IHh0eXBlLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICBpLml0ZW1zID0gW3t4dHlwZTogeHR5cGV9XTtcbiAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgdGVtcCA9IGNvbXBvbmVudHMuY29uY2F0KFtdIC8qW3tcbiAgICAgICAgICAgIHRpdGxlOiAnV2ViYW1wJyxcbiAgICAgICAgICAgIGljb25DbHM6ICdmYXMgZmEtcGxheScsXG4gICAgICAgICAgICBpdGVtczogW3tcbiAgICAgICAgICAgICAgICB4dHlwZTogJ2Juei13aW5hbXAnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICB0aXRsZTogJ1dlYXRoZXInLFxuICAgICAgICAgICAgaWNvbkNsczogJ2ZhcyBmYS1zdW4nLFxuICAgICAgICAgICAgaXRlbXM6IFt7XG4gICAgICAgICAgICAgICAgeHR5cGU6ICdibnotd2VhdGhlcidcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHRpdGxlOiAnSlNPTlZpZXdlciBPbmxpbmUnLFxuICAgICAgICAgICAgaWNvbkNsczogJ2ZhcyBmYS1lZGl0JyxcbiAgICAgICAgICAgIGl0ZW1zOiBbe1xuICAgICAgICAgICAgICAgIHh0eXBlOiAnZGV2Ym56SnNvbk1haW4nLFxuICAgICAgICAgICAgICAgIGhlaWdodDogNjAwLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA4MDBcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHRpdGxlOiAnTXV6a2F0IE1hcCcsXG4gICAgICAgICAgICBpY29uQ2xzOiAnZmFzIGZhLW1hcCcsXG4gICAgICAgICAgICBpdGVtczogdW5kZWZpbmVkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHRpdGxlOiAnTXV6a2F0IEVuZXJneSBDb2RlcycsXG4gICAgICAgICAgICBpY29uQ2xzOiAnZmFzIGZhLWJvbHQnLFxuICAgICAgICAgICAgaXRlbXM6IHVuZGVmaW5lZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICB0aXRsZTogJ1Jhc3BiZXJyeSBQaSBDYW1lcmEnLFxuICAgICAgICAgICAgaWNvbkNsczogJ2ZhcyBmYS1jYW1lcmEnLFxuICAgICAgICAgICAgaXRlbXM6IHVuZGVmaW5lZFxuICAgICAgICB9XVxuICAgICAgICAqL1xuICAgICAgICApLm1hcCgoaXRlbSwgaSkgPT4ge1xuICAgICAgICAgICAgaXRlbS5fY21wID0gaXRlbS5pdGVtcztcbiAgICAgICAgICAgIGl0ZW0udGV4dCA9IGl0ZW0udGl0bGU7XG4gICAgICAgICAgICAvLyBkZWxldGUgaXRlbS5pdGVtcztcbiAgICAgICAgICAgIC8vIGRlbGV0ZSBpdGVtLnRpdGxlO1xuICAgICAgICAgICAgaXRlbS5oYW5kbGVyID0gZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgICAgICAgICBFeHQudG9hc3QoYi5fY21wWzBdLnh0eXBlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldENvbXBvbmVudEFjdGl2ZShiLl9jbXBbMF0ueHR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaXRlbS5zY29wZSA9IHRoaXNcbiAgICAgICAgICAgIGlmICghRXh0LmlzRGVmaW5lZChpdGVtLl9jbXApKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGl0ZW0uaGFuZGxlcjtcbiAgICAgICAgICAgICAgICBpdGVtLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubmF2Lmluc2VydChpICsgMSwgaXRlbSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMubWFpbkZyYW1lID0gRXh0LmNyZWF0ZSh7XG4gICAgICAgICAgICB4dHlwZTogJ3BhbmVsJyxcbiAgICAgICAgICAgIGhlYWRlcjogZmFsc2UsXG4gICAgICAgICAgICBmbGV4OiA4LFxuICAgICAgICAgICAgbGF5b3V0OiAnY2FyZCcsXG4gICAgICAgICAgICBwYWRkaW5nOiAnMTUgMTUgMTUgMTUnLFxuICAgICAgICAgICAgaXRlbXM6IFt7eHR5cGU6ICdjb250YWluZXInLCBodG1sOiAnaGVsbG8nfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pdGVtcyA9IFt0aGlzLm5hdiwgdGhpcy5tYWluRnJhbWVdO1xuXG4gICAgICAgIHRoaXMuY2FsbFBhcmVudChhcmd1bWVudHMpO1xuICAgIH0sXG5cbiAgICBzZXRDb21wb25lbnRBY3RpdmU6IGZ1bmN0aW9uICh4dHlwZSkge1xuICAgICAgICB0aGlzLm1haW5GcmFtZS5yZW1vdmVBbGwoKTtcbiAgICAgICAgdGhpcy5tYWluRnJhbWUuYWRkKHt4dHlwZTogeHR5cGV9KTtcbiAgICB9XG59KTtcbiIsIkV4dC5kZWZpbmUoJ2pzb252aWV3ZXIudmlldy5Kc29uVGV4dEFyZWEnLCB7XG4gICAgZXh0ZW5kOiAnRXh0LnBhbmVsLlBhbmVsJyxcbiAgICBhbGlhczogJ3dpZGdldC5tdXprYXRKc29uVGV4dEFyZWEnLFxuXG4gICAgdGl0bGU6ICdNdXprYXQgSnNvbiBPbmxpbmUgVmlld2VyJyxcblxuICAgIGxheW91dDogJ2ZpdCcsXG5cbiAgICAvLyByZXF1aXJlczogWydzeXNtb24udmlldy5yZXN0Y2xpZW50LlJlc3RNYWluJ10sXG5cbiAgICB0YmFyOiBbe1xuICAgICAgICBpY29uQ2xzOiAneC1mYSBmYS1idWcnLFxuICAgICAgICB0ZXh0OiAnZWRpdCcsXG4gICAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uIChidG4pIHtcbiAgICAgICAgICAgIHZhciBmaWVsZCA9IGJ0bi51cCgnbXV6a2F0SnNvblRleHRBcmVhJykuZG93bigndGV4dGFyZWFmaWVsZCcpLFxuICAgICAgICAgICAgICAgIGpzb25TdHJpbmcgPSBmaWVsZC5nZXRWYWx1ZSgpLFxuICAgICAgICAgICAgICAgIGpzb25PYmplY3QgPSBFeHQuSlNPTi5kZWNvZGUoanNvblN0cmluZywgdHJ1ZSk7XG4gICAgICAgICAgICBpZiAoanNvbk9iamVjdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIEV4dC5sb2coe2R1bXA6IGpzb25PYmplY3QsIG1zZzogJ3ZhbGlkIEpzb24gT2JqJ30pO1xuICAgICAgICAgICAgICAgIHZhciBsZWFmID0gYnRuLnVwKCdtdXprYXRKc29uVGV4dEFyZWEnKS5qc29uMmxlYWYoanNvbk9iamVjdCk7XG5cbiAgICAgICAgICAgICAgICBidG4udXAoJ211emthdEpzb25WaWV3ZXInKS5kb3duKCd0YWJwYW5lbCcpLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgIHh0eXBlOiAnbXV6a2F0SnNvblRyZWVWaWV3JyxcbiAgICAgICAgICAgICAgICAgICAganNvblRyZWVDb25maWc6IGxlYWZcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgRXh0LmxvZyh7bXNnOiAnSnNvbiBPYmogbm90IHZhbGlkJ30pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIHRleHQ6ICdDb3B5J1xuICAgIH0sIHtcbiAgICAgICAgdGV4dDogJ0Zvcm1hdCcsXG4gICAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uIChidG4pIHtcbiAgICAgICAgICAgIHZhciBhID0gYnRuLnVwKCdtdXprYXRKc29uVGV4dEFyZWEnKS5kb3duKCd0ZXh0YXJlYWZpZWxkJyk7XG4gICAgICAgICAgICB2YXIgc3BhY2VGbiA9IGJ0bi51cCgnbXV6a2F0SnNvblRleHRBcmVhJykuc3BhY2U7XG4gICAgICAgICAgICBmb3IgKHZhciBiID0gYS5nZXRWYWx1ZSgpLnJlcGxhY2UoL1xcbi9nLCBcIiBcIikucmVwbGFjZSgvXFxyL2csIFwiIFwiKSwgZSA9IFtdLCBjID0gMCwgZCA9ICExLCBmID0gMCwgaSA9IGIubGVuZ3RoOyBmIDwgaTsgZisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGcgPSBiLmNoYXJBdChmKTtcbiAgICAgICAgICAgICAgICBpZiAoZCAmJiBnID09PSBkKSBiLmNoYXJBdChmIC0gMSkgIT09IFwiXFxcXFwiICYmIChkID0gITEpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCFkICYmIChnID09PSAnXCInIHx8IGcgPT09IFwiJ1wiKSkgZCA9IGc7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoIWQgJiYgKGcgPT09IFwiIFwiIHx8IGcgPT09IFwiXFx0XCIpKSBnID0gXCJcIjtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICghZCAmJiBnID09PSBcIjpcIikgZyArPSBcIiBcIjtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICghZCAmJiBnID09PSBcIixcIikgZyArPSBcIlxcblwiICsgc3BhY2VGbihjICogMik7IGVsc2UgaWYgKCFkICYmIChnID09PSBcIltcIiB8fCBnID09PSBcIntcIikpIGMrKywgZyArPSBcIlxcblwiICsgc3BhY2VGbihjICogMik7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoIWQgJiYgKGcgPT09IFwiXVwiIHx8IGcgPT09IFwifVwiKSkgYy0tLCBnID0gXCJcXG5cIiArIHNwYWNlRm4oYyAqIDIpICsgZztcbiAgICAgICAgICAgICAgICBlLnB1c2goZylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYS5zZXRWYWx1ZShlLmpvaW4oXCJcIikpO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICB0ZXh0OiAnUmVtb3ZlIHdoaXRlIHNwYWNlJyxcbiAgICAgICAgaGFuZGxlcjogZnVuY3Rpb24gKGJ0bikge1xuICAgICAgICAgICAgdmFyIGEgPSBidG4udXAoJ211emthdEpzb25UZXh0QXJlYScpLmRvd24oJ3RleHRhcmVhZmllbGQnKTtcbiAgICAgICAgICAgIGZvciAodmFyIGIgPSBhLmdldFZhbHVlKCkucmVwbGFjZSgvXFxuL2csIFwiIFwiKS5yZXBsYWNlKC9cXHIvZywgXCIgXCIpLCBlID0gW10sIGMgPSAhMSwgZCA9IDAsIGYgPSBiLmxlbmd0aDsgZCA8IGY7IGQrKykge1xuICAgICAgICAgICAgICAgIHZhciBpID0gYi5jaGFyQXQoZCk7XG4gICAgICAgICAgICAgICAgaWYgKGMgJiYgaSA9PT0gYykgYi5jaGFyQXQoZCAtIDEpICE9PSBcIlxcXFxcIiAmJiAoYyA9ICExKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICghYyAmJiAoaSA9PT0gJ1wiJyB8fCBpID09PSBcIidcIikpIGMgPSBpOyBlbHNlIGlmICghYyAmJiAoaSA9PT0gXCIgXCIgfHwgaSA9PT0gXCJcXHRcIikpIGkgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGUucHVzaChpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYS5zZXRWYWx1ZShlLmpvaW4oXCJcIikpO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICB0ZXh0OiAnQ2xlYXInXG4gICAgfSwge1xuICAgICAgICB0ZXh0OiAnTG9hZCBKU09OIERhdGEnXG4gICAgfV0sXG5cbiAgICBzcGFjZTogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgdmFyIGIgPSBbXSwgZTtcbiAgICAgICAgZm9yIChlID0gMDsgZSA8IGE7IGUrKyliLnB1c2goXCIgXCIpO1xuICAgICAgICByZXR1cm4gYi5qb2luKFwiXCIpXG4gICAgfSxcblxuICAgIGluaXRDb21wb25lbnQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB0aGlzLml0ZW1zID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHh0eXBlOiAndGV4dGFyZWFmaWVsZCcsXG4gICAgICAgICAgICAgICAgZ3JvdzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBmaWVsZExhYmVsOiAnSnNvblN0cmluZycsXG4gICAgICAgICAgICAgICAgbWF4TGVuZ3RoOiAxMDAwMDAwMDAwMDAwMDAwMDAwMDAsXG4gICAgICAgICAgICAgICAgYW5jaG9yOiAnMTAwJSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcblxuICAgICAgICB0aGlzLmNhbGxQYXJlbnQoYXJndW1lbnRzKTtcbiAgICB9LFxuXG4gICAganNvbjJsZWFmOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICB2YXIgYiA9IFtdLCBjO1xuICAgICAgICBmb3IgKGMgaW4gYSlhLmhhc093blByb3BlcnR5KGMpICYmIChhW2NdID09PSBudWxsID8gYi5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBjICsgXCIgOiBudWxsXCIsXG4gICAgICAgICAgICAgICAgbGVhZjogITAsXG4gICAgICAgICAgICAgICAgaWNvbkNsczogXCJ4LWZhIGZhLWJ1Z1wiXG4gICAgICAgICAgICB9KSA6IHR5cGVvZiBhW2NdID09PSBcInN0cmluZ1wiID8gYi5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogYyArICcgOiBcIicgKyBhW2NdICsgJ1wiJyxcbiAgICAgICAgICAgICAgICAgICAgbGVhZjogITAsXG4gICAgICAgICAgICAgICAgICAgIGljb25DbHM6IFwieC1mYSBmYS1idWdcIlxuICAgICAgICAgICAgICAgIH0pIDogdHlwZW9mIGFbY10gPT09IFwibnVtYmVyXCIgPyBiLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogYyArIFwiIDogXCIgKyBhW2NdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGVhZjogITAsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uQ2xzOiBcIngtZmEgZmEtYnVnXCJcbiAgICAgICAgICAgICAgICAgICAgfSkgOiB0eXBlb2YgYVtjXSA9PT0gXCJib29sZWFuXCIgPyBiLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGMgKyBcIiA6IFwiICsgKGFbY10gPyBcInRydWVcIiA6IFwiZmFsc2VcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVhZjogITAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkNsczogXCJ4LWZhIGZhLWJ1Z1wiXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSA6IHR5cGVvZiBhW2NdID09PSBcIm9iamVjdFwiID8gYi5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogYyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IHRoaXMuanNvbjJsZWFmKGFbY10pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiBFeHQuaXNBcnJheShhW2NdKSA/IFwieC1mYSBmYS1mb2xkZXJcIiA6IFwieC1mYSBmYS1maWxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSA6IHR5cGVvZiBhW2NdID09PSBcImZ1bmN0aW9uXCIgJiYgYi5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogYyArIFwiIDogZnVuY3Rpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVhZjogITAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25DbHM6IFwieC1mYSBmYS1idWdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgcmV0dXJuIGJcbiAgICB9XG59KTtcbkV4dC5kZWZpbmUoJ2pzb252aWV3ZXIudmlldy5Kc29uVHJlZVZpZXcnLCB7XG4gICAgZXh0ZW5kOiAnRXh0LnRyZWUuUGFuZWwnLFxuICAgIGFsaWFzOiAnd2lkZ2V0Lm11emthdEpzb25UcmVlVmlldycsXG5cbiAgICB2aWV3TW9kZWw6IHtcblxuXG5cbiAgICB9LFxuXG4gICAgdGl0bGU6ICdTaW1wbGUgVHJlZScsXG5cbiAgICByb290VmlzaWJsZTogZmFsc2UsXG4gICAganNvblRyZWVDb25maWc6IHVuZGVmaW5lZCwgLy8gc2V0IGJ5IGNvbnN0cnVjdG9yXG5cbiAgICBsaXN0ZW5lcnM6IHtcblxuICAgICAgICAvKnJlbmRlcjogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIGEuZ2V0U2VsZWN0aW9uTW9kZWwoKS5vbihcInNlbGVjdGlvbmNoYW5nZVwiLCBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgIGQuZ3JpZGJ1aWxkKGIpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9LCovXG4gICAgICAgIGNlbGxjb250ZXh0bWVudTogZnVuY3Rpb24gKHZpZXcsIHRkLCBjZWxsSW5kZXgsIHJlY29yZCwgdHIsIHJvd0luZGV4LCBlLCBlT3B0cyApICB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB2YXIgYiA9IGU7XG4gICAgICAgICAgICAobmV3IEV4dC5tZW51Lk1lbnUoe1xuICAgICAgICAgICAgICAgIGl0ZW1zOiBbe1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIkV4cGFuZFwiLCBoYW5kbGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhLmV4cGFuZCgpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiRXhwYW5kIGFsbFwiLCBoYW5kbGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhLmV4cGFuZCghMClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIFwiLVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiQ29sbGFwc2VcIiwgaGFuZGxlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYS5jb2xsYXBzZSgpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIkNvbGxhcHNlIGFsbFwiLCBoYW5kbGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhLmNvbGxhcHNlKCEwKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9KSkuc2hvd0F0KGIuZ2V0WFkoKSlcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBpbml0Q29tcG9uZW50OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIGpzb25UcmVlID0gW1xuICAgICAgICAgICAge3RleHQ6ICdkZXRlbnRpb24nLCBsZWFmOiB0cnVlfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiAnaG9tZXdvcmsnLCBleHBhbmRlZDogdHJ1ZSwgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICB7dGV4dDogJ2Jvb2sgcmVwb3J0JywgbGVhZjogdHJ1ZX0sXG4gICAgICAgICAgICAgICAge3RleHQ6ICdhbGdlYnJhJywgbGVhZjogdHJ1ZX1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7dGV4dDogJ2J1eSBsb3R0ZXJ5IHRpY2tldHMnLCBsZWFmOiB0cnVlfVxuICAgICAgICBdO1xuXG4gICAgICAgIGlmICh0aGlzLmpzb25UcmVlQ29uZmlnKXtcbiAgICAgICAgICAgIGpzb25UcmVlID0gdGhpcy5qc29uVHJlZUNvbmZpZztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RvcmUgPSBFeHQuY3JlYXRlKCdFeHQuZGF0YS5UcmVlU3RvcmUnLCB7XG4gICAgICAgICAgICByb290OiB7XG4gICAgICAgICAgICAgICAgZXhwYW5kZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IGpzb25UcmVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY2FsbFBhcmVudChhcmd1bWVudHMpO1xuICAgIH1cbn0pO1xuRXh0LmRlZmluZSgnanNvbnZpZXdlci52aWV3Lk1haW4nLCB7XG4gICAgZXh0ZW5kOiAnRXh0LmNvbnRhaW5lci5Db250YWluZXInLFxuICAgIGFsaWFzOiAnd2lkZ2V0Lm11emthdEpzb25WaWV3ZXInLFxuXG4gICAgbGF5b3V0OiAnZml0JyxcblxuICAgIGluaXRDb21wb25lbnQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB0aGlzLml0ZW1zID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHh0eXBlOiAndGFicGFuZWwnLFxuICAgICAgICAgICAgICAgIGl0ZW1zOiBbe1xuICAgICAgICAgICAgICAgICAgICB4dHlwZTogJ211emthdEpzb25UcmVlVmlldydcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4dHlwZTogJ211emthdEpzb25UZXh0QXJlYSdcbiAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcblxuICAgICAgICB0aGlzLmNhbGxQYXJlbnQoYXJndW1lbnRzKTtcbiAgICB9XG59KTsiLCJFeHQuZGVmaW5lKCdkZXZibnouanNvbnZpZXdlci5jb21wb25lbnRzLlRleHRBcmVhJywge1xuICAgIGV4dGVuZDogJ0V4dC5wYW5lbC5QYW5lbCcsXG4gICAgYWxpYXM6ICd3aWRnZXQuZGV2Ym56SnNvblRleHRBcmVhJyxcblxuICAgIHRpdGxlOiAnVGV4dCcsXG4gICAgaWNvbkNsczogJ2ZhcyBmYS1mb250JyxcblxuICAgIGxheW91dDogJ2ZpdCcsXG5cbiAgICBjb250cm9sbGVyOiAnZGV2Ym56SnNvblRleHRBcmVhQ29udHJvbGxlcicsXG5cbiAgICB0YmFyOiBbe1xuICAgICAgICBpY29uQ2xzOiAnZmFzIGZhLXBhc3RlJyxcbiAgICAgICAgdGV4dDogJ1Bhc3RlJyxcbiAgICAgICAgaGFuZGxlcjogJ3Bhc3RlSnNvbidcbiAgICB9LCB7XG4gICAgICAgIGljb25DbHM6ICdmYXMgZmEtY29weScsXG4gICAgICAgIHRleHQ6ICdDb3B5J1xuICAgIH0sIHtcbiAgICAgICAgeHR5cGU6ICd0YnNlcGFyYXRvcidcbiAgICB9LCB7XG4gICAgICAgIHRleHQ6ICdGb3JtYXQnLFxuICAgICAgICBpY29uQ2xzOiAnZmFzIGZhLWZpbGUtc2lnbmF0dXJlJyxcbiAgICAgICAgaGFuZGxlcjogJ2Zvcm1hdEpzb24nXG4gICAgfSwge1xuICAgICAgICB0ZXh0OiAnUmVtb3ZlIHdoaXRlIHNwYWNlJyxcbiAgICAgICAgaWNvbkNsczogJ2ZhcyBmYS1lZGl0JyxcbiAgICAgICAgaGFuZGxlcjogJ3JlbW92ZVdoaXRlc3BhY2UnXG4gICAgfSwge1xuICAgICAgICB4dHlwZTogJ3Ric2VwYXJhdG9yJ1xuICAgIH0sIHtcbiAgICAgICAgdGV4dDogJ0NsZWFyJyxcbiAgICAgICAgaWNvbkNsczogJ2ZhcyBmYS1lcmFzZXInLFxuICAgIH0sIHtcbiAgICAgICAgeHR5cGU6ICd0YnNlcGFyYXRvcidcbiAgICB9LCB7XG4gICAgICAgIHRleHQ6ICdMb2FkIEpTT04gRGF0YScsXG4gICAgICAgIGljb25DbHM6ICdmYXMgZmEtZmlsZScsXG4gICAgfV0sXG5cbiAgICBwYWRkaW5nOiAnMTAgMTAgMTAgMTAnLFxuXG4gICAgaXRlbXM6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgeHR5cGU6ICd0ZXh0YXJlYWZpZWxkJyxcbiAgICAgICAgICAgIGVtcHR5VGV4dDogJ1Bhc3RlIC8gTG9hZCBKU09OIERhdGEnLFxuICAgICAgICAgICAgZ3JvdzogdHJ1ZSxcbiAgICAgICAgICAgIG1heExlbmd0aDogMTAwMDAwMDAwMDAwMDAwMDAwMDAwXG4gICAgICAgIH1cbiAgICBdXG59KTtcbkV4dC5kZWZpbmUoJ2RldmJuei5qc29udmlld2VyLmNvbXBvbmVudHMuVGV4dEFyZWFDb250cm9sbGVyJywge1xuICAgIGV4dGVuZDogJ0V4dC5hcHAuVmlld0NvbnRyb2xsZXInLFxuICAgIGFsaWFzOiAnY29udHJvbGxlci5kZXZibnpKc29uVGV4dEFyZWFDb250cm9sbGVyJyxcblxuICAgIHBhc3RlSnNvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdmlldyA9IHRoaXMuZ2V0VmlldygpO1xuICAgICAgICB2YXIgZmllbGQgPSB2aWV3LmRvd24oJ3RleHRhcmVhZmllbGQnKSxcbiAgICAgICAgICAgIGpzb25TdHJpbmcgPSBmaWVsZC5nZXRWYWx1ZSgpLFxuICAgICAgICAgICAganNvbk9iamVjdCA9IEV4dC5KU09OLmRlY29kZShqc29uU3RyaW5nLCB0cnVlKTtcbiAgICAgICAgaWYgKGpzb25PYmplY3QgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBsZWFmID0gdGhpcy5qc29uMmxlYWYoanNvbk9iamVjdCk7XG4gICAgICAgICAgICB2aWV3LnVwKCdkZXZibnpKc29uTWFpbicpLmFkZCh7XG4gICAgICAgICAgICAgICAgeHR5cGU6ICdkZXZibnpKc29uVHJlZVZpZXcnLFxuICAgICAgICAgICAgICAgIGpzb25UcmVlQ29uZmlnOiBsZWFmXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEV4dC5sb2coe21zZzogJ0pzb24gT2JqIG5vdCB2YWxpZCd9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBmb3JtYXRKc29uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB2aWV3ID0gdGhpcy5nZXRWaWV3KCk7XG4gICAgICAgIHZhciBhID0gdmlldy5kb3duKCd0ZXh0YXJlYWZpZWxkJyk7XG4gICAgICAgIHZhciBzcGFjZUZuID0gdGhpcy5zcGFjZTtcbiAgICAgICAgZm9yICh2YXIgYiA9IGEuZ2V0VmFsdWUoKS5yZXBsYWNlKC9cXG4vZywgXCIgXCIpLnJlcGxhY2UoL1xcci9nLCBcIiBcIiksIGUgPSBbXSwgYyA9IDAsIGQgPSAhMSwgZiA9IDAsIGkgPSBiLmxlbmd0aDsgZiA8IGk7IGYrKykge1xuICAgICAgICAgICAgdmFyIGcgPSBiLmNoYXJBdChmKTtcbiAgICAgICAgICAgIGlmIChkICYmIGcgPT09IGQpIGIuY2hhckF0KGYgLSAxKSAhPT0gXCJcXFxcXCIgJiYgKGQgPSAhMSk7XG4gICAgICAgICAgICBlbHNlIGlmICghZCAmJiAoZyA9PT0gJ1wiJyB8fCBnID09PSBcIidcIikpIGQgPSBnO1xuICAgICAgICAgICAgZWxzZSBpZiAoIWQgJiYgKGcgPT09IFwiIFwiIHx8IGcgPT09IFwiXFx0XCIpKSBnID0gXCJcIjtcbiAgICAgICAgICAgIGVsc2UgaWYgKCFkICYmIGcgPT09IFwiOlwiKSBnICs9IFwiIFwiO1xuICAgICAgICAgICAgZWxzZSBpZiAoIWQgJiYgZyA9PT0gXCIsXCIpIGcgKz0gXCJcXG5cIiArIHNwYWNlRm4oYyAqIDIpOyBlbHNlIGlmICghZCAmJiAoZyA9PT0gXCJbXCIgfHwgZyA9PT0gXCJ7XCIpKSBjKyssIGcgKz0gXCJcXG5cIiArIHNwYWNlRm4oYyAqIDIpO1xuICAgICAgICAgICAgZWxzZSBpZiAoIWQgJiYgKGcgPT09IFwiXVwiIHx8IGcgPT09IFwifVwiKSkgYy0tLCBnID0gXCJcXG5cIiArIHNwYWNlRm4oYyAqIDIpICsgZztcbiAgICAgICAgICAgIGUucHVzaChnKVxuICAgICAgICB9XG5cbiAgICAgICAgYS5zZXRWYWx1ZShlLmpvaW4oXCJcIikpO1xuICAgIH0sXG5cbiAgICByZW1vdmVXaGl0ZXNwYWNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB2aWV3ID0gdGhpcy5nZXRWaWV3KCk7XG4gICAgICAgIHZhciBhID0gdmlldy5kb3duKCd0ZXh0YXJlYWZpZWxkJyk7XG4gICAgICAgIGZvciAodmFyIGIgPSBhLmdldFZhbHVlKCkucmVwbGFjZSgvXFxuL2csIFwiIFwiKS5yZXBsYWNlKC9cXHIvZywgXCIgXCIpLCBlID0gW10sIGMgPSAhMSwgZCA9IDAsIGYgPSBiLmxlbmd0aDsgZCA8IGY7IGQrKykge1xuICAgICAgICAgICAgdmFyIGkgPSBiLmNoYXJBdChkKTtcbiAgICAgICAgICAgIGlmIChjICYmIGkgPT09IGMpIGIuY2hhckF0KGQgLSAxKSAhPT0gXCJcXFxcXCIgJiYgKGMgPSAhMSk7XG4gICAgICAgICAgICBlbHNlIGlmICghYyAmJiAoaSA9PT0gJ1wiJyB8fCBpID09PSBcIidcIikpIGMgPSBpOyBlbHNlIGlmICghYyAmJiAoaSA9PT0gXCIgXCIgfHwgaSA9PT0gXCJcXHRcIikpIGkgPSBcIlwiO1xuICAgICAgICAgICAgZS5wdXNoKGkpXG4gICAgICAgIH1cbiAgICAgICAgYS5zZXRWYWx1ZShlLmpvaW4oXCJcIikpO1xuICAgIH0sXG5cbiAgICBzcGFjZTogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgdmFyIGIgPSBbXSwgZTtcbiAgICAgICAgZm9yIChlID0gMDsgZSA8IGE7IGUrKykgYi5wdXNoKFwiIFwiKTtcbiAgICAgICAgcmV0dXJuIGIuam9pbihcIlwiKVxuICAgIH0sXG5cbiAgICBqc29uMmxlYWY6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgIHZhciBiID0gW10sIGM7XG4gICAgICAgIGZvciAoYyBpbiBhKSBhLmhhc093blByb3BlcnR5KGMpICYmIChhW2NdID09PSBudWxsID8gYi5wdXNoKHtcbiAgICAgICAgICAgIHRleHQ6IGMgKyBcIiA6IG51bGxcIixcbiAgICAgICAgICAgIGxlYWY6ICEwLFxuICAgICAgICAgICAgaWNvbkNsczogXCJmYXMgZmEtYnVnXCJcbiAgICAgICAgfSkgOiB0eXBlb2YgYVtjXSA9PT0gXCJzdHJpbmdcIiA/IGIucHVzaCh7XG4gICAgICAgICAgICB0ZXh0OiBjICsgJyA6IFwiJyArIGFbY10gKyAnXCInLFxuICAgICAgICAgICAgbGVhZjogITAsXG4gICAgICAgICAgICBpY29uQ2xzOiBcImZhcyBmYS1idWdcIlxuICAgICAgICB9KSA6IHR5cGVvZiBhW2NdID09PSBcIm51bWJlclwiID8gYi5wdXNoKHtcbiAgICAgICAgICAgIHRleHQ6IGMgKyBcIiA6IFwiICsgYVtjXSxcbiAgICAgICAgICAgIGxlYWY6ICEwLFxuICAgICAgICAgICAgaWNvbkNsczogXCJmYXMgZmEtYnVnXCJcbiAgICAgICAgfSkgOiB0eXBlb2YgYVtjXSA9PT0gXCJib29sZWFuXCIgPyBiLnB1c2goe1xuICAgICAgICAgICAgdGV4dDogYyArIFwiIDogXCIgKyAoYVtjXSA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiKSxcbiAgICAgICAgICAgIGxlYWY6ICEwLFxuICAgICAgICAgICAgaWNvbkNsczogXCJmYXMgZmEtYnVnXCJcbiAgICAgICAgfSkgOiB0eXBlb2YgYVtjXSA9PT0gXCJvYmplY3RcIiA/IGIucHVzaCh7XG4gICAgICAgICAgICB0ZXh0OiBjLFxuICAgICAgICAgICAgY2hpbGRyZW46IHRoaXMuanNvbjJsZWFmKGFbY10pLFxuICAgICAgICAgICAgaWNvbjogRXh0LmlzQXJyYXkoYVtjXSkgPyBcImZhcyBmYS1mb2xkZXJcIiA6IFwiZmFzIGZhLWZpbGVcIlxuICAgICAgICB9KSA6IHR5cGVvZiBhW2NdID09PSBcImZ1bmN0aW9uXCIgJiYgYi5wdXNoKHtcbiAgICAgICAgICAgIHRleHQ6IGMgKyBcIiA6IGZ1bmN0aW9uXCIsXG4gICAgICAgICAgICBsZWFmOiAhMCxcbiAgICAgICAgICAgIGljb25DbHM6IFwiZmFzIGZhLWJ1Z1wiXG4gICAgICAgIH0pKTtcbiAgICAgICAgcmV0dXJuIGJcbiAgICB9XG5cbn0pO1xuXG5FeHQuZGVmaW5lKCdkZXZibnouanNvbnZpZXdlci5UcmVlVmlldycsIHtcbiAgICBleHRlbmQ6ICdFeHQudHJlZS5QYW5lbCcsXG4gICAgYWxpYXM6ICd3aWRnZXQuZGV2Ym56SnNvblRyZWVWaWV3JyxcblxuICAgIHJvb3RWaXNpYmxlOiBmYWxzZSxcbiAgICBqc29uVHJlZUNvbmZpZzogdW5kZWZpbmVkLCAvLyBzZXQgYnkgY29uc3RydWN0b3JcblxuICAgIGxpc3RlbmVyczoge1xuXG4gICAgICAgIC8qcmVuZGVyOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgYS5nZXRTZWxlY3Rpb25Nb2RlbCgpLm9uKFwic2VsZWN0aW9uY2hhbmdlXCIsIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgZC5ncmlkYnVpbGQoYilcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sKi9cbiAgICAgICAgY2VsbGNvbnRleHRtZW51OiBmdW5jdGlvbiAodmlldywgdGQsIGNlbGxJbmRleCwgcmVjb3JkLCB0ciwgcm93SW5kZXgsIGUsIGVPcHRzKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB2YXIgYiA9IGU7XG4gICAgICAgICAgICAobmV3IEV4dC5tZW51Lk1lbnUoe1xuICAgICAgICAgICAgICAgIGl0ZW1zOiBbe1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIkV4cGFuZFwiLCBoYW5kbGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhLmV4cGFuZCgpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiRXhwYW5kIGFsbFwiLCBoYW5kbGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhLmV4cGFuZCghMClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIFwiLVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiQ29sbGFwc2VcIiwgaGFuZGxlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYS5jb2xsYXBzZSgpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIkNvbGxhcHNlIGFsbFwiLCBoYW5kbGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYS5jb2xsYXBzZSghMClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH0pKS5zaG93QXQoYi5nZXRYWSgpKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGluaXRDb21wb25lbnQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIganNvblRyZWUgPSBbXG4gICAgICAgICAgICB7dGV4dDogJ2RldGVudGlvbicsIGxlYWY6IHRydWV9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRleHQ6ICdob21ld29yaycsIGV4cGFuZGVkOiB0cnVlLCBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICAgICB7dGV4dDogJ2Jvb2sgcmVwb3J0JywgbGVhZjogdHJ1ZX0sXG4gICAgICAgICAgICAgICAgICAgIHt0ZXh0OiAnYWxnZWJyYScsIGxlYWY6IHRydWV9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHt0ZXh0OiAnYnV5IGxvdHRlcnkgdGlja2V0cycsIGxlYWY6IHRydWV9XG4gICAgICAgIF07XG5cbiAgICAgICAgaWYgKHRoaXMuanNvblRyZWVDb25maWcpIHtcbiAgICAgICAgICAgIGpzb25UcmVlID0gdGhpcy5qc29uVHJlZUNvbmZpZztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RvcmUgPSBFeHQuY3JlYXRlKCdFeHQuZGF0YS5UcmVlU3RvcmUnLCB7XG4gICAgICAgICAgICByb290OiB7XG4gICAgICAgICAgICAgICAgZXhwYW5kZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IGpzb25UcmVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY2FsbFBhcmVudChhcmd1bWVudHMpO1xuICAgIH1cbn0pO1xuRXh0LmRlZmluZSgnZGV2Ym56Lmpzb252aWV3ZXIuSnNvbk1haW4nLCB7XG4gICAgZXh0ZW5kOiAnRXh0LnRhYi5QYW5lbCcsXG4gICAgYWxpYXM6ICd3aWRnZXQuZGV2Ym56SnNvbk1haW4nLFxuXG4gICAgY29udHJvbGxlcjogJ2RldmJuekpzb25NYWluQ29udHJvbGxlcicsXG5cbiAgICBpdGVtczpcbiAgICAgICAgW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHh0eXBlOiAncGFuZWwnLFxuICAgICAgICAgICAgICAgIGxheW91dDoge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaGJveCcsXG4gICAgICAgICAgICAgICAgICAgIGFsaWduOiAnc3RyZXRjaCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnVmlld2VyJyxcbiAgICAgICAgICAgICAgICBpY29uQ2xzOiAnZmFzIGZhLWV5ZScsXG4gICAgICAgICAgICAgICAgaXRlbXM6XG4gICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHt4dHlwZTogJ2RldmJuekpzb25UcmVlVmlldycsIGZsZXg6IDYsIGhlYWRlcjogZmFsc2V9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHh0eXBlOiAnY29udGFpbmVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBodG1sOiAnbW9yZSBzb29uJywgZmxleDogMlxuICAgICAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7eHR5cGU6ICdkZXZibnpKc29uVGV4dEFyZWEnfVxuICAgICAgICBdXG59KTtcbkV4dC5kZWZpbmUoJ2RldmJuei5qc29udmlld2VyLkpzb25NYWluQ29udHJvbGxlcicsIHtcbiAgZXh0ZW5kOiAnRXh0LmFwcC5WaWV3Q29udHJvbGxlcicsXG4gIGFsaWFzOiAnY29udHJvbGxlci5kZXZibnpKc29uTWFpbkNvbnRyb2xsZXInLFxuXG5cbn0pO1xuIiwiRXh0LmRlZmluZSgnbXV6a2F0TWFwLmJhc2VNYXAnLCB7XG4gICAgZXh0ZW5kOiAnRXh0LnBhbmVsLlBhbmVsJyxcbiAgICBhbGlhczogJ3dpZGdldC5tdXprYXRCYXNlTWFwJyxcblxuICAgIHJlZ2lvbjogJ2NlbnRlcicsXG4gICAgbGF5b3V0OiAnZml0JyxcbiAgICB0aXRsZTogJ01hcCdcbn0pO1xuXG5FeHQuZGVmaW5lKCdtdXprYXRNYXAuY29udGV4dG1lbnUuTWFwQ29udGV4dG1lbnUnLCB7XG4gICAgZXh0ZW5kOiAnRXh0Lm1lbnUuTWVudScsXG4gICAgYWxpYXM6ICd3aWRnZXQubXV6a2F0T3NtQ20nLFxuXG4gICAgcGFyZW50Q21wUmVmZXJlbmNlOiB1bmRlZmluZWQsXG4gICAgbWFwRXZlbnRSZWZlcmVuY2U6IHVuZGVmaW5lZCxcblxuICAgIG1hcmdpbjogJzAgMCAxMCAwJyxcbiAgICBwbGFpbjogdHJ1ZSxcbiAgICBpdGVtczogW3tcbiAgICAgICAgaWNvbkNsczogJ3gtZmEgZmEtbWFwLW1hcmtlcicsXG4gICAgICAgIHRleHQ6ICdNYXJrZXIgcGxhdHppZXJlbicsXG4gICAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uIChidG4pIHtcbiAgICAgICAgICAgIHZhciBtdXprYXRPc21DbSA9IGJ0bi51cCgnbXV6a2F0T3NtQ20nKTtcbiAgICAgICAgICAgIHZhciBtZSA9IG11emthdE9zbUNtLnBhcmVudENtcFJlZmVyZW5jZSxcbiAgICAgICAgICAgICAgICBlID0gbXV6a2F0T3NtQ20ubWFwRXZlbnRSZWZlcmVuY2U7XG4gICAgICAgICAgICBtZS5wbGFjZU1hcmtlcih7XG4gICAgICAgICAgICAgICAgaWQ6IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxuICAgICAgICAgICAgICAgIGxhdDogZS5sYXRsbmcubGF0LFxuICAgICAgICAgICAgICAgIGxuZzogZS5sYXRsbmcubG5nLFxuICAgICAgICAgICAgICAgIGRlc2M6ICdkdW1teSdcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGljb25DbHM6ICd4LWZhIGZhLWNpcmNsZS1vJyxcbiAgICAgICAgdGV4dDogJ1Vta3JlaXMgc2V0emVuJyxcbiAgICAgICAgaGFuZGxlcjogZnVuY3Rpb24gKGJ0bikge1xuICAgICAgICAgICAgdmFyIG11emthdE9zbUNtID0gYnRuLnVwKCdtdXprYXRPc21DbScpO1xuICAgICAgICAgICAgdmFyIG1lID0gbXV6a2F0T3NtQ20ucGFyZW50Q21wUmVmZXJlbmNlLFxuICAgICAgICAgICAgICAgIGUgPSBtdXprYXRPc21DbS5tYXBFdmVudFJlZmVyZW5jZTtcbiAgICAgICAgICAgIEwuY2lyY2xlKGUubGF0bG5nLCA1MDAsIHtcbiAgICAgICAgICAgICAgICBjb2xvcjogJ3JlZCcsXG4gICAgICAgICAgICAgICAgZmlsbENvbG9yOiAnI2YwMycsXG4gICAgICAgICAgICAgICAgZmlsbE9wYWNpdHk6IDAuNVxuICAgICAgICAgICAgfSkuYWRkVG8obWUubWFwKS5iaW5kUG9wdXAoXCJVbWtyZWlzXCIpO1xuICAgICAgICB9XG4gICAgfV1cbn0pO1xuXG5cbkV4dC5kZWZpbmUoJ211emthdE1hcC5tYXBEZXRhaWxzJywge1xuICAgIGV4dGVuZDogJ0V4dC5jb250YWluZXIuQ29udGFpbmVyJyxcbiAgICBhbGlhczogJ3dpZGdldC5tdXprYXRNYXBEZXRhaWxzJyxcblxuICAgIGxheW91dDoge1xuICAgICAgICB0eXBlOiAndmJveCcsXG4gICAgICAgIGFsaWduOiAnc3RyZXRjaCdcbiAgICB9LFxuXG4gICAgYWRkTWFya2VyVG9TdG9yZTogZnVuY3Rpb24gKG1hcmtlck9iaikge1xuICAgICAgICB0aGlzLmRvd24oJyNtYXJrZXJHcmlkJykuZ2V0U3RvcmUoKS5hZGQobWFya2VyT2JqKTtcbiAgICB9LFxuXG4gICAgaXRlbXM6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgeHR5cGU6ICdncmlkJyxcbiAgICAgICAgICAgIGl0ZW1JZDogJ21hcmtlckdyaWQnLFxuICAgICAgICAgICAgc3RvcmU6IEV4dC5jcmVhdGUoJ0V4dC5kYXRhLlN0b3JlJywge1xuICAgICAgICAgICAgICAgIGRhdGE6IFtdXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGhpZGVIZWFkZXJzOiB0cnVlLFxuICAgICAgICAgICAgY29sdW1uczogW1xuICAgICAgICAgICAgICAgIHt0ZXh0OiAnVHlwJywgZGF0YUluZGV4OiAndHlwZSd9LFxuICAgICAgICAgICAgICAgIHt0ZXh0OiAnTmFtZScsIGRhdGFJbmRleDogJ2Rlc2MnLCBmbGV4OiAxfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHh0eXBlOiAnYWN0aW9uY29sdW1uJyxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDUwLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb25DbHM6ICd4LWZhIGZhLWV5ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwOiAnRWluL2F1c2JsZW5kZW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcjogZnVuY3Rpb24gKGdyaWQsIHJvd0luZGV4LCBjb2xJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWMgPSBncmlkLmdldFN0b3JlKCkuZ2V0QXQocm93SW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYXAgPSBncmlkLnVwKCdtdXprYXRPc20nKS5nZXRNYXBSZWZlcmVuY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWFya2VyUmVmID0gcmVjLmdldCgncmVmJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhpZGRlbiA9IHJlYy5nZXQoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChFeHQuaXNEZWZpbmVkKGhpZGRlbikgJiYgaGlkZGVuID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtlclJlZi5hZGRUbyhtYXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWMuc2V0KCdoaWRkZW4nLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFya2VyUmVmLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWMuc2V0KCdoaWRkZW4nLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb25DbHM6ICd4LWZhIGZhLXJlbW92ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwOiAnRWludHJhZyBlbnRmZXJuZW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcjogZnVuY3Rpb24gKGdyaWQsIHJvd0luZGV4LCBjb2xJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdG9yZSA9IGdyaWQuZ2V0U3RvcmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVjID0gc3RvcmUuZ2V0QXQocm93SW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYXJrZXJSZWYgPSByZWMuZ2V0KCdyZWYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJrZXJSZWYucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmUucmVtb3ZlKHJlYyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGZsZXg6IDEsXG4gICAgICAgICAgICB0YmFyOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJ01hcmtlciBhbmQgb3RoZXIgT3ZlcmxheXMnLFxuICAgICAgICAgICAgICAgICAgICB4dHlwZTogJ2Rpc3BsYXlmaWVsZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgYmJhcjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWNvbkNsczogJ3gtZmEgZmEtcGx1cycsXG4gICAgICAgICAgICAgICAgICAgIG1lbnU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWluOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25DbHM6ICd4LWZhIGZhLW1hcC1tYXJrZXInLCB0ZXh0OiAnTWFya2VyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uQ2xzOiAneC1mYSBmYS1jaXJjbGUtbycsIHRleHQ6ICdVbWtyZWlzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgaWNvbkNsczogJ3gtZmEgZmEtdHJhc2gnXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICBpY29uQ2xzOiAneC1mYSBmYS1kb3dubG9hZCdcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAnQWN0aW9ucycsXG4gICAgICAgICAgICAgICAgICAgIHh0eXBlOiAnZGlzcGxheWZpZWxkJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIF1cbn0pO1xuRXh0LmRlZmluZSgnbXV6a2F0TWFwLm1hcHMub3NtJywge1xuICAgIGV4dGVuZDogJ211emthdE1hcC5iYXNlTWFwJyxcbiAgICBhbGlhczogJ3dpZGdldC5tdXprYXRPc21NYXAnLFxuXG4gICAgdmlld01vZGVsOiB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGxhc3RMYXRMbmc6ICdub3RoaW5nIGNsaWNrZWQnXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgaGVhZGVyOiBmYWxzZSxcblxuICAgIGJpbmQ6IHtcbiAgICAgICAgdGl0bGU6ICdPcGVuIFN0cmVldCAvIE9wZW4gU2VhIE1hcCAtIExhc3QgY2xpY2s6IHtsYXN0TGF0TG5nfSdcbiAgICB9LFxuXG4gICAgY29vcmRzOiB7XG4gICAgICAgIGJlcmxpbjoge1xuICAgICAgICAgICAgbGF0OiA1Mi41LFxuICAgICAgICAgICAgbG5nOiAxMy40LFxuICAgICAgICAgICAgem9vbTogMTJcbiAgICAgICAgfSxcbiAgICAgICAgdHJvZ2lyOiB7XG4gICAgICAgICAgICBsYXQ6IDQzLjUxNTYxNDg0ODA0MDQ2LFxuICAgICAgICAgICAgbG5nOiAxNi4yNTA0NjM3MjQxMzYzNTYsXG4gICAgICAgICAgICB6b29tOiAxNVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG1hcmtlcnM6IFt7XG4gICAgICAgIGlkOiAnaG90ZWwnLFxuICAgICAgICBkZXNjOiAnQmlmb3JhIEhvdGVsJyxcbiAgICAgICAgbGF0OiA0My41MTM4NixcbiAgICAgICAgbG5nOiAxNi4yNTAzNlxuICAgIH1dLFxuXG4gICAgcG9pbnQ6IHVuZGVmaW5lZCxcblxuICAgIHBsYWNlTWFya2VyczogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICBFeHQuQXJyYXkuZWFjaCh0aGlzLm1hcmtlcnMsIGZ1bmN0aW9uIChtYXJrZXJPYmopIHtcbiAgICAgICAgICAgIG1lLnBsYWNlTWFya2VyKG1hcmtlck9iaik7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBwbGFjZU1hcmtlcjogZnVuY3Rpb24gKG1hcmtlck9iaikge1xuICAgICAgICB2YXIgbWFya2VyID0gTC5tYXJrZXIoW21hcmtlck9iai5sYXQsIG1hcmtlck9iai5sbmddKS5hZGRUbyh0aGlzLm1hcCk7XG4gICAgICAgIG1hcmtlci5iaW5kVG9vbHRpcChtYXJrZXJPYmouZGVzYykub3BlblRvb2x0aXAoKTtcbiAgICAgICAgbWFya2VyT2JqLnR5cGUgPSAnbWFya2VyJztcbiAgICAgICAgbWFya2VyT2JqLnJlZiA9IG1hcmtlcjtcbiAgICAgICAgdGhpcy51cCgnbXV6a2F0T3NtJykuYWRkTWFya2VyKG1hcmtlck9iaik7XG4gICAgfSxcblxuICAgIGRlZmF1bHRDZW50ZXI6ICd0cm9naXInLFxuXG4gICAgbWFwOiB1bmRlZmluZWQsIC8vIG1hcCByZWZlcmVuY2VcblxuICAgIGxpc3RlbmVyczoge1xuICAgICAgICBhZnRlcnJlbmRlcjogZnVuY3Rpb24gKGNtcCkge1xuICAgICAgICAgICAgaWYgKEV4dC5pc0RlZmluZWQoY21wLnBvaW50KSkge1xuICAgICAgICAgICAgICAgIGNtcC5jb29yZHNbY21wLmRlZmF1bHRDZW50ZXJdID0gY21wLnBvaW50O1xuICAgICAgICAgICAgICAgIGNtcC5jb29yZHNbY21wLmRlZmF1bHRDZW50ZXJdWyd6b29tJ10gPSAxMjtcbiAgICAgICAgICAgICAgICBjbXAubWFya2VycyA9IFt7XG4gICAgICAgICAgICAgICAgICAgIGlkOiAndGJkJyxcbiAgICAgICAgICAgICAgICAgICAgZGVzYzogY21wLmRlZmF1bHRDZW50ZXIsXG4gICAgICAgICAgICAgICAgICAgIGxhdDogY21wLnBvaW50LmxhdCxcbiAgICAgICAgICAgICAgICAgICAgbG5nOiBjbXAucG9pbnQubG5nXG4gICAgICAgICAgICAgICAgfV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjbXAuaW5pdE1hcChjbXAuY29vcmRzW2NtcC5kZWZhdWx0Q2VudGVyXSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlc2l6ZTogZnVuY3Rpb24gKGNtcCkge1xuICAgICAgICAgICAgY21wLnJlTGF5b3V0TWFwKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVMYXlvdXRNYXA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKEV4dC5pc0RlZmluZWQodGhpcy5tYXApKSB7XG4gICAgICAgICAgICB0aGlzLm1hcC5pbnZhbGlkYXRlU2l6ZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uTWFwQ2xpY2s6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBtZSA9IHRoaXMsXG4gICAgICAgICAgICB2bSA9IG1lLmdldFZpZXdNb2RlbCgpLFxuICAgICAgICAgICAgbGFzdExhdExuZyA9IGUubGF0bG5nLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgdm0uc2V0KCdsYXN0TGF0TG5nJywgbGFzdExhdExuZyk7XG4gICAgfSxcblxuICAgIG9uTWFwQ29udGV4dG1lbnU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciB4eSA9IFsxMDAsIDEwMF07XG4gICAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQpIHtcbiAgICAgICAgICAgIHh5WzBdID0gZS5vcmlnaW5hbEV2ZW50LmNsaWVudFg7XG4gICAgICAgICAgICB4eVsxXSA9IGUub3JpZ2luYWxFdmVudC5jbGllbnRZO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHBvc2l0aW9uID0geHk7XG4gICAgICAgIHZhciBtID0gRXh0LmNyZWF0ZUJ5QWxpYXMoJ3dpZGdldC5tdXprYXRPc21DbScsIHtcbiAgICAgICAgICAgIHBhcmVudENtcFJlZmVyZW5jZTogdGhpcyxcbiAgICAgICAgICAgIG1hcEV2ZW50UmVmZXJlbmNlOiBlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIG0uc2hvd0F0KHBvc2l0aW9uKTtcbiAgICB9LFxuXG4gICAgYWRkTWFwVG9DbXA6IGZ1bmN0aW9uIChsb2MpIHtcbiAgICAgICAgdmFyIG1lID0gdGhpcztcblxuICAgICAgICB2YXIgdGlsZUxheWVyID0gJ09wZW5TdHJlZXRNYXAuQmxhY2tBbmRXaGl0ZSc7XG4gICAgICAgIHZhciBsYXllciA9IEwudGlsZUxheWVyLnByb3ZpZGVyKHRpbGVMYXllcik7XG5cbiAgICAgICAgbWUubWFwID0gTC5tYXAobWUuYm9keS5kb20uaWQsIHtcbiAgICAgICAgICAgIGNlbnRlcjogW2xvYy5sYXQsIGxvYy5sbmddLFxuICAgICAgICAgICAgem9vbTogbG9jLnpvb20sXG4gICAgICAgICAgICB6b29tQ29udHJvbDogZmFsc2UsXG4gICAgICAgICAgICBwcmVmZXJDYW52YXM6IGZhbHNlLFxuICAgICAgICAgICAgbGF5ZXJzOiBbbGF5ZXJdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIG1lLnRvZ2dsZUxheWVyKCdPcGVuU3RyZWV0TWFwLkJsYWNrQW5kV2hpdGUnKTtcbiAgICAgICAgbWUucmVMYXlvdXRNYXAoKTtcbiAgICAgICAgbWUucGxhY2VNYXJrZXJzKCk7XG4gICAgICAgIG1lLm1hcC5vbignY2xpY2snLCBtZS5vbk1hcENsaWNrLmJpbmQobWUpKTtcbiAgICAgICAgbWUubWFwLm9uKCdjb250ZXh0bWVudScsIG1lLm9uTWFwQ29udGV4dG1lbnUuYmluZChtZSkpO1xuICAgICAgICBtZS5zZXRMb2FkaW5nKGZhbHNlKTtcbiAgICB9LFxuXG4gICAgaW5pdE1hcDogZnVuY3Rpb24gKGxvYykge1xuICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICB0aGlzLnNldExvYWRpbmcoJ01hcCB3aXJkIGdlbGFkZW4uLi4nKTtcbiAgICAgICAgaWYgKCFtdXprYXRNYXAuTW9kdWxlLmZpbGVzTG9hZGVkKSB7XG4gICAgICAgICAgICBtdXprYXRNYXAuTW9kdWxlLmxvYWRBc3NldHMoKS50aGVuKGZ1bmN0aW9uIChzdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgbXV6a2F0TWFwLk1vZHVsZS5maWxlc0xvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgRXh0LmRlZmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgbWUuYWRkTWFwVG9DbXAobG9jKTtcbiAgICAgICAgICAgICAgICB9LCAxNTAwKTtcblxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2VycnJyb3InKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgRXh0LmxvZyh7bXNnOiAnQXNzZXQgbG9hZGluZyBza2lwcGVkLi4uJ30pO1xuICAgICAgICAgICAgbWUuYWRkTWFwVG9DbXAobG9jKTtcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIGFkZFRpbGVMYXllcjogZnVuY3Rpb24gKHRpbGVMYXllcikge1xuICAgICAgICB0aGlzLmFjdGl2ZUxheWVyc1t0aWxlTGF5ZXJdID0gTC50aWxlTGF5ZXIucHJvdmlkZXIodGlsZUxheWVyKS5hZGRUbyh0aGlzLm1hcCk7XG4gICAgfSxcblxuICAgIGFjdGl2ZUxheWVyczoge30sXG5cbiAgICB0b2dnbGVMYXllcjogZnVuY3Rpb24gKHRpbGVMYXllcikge1xuICAgICAgICBpZiAodGlsZUxheWVyIGluIHRoaXMuYWN0aXZlTGF5ZXJzKSB7XG4gICAgICAgICAgICB0aGlzLm1hcC5yZW1vdmVMYXllcih0aGlzLmFjdGl2ZUxheWVyc1t0aWxlTGF5ZXJdKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmFjdGl2ZUxheWVyc1t0aWxlTGF5ZXJdO1xuICAgICAgICAgICAgRXh0LmxvZygnbGF5ZXIgJyArIHRpbGVMYXllciArICcgcmVtb3ZlZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgRXh0LmxvZygnbGF5ZXIgJyArIHRpbGVMYXllciArICcgYWRkZWQnKTtcbiAgICAgICAgICAgIHRoaXMuYWRkVGlsZUxheWVyKHRpbGVMYXllcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY3NzUGF0aHM6IFtdLFxuXG4gICAgZ2V0TWFwSW5mbzogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICAgICAgYXJyYXkucHVzaChcbiAgICAgICAgICAgIHtrZXk6ICdNYXAgQ2VudGVyJywgdmFsdWU6IHRoaXMuZ2V0TWFwQ2VudGVyKCkudG9TdHJpbmcoKX0sXG4gICAgICAgICAgICB7a2V5OiAnTWFwIFpvb20nLCB2YWx1ZTogdGhpcy5tYXAuZ2V0Wm9vbSgpfSxcbiAgICAgICAgICAgIHtrZXk6ICdab29tIE1heCcsIHZhbHVlOiB0aGlzLm1hcC5nZXRNYXhab29tKCl9LFxuICAgICAgICAgICAge2tleTogJ1pvb20gTWluJywgdmFsdWU6IHRoaXMubWFwLmdldE1pblpvb20oKX0sXG4gICAgICAgICAgICB7a2V5OiAnTWFwIEJvdW5kcycsIHZhbHVlOiBKU09OLnN0cmluZ2lmeSh0aGlzLm1hcC5nZXRCb3VuZHMoKSl9KTtcbiAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH0sXG5cbiAgICBnZXRNYXBDZW50ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwLmdldENlbnRlcigpO1xuICAgIH0sXG5cbiAgICBkb2NrZWRJdGVtczogW3tcbiAgICAgICAgeHR5cGU6ICd0b29sYmFyJyxcbiAgICAgICAgZG9jazogJ3RvcCcsXG4gICAgICAgIGl0ZW1zOiBbe1xuICAgICAgICAgICAgaWNvbkNsczogJ3gtZmEgZmEtcGx1cycsXG4gICAgICAgICAgICB0b29sdGlwOiAnWm9vbUluJyxcbiAgICAgICAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uIChidG4pIHtcbiAgICAgICAgICAgICAgICBidG4udXAoJ211emthdE9zbU1hcCcpLm1hcC56b29tSW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgaWNvbkNsczogJ3gtZmEgZmEtbWludXMnLFxuICAgICAgICAgICAgdG9vbHRpcDogJ1pvb21PdXQnLFxuICAgICAgICAgICAgaGFuZGxlcjogZnVuY3Rpb24gKGJ0bikge1xuICAgICAgICAgICAgICAgIGJ0bi51cCgnbXV6a2F0T3NtTWFwJykubWFwLnpvb21PdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6ICdNYXAgQ29udHJvbHMnLFxuICAgICAgICAgICAgeHR5cGU6ICdkaXNwbGF5ZmllbGQnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHh0eXBlOiAndGJmaWxsJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogJ01hcCBTZXR0aW5ncycsXG4gICAgICAgICAgICB4dHlwZTogJ2Rpc3BsYXlmaWVsZCdcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgaWNvbkNsczogJ3gtZmEgZmEtYnVsbHNleWUnLFxuICAgICAgICAgICAgdG9vbHRpcDogJ01hcCB6dXLDvGNrc2V0emVuJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICBpY29uQ2xzOiAneC1mYSBmYS1pbmZvJyxcbiAgICAgICAgICAgIGxpc3RlbmVyczoge1xuICAgICAgICAgICAgICAgICdyZW5kZXInOiBmdW5jdGlvbiAoY21wKSB7XG4gICAgICAgICAgICAgICAgICAgIEV4dC5jcmVhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgeHR5cGU6ICd0b29sdGlwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogY21wLmdldEVsKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZTogdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZWZvcmVzaG93OiBmdW5jdGlvbiAodGlwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmZvQXJyYXkgPSBjbXAudXAoJ211emthdE9zbU1hcCcpLmdldE1hcEluZm8oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGh0bWwgPSAnPHRhYmxlPic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEV4dC5BcnJheS5lYWNoKGluZm9BcnJheSwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gJzx0cj48dGQ+JyArIGl0ZW0ua2V5ICsgJzwvdGQ+JyArICc8dGQ+JyArIGl0ZW0udmFsdWUgKyAnPC90ZD48L3RyPic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBodG1sICs9ICc8dHI+PHRkPiBVaHJ6ZWl0IDwvdGQ+JyArICc8dGQ+JyArIG5ldyBEYXRlKCkudG9UaW1lU3RyaW5nKCkgKyAnPC90ZD48L3RyPic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gJzwvdGFibGU+JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwLnNldEh0bWwoaHRtbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGljb25DbHM6ICd4LWZhIGZhLWNvZycsXG4gICAgICAgICAgICB0b29sdGlwOiAnTWFwIGtvbmZpZ3VyaWVyZW4nXG4gICAgICAgIH1dXG4gICAgfSwge1xuICAgICAgICB4dHlwZTogJ3Rvb2xiYXInLFxuICAgICAgICBkb2NrOiAnYm90dG9tJyxcbiAgICAgICAgaXRlbXM6IFt7XG4gICAgICAgICAgICBpY29uQ2xzOiAneC1mYSBmYS1tYXAtbWFya2VyJyxcbiAgICAgICAgICAgIHRvb2x0aXA6ICdNYXJrZXIgZWluL2F1c2JsZW5kZW4nLFxuICAgICAgICAgICAgaGFuZGxlcjogZnVuY3Rpb24gKGJ0bikge1xuICAgICAgICAgICAgICAgIC8vIGJ0bi51cCgnbXV6a2F0T3NtTWFwJykudG9nZ2xlTGF5ZXIoJ0VzcmkuV29ybGRJbWFnZXJ5Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiAnTWFwIEludGVyYWt0aW9uZW4nLFxuICAgICAgICAgICAgeHR5cGU6ICdkaXNwbGF5ZmllbGQnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHh0eXBlOiAndGJmaWxsJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogJ01hcCBMYXllcicsXG4gICAgICAgICAgICB4dHlwZTogJ2Rpc3BsYXlmaWVsZCdcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgaWNvbkNsczogJ3gtZmEgZmEtbWFwJyxcbiAgICAgICAgICAgIHRvb2x0aXA6ICdCaWxka2FydGUgZWluYmxlbmRlbicsXG4gICAgICAgICAgICBoYW5kbGVyOiBmdW5jdGlvbiAoYnRuKSB7XG4gICAgICAgICAgICAgICAgYnRuLnVwKCdtdXprYXRPc21NYXAnKS50b2dnbGVMYXllcignRXNyaS5Xb3JsZEltYWdlcnknKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgaWNvbkNsczogJ3gtZmEgZmEtc2hpcCcsXG4gICAgICAgICAgICB0b29sdGlwOiAnT3BlbiBTZWEgTWFwIGVpbi9hdXNibGVuZGVuJyxcbiAgICAgICAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uIChidG4pIHtcbiAgICAgICAgICAgICAgICBidG4udXAoJ211emthdE9zbU1hcCcpLnRvZ2dsZUxheWVyKCdPcGVuU2VhTWFwJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1dXG4gICAgfV1cbn0pO1xuXG5FeHQuZGVmaW5lKCdtdXprYXRNYXAuTW9kdWxlJywge1xuICAgIHNpbmdsZXRvbjogdHJ1ZSxcblxuICAgIGxvYWRBc3NldHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9hZE1hcFNjcmlwdHMoKTtcbiAgICB9LFxuXG4gICAgZmlsZXNMb2FkZWQ6IGZhbHNlLFxuXG4gICAgc2NyaXB0UGF0aHM6IFtcbiAgICAgICAgJ2h0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2xlYWZsZXQvMS4zLjEvbGVhZmxldC5jc3MnLFxuICAgICAgICAnaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvbGVhZmxldC8xLjMuMS9sZWFmbGV0LmpzJyxcbiAgICAgICAgJ2h0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2xlYWZsZXQtcHJvdmlkZXJzLzEuMS4xNy9sZWFmbGV0LXByb3ZpZGVycy5qcydcbiAgICBdLFxuXG4gICAgbG9hZE1hcFNjcmlwdHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGxvYWRpbmdBcnJheSA9IFtdLCBtZSA9IHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgRXh0LlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgRXh0LkFycmF5LmVhY2gobWUuc2NyaXB0UGF0aHMsIGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgICAgICAgICBsb2FkaW5nQXJyYXkucHVzaChtZS5sb2FkTWFwU2NyaXB0KHVybCkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIEV4dC5Qcm9taXNlLmFsbChsb2FkaW5nQXJyYXkpLnRoZW4oZnVuY3Rpb24gKHN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2FydGVmYWN0cyB3ZXJlIGxvYWRlZCBzdWNjZXNzZnVsbHknKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgnTG9hZGluZyB3YXMgc3VjY2Vzc2Z1bCcpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCgnRXJyb3IgZHVyaW5nIGFydGVmYWN0IGxvYWRpbmcuLi4nKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGxvYWRNYXBTY3JpcHQ6IGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFeHQuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBFeHQuTG9hZGVyLmxvYWRTY3JpcHQoe1xuICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh1cmwgKyAnIHdhcyBsb2FkZWQgc3VjY2Vzc2Z1bGx5Jyk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9uRXJyb3I6IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoJ0xvYWRpbmcgd2FzIG5vdCBzdWNjZXNzZnVsIGZvcjogJyArIHVybCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufSk7XG5FeHQuZGVmaW5lKCdtdXprYXRNYXAubXV6a2F0TWFwJywge1xuICAgIGV4dGVuZDogJ0V4dC5wYW5lbC5QYW5lbCcsXG4gICAgYWxpYXM6ICd3aWRnZXQubXV6a2F0TWFwJyxcblxuICAgIGxheW91dDogJ2ZpdCcsXG4gICAgdGl0bGU6ICdFeHRKcyBVbml2ZXJzYWwgTWFwIGNvbXBvbmVudCBieSBtdXprYXQnLFxuICAgIGhlYWRlcjogdHJ1ZSxcbiAgICBoaWRlRGV0YWlsczogZmFsc2UsXG4gICAgZGVmYXVsdENlbnRlcjogJ2JlcmxpbicsXG4gICAgcG9pbnQ6IHVuZGVmaW5lZCxcblxuICAgIGluaXRDb21wb25lbnQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB0aGlzLml0ZW1zID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHh0eXBlOiAnbXV6a2F0T3NtJyxcbiAgICAgICAgICAgICAgICBkZWZhdWx0Q2VudGVyOiB0aGlzLmRlZmF1bHRDZW50ZXIsXG4gICAgICAgICAgICAgICAgaGVhZGVyOiB0aGlzLmhlYWRlcixcbiAgICAgICAgICAgICAgICBoaWRlRGV0YWlsczogdGhpcy5oaWRlRGV0YWlscyxcbiAgICAgICAgICAgICAgICBwb2ludDogdGhpcy5wb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICBdO1xuXG4gICAgICAgIHRoaXMuY2FsbFBhcmVudChhcmd1bWVudHMpO1xuICAgIH1cbn0pO1xuXG5FeHQuZGVmaW5lKCdtdXprYXRNYXAubXV6a2F0TWFwV2lkZ2V0Jywge1xuICAgIGV4dGVuZDogJ211emthdE1hcC5tdXprYXRNYXAnLFxuICAgIGFsaWFzOiAnd2lkZ2V0Lm11emthdE1hcFdpZGdldCcsXG5cbiAgICBoZWFkZXI6IHRydWUsXG4gICAgaGlkZURldGFpbHM6IHRydWVcbn0pO1xuXG5FeHQuZGVmaW5lKCdtdXprYXRNYXAubXV6a2F0b3NtJywge1xuICAgIGV4dGVuZDogJ0V4dC5wYW5lbC5QYW5lbCcsXG4gICAgYWxpYXM6ICd3aWRnZXQubXV6a2F0T3NtJyxcblxuICAgIGxheW91dDoge1xuICAgICAgICB0eXBlOiAnaGJveCcsXG4gICAgICAgIGFsaWduOiAnc3RyZXRjaCdcbiAgICB9LFxuICAgIHRpdGxlOiAnTXV6a2F0IE9wZW4gU3RyZWV0IE1hcCcsXG5cbiAgICBoaWRlRGV0YWlsczogdW5kZWZpbmVkLCAvLyBzZXQgYnkgY29uc3RydWN0b3IgLSBkZWZhdWx0OiBmYWxzZVxuICAgIGRlZmF1bHRDZW50ZXI6IHVuZGVmaW5lZCxcbiAgICBwb2ludDogdW5kZWZpbmVkLFxuXG4gICAgaW5pdENvbXBvbmVudDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLml0ZW1zID1cbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICB7eHR5cGU6ICdtdXprYXRNYXBEZXRhaWxzJywgZmxleDogMSwgaGlkZGVuOiB0aGlzLmhpZGVEZXRhaWxzfSxcbiAgICAgICAgICAgICAgICB7eHR5cGU6ICdtdXprYXRPc21NYXAnLCBmbGV4OiA1LCBkZWZhdWx0Q2VudGVyOiB0aGlzLmRlZmF1bHRDZW50ZXIsIHBvaW50OiB0aGlzLnBvaW50fVxuICAgICAgICAgICAgXTtcbiAgICAgICAgdGhpcy5jYWxsUGFyZW50KGFyZ3VtZW50cyk7XG4gICAgfSxcblxuICAgIGFkZE1hcmtlcjogZnVuY3Rpb24gKG1hcmtlck9iaikge1xuICAgICAgICB0aGlzLmRvd24oJ211emthdE1hcERldGFpbHMnKS5hZGRNYXJrZXJUb1N0b3JlKG1hcmtlck9iaik7XG4gICAgfSxcblxuICAgIGdldE1hcFJlZmVyZW5jZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kb3duKCdtdXprYXRPc21NYXAnKS5tYXA7XG4gICAgfVxufSk7XG4iLCJFeHQuZGVmaW5lKCdNemsuTnJnLkhlbHBlcicsIHtcbiAgICBzaW5nbGV0b246IHRydWUsXG4gICAgZGF0YVN0b3JlVXJsOiAnJywgLy8gL2dhcy9tYXJrZXRwYXJ0bmVyXG4gICAgdG9vbHRpcFJlbmRlcmVyOiBmdW5jdGlvbiAodmFsdWUsIG1ldGFEYXRhLCByZWNvcmQsIHJvd0luZGV4LCBjb2xJbmRleCkge1xuICAgICAgICBpZiAoRXh0LmlzRGVmaW5lZChyZWNvcmQpKSB7XG4gICAgICAgICAgICB2YXIgcmVjb3JkRGF0YSA9IHJlY29yZC5nZXREYXRhKCk7XG4gICAgICAgICAgICBpZiAocmVjb3JkRGF0YVsnX3NvdXJjZSddICYmIHJlY29yZERhdGFbJ19zb3VyY2UnXVsnY29udGFjdCddKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRhY3REYXRhID0gcmVjb3JkRGF0YVsnX3NvdXJjZSddWydjb250YWN0J107XG4gICAgICAgICAgICAgICAgaWYgKGNvbnRhY3REYXRhLmFuc3ByZWNocGFydG5lcikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdG9vbHRpcCA9ICc8dGFibGU+JztcbiAgICAgICAgICAgICAgICAgICAgRXh0Lml0ZXJhdGUoY29udGFjdERhdGEuYW5zcHJlY2hwYXJ0bmVyLCBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvb2x0aXAgKz0gJzx0cj48L3RyPjx0ZD4nICsga2V5ICsgJzwvdGQ+PHRkPicgKyB2YWwgKyAnPC90ZD48L3RyPic7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB0b29sdGlwICs9ICc8L3RhYmxlPic7XG4gICAgICAgICAgICAgICAgICAgIG1ldGFEYXRhLnRkQXR0ciA9ICdkYXRhLXF0aXA9JyArIEV4dC5lbmNvZGUodG9vbHRpcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG59KTtcblxuRXh0LmRlZmluZSgnTXprLk5yZy5HcmlkJywge1xuICAgIGV4dGVuZDogJ0V4dC5ncmlkLlBhbmVsJyxcbiAgICBhbGlhczogJ3dpZGdldC5hY2NvdW50R3JpZCcsXG4gICAgaWNvbkNsczogJ3gtZmEgZmEtZ3JvdXAnLFxuICAgIGNvbnRyb2xsZXI6ICdhY2NvdW50R3JpZENvbnRyb2xsZXInLFxuICAgIGxpc3RlbmVyczoge1xuICAgICAgICBzZWxlY3Q6ICdvblNlbGVjdCdcbiAgICB9LFxuICAgIGJpbmQ6IHtcbiAgICAgICAgdGl0bGU6ICdEVkdXIE1hcmt0cGFydG5lciAtIHtzdG9yZVJlY29yZENvdW50fSdcbiAgICB9LFxuICAgIGhpZGVIZWFkZXJzOiB0cnVlLFxuICAgIHRiYXI6IFt7XG4gICAgICAgIHh0eXBlOiAnY29udGFpbmVyJyxcbiAgICAgICAgbGF5b3V0OiB7XG4gICAgICAgICAgICB0eXBlOiAndmJveCcsXG4gICAgICAgICAgICBhbGlnbjogJ3N0cmV0Y2gnXG4gICAgICAgIH0sXG4gICAgICAgIGZsZXg6IDEsXG4gICAgICAgIHBhZGRpbmc6ICcxNSAyMCAxNSAyMCcsXG4gICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgeHR5cGU6ICd0ZXh0ZmllbGQnLFxuICAgICAgICAgICAgICAgIGZsZXg6IDEsXG4gICAgICAgICAgICAgICAgZW1wdHlUZXh0OiAnTWFya3RwYXJ0bmVyc3VjaGUnLFxuICAgICAgICAgICAgICAgIGxpc3RlbmVyczoge1xuICAgICAgICAgICAgICAgICAgICAnY2hhbmdlJzogZnVuY3Rpb24gKGNtcCwgbmV3VmFsLCBvbGRWYWwsIGVPcHRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RvcmUgPSBjbXAudXAoJ2FjY291bnRHcmlkJykuZ2V0U3RvcmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlLmdldFByb3h5KCkuc2V0RXh0cmFQYXJhbSgncScsIG5ld1ZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yZS5sb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XVxuICAgIH1dLFxuICAgIGNvbHVtbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ0NvZGUnLFxuICAgICAgICAgICAgZGF0YUluZGV4OiAnY29kZScsXG4gICAgICAgICAgICBmbGV4OiAyLFxuICAgICAgICAgICAgcmVuZGVyZXI6IE16ay5OcmcuSGVscGVyLnRvb2x0aXBSZW5kZXJlclxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnVHlwJyxcbiAgICAgICAgICAgIGZsZXg6IDEsXG4gICAgICAgICAgICBkYXRhSW5kZXg6ICd0eXBlJyxcbiAgICAgICAgICAgIHJlbmRlcmVyOiBNemsuTnJnLkhlbHBlci50b29sdGlwUmVuZGVyZXJcblxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnRnVua3Rpb24nLFxuICAgICAgICAgICAgZmxleDogMSxcbiAgICAgICAgICAgIGRhdGFJbmRleDogJ2Z1bmN0aW9uJyxcbiAgICAgICAgICAgIHJlbmRlcmVyOiBNemsuTnJnLkhlbHBlci50b29sdGlwUmVuZGVyZXJcblxuICAgICAgICB9LCB7XG4gICAgICAgICAgICB0ZXh0OiAnU3RhdHVzJyxcbiAgICAgICAgICAgIGZsZXg6IDEsXG4gICAgICAgICAgICBkYXRhSW5kZXg6ICdzdGF0dXMnLFxuICAgICAgICAgICAgcmVuZGVyZXI6IE16ay5OcmcuSGVscGVyLnRvb2x0aXBSZW5kZXJlclxuXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdGaXJtYScsXG4gICAgICAgICAgICBmbGV4OiAxLFxuICAgICAgICAgICAgZGF0YUluZGV4OiAnY29tcGFueScsXG4gICAgICAgICAgICByZW5kZXJlcjogTXprLk5yZy5IZWxwZXIudG9vbHRpcFJlbmRlcmVyXG5cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ09ydCcsXG4gICAgICAgICAgICBmbGV4OiAxLFxuICAgICAgICAgICAgZGF0YUluZGV4OiAnY2l0eScsXG4gICAgICAgICAgICByZW5kZXJlcjogTXprLk5yZy5IZWxwZXIudG9vbHRpcFJlbmRlcmVyXG5cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgeHR5cGU6ICdhY3Rpb25jb2x1bW4nLFxuICAgICAgICAgICAgd2lkdGg6IDUwLFxuICAgICAgICAgICAgaXRlbXM6IFt7XG4gICAgICAgICAgICAgICAgaWNvbkNsczogJ3gtZmEgZmEtbWFwJyxcbiAgICAgICAgICAgICAgICB0b29sdGlwOiAnRmlybWVuc3RhbmRvcnQgYXVmIEthcnRlIGFuemVpZ2VuJyxcbiAgICAgICAgICAgICAgICBoYW5kbGVyOiBmdW5jdGlvbiAoZ3JpZCwgcm93SW5kZXgsIGNvbEluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZWNvcmQgPSBncmlkLmdldFN0b3JlKCkuZ2V0QXQocm93SW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoRXh0LmlzRGVmaW5lZChyZWNvcmQpICYmIHJlY29yZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlY29yZERhdGEgPSByZWNvcmQuZ2V0RGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlY29yZERhdGFbJ19zb3VyY2UnXSAmJiByZWNvcmREYXRhWydfc291cmNlJ11bJ2dlbyddKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdlbyA9IHJlY29yZERhdGFbJ19zb3VyY2UnXVsnZ2VvJ107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdlbyAmJiBnZW8uc3RhdHVzICYmIGdlby5zdGF0dXMgPT09ICdPSycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxvYyA9IGdlb1sncmVzdWx0cyddWzBdWydnZW9tZXRyeSddWydsb2NhdGlvbiddO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9jLmxhdCAmJiBsb2MubG5nICYmIEV4dC5pc0RlZmluZWQobG9jLmxhdCkgJiYgRXh0LmlzRGVmaW5lZChsb2MubG5nKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFeHQuY3JlYXRlKCdFeHQud2luZG93LldpbmRvdycsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdEVkdXIE1hcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQgKiAwLjgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodCAqIDAuOCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0OiAnZml0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHh0eXBlOiAnbXV6a2F0QnBjV3JhcHBlck1haW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXQ6IGxvYy5sYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG5nOiBsb2MubG5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdENlbnRlcjogcmVjb3JkLmdldCgnY29kZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRXh0LmxvZygnRXJyb3IuLi4uIGxvb2tzIGxpa2UgdGhlIGNsYXNzIHdhcyBub3QgZm91bmQuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaXNEaXNhYmxlZDogZnVuY3Rpb24gKHZpZXcsIHJvd0luZGV4LCBjb2xJbmRleCwgaXRlbSwgcmVjb3JkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChFeHQuaXNEZWZpbmVkKHJlY29yZCkgJiYgcmVjb3JkICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVjb3JkRGF0YSA9IHJlY29yZC5nZXREYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVjb3JkRGF0YVsnX3NvdXJjZSddICYmIHJlY29yZERhdGFbJ19zb3VyY2UnXVsnZ2VvJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZ2VvID0gcmVjb3JkRGF0YVsnX3NvdXJjZSddWydnZW8nXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2VvICYmIGdlby5zdGF0dXMgJiYgZ2VvLnN0YXR1cyA9PT0gJ09LJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbG9jID0gZ2VvWydyZXN1bHRzJ11bMF1bJ2dlb21ldHJ5J11bJ2xvY2F0aW9uJ107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb2MubGF0ICYmIGxvYy5sbmcgJiYgRXh0LmlzRGVmaW5lZChsb2MubGF0KSAmJiBFeHQuaXNEZWZpbmVkKGxvYy5sbmcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRpc2FibGVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1dXG4gICAgICAgIH1dLFxuICAgIGluaXRDb21wb25lbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zdG9yZSA9IEV4dC5jcmVhdGUoJ0V4dC5kYXRhLkJ1ZmZlcmVkU3RvcmUnLCB7XG4gICAgICAgICAgICBwcm94eToge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdhamF4JyxcbiAgICAgICAgICAgICAgICB1cmw6IE16ay5OcmcuSGVscGVyLmRhdGFTdG9yZVVybCxcbiAgICAgICAgICAgICAgICB1c2VEZWZhdWx0SGVhZGVyOiBmYWxzZSxcbiAgICAgICAgICAgICAgICByZWFkZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHk6ICdoaXRzLmhpdHMnLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbFByb3BlcnR5OiAnaGl0cy50b3RhbCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFnZVNpemU6IDEwMCxcbiAgICAgICAgICAgIGF1dG9Mb2FkOiB0cnVlLFxuICAgICAgICAgICAgbW9kZWw6ICdNemsuTnJnLkdyaWRMaW5lJ1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jYWxsUGFyZW50KGFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuc3RvcmUub24oJ2xvYWQnLCBmdW5jdGlvbiAoc3RvcmUpIHtcbiAgICAgICAgICAgIHRoaXMudXAoJyNpc3N1ZVdyYXBwZXInKS5nZXRWaWV3TW9kZWwoKS5zZXQoJ3N0b3JlUmVjb3JkQ291bnQnLCBzdG9yZS5nZXRUb3RhbENvdW50KCkpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH1cbn0pO1xuRXh0LmRlZmluZSgnTXprLk5yZy5HcmlkQ29udHJvbGxlcicsIHtcbiAgICBleHRlbmQ6ICdFeHQuYXBwLlZpZXdDb250cm9sbGVyJyxcbiAgICBhbGlhczogJ2NvbnRyb2xsZXIuYWNjb3VudEdyaWRDb250cm9sbGVyJyxcblxuICAgIG9uU2VsZWN0OiBmdW5jdGlvbiAocm93TW9kZWwsIHJlY29yZCwgaW5kZXgsIGVPcHRzKSB7XG4gICAgICAgIGlmIChyb3dNb2RlbC52aWV3KSB7XG4gICAgICAgICAgICB2YXIgdmlldyA9IHJvd01vZGVsLnZpZXc7XG4gICAgICAgICAgICB2aWV3LnVwKCcjaXNzdWVXcmFwcGVyJykudXBkYXRlSXNzdWUocmVjb3JkKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5FeHQuZGVmaW5lKCdNemsuTnJnLk1haW4nLCB7XG4gICAgZXh0ZW5kOiAnRXh0LmNvbnRhaW5lci5Db250YWluZXInLFxuICAgIGFsaWFzOiAnd2lkZ2V0Lm11emthdE5yZ01haW4nLFxuICAgIGxheW91dDogJ2ZpdCcsXG4gICAgaXRlbXM6IFt7XG4gICAgICAgIHh0eXBlOiAnY29udGFpbmVyJyxcbiAgICAgICAgaXRlbUlkOiAnaXNzdWVXcmFwcGVyJyxcbiAgICAgICAgdmlld01vZGVsOiB7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgc3RvcmVSZWNvcmRDb3VudDogMCxcbiAgICAgICAgICAgICAgICBhY3RpdmVJdGVtOiBudWxsLFxuICAgICAgICAgICAgICAgIHJlY29yZEFjdGl2ZTogbnVsbCxcbiAgICAgICAgICAgICAgICBhY3RpdmVDb250YWN0OiB7XG4gICAgICAgICAgICAgICAgICAgIGFuc3ByZWNocGFydG5lcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5yZWRlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBmYXg6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYWNobmFtZTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbGVmb246IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICB2b3JuYW1lOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNvZGVudW1tZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJpczogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGVudW1tZXI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RldHlwOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdm9uOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFya3RmdW5rdGlvbjogbnVsbFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBmaXJtZW5hbnNjaHJpZnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ydDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsejogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVudGVybmVobWVuOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZm9ybXVsYXM6IHt9XG4gICAgICAgIH0sXG4gICAgICAgIGxheW91dDoge1xuICAgICAgICAgICAgdHlwZTogJ2hib3gnLFxuICAgICAgICAgICAgYWxpZ246ICdzdHJldGNoJ1xuICAgICAgICB9LFxuICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHh0eXBlOiAnYWNjb3VudEdyaWQnLFxuICAgICAgICAgICAgICAgIGZsZXg6IDRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgeHR5cGU6ICdjb250YWluZXInLFxuICAgICAgICAgICAgICAgIGZsZXg6IDMsXG4gICAgICAgICAgICAgICAgbGF5b3V0OiAnZml0JyxcbiAgICAgICAgICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMTAgMTAgMTAgMTAnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMjUgMjUgMjUgMjUnLFxuICAgICAgICAgICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHh0eXBlOiAncGFuZWwnLCBsYXlvdXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndmJveCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ246ICdzdHJldGNoJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZmxleDogNCwgaGVhZGVyOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRiYXI6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkNsczogJ3gtZmEgZmEtcGhvbmUnLCB0b29sdGlwOiAnQW5ydWZlbicsIHNjYWxlOiAnbWVkaXVtJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25DbHM6ICd4LWZhIGZhLWZheCcsIHRvb2x0aXA6ICdGYXggYW4gUGFydG5lciB2ZXJzZW5kZW4nLCBzY2FsZTogJ21lZGl1bSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uQ2xzOiAneC1mYSBmYS1lbnZlbG9wZS1vJywgdG9vbHRpcDogJ01haWwgYW4gUGFydG5lciB2ZXJzY2hpY2tlbicsIHNjYWxlOiAnbWVkaXVtJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25DbHM6ICd4LWZhIGZhLWRlc2t0b3AnLCB0b29sdGlwOiAnV2Vic2VpdGUgYXVmcnVmZW4nLCBzY2FsZTogJ21lZGl1bSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4dHlwZTogJ3RiZmlsbCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uQ2xzOiAneC1mYSBmYS1ib29rbWFyaycsIHRvb2x0aXA6ICdBbHMgRmF2b3JpdCBhYmxlZ2VuJywgc2NhbGU6ICdtZWRpdW0nXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkNsczogJ3gtZmEgZmEtY2FtZXJhJywgdG9vbHRpcDogJ1NjcmVlbnNob3QgZXJzdGVsbGVuJywgc2NhbGU6ICdtZWRpdW0nXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkNsczogJ3gtZmEgZmEtcHJpbnQnLCB0b29sdGlwOiAnS29udGFrdGluZm9ybWF0aW9uZW4gYXVzZHJ1Y2tlbicsIHNjYWxlOiAnbWVkaXVtJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsZXg6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzMgMyAzIDMnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBpdGVtczogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4dHlwZTogJ2ZpZWxkc2V0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQW5zcHJlY2hwYXJ0bmVyIC0ge2FjdGl2ZUNvbnRhY3QuZmlybWVuYW5zY2hyaWZ0LnVudGVybmVobWVufSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRUeXBlOiAndGV4dGZpZWxkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0czoge2FuY2hvcjogJzEwMCUnLCBwYWRkaW5nOiAnMCAwIDAgMCd9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxheW91dDogJ2FuY2hvcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkTGFiZWw6ICdOYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICd7YWN0aXZlQ29udGFjdC5hbnNwcmVjaHBhcnRuZXIudm9ybmFtZX0ge2FjdGl2ZUNvbnRhY3QuYW5zcHJlY2hwYXJ0bmVyLm5hY2huYW1lfSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRMYWJlbDogJ0UtTWFpbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiAne2FjdGl2ZUNvbnRhY3QuYW5zcHJlY2hwYXJ0bmVyLmVtYWlsfSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRMYWJlbDogJ1RlbGVmb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJ3thY3RpdmVDb250YWN0LmFuc3ByZWNocGFydG5lci50ZWxlZm9ufSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRMYWJlbDogJ0ZheCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiAne2FjdGl2ZUNvbnRhY3QuYW5zcHJlY2hwYXJ0bmVyLmZheH0nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHh0eXBlOiAnZmllbGRzZXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdDb2RlIEluZm9ybWF0aW9uZW4gLSB7YWN0aXZlQ29udGFjdC5jb2RlbnVtbWVyLmNvZGVudW1tZXJ9IC0ge2FjdGl2ZUNvbnRhY3QuY29kZW51bW1lci5tYXJrdGZ1bmt0aW9ufSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRUeXBlOiAndGV4dGZpZWxkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0czoge2FuY2hvcjogJzEwMCUnLCBwYWRkaW5nOiAnMCAwIDAgMCd9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxheW91dDogJ2FuY2hvcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkTGFiZWw6ICdDb2RlVHlwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICd7YWN0aXZlQ29udGFjdC5jb2RlbnVtbWVyLmNvZGV0eXB9J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZExhYmVsOiAnQ29kZU51bW1lcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiAne2FjdGl2ZUNvbnRhY3QuY29kZW51bW1lci5jb2RlbnVtbWVyfSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRMYWJlbDogJ1ZvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiAne2FjdGl2ZUNvbnRhY3QuY29kZW51bW1lci52b259J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZExhYmVsOiAnQmlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICd7YWN0aXZlQ29udGFjdC5jb2RlbnVtbWVyLmJpc30nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeHR5cGU6ICdmaWVsZHNldCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdGaXJtZW5kZXRhaWxzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsYXBzaWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VHlwZTogJ3RleHRmaWVsZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdHM6IHthbmNob3I6ICcxMDAlJywgcGFkZGluZzogJzAgMCAwIDAnfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXlvdXQ6ICdhbmNob3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZExhYmVsOiAnT3J0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICd7YWN0aXZlQ29udGFjdC5maXJtZW5hbnNjaHJpZnQucGx6fSB7YWN0aXZlQ29udGFjdC5maXJtZW5hbnNjaHJpZnQub3J0fSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRMYWJlbDogJ1VudGVybmVobWVuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICd7YWN0aXZlQ29udGFjdC5maXJtZW5hbnNjaHJpZnQudW50ZXJuZWhtZW59J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZExhYmVsOiAnV2ViJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICd7YWN0aXZlQ29udGFjdC5maXJtZW5hbnNjaHJpZnQudXJsfSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgdXBkYXRlSXNzdWU6IGZ1bmN0aW9uIChyZWNvcmQpIHtcbiAgICAgICAgICAgIGlmIChFeHQuaXNEZWZpbmVkKHJlY29yZCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVjb3JkRGF0YSA9IHJlY29yZC5nZXREYXRhKCk7XG4gICAgICAgICAgICAgICAgaWYgKHJlY29yZERhdGFbJ19zb3VyY2UnXSAmJiByZWNvcmREYXRhWydfc291cmNlJ11bJ2NvbnRhY3QnXSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29udGFjdERhdGEgPSByZWNvcmREYXRhWydfc291cmNlJ11bJ2NvbnRhY3QnXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRhY3REYXRhWydjb2RlLW51bW1lcm4tdmVyZ2FiZSddKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250YWN0RGF0YS5jb2RlbnVtbWVyID0gY29udGFjdERhdGFbJ2NvZGUtbnVtbWVybi12ZXJnYWJlJ107XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgY29udGFjdERhdGFbJ2NvZGUtbnVtbWVybi12ZXJnYWJlJ107XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGFjdERhdGEuY29kZW51bW1lclsnY29kZSB0eXAnXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhY3REYXRhLmNvZGVudW1tZXIuY29kZXR5cCA9IGNvbnRhY3REYXRhLmNvZGVudW1tZXJbJ2NvZGUgdHlwJ107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNvbnRhY3REYXRhLmNvZGVudW1tZXJbJ2NvZGUgdHlwJ107XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICBFeHQuaXRlcmF0ZShjb250YWN0RGF0YSwgZnVuY3Rpb24gKGtleSwgb2JqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBFeHQuaXRlcmF0ZShvYmosIGZ1bmN0aW9uIChzdWJrZXksIHZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lLmdldFZpZXdNb2RlbCgpLnNldCgnYWN0aXZlQ29udGFjdC4nICsga2V5ICsgJy4nICsgc3Via2V5LCB2YWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBFeHQubG9nKHtkdW1wOiBjb250YWN0RGF0YSwgbXNnOiAnZGF0YS4uJ30pO1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmdldFZpZXdNb2RlbCgpLnNldCgnYWN0aXZlQ29udGFjdCcsIGNvbnRhY3REYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRWaWV3TW9kZWwoKS5zZXQoJ2FjdGl2ZUl0ZW0nLCBKU09OLnN0cmluZ2lmeShyZWNvcmREYXRhKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRWaWV3TW9kZWwoKS5zZXQoJ3JlY29yZEFjdGl2ZScsIHJlY29yZCk7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICB9XG4gICAgfV1cbn0pO1xuRXh0LmRlZmluZSgnTXprLk5yZy5HcmlkTGluZScsIHtcbiAgICBleHRlbmQ6ICdFeHQuZGF0YS5Nb2RlbCcsXG4gICAgZmllbGRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdpZCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2NvZGUnLFxuICAgICAgICAgICAgbWFwcGluZzogJ19zb3VyY2UuQ29kZSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2NvZGVlbnVtJyxcbiAgICAgICAgICAgIG1hcHBpbmc6ICdfc291cmNlLkNvZGVUeXBlRW51bSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ3R5cGUnLFxuICAgICAgICAgICAgbWFwcGluZzogJ19zb3VyY2UuQ29kZVR5cGUnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdmdW5jdGlvbicsXG4gICAgICAgICAgICBtYXBwaW5nOiAnX3NvdXJjZS5NYXJrZXRGdW5jdGlvbidcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ3N0YXR1cycsXG4gICAgICAgICAgICBtYXBwaW5nOiAnX3NvdXJjZS5Mb2NhbGl6ZWRTdGF0dXMnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdjaXR5JyxcbiAgICAgICAgICAgIG1hcHBpbmc6ICdfc291cmNlLmNpdHknXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdjb21wYW55JyxcbiAgICAgICAgICAgIG1hcHBpbmc6ICdfc291cmNlLmNvbXBhbnlOYW1lJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnemlwJyxcbiAgICAgICAgICAgIG1hcHBpbmc6ICdfc291cmNlLnppcENvZGUnXG4gICAgICAgIH1dXG59KTsiLCJFeHQuZGVmaW5lKCdtdXprYXQucGkuY2FtZXJhLkFwaScsIHtcbiAgICBzaW5nbGV0b246IHRydWUsXG5cbiAgICBnZXRQcm9taXNlOiBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgIHJldHVybiBuZXcgRXh0LlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgRXh0LkFqYXgucmVxdWVzdCh7XG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoRXh0LmRlY29kZShyZXNwb25zZS5yZXNwb25zZVRleHQsIHRydWUpKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgZmFpbHVyZTogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChyZXNwb25zZS5zdGF0dXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgdGFrZVBob3RvOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBtdXprYXQucGkuY2FtZXJhLkFwaS5nZXRQcm9taXNlKCcvcGhvdG9zL3Rha2UnKTtcbiAgICB9LFxuXG4gICAgZ2V0UGhvdG9zOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBtdXprYXQucGkuY2FtZXJhLkFwaS5nZXRQcm9taXNlKCcvcGhvdG9zJyk7XG4gICAgfVxufSk7XG5FeHQuZGVmaW5lKCdtdXprYXQucGkuY2FtZXJhLk1haW4nLCB7XG4gICAgZXh0ZW5kOiAnRXh0LmNvbnRhaW5lci5Db250YWluZXInLFxuICAgIGFsaWFzOiAnd2lkZ2V0Lm16a1BpQ2FtZXJhTWFpbicsXG5cbiAgICB0aXRsZTogJ011emthdCBQaSBDYW1lcmEnLFxuXG4gICAgbGF5b3V0OiAnY2VudGVyJyxcblxuICAgIGl0ZW1zOiBbe1xuICAgICAgICB4dHlwZTogJ3BhbmVsJyxcblxuICAgICAgICB3aWR0aDogJzgwJScsXG4gICAgICAgIGhlaWdodDogJzgwJScsXG4gICAgICAgIGxheW91dDogJ2ZpdCcsXG5cbiAgICAgICAgaXRlbXM6IFt7XG4gICAgICAgICAgICB4dHlwZTogJ3BhbmVsJyxcbiAgICAgICAgICAgIGl0ZW1JZDogJ3ByZXZpZXcnLFxuICAgICAgICAgICAgbGF5b3V0OiAnZml0JyxcbiAgICAgICAgICAgIGl0ZW1zOiBbe1xuICAgICAgICAgICAgICAgIHh0eXBlOiAnY29udGFpbmVyJyxcbiAgICAgICAgICAgICAgICBkZWZhdWx0SHRtbEhlYWRsaW5lOiAnPGgzPk11emthdCBQaSBDYW1lcmE8L2gzPicsXG4gICAgICAgICAgICAgICAgaHRtbDogJzxoMz5NdXprYXQgUGkgQ2FtZXJhPC9oMz4nLFxuICAgICAgICAgICAgICAgIHVwZGF0ZUh0bWxDb250ZW50OiBmdW5jdGlvbiAoaHRtbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEh0bWwodGhpcy5kZWZhdWx0SHRtbEhlYWRsaW5lICsgaHRtbCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGVJbWFnZTogZnVuY3Rpb24gKGltYWdlVXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBodG1sID0gJzxpbWcgc3JjPVwiL3NlcnZlLycgKyBpbWFnZVVybCArICdcIiBoZWlnaHQ9XCI0ODBcIiB3aWR0aD1cIjY0MFwiPic7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSHRtbENvbnRlbnQoaHRtbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICBkb2NrZWRJdGVtczogW3tcbiAgICAgICAgICAgICAgICB4dHlwZTogJ3Rvb2xiYXInLFxuICAgICAgICAgICAgICAgIGRvY2s6ICdib3R0b20nLFxuICAgICAgICAgICAgICAgIG92ZXJmbG93SGFuZGxlcjogJ3Njcm9sbGVyJyxcbiAgICAgICAgICAgICAgICBpdGVtczogW11cbiAgICAgICAgICAgIH1dXG4gICAgICAgIH1dLFxuXG4gICAgICAgIGJiYXI6IFt7XG4gICAgICAgICAgICB0ZXh0OiAnVGFrZSBQaWN0dXJlJyxcbiAgICAgICAgICAgIHNjYWxlOiAnbWVkaXVtJyxcbiAgICAgICAgICAgIGljb25DbHM6ICd4LWZhIGZhLXBob3RvJyxcbiAgICAgICAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uIChidG4pIHtcbiAgICAgICAgICAgICAgICB2YXIgbWFpblZpZXcgPSBidG4udXAoJ216a1BpQ2FtZXJhTWFpbicpO1xuICAgICAgICAgICAgICAgIG11emthdC5waS5jYW1lcmEuQXBpLnRha2VQaG90bygpLnRoZW4oZnVuY3Rpb24gKHN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgbWFpblZpZXcucmVmcmVzaEd1aSgpO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBFeHQudG9hc3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICB0ZXh0OiAnR2FsbGVyeScsXG4gICAgICAgICAgICBzY2FsZTogJ21lZGl1bScsXG4gICAgICAgICAgICBpY29uQ2xzOiAneC1mYSBmYS1maWxlLWltYWdlLW8nXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHh0eXBlOiAndGJmaWxsJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB0ZXh0OiAnQVBJJyxcbiAgICAgICAgICAgIHNjYWxlOiAnbWVkaXVtJyxcbiAgICAgICAgICAgIGljb25DbHM6ICd4LWZhIGZhLWZpbGUtaW1hZ2UtbydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdGV4dDogJ0Fib3V0JyxcbiAgICAgICAgICAgIHNjYWxlOiAnbWVkaXVtJyxcbiAgICAgICAgICAgIGljb25DbHM6ICd4LWZhIGZhLWZpbGUtaW1hZ2UtbydcbiAgICAgICAgfV1cbiAgICB9XSxcblxuICAgIGluaXRDb21wb25lbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jYWxsUGFyZW50KGFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMucmVmcmVzaEd1aSgpO1xuICAgIH0sXG5cbiAgICByZWZyZXNoR3VpOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIG11emthdC5waS5jYW1lcmEuQXBpLmdldFBob3RvcygpLnRoZW4oZnVuY3Rpb24gKGFycmF5KSB7XG4gICAgICAgICAgICB2YXIgcHJldmlldyA9IG1lLmRvd24oJyNwcmV2aWV3Jyk7XG4gICAgICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGFycmF5ID0gYXJyYXkucmV2ZXJzZSgpO1xuICAgICAgICAgICAgICAgIHZhciBpbWdDb250YWluZXIgPSBwcmV2aWV3LmRvd24oJ2NvbnRhaW5lcicpO1xuICAgICAgICAgICAgICAgIGltZ0NvbnRhaW5lci51cGRhdGVJbWFnZShhcnJheVswXS5uYW1lKTtcbiAgICAgICAgICAgICAgICB2YXIgZG9ja2VkSXRlbXMgPSBwcmV2aWV3LmdldERvY2tlZEl0ZW1zKCd0b29sYmFyW2RvY2s9XCJib3R0b21cIl0nKTtcbiAgICAgICAgICAgICAgICBkb2NrZWRJdGVtc1swXS5yZW1vdmVBbGwoKTtcblxuICAgICAgICAgICAgICAgIEV4dC5BcnJheS5lYWNoKGFycmF5LCBmdW5jdGlvbiAoaW1nT2JqKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY2tlZEl0ZW1zWzBdLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB4dHlwZTogJ2ltYWdlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyYzogJy9zZXJ2ZS8nICsgaW1nT2JqLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDkwLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDEyMFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIEV4dC50b2FzdChlcnJvcik7XG4gICAgICAgIH0pO1xuICAgIH1cbn0pOyIsIkV4dC5kZWZpbmUoJ1BsYXlncm91bmQudmlldy53ZWF0aGVyLldlYXRoZXInLCB7XG4gIGV4dGVuZDogJ0V4dC5wYW5lbC5QYW5lbCcsXG4gIHh0eXBlOiAnYm56LXdlYXRoZXInLFxuXG4gIGNvbnRyb2xsZXI6ICd3ZWF0aGVyLW1haW4nLFxuICB2aWV3TW9kZWw6ICd3ZWF0aGVyLW1haW4nLFxuXG4gIHRpdGxlOiAnV2VhdGhlciBGb3JlY2FzdCcsXG4gIGhlYWRlcjogZmFsc2UsXG4gIHdpZHRoOiA2MDAsXG4gIGhlaWdodDogJ2F1dG8nLFxuICBib3JkZXI6IDAsXG4gIGl0ZW1zOiBbe1xuICAgIHh0eXBlOiAncGFuZWwnLFxuICAgIHRpdGxlOiAnV2VhdGhlciBGb3JlY2FzdCcsXG4gICAgLy8gIHRvb2xzOiBbe1xuICAgIC8vICAgIHR5cGU6ICdjbG9zZSdcbiAgICAvLyAgfV0sXG4gICAgYm9yZGVyOiAxLFxuICAgIHJlZmVyZW5jZTogJ3dpbmFtcC1lcScsXG4gICAgbGF5b3V0OiB7XG4gICAgICB0eXBlOiAnaGJveCcsXG4gICAgICBhbGlnbjogJ3N0cmV0Y2gnXG4gICAgfSxcbiAgICB0YmFyOiBbe1xuICAgICAgdGV4dDogJ09OJ1xuICAgIH0sIHtcbiAgICAgIHRleHQ6ICdBVVRPJ1xuICAgIH1dLFxuICAgIGRlZmF1bHRzOiB7XG4gICAgICAvLyBkZWZhdWx0cyBhcmUgYXBwbGllZCB0byBpdGVtcywgbm90IHRoZSBjb250YWluZXJcbiAgICAgIC8vZmxleDogMVxuICAgIH0sXG4gICAgaXRlbXM6IFtdXG4gIH1dLFxuXG4gIGluaXRDb21wb25lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY2FsbFBhcmVudCgpO1xuICB9XG59KTtcblxuRXh0LmRlZmluZSgnUGxheWdyb3VuZC52aWV3LndlYXRoZXIuV2VhdGhlckNvbnRyb2xsZXInLCB7XG4gIGV4dGVuZDogJ0V4dC5hcHAuVmlld0NvbnRyb2xsZXInLFxuICBhbGlhczogJ2NvbnRyb2xsZXIud2VhdGhlci1tYWluJyxcblxuICBhdWRpb0NvbnRleHQ6IHVuZGVmaW5lZCxcbiAgc291cmNlOiB1bmRlZmluZWQsXG4gIGdhaW5Ob2RlOiB1bmRlZmluZWQsXG4gIHBhbk5vZGU6IHVuZGVmaW5lZCxcbiAgc3BsaXR0ZXI6IHVuZGVmaW5lZCxcbiAgZ2Fpbkw6IHVuZGVmaW5lZCxcbiAgZ2FpblI6IHVuZGVmaW5lZCxcblxuICBtYWluRmlsdGVyOiB1bmRlZmluZWQsXG5cbiAgY29udHJvbDoge1xuLypcbiAgICB0b29sOntcbiAgICAgIGNsaWNrOiAnb25DbG9zZUNsaWNrJ1xuICAgIH0sXG4gICAgJ2Juei13aW5hbXBzbGlkZXInOiB7XG4gICAgICBjaGFuZ2U6ICdvblNsaWRlck1vdmUnXG4gICAgfSxcbiAgICAgICcjcGxheUJ0bic6IHtcbiAgICAgICAgY2xpY2s6ICdwbGF5U291bmQnXG4gICAgICB9LFxuICAgICcjdm9sdW1lU2lsZGVyJzoge1xuICAgICAgY2hhbmdlOiAnc2V0Vm9sdW1lJ1xuICAgIH0sXG4gICAgJyNwYW5TbGlkZXInOiB7XG4gICAgICBjaGFuZ2U6ICdzZXRQYW4nXG4gICAgfSxcbiAgICAnI2ZyZXFTaWxkZXInOiB7XG4gICAgICBjaGFuZ2U6ICdzZXRNYWluRmlsdGVyJ1xuICAgIH0sXG4gICAgJyNwbCc6IHtcbiAgICAgIGNsaWNrOiAnc2hvd0hpZGUnXG4gICAgfSxcbiAgICAnI2VxJzoge1xuICAgICAgY2xpY2s6ICdzaG93SGlkZSdcbiAgICB9LFxuICAgIGdyaWQ6IHtcbiAgICAgIGl0ZW1kYmxjbGljazogJ29uSXRlbUNsaWNrJ1xuICAgIH0qL1xuICB9LFxuXG4gIGluaXQ6IGZ1bmN0aW9uKCl7XG5cbiAgICBFeHQuQWpheC5yZXF1ZXN0KHtcbiAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L2ZpbmQ/cT1CZXJsaW4mdW5pdHM9bWV0cmljJmFwcGlkPTQ0ZGI2YTg2MmZiYTBiMDY3YjE5MzBkYTBkNzY5ZTk4Jm1vZGU9anNvbicsXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAvLyAgICBoZWFkZXJzOiB7J1gtUmVxdWVzdGVkLVdpdGgnOiAnWE1MSHR0cFJlcXVlc3QnfSxcbiAgICAgICAgICAvLyAgcGFyYW1zIDogRXh0LkpTT04uZW5jb2RlKGZvcm1QYW5lbC5nZXRWYWx1ZXMoKSksXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihjb25uLCByZXNwb25zZSwgb3B0aW9ucywgZU9wdHMpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gcmVzcG9uc2UucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgRXh0LmxvZyh7ZHVtcDpyZXN1bHR9KTtcbiAgICAgICAgICAgICAgICAgIC8vICBQYWNrdC51dGlsLkFsZXJ0Lm1zZygnU3VjY2VzcyEnLCAnU3RvY2sgd2FzIHNhdmVkLicpO1xuICAgICAgICAgICAgICAgICAgLy8gIHN0b3JlLmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgIC8vICB3aW4uY2xvc2UoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgLy8gIFBhY2t0LnV0aWwuVXRpbC5zaG93RXJyb3JNc2cocmVzdWx0Lm1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZhaWx1cmU6IGZ1bmN0aW9uKGNvbm4sIHJlc3BvbnNlLCBvcHRpb25zLCBlT3B0cykge1xuICAgICAgICAgICAgICAgIC8vIFRPRE8gZ2V0IHRoZSAnbXNnJyBmcm9tIHRoZSBqc29uIGFuZCBkaXNwbGF5IGl0XG4gICAgICAgICAgICAgICAgLy9QYWNrdC51dGlsLlV0aWwuc2hvd0Vycm9yTXNnKGNvbm4ucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gIH1cblxufSk7XG5cbkV4dC5kZWZpbmUoJ1BsYXlncm91bmQudmlldy53ZWF0aGVyLldlYXRoZXJNb2RlbCcsIHtcbiAgICBleHRlbmQ6ICdFeHQuYXBwLlZpZXdNb2RlbCcsXG4gICAgYWxpYXM6ICd2aWV3bW9kZWwud2VhdGhlci1tYWluJyxcbiAgICBkYXRhOiB7XG4gICAgICAgIG5hbWU6ICdQbGF5Z3JvdW5kJyxcbiAgICAgICAgdHJhY2s6IHVuZGVmaW5lZCxcbiAgICAgICAgYWN0dWFsVHJhY2s6IHt9LFxuICAgICAgICBhY3R1YWxobXM6ICcwMDowMDowMCdcbiAgICB9XG59KTtcbiIsIkV4dC5kZWZpbmUoJ1BsYXlncm91bmQudmlldy53aW5hbXAuYXNzZXRzLlN0cmluZ3MnLCB7XG4gIHNpbmdsZXRvbjogdHJ1ZSxcblxuICBwbGF5ZXJUaXRsZTogJ1dFQkFNUCcsXG4gIHBsYXllckVxQnRuOiAnRVEnLFxuICBwbGF5ZXJQbEJ0bjogJ1BMJyxcbiAgcGxheWxpc3RUaXRsZTogJ1BMQVlMSVNUJ1xuXG59KTtcblxuRXh0LmRlZmluZSgnUGxheWdyb3VuZC52aWV3LndpbmFtcC5wbGF5ZXIuUGxheWVyJywge1xuICBleHRlbmQ6ICdFeHQucGFuZWwuUGFuZWwnLFxuICBhbGlhczogJ3dpZGdldC5ibnotcGxheWVyJyxcblxuICB0aXRsZTogUGxheWdyb3VuZC52aWV3LndpbmFtcC5hc3NldHMuU3RyaW5ncy5wbGF5ZXJUaXRsZSxcbiAgYm9yZGVyOiAwLFxuICByZWZlcmVuY2U6ICd3aW5hbXAtcGxheWVyJyxcbiAgdG9vbHM6IFt7XG4gICAgICB0eXBlOiAnY2xvc2UnXG4gIH1dLFxuXG4gIGl0ZW1zOiBbe1xuICAgIHh0eXBlOiAncGFuZWwnLFxuICAgIGhlYWRlcjogZmFsc2UsXG4gICAgYm9yZGVyOiBmYWxzZSxcbiAgICBpdGVtczogW3tcbiAgICAgIHh0eXBlOiAncGFuZWwnLFxuICAgICAgaGVhZGVyOiBmYWxzZSxcbiAgICAgIGJvcmRlcjogZmFsc2UsXG4gICAgICBsYXlvdXQ6IHtcbiAgICAgICAgdHlwZTogJ2NvbHVtbicsXG4gICAgICAgIGFsaWduOiAnbGVmdCdcbiAgICAgIH0sXG4gICAgICBpdGVtczogW3tcbiAgICAgICAgYmluZDoge1xuICAgICAgICAgIHRpdGxlOiAne2FjdHVhbGhtc30nXG4gICAgICAgIH0sXG4gICAgICAgIGNvbHVtbldpZHRoOiAwLjI1XG4gICAgICB9LCB7XG4gICAgICAgIGNvbHVtbldpZHRoOiAwLjc1LFxuICAgICAgICB4dHlwZTogJ3RleHRmaWVsZCcsXG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICBhbGxvd0JsYW5rOiB0cnVlLFxuICAgICAgICBiaW5kOiB7XG4gICAgICAgICAgdmFsdWU6ICd7YWN0dWFsVHJhY2sudGl0bGV9J1xuICAgICAgICB9XG4gICAgICB9XVxuICAgIH0sIHtcbiAgICAgIHh0eXBlOiAncGFuZWwnLFxuICAgICAgaGVhZGVyOiBmYWxzZSxcbiAgICAgIGJvcmRlcjogZmFsc2UsXG4gICAgICBsYXlvdXQ6IHtcbiAgICAgICAgdHlwZTogJ2NvbHVtbicsXG4gICAgICAgIGFsaWduOiAnbGVmdCdcbiAgICAgIH0sXG4gICAgICBpdGVtczogW3tcbiAgICAgICAgdGl0bGU6ICdDb2x1bW4gMScsXG4gICAgICAgIGNvbHVtbldpZHRoOiAwLjI1XG4gICAgICB9LCB7XG4gICAgICAgIGNvbHVtbldpZHRoOiAwLjU1LFxuICAgICAgICBsYXlvdXQ6IHtcbiAgICAgICAgICB0eXBlOiAnaGJveCcsXG4gICAgICAgICAgYWxpZ246ICdzdHJldGNoJ1xuICAgICAgICB9LFxuICAgICAgICBpdGVtczogW3tcbiAgICAgICAgICB4dHlwZTogJ2Juei1oc2xpZGVyJyxcbiAgICAgICAgICBpdGVtSWQ6ICd2b2x1bWVTaWxkZXInLFxuICAgICAgICAgIGZsZXg6IDJcbiAgICAgICAgfSwge1xuICAgICAgICAgIHh0eXBlOiAnYm56LWhzbGlkZXInLFxuICAgICAgICAgIGl0ZW1JZDogJ3BhblNsaWRlcicsXG4gICAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgICAgaW5jcmVtZW50OiAxLFxuICAgICAgICAgIG1pblZhbHVlOiAtMTAsXG4gICAgICAgICAgbWF4VmFsdWU6IDEwLFxuICAgICAgICAgIGZsZXg6IDFcbiAgICAgICAgfV1cbiAgICAgIH0sIHtcbiAgICAgICAgY29sdW1uV2lkdGg6IDAuMjAsXG4gICAgICAgIGl0ZW1zOiBbe1xuICAgICAgICAgIHRleHQ6IFBsYXlncm91bmQudmlldy53aW5hbXAuYXNzZXRzLlN0cmluZ3MucGxheWVyRXFCdG4sXG4gICAgICAgICAgeHR5cGU6ICdidXR0b24nLFxuICAgICAgICAgIGl0ZW1JZDogJ2VxJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgdGV4dDogUGxheWdyb3VuZC52aWV3LndpbmFtcC5hc3NldHMuU3RyaW5ncy5wbGF5ZXJQbEJ0bixcbiAgICAgICAgICB4dHlwZTogJ2J1dHRvbicsXG4gICAgICAgICAgaXRlbUlkOiAncGwnXG4gICAgICAgIH1dXG4gICAgICB9XVxuICAgIH0sIHtcbiAgICAgIHh0eXBlOiAncGFuZWwnLFxuICAgICAgaGVhZGVyOiBmYWxzZSxcbiAgICAgIGJvcmRlcjogZmFsc2UsXG4gICAgICBpdGVtczogW3tcbiAgICAgICAgeHR5cGU6ICdibnotaHNsaWRlcicsXG4gICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgIH1dXG4gICAgfV1cbiAgfV0sXG5cblxuICBiYmFyOiBbe1xuICAgIGljb25DbHM6ICd4LWZhIGZhLXN0ZXAtYmFja3dhcmQnXG4gIH0sIHtcbiAgICBpY29uQ2xzOiAneC1mYSBmYS1wbGF5JyxcbiAgICBpdGVtSWQ6ICdwbGF5QnRuJ1xuLy8gICAgaGFuZGxlcjogJ3BsYXlTb3VuZCcgLy8gVE9ETyBsaXN0ZW4gdG8gZXZlbnQgaW4gY29udHJvbGxlclxuICB9LCB7XG4gICAgaWNvbkNsczogJ3gtZmEgZmEtcGF1c2UnLFxuICAgIGhhbmRsZXI6ICdzdG9wUGxheSdcbiAgfSwge1xuICAgIGljb25DbHM6ICd4LWZhIGZhLXN0b3AnXG4gIH0sIHtcbiAgICBpY29uQ2xzOiAneC1mYSBmYS1zdGVwLWZvcndhcmQnXG4gIH0sIHtcbiAgICBpY29uQ2xzOiAneC1mYSBmYS1lamVjdCdcbiAgfV1cblxufSk7XG5cbkV4dC5kZWZpbmUoJ1BsYXlncm91bmQudmlldy53aW5hbXAucGxheWxpc3QuUGxheWxpc3QnLCB7XG4gIGV4dGVuZDogJ0V4dC5ncmlkLlBhbmVsJyxcbiAgYWxpYXM6ICd3aWRnZXQuYm56LXdpbmFtcC1wbGF5bGlzdCcsXG5cbiAgdGl0bGU6IFBsYXlncm91bmQudmlldy53aW5hbXAuYXNzZXRzLlN0cmluZ3MucGxheWVyVGl0bGUrICcgJyArIFBsYXlncm91bmQudmlldy53aW5hbXAuYXNzZXRzLlN0cmluZ3MucGxheWxpc3RUaXRsZSxcbiAgYm9yZGVyOiAxLFxuICByZWZlcmVuY2U6ICd3aW5hbXAtcGxheWxpc3QnLFxuICB0b29sczogW3tcbiAgICAgIHR5cGU6ICdjbG9zZSdcbiAgfV0sXG4gIGxheW91dDoge1xuICAgIHR5cGU6ICdmaXQnXG4gIH0sXG4gIHN0b3JlOiB1bmRlZmluZWQsXG5cbiAgdmlld0NvbmZpZzoge1xuICAgIHBsdWdpbnM6IHtcbiAgICAgIHB0eXBlOiAnZ3JpZHZpZXdkcmFnZHJvcCcsXG4gICAgICBkcmFnVGV4dDogJ0RyYWcgYW5kIGRyb3AgdG8gcmVvcmdhbml6ZSdcbiAgICB9XG4gIH0sXG4gIGhpZGVIZWFkZXJzOiB0cnVlLFxuICBjb2x1bW5zOiBbe1xuICAgIHh0eXBlOiAncm93bnVtYmVyZXInXG4gIH0sIHtcbiAgICBkYXRhSW5kZXg6ICd0aXRsZScsXG4gICAgZmxleDogMVxuICB9LCB7XG4gICAgZGF0YUluZGV4OiAnZHVyYXRpb24nLFxuICAgIHJlbmRlcmVyOiBmdW5jdGlvbih2YWx1ZSwgbWV0YSwgcmVjb3JkKSB7XG4gICAgICByZXR1cm4gUGxheWdyb3VuZC52aWV3LndpbmFtcC5VdGlsLmNyZWF0ZWhtc1N0cmluZyh2YWx1ZSk7XG4gICAgfVxuICB9XSxcblxuICBiYmFyOiBbe1xuICAgIHRleHQ6ICdBREQnLFxuICAgIG1lbnU6IFt7XG4gICAgICB0ZXh0OiAnQUREIFVSTCdcbiAgICB9LHtcbiAgICAgIHRleHQ6ICdBREQgTElTVCdcbiAgICB9LHtcbiAgICAgIHRleHQ6ICdBREQgRklMRSdcbiAgICB9XVxuICB9LCB7XG4gICAgdGV4dDogJ1JFTSdcbiAgfSwge1xuICAgIHRleHQ6ICdTRUwnXG4gIH0sIHtcbiAgICB0ZXh0OiAnTUlTQydcbiAgfV0sXG5cbiAgaW5pdENvbXBvbmVudDogZnVuY3Rpb24oKSB7XG5cbiAgICB0aGlzLnN0b3JlID0gRXh0LmNyZWF0ZSgnRXh0LmRhdGEuU3RvcmUnLCB7XG4gICAgICBzdG9yZUlkOiAncGxheUxpc3QnLFxuICAgICAgZmllbGRzOiBbJ2lkJywgJ3RpdGxlJywgJ3VzZXInLCAnZHVyYXRpb24nXVxuICAgIH0pO1xuICAgIHRoaXMuY2FsbFBhcmVudCgpO1xuICB9XG59KTtcblxuRXh0LmRlZmluZSgnUGxheWdyb3VuZC52aWV3LndpbmFtcC5zbGlkZXIuSHNsaWRlcicsIHtcbiAgZXh0ZW5kOiAnRXh0LnNsaWRlci5TaW5nbGUnLFxuICBhbGlhczogJ3dpZGdldC5ibnotaHNsaWRlcicsXG5cbiAgdmFsdWU6IDUwLFxuICBpbmNyZW1lbnQ6IDEwLFxuICBtaW5WYWx1ZTogMCxcbiAgbWF4VmFsdWU6IDEwMCxcbiAgdmVydGljYWw6IGZhbHNlXG59KTtcblxuRXh0LmRlZmluZSgnUGxheWdyb3VuZC52aWV3LndpbmFtcC5zbGlkZXIuVnNsaWRlcicsIHtcbiAgZXh0ZW5kOiAnRXh0LnNsaWRlci5TaW5nbGUnLFxuICBhbGlhczogJ3dpZGdldC5ibnotd2luYW1wc2xpZGVyJyxcblxuICB2YWx1ZTogMTAwLFxuICBpbmNyZW1lbnQ6IDEwMCxcbiAgbWluVmFsdWU6IDAsXG4gIG1heFZhbHVlOiA1MDAwLFxuICB2ZXJ0aWNhbDogdHJ1ZSxcbiAgaGVpZ2h0OiAxMDBcbn0pO1xuXG5FeHQuZGVmaW5lKCdQbGF5Z3JvdW5kLnZpZXcud2luYW1wLlV0aWwnLCB7XG4gIHNpbmdsZXRvbjogdHJ1ZSxcblxuICB3ZWxjb21lVHJhY2s6ICdodHRwczovL3NvdW5kY2xvdWQuY29tL2JuemxvdmVzeW91L2Rha3RhcmktcHJldmlldycsXG4gIGluaXRpYWxQbGF5bGlzdDogJy91c2Vycy8xNjcyNDQ0L3RyYWNrcycsXG5cbiAgLy8gY3JlYXRlIGR1cmF0aW9uIGgtbS1zIHN0cmluZyBmcm9tIG1pbGxpc2Vjb25kc1xuICBjcmVhdGVobXNTdHJpbmc6IGZ1bmN0aW9uKG1pbGxpKSB7XG4gICAgdmFyIGhvdXJzID0gTWF0aC5mbG9vcihtaWxsaSAvIDM2ZTUpLFxuICAgICAgbWlucyA9IE1hdGguZmxvb3IoKG1pbGxpICUgMzZlNSkgLyA2ZTQpLFxuICAgICAgc2VjcyA9IE1hdGguZmxvb3IoKG1pbGxpICUgNmU0KSAvIDEwMDApO1xuICAgIHZhciBobXNTdHJpbmcgPSB0aGlzLnBhZChob3VycykgKyAnOicgKyB0aGlzLnBhZChtaW5zKSArICc6JyArIHRoaXMucGFkKHNlY3MpO1xuICAgIHJldHVybiBobXNTdHJpbmc7XG4gIH0sXG5cbiAgLy8gYWRkIGxlYWRpbmcgemVyb3NcbiAgcGFkOiBmdW5jdGlvbihudW1iZXIsIHNpemUpIHtcbiAgICB2YXIgcyA9IFN0cmluZyhudW1iZXIpO1xuICAgIHdoaWxlIChzLmxlbmd0aCA8IChzaXplIHx8IDIpKSB7XG4gICAgICBzID0gXCIwXCIgKyBzO1xuICAgIH1cbiAgICByZXR1cm4gcztcbiAgfVxuXG59KTtcblxuRXh0LmRlZmluZSgnUGxheWdyb3VuZC52aWV3LndpbmFtcC5XaW5hbXAnLCB7XG4gIGV4dGVuZDogJ0V4dC5wYW5lbC5QYW5lbCcsXG4gIHh0eXBlOiAnYm56LXdpbmFtcCcsXG5cbiAgY29udHJvbGxlcjogJ3dpbmFtcC1tYWluJyxcbiAgdmlld01vZGVsOiAnd2luYW1wLW1haW4nLFxuXG4gIHRpdGxlOiAnTXVsdGltZWRpYSBQbGF5ZXInLFxuICBoZWFkZXI6IGZhbHNlLFxuICB3aWR0aDogNjAwLFxuICBoZWlnaHQ6ICdhdXRvJyxcbiAgYm9yZGVyOiAwLFxuICBpdGVtczogW3tcbiAgICB4dHlwZTogJ2Juei1wbGF5ZXInXG4gIH0sIHtcbiAgICB4dHlwZTogJ3BhbmVsJyxcbiAgICB0aXRsZTogJ1dJTkFNUCBFUVVBTElaRVInLFxuICAgIHRvb2xzOiBbe1xuICAgICAgdHlwZTogJ2Nsb3NlJ1xuICAgIH1dLFxuICAgIGJvcmRlcjogMSxcbiAgICByZWZlcmVuY2U6ICd3aW5hbXAtZXEnLFxuICAgIGxheW91dDoge1xuICAgICAgdHlwZTogJ2hib3gnLFxuICAgICAgYWxpZ246ICdzdHJldGNoJ1xuICAgIH0sXG4gICAgdGJhcjogW3tcbiAgICAgIHRleHQ6ICdPTidcbiAgICB9LCB7XG4gICAgICB0ZXh0OiAnQVVUTydcbiAgICB9XSxcbiAgICBkZWZhdWx0czoge1xuICAgICAgLy8gZGVmYXVsdHMgYXJlIGFwcGxpZWQgdG8gaXRlbXMsIG5vdCB0aGUgY29udGFpbmVyXG4gICAgICAvL2ZsZXg6IDFcbiAgICB9LFxuICAgIGl0ZW1zOiBbe1xuICAgICAgeHR5cGU6ICdibnotd2luYW1wc2xpZGVyJyxcbiAgICAgIGl0ZW1JZDogJ2ZyZXFTaWxkZXInXG4gICAgfSwge1xuICAgICAgeHR5cGU6ICdibnotd2luYW1wc2xpZGVyJ1xuICAgIH0sIHtcbiAgICAgIHh0eXBlOiAnYm56LXdpbmFtcHNsaWRlcidcbiAgICB9LCB7XG4gICAgICB4dHlwZTogJ2Juei13aW5hbXBzbGlkZXInXG4gICAgfSwge1xuICAgICAgeHR5cGU6ICdibnotd2luYW1wc2xpZGVyJ1xuICAgIH0sIHtcbiAgICAgIHh0eXBlOiAnYm56LXdpbmFtcHNsaWRlcidcbiAgICB9LCB7XG4gICAgICB4dHlwZTogJ2Juei13aW5hbXBzbGlkZXInXG4gICAgfSwge1xuICAgICAgeHR5cGU6ICdibnotd2luYW1wc2xpZGVyJ1xuICAgIH0sIHtcbiAgICAgIHh0eXBlOiAnYm56LXdpbmFtcHNsaWRlcidcbiAgICB9LCB7XG4gICAgICB4dHlwZTogJ2Juei13aW5hbXBzbGlkZXInXG4gICAgfSwge1xuICAgICAgeHR5cGU6ICdibnotd2luYW1wc2xpZGVyJ1xuICAgIH0sIHtcbiAgICAgIHh0eXBlOiAnYm56LXdpbmFtcHNsaWRlcidcbiAgICB9XVxuICB9LCB7XG4gICAgeHR5cGU6ICdibnotd2luYW1wLXBsYXlsaXN0J1xuICB9LCB7XG4gICAgeHR5cGU6ICdwYW5lbCcsXG4gICAgdGl0bGU6IFBsYXlncm91bmQudmlldy53aW5hbXAuYXNzZXRzLlN0cmluZ3MucGxheWVyVGl0bGUgKyAnIE1PTk8gTU9ERScsXG4gICAgaXRlbXM6IFt7XG4gICAgICAgIC8qKlxuICAgICAgICBCYWxhbmNlLVNsaWRlciBMZWZ0L1JpZ2h0XG4gICAgICAgIC0+IGFiZXIgb2huZSBBTExFUyBuYWNoIGxpbmtzL3JlY2h0cyB6dSB6aWVoZW4sXG4gICAgICAgIHNvbmRlcm4gZGVuIGVudHNwcmVjaGVuZCBhbmRlcmVuIFN0ZXJlb2thbmFsXG4gICAgICAgIGF1c3p1YmxlbmRlbiAoLT5nYW56IGxpbmtzIGJlZGV1dGV0IGFsc28gbnVyIG5vY2hcbiAgICAgICAgbGlua2VyIFNwZWFrZXIgaXN0IGFrdGl2LCBhYmVyIGF1Y2ggbnVyIG1pdFxuICAgICAgICBJbmhhbHQgZGVzIGxpbmtlbiBTdGVyZW8tS2FuYWxzKVxuICAgICAgICAqL1xuICAgIH0sIHtcbiAgICAgIC8qXG4gICAgICAgICAgIFN0ZXJlby1Nb25vLVN3aXRjaDpcbiAgICAgICAgICAgYmVpZGUgS2Fuw6RsZSB3ZXJkZW4genUgZWluZW0gTW9ub3NpZ25hbCB6dXNhbW1lblxuICAgICAgICAgICBnZW1pc2NodCB1bmQgZGVyIERvd25taXggYXVmIGVpbmVtL2JlaWRlblxuICAgICAgICAgICBLYW7DpGxlbiBhdXNnZWdlYmVuXG4gICAgICAgICAgICovXG4gICAgfSwge1xuICAgICAgeHR5cGU6ICdwYW5lbCcsXG4gICAgICB0aXRsZTogJ0NoYW5uZWwgU2VsZWt0b3InLFxuICAgICAgaXRlbXM6IFt7XG4gICAgICAgICAgeHR5cGU6ICdzZWdtZW50ZWRidXR0b24nLFxuICAgICAgICAgIGFsbG93TXVsdGlwbGU6IGZhbHNlLFxuICAgICAgICAgIGl0ZW1JZDogJ0xlZnRSaWdodCcsXG4gICAgICAgICAgaXRlbXM6IFt7XG4gICAgICAgICAgICB0ZXh0OiAnTEVGVCdcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICB0ZXh0OiAnUklHSFQnLFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIHRleHQ6ICdCT1RIJyxcbiAgICAgICAgICB9XVxuICAgICAgICB9LCB7XG4gICAgICAgICAgeHR5cGU6ICdjb250YWluZXInLFxuICAgICAgICAgIGl0ZW1zOiBbe1xuICAgICAgICAgICAgeHR5cGU6ICdibnotaHNsaWRlcicsXG4gICAgICAgICAgICBpdGVtSWQ6ICdiYWxhbmNlU2xpZGVyTFInLFxuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIHZhbHVlOiAwLFxuICAgICAgICAgICAgaW5jcmVtZW50OiAxLFxuICAgICAgICAgICAgbWluVmFsdWU6IC0xMCxcbiAgICAgICAgICAgIG1heFZhbHVlOiAxMCxcbiAgICAgICAgICAgIHZlcnRpY2FsOiBmYWxzZVxuICAgICAgICAgIH1dXG4gICAgICAgIH0se1xuICAgICAgICAgIHh0eXBlOiAnY29udGFpbmVyJyxcbiAgICAgICAgICBsYXlvdXQ6IHtcbiAgICAgICAgICAgIHR5cGU6ICdoYm94JyxcbiAgICAgICAgICAgIGFsaWduOiAnc3RyZXRjaCdcbiAgICAgICAgICB9LFxuICAgICAgICAgIGl0ZW1zOiBbe1xuICAgICAgICAgICAgeHR5cGU6ICdibnotd2luYW1wc2xpZGVyJyxcbiAgICAgICAgICAgIGl0ZW1JZDogJ3NsaWRlckwnLFxuICAgICAgICAgICAgdmFsdWU6IDUsXG4gICAgICAgICAgICBpbmNyZW1lbnQ6IDEsXG4gICAgICAgICAgICBtaW5WYWx1ZTogMCxcbiAgICAgICAgICAgIG1heFZhbHVlOiAxMCxcbiAgICAgICAgICAgIHZlcnRpY2FsOiB0cnVlLFxuICAgICAgICAgICAgaGVpZ2h0OiAxMDBcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICB4dHlwZTogJ2Juei13aW5hbXBzbGlkZXInLFxuICAgICAgICAgICAgaXRlbUlkOiAnc2xpZGVyUicsXG4gICAgICAgICAgICB2YWx1ZTogNSxcbiAgICAgICAgICAgIGluY3JlbWVudDogMSxcbiAgICAgICAgICAgIG1pblZhbHVlOiAwLFxuICAgICAgICAgICAgbWF4VmFsdWU6IDEwLFxuICAgICAgICAgICAgdmVydGljYWw6IHRydWUsXG4gICAgICAgICAgICBoZWlnaHQ6IDEwMFxuICAgICAgICAgIH1dXG4gICAgICAgIH1dXG4gICAgICAgIC8qXG4gICAgICAgIFN0ZXJlby1TaWdubGVjaGFuZWwtTW9uby1Td2l0Y2g6IG1hbiBrYW5uIGVpbmVuXG4gICAgICAgIFN0ZXJlby1LYW5hbCBhdXN3w6RobGVuIHdlbGNoZXIgZGFubiBhdXNzY2hsaWXDn2xpY2hcbiAgICAgICAgKGRhbm4gYWJlciBhdWYgYmVpZGVuIEthbsOkbGVuKSBhdXNnZWdlYmVuIHdpcmRcbiAgICAgICAgKi9cbiAgICB9XVxuICB9XSxcblxuICBpbml0Q29tcG9uZW50OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNhbGxQYXJlbnQoKTtcbiAgfVxufSk7XG5cbkV4dC5kZWZpbmUoJ1BsYXlncm91bmQudmlldy53aW5hbXAuV2luYW1wQ29udHJvbGxlcicsIHtcbiAgZXh0ZW5kOiAnRXh0LmFwcC5WaWV3Q29udHJvbGxlcicsXG4gIGFsaWFzOiAnY29udHJvbGxlci53aW5hbXAtbWFpbicsXG5cbiAgYXVkaW9Db250ZXh0OiB1bmRlZmluZWQsXG4gIHNvdXJjZTogdW5kZWZpbmVkLFxuICBnYWluTm9kZTogdW5kZWZpbmVkLFxuICBwYW5Ob2RlOiB1bmRlZmluZWQsXG4gIHNwbGl0dGVyOiB1bmRlZmluZWQsXG4gIGdhaW5MOiB1bmRlZmluZWQsXG4gIGdhaW5SOiB1bmRlZmluZWQsXG4gIG1lcmdlcjogdW5kZWZpbmVkLFxuICBiYWxMOiB1bmRlZmluZWQsXG4gIGJhbFI6IHVuZGVmaW5lZCxcblxuICBtYWluRmlsdGVyOiB1bmRlZmluZWQsXG5cbiAgY29udHJvbDoge1xuICAgIHRvb2w6IHtcbiAgICAgIGNsaWNrOiAnb25DbG9zZUNsaWNrJ1xuICAgIH0sXG4gICAgJ2Juei13aW5hbXBzbGlkZXInOiB7XG4gICAgICBjaGFuZ2U6ICdvblNsaWRlck1vdmUnXG4gICAgfSxcbiAgICAnI3BsYXlCdG4nOiB7XG4gICAgICBjbGljazogJ3BsYXlTb3VuZCdcbiAgICB9LFxuICAgICcjdm9sdW1lU2lsZGVyJzoge1xuICAgICAgY2hhbmdlOiAnc2V0Vm9sdW1lJ1xuICAgIH0sXG4gICAgJyNwYW5TbGlkZXInOiB7XG4gICAgICBjaGFuZ2U6ICdzZXRQYW4nXG4gICAgfSxcbiAgICAnI2ZyZXFTaWxkZXInOiB7XG4gICAgICBjaGFuZ2U6ICdzZXRNYWluRmlsdGVyJ1xuICAgIH0sXG4gICAgJyNwbCc6IHtcbiAgICAgIGNsaWNrOiAnc2hvd0hpZGUnXG4gICAgfSxcbiAgICAnI2VxJzoge1xuICAgICAgY2xpY2s6ICdzaG93SGlkZSdcbiAgICB9LFxuICAgICcjTGVmdFJpZ2h0Jzoge1xuICAgICAgdG9nZ2xlOiAnc2VwYXJhdGVDaGFubmVsJ1xuICAgIH0sXG4gICAgJyNzbGlkZXJMJzoge1xuICAgICAgY2hhbmdlOiAnc2V0TGVmdEdhaW4nXG4gICAgfSxcbiAgICAnI3NsaWRlclInOiB7XG4gICAgICBjaGFuZ2U6ICdzZXRSaWdodEdhaW4nXG4gICAgfSxcbiAgICAnI2JhbGFuY2VTbGlkZXJMUic6e1xuICAgICAgY2hhbmdlOiAnY2hhbmdlQmFsYW5jZSdcbiAgICB9LFxuICAgIGdyaWQ6IHtcbiAgICAgIGl0ZW1kYmxjbGljazogJ29uSXRlbUNsaWNrJ1xuICAgIH1cbiAgfSxcblxuICBvbkNsb3NlQ2xpY2s6IGZ1bmN0aW9uKHRvb2wsIGUsIG93bmVyLCBlT3B0cykge1xuICAgIGlmICghKG93bmVyLnJlZmVyZW5jZSA9PT0gJ3dpbmFtcC1wbGF5ZXInKSkge1xuICAgICAgb3duZXIuaGlkZSgpO1xuICAgIH1cblxuICB9LFxuXG4gIGRlZmF1bHRSb3V0aW5nOiBmdW5jdGlvbigpe1xuICB0aGlzLm1lcmdlci5kaXNjb25uZWN0KCk7XG4gIHRoaXMuc3BsaXR0ZXIuZGlzY29ubmVjdCgpO1xuICB0aGlzLm1haW5GaWx0ZXIuY29ubmVjdCh0aGlzLnBhbk5vZGUpO1xuICB0aGlzLnBhbk5vZGUuY29ubmVjdCh0aGlzLmdhaW5Ob2RlKTtcbiAgLypcbiAgdGhpcy5tYWluRmlsdGVyLmNvbm5lY3QodGhpcy5zcGxpdHRlcik7XG5cblxuICB0aGlzLnNwbGl0dGVyLmNvbm5lY3QodGhpcy5nYWluTCwgMCk7XG4gIHRoaXMuc3BsaXR0ZXIuY29ubmVjdCh0aGlzLmdhaW5SLCAxKTtcbiAgdGhpcy5nYWluTC5jb25uZWN0KHRoaXMubWVyZ2VyLCAwLCAwKTtcbiAgdGhpcy5nYWluUi5jb25uZWN0KHRoaXMubWVyZ2VyLCAwLCAxKTtcblxuICB0aGlzLm1lcmdlci5jb25uZWN0KHRoaXMuZ2Fpbk5vZGUpO1xuICAqL1xuICB9LFxuXG4gIGRldGFjaERlZmF1bHRSb3V0aW5nOiBmdW5jdGlvbigpe1xuICB0aGlzLm1haW5GaWx0ZXIuZGlzY29ubmVjdCgpO1xuICB0aGlzLnBhbk5vZGUuZGlzY29ubmVjdCgpO1xuICB0aGlzLm1haW5GaWx0ZXIuY29ubmVjdCh0aGlzLnNwbGl0dGVyKTtcblxuXG4gIHRoaXMuc3BsaXR0ZXIuY29ubmVjdCh0aGlzLmdhaW5MLCAwKTtcbiAgdGhpcy5zcGxpdHRlci5jb25uZWN0KHRoaXMuZ2FpblIsIDEpO1xuICB0aGlzLmdhaW5MLmNvbm5lY3QodGhpcy5iYWxMKTtcbiAgdGhpcy5nYWluUi5jb25uZWN0KHRoaXMuYmFsUik7XG4gIHRoaXMuYmFsTC5jb25uZWN0KHRoaXMubWVyZ2VyLCAwLCAwKVxuICB0aGlzLmJhbFIuY29ubmVjdCh0aGlzLm1lcmdlciwgMCwgMSlcblxuICB0aGlzLm1lcmdlci5jb25uZWN0KHRoaXMuZ2Fpbk5vZGUpO1xuICB9LFxuXG4gIGNoYW5nZUJhbGFuY2U6IGZ1bmN0aW9uKGNtcCwgeCwgeSwgZU9wdHMpe1xuICAgIHRoaXMuZGV0YWNoRGVmYXVsdFJvdXRpbmcoKTtcbiAgIGlmICh4ID4wIClcbiAgIHt0aGlzLnNldExlZnRHYWluKDAsIDEwLXgpfVxuICAgaWYgKHggPCAwKVxuICAgeyB4ID0gTWF0aC5hYnMoeCk7XG4gICAgIHRoaXMuc2V0UmlnaHRHYWluKDAsIDEwLXgpO1xuICAgfVxuICB9LFxuXG4gIHNldExlZnRHYWluOiBmdW5jdGlvbihjbXAsIHgsIHksIGVPcHRzKSB7XG4gICAgdGhpcy5kZXRhY2hEZWZhdWx0Um91dGluZygpO1xuICAgIHRoaXMuZ2FpbkwuZ2Fpbi52YWx1ZSA9IHggLyAxMDtcbiAgfSxcblxuICBzZXRSaWdodEdhaW46IGZ1bmN0aW9uKGNtcCwgeCwgeSwgZU9wdHMpIHtcbiAgICB0aGlzLmRldGFjaERlZmF1bHRSb3V0aW5nKCk7XG4gICAgdGhpcy5nYWluUi5nYWluLnZhbHVlID0geCAvIDEwO1xuICB9LFxuXG4gIHNlcGFyYXRlQ2hhbm5lbDogZnVuY3Rpb24oY29udGFpbmVyLCBidXR0b24sIHByZXNzZWQpIHtcbiAgICB0aGlzLmRldGFjaERlZmF1bHRSb3V0aW5nKCk7XG4gICAgaWYgKGJ1dHRvbi50ZXh0ID09PSAnTEVGVCcpIHtcbiAgICAgIHRoaXMuZ2FpbkwuZ2Fpbi52YWx1ZSA9IDEuMDtcbiAgICAgIHRoaXMuZ2FpblIuZ2Fpbi52YWx1ZSA9IDAuMDtcbiAgICB9XG4gICAgaWYgKGJ1dHRvbi50ZXh0ID09PSAnUklHSFQnKSB7XG4gICAgICB0aGlzLmdhaW5MLmdhaW4udmFsdWUgPSAwLjA7XG4gICAgICB0aGlzLmdhaW5SLmdhaW4udmFsdWUgPSAxLjA7XG4gICAgfVxuICAgIGlmIChidXR0b24udGV4dCA9PT0gJ0JPVEgnKSB7XG4gICAgICB0aGlzLmdhaW5MLmdhaW4udmFsdWUgPSAxLjA7XG4gICAgICB0aGlzLmdhaW5SLmdhaW4udmFsdWUgPSAxLjA7XG4gICAgfVxuICB9LFxuXG4gIC8vVE9ETyByZWZhY3RvcmluZyBuZWVkZWRcbiAgc2hvd0hpZGU6IGZ1bmN0aW9uKGNtcCkge1xuICAgIGlmIChjbXAuaXRlbUlkID09PSAnZXEnKSB7XG4gICAgICBlcSA9IHRoaXMubG9va3VwUmVmZXJlbmNlKCd3aW5hbXAtZXEnKVxuICAgICAgaWYgKGVxLmhpZGRlbikge1xuICAgICAgICBlcS5zaG93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlcS5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChjbXAuaXRlbUlkID09PSAncGwnKSB7XG4gICAgICBwbCA9IHRoaXMubG9va3VwUmVmZXJlbmNlKCd3aW5hbXAtcGxheWxpc3QnKVxuICAgICAgaWYgKHBsLmhpZGRlbikge1xuICAgICAgICBwbC5zaG93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwbC5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIG9uSXRlbUNsaWNrOiBmdW5jdGlvbih2aWV3LCByZWNvcmQsIGl0ZW0sIGluZGV4LCBlLCBlT3B0cykge1xuICAgIG1lID0gdGhpcztcbiAgICBtZS5zZXRBY3R1YWxUcmFjayhyZWNvcmQuZGF0YSk7XG4gIH0sXG5cbiAgc2V0UGFuOiBmdW5jdGlvbihjbXAsIHgsIHksIGVPcHRzKSB7XG4gICAgdGhpcy5kZWZhdWx0Um91dGluZygpO1xuICAgIHRoaXMucGFuTm9kZS5wYW4udmFsdWUgPSB4IC8gMTA7XG4gIH0sXG5cbiAgc2V0QWN0dWFsVHJhY2s6IGZ1bmN0aW9uKFRyYWNrSW5mbykge1xuICAgIGlmICh0aGlzLnNvdXJjZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc291cmNlLnN0b3AoKTtcbiAgICB9XG4gICAgbWUuZ2V0VmlldygpLmdldFZpZXdNb2RlbCgpLnNldChcImFjdHVhbFRyYWNrXCIsIFRyYWNrSW5mbyk7XG4gICAgbWUuZ2V0VmlldygpLmdldFZpZXdNb2RlbCgpLnNldChcImFjdHVhbGhtc1wiLCBQbGF5Z3JvdW5kLnZpZXcud2luYW1wLlV0aWwuY3JlYXRlaG1zU3RyaW5nKFRyYWNrSW5mby5kdXJhdGlvbikpO1xuICAgIHRoaXMuZ2V0RGF0YShUcmFja0luZm8uc3RyZWFtX3VybCk7XG4gIH0sXG5cbiAgb25TbGlkZXJNb3ZlOiBmdW5jdGlvbihjbXAsIHgsIHksIGVPcHRzKSB7XG4gICAgRXh0LmxvZyh7ZHVtcDogY21wIH0pO1xuICAgIEV4dC5sb2coe2R1bXA6IHh9KTtcbiAgICBFeHQubG9nKHtkdW1wOiB5fSk7XG4gICAgRXh0LmxvZyh7ZHVtcDogZU9wdHN9KTtcbiAgfSxcblxuICBzZXRWb2x1bWU6IGZ1bmN0aW9uKGNtcCwgeCwgeSwgZU9wdHMpIHtcbiAgICB0aGlzLmdhaW5Ob2RlLmdhaW4udmFsdWUgPSB4IC8gMTAwO1xuICB9LFxuXG4gIHNldE1haW5GaWx0ZXI6IGZ1bmN0aW9uKGNtcCwgeCwgeSwgZU9wdHMpIHtcbiAgICB0aGlzLm1haW5GaWx0ZXIuZnJlcXVlbmN5LnZhbHVlID0geDtcbiAgfSxcblxuICB2b2x1bWVSZXNldDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5nYWluTm9kZS5nYWluLnZhbHVlID0gMC41O1xuICB9LFxuXG4gIGluaXQ6IGZ1bmN0aW9uKHZpZXcpIHtcbiAgICB0aGlzLmF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKSxcbiAgICB0aGlzLmdhaW5SID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpLFxuICAgIHRoaXMuZ2FpbkwgPSB0aGlzLmF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCksXG4gICAgdGhpcy5iYWxSID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpLFxuICAgIHRoaXMuYmFsTCA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKSxcbiAgICB0aGlzLmdhaW5Ob2RlID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpLFxuICAgIHRoaXMubWVyZ2VyID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlQ2hhbm5lbE1lcmdlcigyKSxcbiAgICB0aGlzLm1haW5GaWx0ZXIgPSB0aGlzLmF1ZGlvQ29udGV4dC5jcmVhdGVCaXF1YWRGaWx0ZXIoKSxcbiAgICB0aGlzLnBhbk5vZGUgPSB0aGlzLmF1ZGlvQ29udGV4dC5jcmVhdGVTdGVyZW9QYW5uZXIoKSxcbiAgICB0aGlzLnNwbGl0dGVyID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlQ2hhbm5lbFNwbGl0dGVyKDIpO1xuXG5cblxuICAgIHRoaXMuZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9IDAuNTtcblxuICAgIHRoaXMuZ2FpblIuZ2Fpbi52YWx1ZSA9IDAuNTtcbiAgICB0aGlzLmdhaW5MLmdhaW4udmFsdWUgPSAwLjU7XG5cbiAgICB0aGlzLmJhbFIuZ2Fpbi52YWx1ZSA9IDE7XG4gICAgdGhpcy5iYWxMLmdhaW4udmFsdWUgPSAxO1xuXG4gICAgdGhpcy5nYWluTm9kZS5jb25uZWN0KHRoaXMuYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcblxuICAgIHRoaXMubWFpbkZpbHRlci50eXBlID0gJ2xvd3Bhc3MnO1xuICAgIHRoaXMubWFpbkZpbHRlci5mcmVxdWVuY3kudmFsdWUgPSAxMDA7XG5cblxuICAgIC8vICB0aGlzLnNwbGl0dGVyLmNvbm5lY3QodGhpcy5tZXJnZXIsIDEsIDApO1xuXG4gICAgdGhpcy5tYWluRmlsdGVyLmNvbm5lY3QodGhpcy5wYW5Ob2RlKTtcbiAgICB0aGlzLnBhbk5vZGUuY29ubmVjdCh0aGlzLmdhaW5Ob2RlKTtcbiAgICAvLyAgICB0aGlzLmdhaW5SLmNvbm5lY3QodGhpcy5hdWRpb0NvbnRleHQuZGVzdGluYXRpb24pXG4gICAgLy8gICAgdGhpcy5zcGxpdHRlci5jb25uZWN0KHRoaXMuZ2Fpbk5vZGUsMCk7XG5cbiAgICBtZSA9IHRoaXM7XG4gICAgRXh0LkxvYWRlci5sb2FkU2NyaXB0KHtcbiAgICAgIHVybDogJ2h0dHBzOi8vY29ubmVjdC5zb3VuZGNsb3VkLmNvbS9zZGsvc2RrLTMuMC4wLmpzJyxcbiAgICAgIG9uTG9hZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdTb3VuZENsb3VkIGxpYmFyeSBzdWNjZXNzZnVsbHkgbG9hZGVkLicpO1xuICAgICAgICBtZS5pbml0U291bmRjbG91ZCgpO1xuXG4gICAgICB9LFxuICAgICAgb25FcnJvcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciB3aGlsZSBsb2FkaW5nIHRoZSBTb3VuZENsb3VkIGxpYmFyeScpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIGluaXRTb3VuZGNsb3VkOiBmdW5jdGlvbigpIHtcbiAgICBTQy5pbml0aWFsaXplKHtcbiAgICAgIGNsaWVudF9pZDogJzQwNDkzZjVkN2Y3MDlhOTg4MTY3NWUyNmM4MjRiMTM2J1xuICAgIH0pO1xuXG4gICAgU0MuZ2V0KFBsYXlncm91bmQudmlldy53aW5hbXAuVXRpbC5pbml0aWFsUGxheWxpc3QpLnRoZW4oZnVuY3Rpb24odHJhY2tzKSB7XG4gICAgICB2YXIgc3RvcmUgPSBFeHQuZGF0YS5TdG9yZU1hbmFnZXIubG9va3VwKCdwbGF5TGlzdCcpO1xuICAgICAgc3RvcmUuYWRkKHRyYWNrcyk7XG4gICAgfSk7XG4gIH0sXG5cbiAgc3RvcFBsYXk6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc291cmNlLnN0b3AoKTtcbiAgfSxcblxuICBwbGF5U291bmQ6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnNvdXJjZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc291cmNlLnN0b3AoKTtcbiAgICAgIHZhciBhY3R1YWxTb3VuZCA9IHRoaXMuZ2V0VmlldygpLmdldFZpZXdNb2RlbCgpLmdldChcImFjdHVhbFRyYWNrXCIpO1xuICAgICAgdGhpcy5nZXREYXRhKGFjdHVhbFNvdW5kLnN0cmVhbV91cmwpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnNvdW5kY2xvdWQoKTtcbiAgICAvL3NvdXJjZS5zdGFydCgwKTtcbiAgfSxcblxuICBzb3VuZGNsb3VkOiBmdW5jdGlvbigpIHtcbiAgICBtZSA9IHRoaXM7XG4gICAgdXJsID0gUGxheWdyb3VuZC52aWV3LndpbmFtcC5VdGlsLndlbGNvbWVUcmFjaztcbiAgICBTQy5nZXQoJy9yZXNvbHZlJywge1xuICAgICAgdXJsOiB1cmxcbiAgICB9KS50aGVuKGZ1bmN0aW9uKHNvdW5kKSB7XG4gICAgICBtZS5nZXRWaWV3KCkuZ2V0Vmlld01vZGVsKCkuc2V0KFwiYWN0dWFsVHJhY2tcIiwgc291bmQpO1xuICAgICAgbWUuZ2V0VmlldygpLmdldFZpZXdNb2RlbCgpLnNldChcImFjdHVhbGhtc1wiLCBQbGF5Z3JvdW5kLnZpZXcud2luYW1wLlV0aWwuY3JlYXRlaG1zU3RyaW5nKHNvdW5kLmR1cmF0aW9uKSk7XG4gICAgICBtZS5nZXREYXRhKHNvdW5kLnN0cmVhbV91cmwpO1xuICAgIH0pO1xuICB9LFxuXG4gIGdldERhdGE6IGZ1bmN0aW9uKHNhbXBsZSkge1xuICAgIG1lID0gdGhpcy5hdWRpb0NvbnRleHQ7XG5cbiAgICBzb3VyY2UgPSBtZS5jcmVhdGVCdWZmZXJTb3VyY2UoKSxcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcblxuICAgIHNvdXJjZS5jb25uZWN0KHRoaXMubWFpbkZpbHRlcik7XG5cbiAgICB2YXIgdXJsID0gbmV3IFVSTChzYW1wbGUgKyAnP2NsaWVudF9pZD0xN2E5OTIzNThkYjY0ZDk5ZTQ5MjMyNjc5N2ZmZjNlOCcpO1xuXG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgdXJsLCB0cnVlKTtcbiAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9IFwiYXJyYXlidWZmZXJcIjtcblxuICAgIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICBtZS5kZWNvZGVBdWRpb0RhdGEocmVxdWVzdC5yZXNwb25zZSxcbiAgICAgICAgZnVuY3Rpb24oYnVmZmVyKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJzYW1wbGUgbG9hZGVkIVwiKTtcbiAgICAgICAgICBzYW1wbGUubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICBzb3VyY2UuYnVmZmVyID0gYnVmZmVyO1xuICAgICAgICAgIHNvdXJjZS5zdGFydCgpO1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkRlY29kaW5nIGVycm9yISBcIik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzYW1wbGUubG9hZGVkID0gZmFsc2U7XG4gICAgcmVxdWVzdC5zZW5kKCk7XG4gIH1cbn0pO1xuXG5FeHQuZGVmaW5lKCdQbGF5Z3JvdW5kLnZpZXcud2luYW1wLldpbmFtcE1vZGVsJywge1xuICAgIGV4dGVuZDogJ0V4dC5hcHAuVmlld01vZGVsJyxcbiAgICBhbGlhczogJ3ZpZXdtb2RlbC53aW5hbXAtbWFpbicsXG4gICAgZGF0YToge1xuICAgICAgICBuYW1lOiAnUGxheWdyb3VuZCcsXG4gICAgICAgIHRyYWNrOiB1bmRlZmluZWQsXG4gICAgICAgIGFjdHVhbFRyYWNrOiB7fSxcbiAgICAgICAgYWN0dWFsaG1zOiAnMDA6MDA6MDAnXG4gICAgfVxufSk7XG4iLCIvKipcbiAqXG4gKiBAcGFyYW0gbmFtZVxuICogQHBhcmFtIG1haW5Db21wb25lbnRcbiAqIEBwYXJhbSBsb2dpbk5lZWRlZFxuICogQHBhcmFtIGZpbGVcbiAqIEByZXR1cm5zIHt7YXBwOiB1bmRlZmluZWQsIGFwcE1haW5Db21wb25lbnQ6ICosIGFwcE5hbWU6IHN0cmluZywgYXBwTG9naW5OZWVkZWQ6ICosIHN0YXJ0OiAoZnVuY3Rpb24oKTogKiksIGRlZmluZUJhc2VDbGFzczogKGZ1bmN0aW9uKCk6IHZvaWQpLCBsYXVuY2hBcHA6IGxhdW5jaEFwcH19XG4gKi9cbmZ1bmN0aW9uIG11emthdEFwcChuYW1lLCBtYWluQ29tcG9uZW50LCBsb2dpbk5lZWRlZCwgZmlsZSkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgYXBwOiB1bmRlZmluZWQsXG4gICAgICAgIGFwcE5hbWU6ICdtemsnLFxuICAgICAgICBhcHBNYWluQ29tcG9uZW50OiBtYWluQ29tcG9uZW50LFxuICAgICAgICBhcHBMb2dpbk5lZWRlZDogbG9naW5OZWVkZWQsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAgICAgKi9cbiAgICAgICAgbGF1bmNoQXBwOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5FeHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgLy90aGlzLmRlZmluZUJhc2VDbGFzcygpOyAvLyBUT0RPIGFzeW5jICsgc2luZ2xldG9uIEFwaVxuICAgICAgICAgICAgICAgIHRoaXMuYXBwID0gdGhpcy5zdGFydCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFwcDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoJ0ZyYW1ld29yayBpcyBub3QgYXZhaWxhYmxlLiBBcHBsaWNhdGlvbiBjYW5ub3QgYmUgc3RhcnRldC4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBkZWZpbmVCYXNlQ2xhc3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gRXh0LmRlZmluZShtZS5hcHBOYW1lICsgJy5NYWluQXBwbGljYXRpb24nLCB7XG4gICAgICAgICAgICAgICAgZXh0ZW5kOiAnRXh0LmNvbnRhaW5lci5Db250YWluZXInLFxuICAgICAgICAgICAgICAgIGFsaWFzOiAnd2lkZ2V0LicgKyBtZS5hcHBOYW1lICsgJ01haW4nLFxuICAgICAgICAgICAgICAgIGxheW91dDogJ2ZpdCcsXG5cbiAgICAgICAgICAgICAgICByZXF1ZXN0TG9naW46IG1lLmFwcExvZ2luTmVlZGVkLFxuICAgICAgICAgICAgICAgIG1haW5Db21wb25lbnQ6IG1lLmFwcE1haW5Db21wb25lbnQsXG4gICAgICAgICAgICAgICAgYXBwTmFtZTogbWUuYXBwTmFtZSxcblxuICAgICAgICAgICAgICAgIGZpbGVBcnJheTogW10sXG5cbiAgICAgICAgICAgICAgICBpbml0Q29tcG9uZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yZXF1ZXN0TG9naW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zID0gW3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4dHlwZTogJ2NvbnRhaW5lcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaHRtbDogJ2xvZ2luIHJlcXVpcmVkLi4uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm1haW5Db21wb25lbnQgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXMgPSBbe3h0eXBlOiB0aGlzLm1haW5Db21wb25lbnR9XVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbGVBcnJheS5wdXNoKGZpbGUudXJsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtcyA9IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHh0eXBlOiAnYnV0dG9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0OiAnZml0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ011emthdCBGcmFtZSB3YXMgbG9hZGVkIHdpdGhvdXQgbW9kdWxlIE9SIHN1cHBsaWVkIHdpdGggYSBtb2R1bGUgdXJsLidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1zID0gaXRlbXM7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FsbFBhcmVudChhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBjaGFuZ2VDb21wb25lbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkU2NyaXB0cyh0aGlzLmZpbGVBcnJheSkudGhlbihmdW5jdGlvbiAoc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgRXh0LmRlZmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZS5yZW1vdmVBbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZS5hZGQoe3h0eXBlOiBmaWxlLmNtcH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMzAwKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGxvYWRTY3JpcHRzOiBmdW5jdGlvbiAoanNDc3NBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbG9hZGluZ0FycmF5ID0gW10sIG1lID0gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFeHQuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBFeHQuQXJyYXkuZWFjaChqc0Nzc0FycmF5LCBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZGluZ0FycmF5LnB1c2gobWUubG9hZFNjcmlwdCh1cmwpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBFeHQuUHJvbWlzZS5hbGwobG9hZGluZ0FycmF5KS50aGVuKGZ1bmN0aW9uIChzdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhcnRlZmFjdHMgd2VyZSBsb2FkZWQgc3VjY2Vzc2Z1bGx5Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCgnRXJyb3IgZHVyaW5nIGFydGVmYWN0IGxvYWRpbmcuLi4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGxvYWRTY3JpcHQ6IGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFeHQuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBFeHQuTG9hZGVyLmxvYWRTY3JpcHQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh1cmwgKyAnIHdhcyBsb2FkZWQgc3VjY2Vzc2Z1bGx5Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoJ0xvYWRpbmcgd2FzIHN1Y2Nlc3NmdWwnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uRXJyb3I6IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoJ0xvYWRpbmcgd2FzIG5vdCBzdWNjZXNzZnVsIGZvcjogJyArIHVybCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgICAgICovXG4gICAgICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIEV4dC5hcHBsaWNhdGlvbih7XG4gICAgICAgICAgICAgICAgbmFtZTogJ216aycsXG4gICAgICAgICAgICAgICAgbWFpblZpZXc6IHt4dHlwZTogbWUuYXBwTWFpbkNvbXBvbmVudH0sXG4gICAgICAgICAgICAgICAgbGF1bmNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIEV4dC5sb2coJ016ayB3cmFwcGVyIGJvb3RlZCEnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbXV6a2F0QXBwOyIsImNvbnN0IG11emthdEFwcCA9IHJlcXVpcmUoJ211emthdC1leHQtYXBwJyk7XG5sZXQgcHQgPSBuZXcgbXV6a2F0QXBwKCdNdXprYXQgRXh0SlM2IFdpZGdldHMnLCAnYXBwLW1haW4nLCBmYWxzZSk7XG5wdC5sYXVuY2hBcHAoKTsiXX0=
