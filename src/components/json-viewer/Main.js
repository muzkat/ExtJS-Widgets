Ext.define('mzk.jsonViewer.main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mzkJsonViewerMain',

    layout: 'fit',
    header: false,

    initComponent: function () {
        var defaults = {
            mainView: this
        };

        this.treePanel = Ext.create(Ext.apply({}, {xtype: 'muzkatJsonTreeView'}, defaults));
        this.editorPanel = Ext.create(Ext.apply({}, {xtype: 'muzkatJsonTextArea'}, defaults));
        this.tabPanel = Ext.create({xtype: 'tabpanel', items: [this.treePanel, this.editorPanel]});
        this.tabPanel.setActiveTab(this.editorPanel);

        this.items = [
            this.tabPanel
        ];

        this.callParent(arguments);
    }
});