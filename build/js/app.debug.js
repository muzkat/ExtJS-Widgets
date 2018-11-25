Ext.define('Playground.view.main.Main', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.app-main',

    titleRotation: 0,
    tabRotation: 0,

    defaults: {
        xtype: 'panel',
        layout: 'center'
    },

    items: [],

    initComponent: function () {

        var cmpDefinitions = [{
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
                xtype: 'devbnzJsonMain', height: 600, width: 800
            }]
        }];

        var me = this;
        Ext.Array.each(cmpDefinitions, function (o) {
            me.items.push(o);
        });

        me.callParent(arguments);
    }
});
