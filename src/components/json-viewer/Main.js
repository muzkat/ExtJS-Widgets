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