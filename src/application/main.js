Ext.define('Playground.view.main.Main', {
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

        let components = ['mzkJsonViewerMain', 'muzkatMap', 'mzkPiCameraMain', 'bnz-weather', 'bnz-winamp'].map(xtype => {
            var i = {};
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
