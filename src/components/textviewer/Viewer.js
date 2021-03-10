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