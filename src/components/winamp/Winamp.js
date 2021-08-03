Ext.define('muzkat.player.Winamp', {
    extend: 'Ext.panel.Panel',
    xtype: 'bnz-winamp',

    controller: 'winamp-main',

    viewModel: {
        data: {
            name: 'Playground',
            track: undefined,
            actualTrack: {},
            actualhms: '00:00:00'
        }
    },

    title: 'Multimedia Player',
    header: false,
    width: 600,
    height: 'auto',
    border: 0,

    layout: {
        type: 'vbox', align: 'stretch'
    },

    initComponent: function () {

        this.player = Ext.create({
            xtype: 'bnz-player'
        });

        let eqs = [], eqCount = 0;
        while (eqCount <= 12) {
            eqs.push(Ext.apply(muzkat.player.Util.getVerticalSlider(), (eqCount === 0 ? {
                itemId: 'freqSilder'
            } : {})))
            eqCount++
        }

        this.eq = Ext.create({
            xtype: 'panel',
            title: 'WINAMP EQUALIZER',
            tools: [{
                type: 'close'
            }],
            border: 1,
            reference: 'winamp-eq',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            tbar: [{
                text: 'ON'
            }, {
                text: 'AUTO'
            }],
            defaults: {
                // defaults are applied to items, not the container
                //flex: 1
            },
            items: eqs.map((e) => {
                return { // wrap in container for flex - slider extends a cmp !== container
                    xtype: 'container',flex:1,
                    layout: 'center',
                    items: [e]
                }
            })
        });

        this.items = [this.player, this.eq, {
            xtype: 'bnz-winamp-playlist', flex: 1
        }, {
            xtype: 'panel',
            title: muzkat.player.Util.playerTitle + ' MONO MODE',
            items: [{
                /**
                 Balance-Slider Left/Right
                 -> aber ohne ALLES nach links/rechts zu ziehen,
                 sondern den entsprechend anderen Stereokanal
                 auszublenden (->ganz links bedeutet also nur noch
                 linker Speaker ist aktiv, aber auch nur mit
                 Inhalt des linken Stereo-Kanals)
                 */
            }, {
                /*
                     Stereo-Mono-Switch:
                     beide Kanäle werden zu einem Monosignal zusammen
                     gemischt und der Downmix auf einem/beiden
                     Kanälen ausgegeben
                     */
            }, {
                xtype: 'panel',
                title: 'Channel Selektor',
                items: [{
                    xtype: 'segmentedbutton',
                    allowMultiple: false,
                    itemId: 'LeftRight',
                    items: [{
                        text: 'LEFT'
                    }, {
                        text: 'RIGHT',
                    }, {
                        text: 'BOTH',
                    }]
                }, {
                    xtype: 'container',
                    items: [Ext.apply(muzkat.player.Util.getHorizontalSlider(), {
                        itemId: 'balanceSliderLR',
                        width: '100%',
                        value: 0,
                        increment: 1,
                        minValue: -10,
                        maxValue: 10,
                        vertical: false
                    })]
                }, {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [Ext.apply(muzkat.player.Util.getVerticalSlider(), {
                        itemId: 'sliderL',
                        value: 5,
                        increment: 1,
                        minValue: 0,
                        maxValue: 10,
                        vertical: true,
                        height: 100
                    }), Ext.apply(muzkat.player.Util.getVerticalSlider(), {
                        itemId: 'sliderR',
                        value: 5,
                        increment: 1,
                        minValue: 0,
                        maxValue: 10,
                        vertical: true,
                        height: 100
                    })]
                }]
                /*
                Stereo-Signlechanel-Mono-Switch: man kann einen
                Stereo-Kanal auswählen welcher dann ausschließlich
                (dann aber auf beiden Kanälen) ausgegeben wird
                */
            }]
        }];
        this.callParent();
    }
});
