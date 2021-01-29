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