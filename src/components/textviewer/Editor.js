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