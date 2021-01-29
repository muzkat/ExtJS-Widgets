Ext.define('devbnz.jsonviewer.components.TextArea', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.devbnzJsonTextArea',

    title: 'Text',
    iconCls: 'fas fa-font',

    layout: 'fit',

    controller: 'devbnzJsonTextAreaController',

    tbar: [{
        iconCls: 'fas fa-paste',
        text: 'Paste',
        handler: 'pasteJson'
    }, {
        iconCls: 'fas fa-copy',
        text: 'Copy'
    }, {
        xtype: 'tbseparator'
    }, {
        text: 'Format',
        iconCls: 'fas fa-file-signature',
        handler: 'formatJson'
    }, {
        text: 'Remove white space',
        iconCls: 'fas fa-edit',
        handler: 'removeWhitespace'
    }, {
        xtype: 'tbseparator'
    }, {
        text: 'Clear',
        iconCls: 'fas fa-eraser',
    }, {
        xtype: 'tbseparator'
    }, {
        text: 'Load JSON Data',
        iconCls: 'fas fa-file',
    }],

    padding: '10 10 10 10',

    items: [
        {
            xtype: 'textareafield',
            emptyText: 'Paste / Load JSON Data',
            grow: true,
            maxLength: 100000000000000000000
        }
    ]
});