Ext.define('Playground.view.winamp.assets.Strings', {
  singleton: true,

  playerTitle: 'WEBAMP',
  playerEqBtn: 'EQ',
  playerPlBtn: 'PL',
  playlistTitle: 'PLAYLIST'

});

Ext.define('Playground.view.winamp.player.Player', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.bnz-player',

  title: Playground.view.winamp.assets.Strings.playerTitle,
  border: 0,
  reference: 'winamp-player',
  tools: [{
      type: 'close'
  }],

  items: [{
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
  }],


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

Ext.define('Playground.view.winamp.playlist.Playlist', {
  extend: 'Ext.grid.Panel',
  alias: 'widget.bnz-winamp-playlist',

  title: Playground.view.winamp.assets.Strings.playerTitle+ ' ' + Playground.view.winamp.assets.Strings.playlistTitle,
  border: 1,
  reference: 'winamp-playlist',
  tools: [{
      type: 'close'
  }],
  layout: {
    type: 'fit'
  },
  store: undefined,

  viewConfig: {
    plugins: {
      ptype: 'gridviewdragdrop',
      dragText: 'Drag and drop to reorganize'
    }
  },
  hideHeaders: true,
  columns: [{
    xtype: 'rownumberer'
  }, {
    dataIndex: 'title',
    flex: 1
  }, {
    dataIndex: 'duration',
    renderer: function(value, meta, record) {
      return Playground.view.winamp.Util.createhmsString(value);
    }
  }],

  bbar: [{
    text: 'ADD',
    menu: [{
      text: 'ADD URL'
    },{
      text: 'ADD LIST'
    },{
      text: 'ADD FILE'
    }]
  }, {
    text: 'REM'
  }, {
    text: 'SEL'
  }, {
    text: 'MISC'
  }],

  initComponent: function() {

    this.store = Ext.create('Ext.data.Store', {
      storeId: 'playList',
      fields: ['id', 'title', 'user', 'duration']
    });
    this.callParent();
  }
});

Ext.define('Playground.view.winamp.slider.Hslider', {
  extend: 'Ext.slider.Single',
  alias: 'widget.bnz-hslider',

  value: 50,
  increment: 10,
  minValue: 0,
  maxValue: 100,
  vertical: false
});

Ext.define('Playground.view.winamp.slider.Vslider', {
  extend: 'Ext.slider.Single',
  alias: 'widget.bnz-winampslider',

  value: 100,
  increment: 100,
  minValue: 0,
  maxValue: 5000,
  vertical: true,
  height: 100
});

Ext.define('Playground.view.winamp.Util', {
  singleton: true,

  welcomeTrack: 'https://soundcloud.com/bnzlovesyou/daktari-preview',
  initialPlaylist: '/users/1672444/tracks',

  // create duration h-m-s string from milliseconds
  createhmsString: function(milli) {
    var hours = Math.floor(milli / 36e5),
      mins = Math.floor((milli % 36e5) / 6e4),
      secs = Math.floor((milli % 6e4) / 1000);
    var hmsString = this.pad(hours) + ':' + this.pad(mins) + ':' + this.pad(secs);
    return hmsString;
  },

  // add leading zeros
  pad: function(number, size) {
    var s = String(number);
    while (s.length < (size || 2)) {
      s = "0" + s;
    }
    return s;
  }

});

Ext.define('Playground.view.winamp.Winamp', {
  extend: 'Ext.panel.Panel',
  xtype: 'bnz-winamp',

  controller: 'winamp-main',
  viewModel: 'winamp-main',

  title: 'Multimedia Player',
  header: false,
  width: 600,
  height: 'auto',
  border: 0,
  items: [{
    xtype: 'bnz-player'
  }, {
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
    items: [{
      xtype: 'bnz-winampslider',
      itemId: 'freqSilder'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }]
  }, {
    xtype: 'bnz-winamp-playlist'
  }, {
    xtype: 'panel',
    title: Playground.view.winamp.assets.Strings.playerTitle + ' MONO MODE',
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
          items: [{
            xtype: 'bnz-hslider',
            itemId: 'balanceSliderLR',
            width: '100%',
            value: 0,
            increment: 1,
            minValue: -10,
            maxValue: 10,
            vertical: false
          }]
        },{
          xtype: 'container',
          layout: {
            type: 'hbox',
            align: 'stretch'
          },
          items: [{
            xtype: 'bnz-winampslider',
            itemId: 'sliderL',
            value: 5,
            increment: 1,
            minValue: 0,
            maxValue: 10,
            vertical: true,
            height: 100
          }, {
            xtype: 'bnz-winampslider',
            itemId: 'sliderR',
            value: 5,
            increment: 1,
            minValue: 0,
            maxValue: 10,
            vertical: true,
            height: 100
          }]
        }]
        /*
        Stereo-Signlechanel-Mono-Switch: man kann einen
        Stereo-Kanal auswählen welcher dann ausschließlich
        (dann aber auf beiden Kanälen) ausgegeben wird
        */
    }]
  }],

  initComponent: function() {
    this.callParent();
  }
});

