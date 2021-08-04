Ext.define('muzkat.player.webamp', {
    extend: 'Ext.panel.Panel',
    xtype: 'muzkatWebamp',

    controller: 'webamp-main',

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
            xtype: 'muzkatPlayer'
        });

        let eqs = [], eqCount = 0;
        while (eqCount <= 12) {
            eqs.push(Ext.apply(muzkat.player.Util.getVerticalSlider(), (eqCount === 0 ? {
                itemId: 'freqSilder'
            } : {
                eqRangeButton: eqCount
            })))
            eqCount++
        }

        this.eq = Ext.create({
            xtype: 'panel',
            title: 'webamp EQUALIZER',
            tools: [{
                type: 'close'
            }],
            border: 1,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            tbar: [{
                text: 'ON', disabled: true
            }, {
                text: 'AUTO', disabled: true
            }, {
                xtype: 'tbfill'
            }, {
                text: 'LEFT', disabled: true
            }, {
                text: 'RIGHT', disabled: true
            }, {
                text: 'BOTH', disabled: true
            }],
            items: eqs.map((e) => {
                return { // wrap in container for flex - slider extends a cmp !== container
                    xtype: 'container', flex: 1,
                    layout: 'center',
                    items: [e]
                }
            })
        });

        this.playlist = Ext.create({
            xtype: 'bnz-webamp-playlist', flex: 1
        })

        this.items = [this.player, this.eq, this.playlist];
        this.callParent();
    }
});
