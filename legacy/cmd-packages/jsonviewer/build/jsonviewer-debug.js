Ext.define('jsonviewer.Module', {
    singleton: true
});

Ext.define('jsonviewer.view.JsonTextArea', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.muzkatJsonTextArea',
    title: 'Muzkat Json Online Viewer',
    layout: 'fit',
    // requires: ['sysmon.view.restclient.RestMain'],
    tbar: [
        {
            iconCls: 'x-fa fa-bug',
            text: 'edit',
            handler: function(btn) {
                var field = btn.up('muzkatJsonTextArea').down('textareafield'),
                    jsonString = field.getValue(),
                    jsonObject = Ext.JSON.decode(jsonString, true);
                if (jsonObject !== null) {
                    Ext.log({
                        dump: jsonObject,
                        msg: 'valid Json Obj'
                    });
                    var leaf = btn.up('muzkatJsonTextArea').json2leaf(jsonObject);
                    btn.up('muzkatJsonViewer').down('tabpanel').add({
                        xtype: 'muzkatJsonTreeView',
                        jsonTreeConfig: leaf
                    });
                } else {
                    Ext.log({
                        msg: 'Json Obj not valid'
                    });
                }
            }
        },
        {
            text: 'Copy'
        },
        {
            text: 'Format',
            handler: function(btn) {
                var a = btn.up('muzkatJsonTextArea').down('textareafield');
                var spaceFn = btn.up('muzkatJsonTextArea').space;
                for (var b = a.getValue().replace(/\n/g, " ").replace(/\r/g, " "),
                    e = [],
                    c = 0,
                    d = !1,
                    f = 0,
                    i = b.length; f < i; f++) {
                    var g = b.charAt(f);
                    if (d && g === d)  {
                        b.charAt(f - 1) !== "\\" && (d = !1);
                    }
                    else if (!d && (g === '"' || g === "'"))  {
                        d = g;
                    }
                    else if (!d && (g === " " || g === "\t"))  {
                        g = "";
                    }
                    else if (!d && g === ":")  {
                        g += " ";
                    }
                    else if (!d && g === ",")  {
                        g += "\n" + spaceFn(c * 2);
                    }
                    else if (!d && (g === "[" || g === "{"))  {
                        c++ , g += "\n" + spaceFn(c * 2);
                    }
                    else if (!d && (g === "]" || g === "}"))  {
                        c-- , g = "\n" + spaceFn(c * 2) + g;
                    }
                    
                    e.push(g);
                }
                a.setValue(e.join(""));
            }
        },
        {
            text: 'Remove white space',
            handler: function(btn) {
                var a = btn.up('muzkatJsonTextArea').down('textareafield');
                for (var b = a.getValue().replace(/\n/g, " ").replace(/\r/g, " "),
                    e = [],
                    c = !1,
                    d = 0,
                    f = b.length; d < f; d++) {
                    var i = b.charAt(d);
                    if (c && i === c)  {
                        b.charAt(d - 1) !== "\\" && (c = !1);
                    }
                    else if (!c && (i === '"' || i === "'"))  {
                        c = i;
                    }
                    else if (!c && (i === " " || i === "\t"))  {
                        i = "";
                    }
                    
                    e.push(i);
                }
                a.setValue(e.join(""));
            }
        },
        {
            text: 'Clear'
        },
        {
            text: 'Load JSON Data'
        }
    ],
    space: function(a) {
        var b = [],
            e;
        for (e = 0; e < a; e++) b.push(" ");
        return b.join("");
    },
    initComponent: function() {
        this.items = [
            {
                xtype: 'textareafield',
                grow: true,
                fieldLabel: 'JsonString',
                maxLength: 1.0E20,
                anchor: '100%'
            }
        ];
        this.callParent(arguments);
    },
    json2leaf: function(a) {
        var b = [],
            c;
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
        return b;
    }
});

Ext.define('jsonviewer.view.JsonTreeView', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.muzkatJsonTreeView',
    viewModel: {},
    title: 'Simple Tree',
    rootVisible: false,
    jsonTreeConfig: undefined,
    // set by constructor
    listeners: {
        /*render: function (a) {
            a.getSelectionModel().on("selectionchange", function (a, b) {
                d.gridbuild(b)
            })
        },*/
        cellcontextmenu: function(view, td, cellIndex, record, tr, rowIndex, e, eOpts) {
            e.preventDefault();
            var b = e;
            (new Ext.menu.Menu({
                items: [
                    {
                        text: "Expand",
                        handler: function() {
                            a.expand();
                        }
                    },
                    {
                        text: "Expand all",
                        handler: function() {
                            a.expand(!0);
                        }
                    },
                    "-",
                    {
                        text: "Collapse",
                        handler: function() {
                            a.collapse();
                        }
                    },
                    {
                        text: "Collapse all",
                        handler: function() {
                            a.collapse(!0);
                        }
                    }
                ]
            })).showAt(b.getXY());
        }
    },
    initComponent: function() {
        var jsonTree = [
                {
                    text: 'detention',
                    leaf: true
                },
                {
                    text: 'homework',
                    expanded: true,
                    children: [
                        {
                            text: 'book report',
                            leaf: true
                        },
                        {
                            text: 'algebra',
                            leaf: true
                        }
                    ]
                },
                {
                    text: 'buy lottery tickets',
                    leaf: true
                }
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

Ext.define('jsonviewer.view.Main', {
    extend: 'Ext.container.Container',
    alias: 'widget.muzkatJsonViewer',
    layout: 'fit',
    initComponent: function() {
        this.items = [
            {
                xtype: 'tabpanel',
                items: [
                    {
                        xtype: 'muzkatJsonTreeView'
                    },
                    {
                        xtype: 'muzkatJsonTextArea'
                    }
                ]
            }
        ];
        this.callParent(arguments);
    }
});

