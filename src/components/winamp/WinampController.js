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
