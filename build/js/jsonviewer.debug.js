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
