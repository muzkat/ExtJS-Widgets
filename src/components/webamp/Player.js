Ext.define('muzkat.player.Player', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.muzkatPlayer',

    border: 0,
    tools: [{
        type: 'close'
    }],

    // audio vars
    audioContext: undefined,
    source: undefined,
    gainNode: undefined,

    panNode: undefined,
    splitter: undefined,
    gainL: undefined,
    gainR: undefined,
    merger: undefined,
    balL: undefined,
    balR: undefined,

    mainFilter: undefined,

    initComponent: function () {
        this.title = muzkat.player.Util.playerTitle;

        this.items = [{
            xtype: 'container',
            items: [{
                xtype: 'container',
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
                xtype: 'container',
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
                        listeners: {
                            change: this.setVolume.bind(this)
                        },
                        flex: 2
                    }), Ext.apply(muzkat.player.Util.getHorizontalSlider(), {
                        itemId: 'panSlider',
                        value: 0,
                        increment: 1,
                        minValue: -10,
                        maxValue: 10,
                        flex: 1,
                        listeners: {
                            change: this.setPan.bind(this)
                        }
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
                xtype: 'container',
                items: [Ext.apply(muzkat.player.Util.getHorizontalSlider(), {
                    width: '100%'
                })]
            }]
        }];

        this.bbar = [{
            iconCls: 'x-fa fa-step-backward', disabled: true
        }, {
            iconCls: 'x-fa fa-play',
            itemId: 'playBtn',
            handler: (b) => {
                this.playSound();
            }
        }, {
            iconCls: 'x-fa fa-pause',
            handler: 'stopPlay'
        }, {
            iconCls: 'x-fa fa-stop', disabled: true
        }, {
            iconCls: 'x-fa fa-step-forward', disabled: true
        }, {
            iconCls: 'x-fa fa-eject', disabled: true
        }];

        this.callParent(arguments);
    },

    toggleView: function (cmp) {
        let item = this.main[cmp];
        item.setVisible(!item.isVisible())
    },

    initAudio: function () {
        this.audioContext = new AudioContext(),
            this.gainR = this.audioContext.createGain(),
            this.gainL = this.audioContext.createGain(),
            this.balR = this.audioContext.createGain(),
            this.balL = this.audioContext.createGain(),
            this.gainNode = this.audioContext.createGain(),
            this.merger = this.audioContext.createChannelMerger(2),
            this.mainFilter = this.audioContext.createBiquadFilter(),
            this.panNode = this.audioContext.createStereoPanner(),
            this.splitter = this.audioContext.createChannelSplitter(2);


        this.gainNode.gain.value = 0.5;

        this.gainR.gain.value = 0.5;
        this.gainL.gain.value = 0.5;

        this.balR.gain.value = 1;
        this.balL.gain.value = 1;

        this.gainNode.connect(this.audioContext.destination);

        this.mainFilter.type = 'lowpass';
        this.mainFilter.frequency.value = 100;

        this.mainFilter.connect(this.panNode);
        this.panNode.connect(this.gainNode);

        Ext.Loader.loadScript({
            url: 'https://connect.soundcloud.com/sdk/sdk-3.0.0.js',
            onLoad: () => {
                SC.initialize({
                    client_id: '40493f5d7f709a9881675e26c824b136'
                });
                this.updatePlaylist(muzkat.player.Util.initialPlaylist);
            },
            onError: function () {
            }
        });
    },

    updatePlaylist: function (playlistPath) {
        return SC.get(playlistPath).then((tracks) => {
            let s = this.main.playlist.store;
            s.removeAll();
            s.add((tracks || []));
        });
    },

    defaultRouting: function () {
        this.merger.disconnect();
        this.splitter.disconnect();
        this.mainFilter.connect(this.panNode);
        this.panNode.connect(this.gainNode);
        /*
        this.mainFilter.connect(this.splitter);


        this.splitter.connect(this.gainL, 0);
        this.splitter.connect(this.gainR, 1);
        this.gainL.connect(this.merger, 0, 0);
        this.gainR.connect(this.merger, 0, 1);

        this.merger.connect(this.gainNode);
        */
    },

    detachDefaultRouting: function () {
        this.mainFilter.disconnect();
        this.panNode.disconnect();
        this.mainFilter.connect(this.splitter);


        this.splitter.connect(this.gainL, 0);
        this.splitter.connect(this.gainR, 1);
        this.gainL.connect(this.balL);
        this.gainR.connect(this.balR);
        this.balL.connect(this.merger, 0, 0)
        this.balR.connect(this.merger, 0, 1)

        this.merger.connect(this.gainNode);
    },

    changeBalance: function (cmp, x, y, eOpts) {
        this.detachDefaultRouting();
        if (x > 0) {
            this.setLeftGain(0, 10 - x)
        }
        if (x < 0) {
            x = Math.abs(x);
            this.setRightGain(0, 10 - x);
        }
    },

    setLeftGain: function (cmp, x, y, eOpts) {
        this.detachDefaultRouting();
        this.gainL.gain.value = x / 10;
    },

    setRightGain: function (cmp, x, y, eOpts) {
        this.detachDefaultRouting();
        this.gainR.gain.value = x / 10;
    },

    separateChannel: function (container, button, pressed) {
        this.detachDefaultRouting();
        if (button.text === 'LEFT') {
            this.gainL.gain.value = 1.0;
            this.gainR.gain.value = 0.0;
        }
        if (button.text === 'RIGHT') {
            this.gainL.gain.value = 0.0;
            this.gainR.gain.value = 1.0;
        }
        if (button.text === 'BOTH') {
            this.gainL.gain.value = 1.0;
            this.gainR.gain.value = 1.0;
        }
    },

    setPan: function (cmp, x, y, eOpts) {
        this.defaultRouting();
        this.panNode.pan.value = x / 10;
    },

    setActualTrack: function (TrackInfo) {
        this.stopPlay();
        this.main.getViewModel().set("actualTrack", TrackInfo);
        this.main.getViewModel().set("actualhms", muzkat.player.Util.createhmsString(TrackInfo.duration));
        this.getData(TrackInfo.stream_url);
    },

    onSliderMove: function (cmp, x, y, eOpts) {
        Ext.log({dump: cmp});
        Ext.log({dump: x});
        Ext.log({dump: y});
        Ext.log({dump: eOpts});
    },

    setVolume: function (cmp, x) {
        this.gainNode.gain.value = x / 100;
    },

    setMainFilter: function (cmp, x, y, eOpts) {
        this.mainFilter.frequency.value = x;
    },

    volumeReset: function () {
        this.gainNode.gain.value = 0.5;
    },

    stopPlay: function () {
        if (this.source) this.source.stop();
    },

    playSound: function () {
        if (this.source) {
            this.source.stop();
            var actualSound = this.main.getViewModel().get("actualTrack");
            this.getData(actualSound.stream_url);
            return;
        }
        this.soundcloud();
    },

    soundcloud: function () {
        SC.get('/resolve', {
            url: muzkat.player.Util.welcomeTrack
        }).then((sound) => {
            this.main.getViewModel().set("actualTrack", sound);
            this.main.getViewModel().set("actualhms", Playground.view.webamp.Util.createhmsString(sound.duration));
            this.getData(sound.stream_url);
        });
    },

    getData: function (sample) {
        this.source = this.audioContext.createBufferSource();
        this.source.connect(this.mainFilter);
        fetch((sample + '?client_id=' + this.main.clientId))
            .then((response) => {
                return response.arrayBuffer();
            }).then((buffer) => {
            this.audioContext.decodeAudioData(buffer).then((decodedBuffer) => {
                console.log('sample loaded:' + sample);
                this.source.buffer = decodedBuffer;
                this.source.start();
            }).catch((e) => {
                console.log('decode error');
            })
        })
    }
});
