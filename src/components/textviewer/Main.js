Ext.define('mzk.textviewer.Main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mzkJsonViewerMain',

    layout: 'fit',
    header: false,

    initComponent: function () {
        var defaults = {
            mainView: this,
            padding: '5 5 5 5'
        };

        this.treePanel = Ext.create(Ext.apply({xtype: 'muzkatJsonTreeView'}, defaults));
        this.editorPanel = Ext.create(Ext.apply({xtype: 'muzkatJsonTextArea'}, defaults));
        this.tabPanel = Ext.create({xtype: 'tabpanel', items: [this.treePanel, this.editorPanel]});
        this.tabPanel.setActiveTab(this.editorPanel);

        this.items = [
            this.tabPanel
        ];

        this.callParent(arguments);
    },

    prettifyXml: function (sourceXml) {
        var xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');

        var xsltDoc = new DOMParser().parseFromString([
            '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
            '  <xsl:output omit-xml-declaration="yes" indent="yes"/>',
            '    <xsl:template match="node()|@*">',
            '      <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
            '    </xsl:template>',
            '</xsl:stylesheet>',
        ].join('\n'), 'application/xml');

        var xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsltDoc);
        var resultDoc = xsltProcessor.transformToDocument(xmlDoc);
        return new XMLSerializer().serializeToString(resultDoc);
    }
});