Ext.define('Playground.view.winamp.WinampController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.winamp-main',

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

  control: {
    tool: {
      click: 'onCloseClick'
    },
    'bnz-winampslider': {
      change: 'onSliderMove'
    },
    '#playBtn': {
      click: 'playSound'
    },
    '#volumeSilder': {
      change: 'setVolume'
    },
    '#panSlider': {
      change: 'setPan'
    },
    '#freqSilder': {
      change: 'setMainFilter'
    },
    '#pl': {
      click: 'showHide'
    },
    '#eq': {
      click: 'showHide'
    },
    '#LeftRight': {
      toggle: 'separateChannel'
    },
    '#sliderL': {
      change: 'setLeftGain'
    },
    '#sliderR': {
      change: 'setRightGain'
    },
    '#balanceSliderLR':{
      change: 'changeBalance'
    },
    grid: {
      itemdblclick: 'onItemClick'
    }
  },

  onCloseClick: function(tool, e, owner, eOpts) {
    if (!(owner.reference === 'winamp-player')) {
      owner.hide();
    }

  },

  defaultRouting: function(){
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

  detachDefaultRouting: function(){
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

  changeBalance: function(cmp, x, y, eOpts){
    this.detachDefaultRouting();
   if (x >0 )
   {this.setLeftGain(0, 10-x)}
   if (x < 0)
   { x = Math.abs(x);
     this.setRightGain(0, 10-x);
   }
  },

  setLeftGain: function(cmp, x, y, eOpts) {
    this.detachDefaultRouting();
    this.gainL.gain.value = x / 10;
  },

  setRightGain: function(cmp, x, y, eOpts) {
    this.detachDefaultRouting();
    this.gainR.gain.value = x / 10;
  },

  separateChannel: function(container, button, pressed) {
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

  //TODO refactoring needed
  showHide: function(cmp) {
    if (cmp.itemId === 'eq') {
      eq = this.lookupReference('winamp-eq')
      if (eq.hidden) {
        eq.show();
      } else {
        eq.hide();
      }
    }
    if (cmp.itemId === 'pl') {
      pl = this.lookupReference('winamp-playlist')
      if (pl.hidden) {
        pl.show();
      } else {
        pl.hide();
      }
    }
  },

  onItemClick: function(view, record, item, index, e, eOpts) {
    me = this;
    me.setActualTrack(record.data);
  },

  setPan: function(cmp, x, y, eOpts) {
    this.defaultRouting();
    this.panNode.pan.value = x / 10;
  },

  setActualTrack: function(TrackInfo) {
    if (this.source != undefined) {
      this.source.stop();
    }
    me.getView().getViewModel().set("actualTrack", TrackInfo);
    me.getView().getViewModel().set("actualhms", Playground.view.winamp.Util.createhmsString(TrackInfo.duration));
    this.getData(TrackInfo.stream_url);
  },

  onSliderMove: function(cmp, x, y, eOpts) {
    Ext.log({dump: cmp });
    Ext.log({dump: x});
    Ext.log({dump: y});
    Ext.log({dump: eOpts});
  },

  setVolume: function(cmp, x, y, eOpts) {
    this.gainNode.gain.value = x / 100;
  },

  setMainFilter: function(cmp, x, y, eOpts) {
    this.mainFilter.frequency.value = x;
  },

  volumeReset: function() {
    this.gainNode.gain.value = 0.5;
  },

  init: function(view) {
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


    //  this.splitter.connect(this.merger, 1, 0);

    this.mainFilter.connect(this.panNode);
    this.panNode.connect(this.gainNode);
    //    this.gainR.connect(this.audioContext.destination)
    //    this.splitter.connect(this.gainNode,0);

    me = this;
    Ext.Loader.loadScript({
      url: 'https://connect.soundcloud.com/sdk/sdk-3.0.0.js',
      onLoad: function() {
        console.log('SoundCloud libary successfully loaded.');
        me.initSoundcloud();

      },
      onError: function() {
        console.log('Error while loading the SoundCloud libary');
      }
    });
  },

  initSoundcloud: function() {
    SC.initialize({
      client_id: '40493f5d7f709a9881675e26c824b136'
    });

    SC.get(Playground.view.winamp.Util.initialPlaylist).then(function(tracks) {
      var store = Ext.data.StoreManager.lookup('playList');
      store.add(tracks);
    });
  },

  stopPlay: function() {
    this.source.stop();
  },

  playSound: function() {
    if (this.source != undefined) {
      this.source.stop();
      var actualSound = this.getView().getViewModel().get("actualTrack");
      this.getData(actualSound.stream_url);
      return;
    }
    this.soundcloud();
    //source.start(0);
  },

  soundcloud: function() {
    me = this;
    url = Playground.view.winamp.Util.welcomeTrack;
    SC.get('/resolve', {
      url: url
    }).then(function(sound) {
      me.getView().getViewModel().set("actualTrack", sound);
      me.getView().getViewModel().set("actualhms", Playground.view.winamp.Util.createhmsString(sound.duration));
      me.getData(sound.stream_url);
    });
  },

  getData: function(sample) {
    me = this.audioContext;

    source = me.createBufferSource(),
    this.source = source;

    source.connect(this.mainFilter);

    var url = new URL(sample + '?client_id=17a992358db64d99e492326797fff3e8');

    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = function() {
      me.decodeAudioData(request.response,
        function(buffer) {
          console.log("sample loaded!");
          sample.loaded = true;
          source.buffer = buffer;
          source.start();
        },
        function() {
          console.log("Decoding error! ");
        });
    }
    sample.loaded = false;
    request.send();
  }
});

Ext.define('Playground.view.winamp.WinampModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.winamp-main',
    data: {
        name: 'Playground',
        track: undefined,
        actualTrack: {},
        actualhms: '00:00:00'
    }
});
