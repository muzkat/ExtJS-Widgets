Ext.define('jsonviewer.view.JsonTreeView', {
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

        // var jsonTree = [
        //     {text: 'detention', leaf: true},
        //     {
        //         text: 'homework', expanded: true, children: [
        //             {text: 'book report', leaf: true},
        //             {text: 'algebra', leaf: true}
        //         ]
        //     },
        //     {text: 'buy lottery tickets', leaf: true}
        // ];

        // if (this.jsonTreeConfig) {
        //     jsonTree = this.jsonTreeConfig;
        // }

        this.store = Ext.create('Ext.data.TreeStore', {
            root: {
                expanded: true,
                children: this.jsonData || []
            }
        });

        this.callParent(arguments);
    }
});