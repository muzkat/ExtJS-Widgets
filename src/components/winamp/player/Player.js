Ext.define('Playground.view.winamp.player.Player', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.bnz-player',

    border: 0,
    reference: 'winamp-player',
    tools: [{
        type: 'close'
    }],

    initComponent: function () {
        this.title = Playground.view.winamp.assets.Strings.playerTitle;

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
                    items: [{
                        xtype: 'bnz-hslider',
                        itemId: 'volumeSilder',
                        flex: 2
                    }, {
                        xtype: 'bnz-hslider',
                        itemId: 'panSlider',
                        value: 0,
                        increment: 1,
                        minValue: -10,
                        maxValue: 10,
                        flex: 1
                    }]
                }, {
                    columnWidth: 0.20,
                    items: [{
                        text: Playground.view.winamp.assets.Strings.playerEqBtn,
                        xtype: 'button',
                        itemId: 'eq'
                    }, {
                        text: Playground.view.winamp.assets.Strings.playerPlBtn,
                        xtype: 'button',
                        itemId: 'pl'
                    }]
                }]
            }, {
                xtype: 'panel',
                header: false,
                border: false,
                items: [{
                    xtype: 'bnz-hslider',
                    width: '100%'
                }]
            }]
        }];

        this.callParent(arguments);
    },

    bbar: [{
        iconCls: 'x-fa fa-step-backward'
    }, {
        iconCls: 'x-fa fa-play',
        itemId: 'playBtn'
//    handler: 'playSound' // TODO listen to event in controller
    }, {
        iconCls: 'x-fa fa-pause',
        handler: 'stopPlay'
    }, {
        iconCls: 'x-fa fa-stop'
    }, {
        iconCls: 'x-fa fa-step-forward'
    }, {
        iconCls: 'x-fa fa-eject'
    }]

});
