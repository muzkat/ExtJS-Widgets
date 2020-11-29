/**
 * Created by bnz on 25.06.17.
 */
if (typeof Range !== "undefined" && !Range.prototype.createContextualFragment) Range.prototype.createContextualFragment = function (a) {
    var b = document.createDocumentFragment(), e = document.createElement("div");
    b.appendChild(e);
    e.outerHTML = a;
    return b
};
Ext.override(Ext.tree.TreeNode, {
    removeAllChildren: function () {
        for (; this.hasChildNodes();)this.removeChild(this.firstChild);
        return this
    }, setIcon: function (a) {
        this.getUI().setIcon(a)
    }, setIconCls: function (a) {
        this.getUI().setIconCls(a)
    }
});
Ext.override(Ext.tree.TreeNodeUI, {
    setIconCls: function (a) {
        this.iconNode && Ext.fly(this.iconNode).replaceClass(this.node.attributes.iconCls, a);
        this.node.attributes.iconCls = a
    }, setIcon: function (a) {
        if (this.iconNode) this.iconNode.src = a || this.emptyIcon, Ext.fly(this.iconNode)[a ? "addClass" : "removeClass"]("x-tree-node-inline-icon");
        this.node.attributes.icon = a
    }
});
Ext.override(Ext.Panel, {
    hideBbar: function () {
        this.bbar && (this.bbar.setVisibilityMode(Ext.Element.DISPLAY), this.bbar.hide(), this.getBottomToolbar().hide(), this.syncSize(), this.ownerCt && this.ownerCt.doLayout())
    }, showBbar: function () {
        this.bbar && (this.bbar.setVisibilityMode(Ext.Element.DISPLAY), this.bbar.show(), this.getBottomToolbar().show(), this.syncSize(), this.ownerCt && this.ownerCt.doLayout())
    }
});
Ext.ux.iconCls = function () {
    var a = {};
    Ext.util.CSS.createStyleSheet("/* Ext.ux.iconCls */", "styleSheetIconCls");
    return {
        get: function (b) {
            if (!b)return null;
            if (typeof a[b] === "undefined") {
                a[b] = "icon_" + Ext.id();
                var e = "\n." + a[b] + " { background-image: url(" + b + ") !important; }";
                Ext.isIE ? document.styleSheets.styleSheetIconCls.cssText += e : Ext.get("styleSheetIconCls").dom.sheet.insertRule(e, 0)
            }
            return a[b]
        }
    }
}();
Ext.getBody().on("contextmenu", function (a) {
    a.preventDefault()
});
String.space = function (a) {
    var b = [], e;
    for (e = 0; e < a; e++)b.push(" ");
    return b.join("")
};
function aboutWindow() {
    var a = [];
    Ext.getBody().select("div.tab").each(function (b) {
        a.push({
            title: b.select("h2").first().dom.innerHTML,
            html: b.select("div").first().dom.innerHTML.replace("{gabor}", '<a href="mailto:turi.gabor@gmail.com">Gabor Turi</a>')
        })
    });
    (new Ext.Window({
        title: document.title,
        width: 640,
        height: 400,
        modal: !0,
        layout: "fit",
        items: new Ext.TabPanel({defaults: {autoScroll: !0, bodyStyle: "padding: 5px;"}, activeTab: 0, items: a})
    })).show()
}
Ext.onReady(function () {
    var a = function () {
        var a = null;
        return {
            init: function () {
                a = new Ext.Window({
                    title: document.title,
                    width: 400,
                    minWidth: 400,
                    height: 100,
                    minHeight: 100,
                    maxHeight: 100,
                    layout: "form",
                    closeAction: "hide",
                    bodyStyle: "padding: 0",
                    border: !1,
                    labelWidth: 25,
                    items: {xtype: "textfield", fieldLabel: "Url", value: "http://", width: 350},
                    buttonAlign: "center",
                    buttons: [{
                        text: "Load JSON data!", handler: function () {
                            d.loadJson(a.items.get(0).getValue());
                            a.hide()
                        }
                    }],
                    listeners: {
                        resize: function (a, b) {
                            a.items.get(0).setWidth(b -
                                50)
                        }
                    }
                })
            }, show: function () {
                a || this.init();
                a.show()
            }
        }
    }();
    Ext.BLANK_IMAGE_URL = "extjs/images/default/s.gif";
    Ext.QuickTips.init();
    var b = new Ext.KeyMap(document, [{
        key: Ext.EventObject.F, ctrl: !0, stopEvent: !0, fn: function () {
            d.ctrlF()
        }
    }, {
        key: Ext.EventObject.H, ctrl: !0, stopEvent: !0, fn: function () {
            d.hideToolbar()
        }
    }]);
    b.disable();
    var e = {
            xtype: "propertygrid",
            id: "grid",
            region: "east",
            width: 300,
            split: !0,
            listeners: {
                beforeedit: function () {
                    return !1
                }
            },
            selModel: new Ext.grid.RowSelectionModel,
            onRender: Ext.grid.PropertyGrid.superclass.onRender
        },
        e = {
            id: "viewerPanel", layout: "border", title: "Viewer", items: [{
                id: "tree",
                xtype: "treepanel",
                region: "center",
                loader: new Ext.tree.TreeLoader,
                lines: !0,
                root: new Ext.tree.TreeNode({text: "JSON"}),
                autoScroll: !0,
                trackMouseOver: !1,
                listeners: {
                    render: function (a) {
                        a.getSelectionModel().on("selectionchange", function (a, b) {
                            d.gridbuild(b)
                        })
                    }, contextmenu: function (a, b) {
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
                bbar: ["Search:", new Ext.form.TextField({
                    xtype: "textfield",
                    id: "searchTextField"
                }), new Ext.Button({
                    text: "GO!", handler: function () {
                        d.searchStart()
                    }
                }), new Ext.form.Label({
                    id: "searchResultLabel",
                    style: "padding-left:10px;font-weight:bold"
                }), {
                    iconCls: Ext.ux.iconCls.get("arrow_down.png"), text: "Next", handler: function () {
                        d.searchNext()
                    }
                }, {
                    iconCls: Ext.ux.iconCls.get("arrow_up.png"), text: "Previous", handler: function () {
                        d.searchPrevious()
                    }
                }]
            },
                e]
        };
    new Ext.Viewport({
        layout: "fit", items: [{
            xtype: "tabpanel", items: [e, {
                id: "textPanel", layout: "fit", title: "Text", tbar: [{
                    text: "Paste", handler: function () {
                        d.pasteText()
                    }
                }, {
                    text: "Copy", handler: function () {
                        d.copyText()
                    }
                }, "-", {
                    text: "Format", handler: function () {
                        d.format()
                    }
                }, {
                    text: "Remove white space", handler: function () {
                        d.removeWhiteSpace()
                    }
                }, "-", {
                    text: "Clear", handler: function () {
                        d.clearText()
                    }
                }, "-", {
                    text: "Load JSON data", handler: function () {
                        a.show()
                    }
                }, "->", {text: "About", handler: aboutWindow}], items: {
                    id: "edit",
                    xtype: "textarea", style: "font-family:monospace", emptyText: "Copy here the JSON variable!"
                }
            }], activeTab: "textPanel", listeners: {
                beforetabchange: function (a, b) {
                    if (b.id === "viewerPanel")return d.check()
                }, tabchange: function (a, d) {
                    d.id === "viewerPanel" ? b.enable() : b.disable()
                }
            }
        }]
    });
    var d = function () {
        var a = Ext.getCmp("edit"),
            b = Ext.getCmp("tree"),
            e = b.getRootNode(),
            p = Ext.getCmp("grid"),
            k = Ext.getCmp("searchTextField"),
            n = Ext.getCmp("searchResultLabel"),
            l = {},
            o = null,
            m = null,
            f = null,
            j = null;
        return {
            check: function () {
                var h =
                    a.getValue().replace(/\n/g, " ").replace(/\r/g, " ");
                try {
                    l = Ext.util.JSON.decode(h)
                } catch (b) {
                    return Ext.MessageBox.show({
                        title: "JSON error",
                        msg: "Invalid JSON variable",
                        icon: Ext.MessageBox.ERROR,
                        buttons: Ext.MessageBox.OK,
                        closable: !1
                    }), !1
                }
                o !== h && (o = h, this.treebuild())
            }, treebuild: function () {
                e.removeAllChildren();
                e.appendChild(this.json2leaf(l));
                e.setIcon(Ext.isArray(l) ? "array.gif" : "object.gif");
                this.gridbuild(e);
                e.expand.defer(50, e, [!1, !1])
            }, gridbuild: function (h) {
                if (h.isLeaf()) h = h.parentNode;
                h.childNodes.length ||
                (h.expand(!1, !1), h.collapse(!1, !1));
                for (var a = {}, c = 0; c < h.childNodes.length; c++) {
                    var b = h.childNodes[c].text.indexOf(":");
                    b === -1 ? a[h.childNodes[c].text] = "..." : a[h.childNodes[c].text.substring(0, b)] = h.childNodes[c].text.substring(b + 1)
                }
                p.setSource(a)
            }, json2leaf: function (a) {
                var b = [], c;
                for (c in a)a.hasOwnProperty(c) && (a[c] === null ? b.push({
                        text: c + " : null",
                        leaf: !0,
                        icon: "red.gif"
                    }) : typeof a[c] === "string" ? b.push({
                            text: c + ' : "' + a[c] + '"',
                            leaf: !0,
                            icon: "blue.gif"
                        }) : typeof a[c] === "number" ? b.push({
                                text: c + " : " + a[c],
                                leaf: !0, icon: "green.gif"
                            }) : typeof a[c] === "boolean" ? b.push({
                                    text: c + " : " + (a[c] ? "true" : "false"),
                                    leaf: !0,
                                    icon: "yellow.gif"
                                }) : typeof a[c] === "object" ? b.push({
                                        text: c,
                                        children: this.json2leaf(a[c]),
                                        icon: Ext.isArray(a[c]) ? "array.gif" : "object.gif"
                                    }) : typeof a[c] === "function" && b.push({
                                        text: c + " : function",
                                        leaf: !0,
                                        icon: "red.gif"
                                    }));
                return b
            }, copyText: function () {
                a.getValue() && Ext.ux.Clipboard.set(a.getValue())
            }, pasteText: function () {
                a.setValue(Ext.ux.Clipboard.get())
            }, clearText: function () {
                a.reset();
                a.focus(null,
                    !0)
            }, searchStart: function () {
                m || (m = new Ext.util.DelayedTask(this.searchFn, this));
                m.delay(150)
            }, searchFn: function () {
                f = [];
                k.getValue() && (this.searchInNode(e, k.getValue()), f.length ? (n.setText(""), j = 0, this.selectNode(f[j]), k.focus()) : n.setText("Phrase not found!"))
            }, searchInNode: function (a, b) {
                a.text.toUpperCase().indexOf(b.toUpperCase()) !== -1 && f.push(a);
                var c = a.isExpanded();
                a.expand(!1, !1);
                for (var e = 0; e < a.childNodes.length; e++)this.searchInNode(a.childNodes[e], b);
                c || a.collapse(!1, !1)
            }, selectNode: function (a) {
                a.select();
                for (b.fireEvent("click", a); a !== e;)a = a.parentNode, a.expand(!1, !1)
            }, searchNext: function () {
                f && f.length && (j = (j + 1) % f.length, this.selectNode(f[j]))
            }, searchPrevious: function () {
                f && f.length && (j = (j - 1 + f.length) % f.length, this.selectNode(f[j]))
            }, ctrlF: function () {
                b.getBottomToolbar().isVisible() || b.showBbar();
                k.focus(!0)
            }, hideToolbar: function () {
                b.hideBbar()
            }, format: function () {
                for (var b = a.getValue().replace(/\n/g, " ").replace(/\r/g, " "), e = [], c = 0, d = !1, f = 0, i = b.length; f < i; f++) {
                    var g = b.charAt(f);
                    if (d && g === d) b.charAt(f -
                        1) !== "\\" && (d = !1); else if (!d && (g === '"' || g === "'")) d = g; else if (!d && (g === " " || g === "\t")) g = ""; else if (!d && g === ":") g += " "; else if (!d && g === ",") g += "\n" + String.space(c * 2); else if (!d && (g === "[" || g === "{")) c++, g += "\n" + String.space(c * 2); else if (!d && (g === "]" || g === "}")) c--, g = "\n" + String.space(c * 2) + g;
                    e.push(g)
                }
                a.setValue(e.join(""))
            }, removeWhiteSpace: function () {
                for (var b = a.getValue().replace(/\n/g, " ").replace(/\r/g, " "), e = [], c = !1, d = 0, f = b.length; d < f; d++) {
                    var i = b.charAt(d);
                    if (c && i === c) b.charAt(d - 1) !== "\\" && (c = !1);
                    else if (!c && (i === '"' || i === "'")) c = i; else if (!c && (i === " " || i === "\t")) i = "";
                    e.push(i)
                }
                a.setValue(e.join(""))
            }, loadJson: function (a) {
                if (document.location.hash !== "#" + a) document.location.hash = a;
                Ext.getBody().mask("Loading url: " + a, "x-mask-loading");
                Ext.Ajax.request({
                    url: "readjson.php", params: {url: a}, success: function (a) {
                        Ext.getCmp("edit").setValue(a.responseText);
                        d.format();
                        Ext.getBody().unmask()
                    }, failure: function (a) {
                        Ext.Msg.alert("Error", a.responseText);
                        Ext.getBody().unmask()
                    }
                })
            }
        }
    }();
    document.location.hash &&
    document.location.hash.length && d.loadJson(document.location.hash.substring(1))
});