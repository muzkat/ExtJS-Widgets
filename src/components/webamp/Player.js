Ext.define('muzkat.player.Player', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.muzkatPlayer',

    border: 0,
    tools: [{
        type: 'close'
    }],

    initComponent: function () {
        this.title = muzkat.player.Util.playerTitle;

        this.items = [{
            xtype: 'panel',
            header: false,
            border: false,
            items: [{
                xtype: 'panel',
                header: false,
                border: false,
                layout: {
                    type: 'column',
                    align: 'left'
                },
                items: [{
                    bind: {
                        title: '{actualhms}'
                    },
                    columnWidth: 0.25
                }, {
                    columnWidth: 0.75,
                    xtype: 'textfield',
                    width: '100%',
                    height: '100%',
                    allowBlank: true,
                    bind: {
                        value: '{actualTrack.title}'
                    }
                }]
            }, {
                xtype: 'panel',
                header: false,
                border: false,
                layout: {
                    type: 'column',
                    align: 'left'
                },
                items: [{
                    title: 'Column 1',
                    columnWidth: 0.25
                }, {
                    columnWidth: 0.55,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [Ext.apply(muzkat.player.Util.getHorizontalSlider(), {
                        itemId: 'volumeSilder',
                        flex: 2
                    }), Ext.apply(muzkat.player.Util.getHorizontalSlider(), {
                        itemId: 'panSlider',
                        value: 0,
                        increment: 1,
                        minValue: -10,
                        maxValue: 10,
                        flex: 1
                    })]
                }, {
                    columnWidth: 0.20,
                    items: [{
                        text: muzkat.player.Util.playerEqBtn,
                        xtype: 'button',
                        cmp: 'eq',
                        handler: (b) => {
                            this.toggleView(b.cmp);
                        }
                    }, {
                        text: muzkat.player.Util.playerPlBtn,
                        xtype: 'button',
                        cmp: 'playlist',
                        handler: (b) => {
                            this.toggleView(b.cmp);
                        }
                    }]
                }]
            }, {
                xtype: 'panel',
                header: false,
                border: false,
                items: [Ext.apply(muzkat.player.Util.getHorizontalSlider(), {
                    width: '100%'
                })]
            }]
        }];
        this.callParent(arguments);
    },

    toggleView: function (cmp) {
        let item = this.main[cmp];
        item.setVisible(!item.isVisible())
    },

    bbar: [{
        iconCls: 'x-fa fa-step-backward', disabled: true
    }, {
        iconCls: 'x-fa fa-play',
        itemId: 'playBtn'
//    handler: 'playSound' // TODO listen to event in controller
    }, {
        iconCls: 'x-fa fa-pause',
        handler: 'stopPlay'
    }, {
        iconCls: 'x-fa fa-stop', disabled: true
    }, {
        iconCls: 'x-fa fa-step-forward', disabled: true
    }, {
        iconCls: 'x-fa fa-eject', disabled: true
    }]

});
