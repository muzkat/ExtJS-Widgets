Ext.define('Playground.view.winamp.WinampController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.winamp-main',

  audioContext: undefined,
  source: undefined,
  gainNode: undefined,
  panNode: undefined,

  mainFilter: undefined,

  control: {
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
    grid: {
      itemdblclick: 'onItemClick'
    }
  },

  onItemClick: function(view, record, item, index, e, eOpts) {
    me = this;
    me.setActualTrack(record.data);
  },

  setPan: function(cmp, x, y, eOpts) {
    Ext.log({
      dump: cmp
    });
    Ext.log({
      dump: x
    });
    Ext.log({
      dump: y
    });
    Ext.log({
      dump: eOpts
    });

    this.panNode.pan.value = x;

  },

  setActualTrack: function(TrackInfo) {
    if(this.source != undefined){
      this.source.stop();
    }
    me.getView().getViewModel().set("actualTrack", TrackInfo);
    me.getView().getViewModel().set("actualhms", Playground.view.winamp.Util.createhmsString(TrackInfo.duration));
    this.getData(TrackInfo.stream_url);
  },

  onSliderMove: function(cmp, x, y, eOpts) {
    Ext.log({
      dump: cmp
    });
    Ext.log({
      dump: x
    });
    Ext.log({
      dump: y
    });
    Ext.log({
      dump: eOpts
    });
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
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0.5;
    this.gainNode.connect(this.audioContext.destination);
    this.mainFilter = this.audioContext.createBiquadFilter();
    this.mainFilter.type = 'lowpass';
    this.mainFilter.frequency.value = 100;
    this.panNode = this.audioContext.createStereoPanner();
    this.mainFilter.connect(this.panNode);
    this.panNode.connect(this.gainNode);

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
    if(this.source != undefined){
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
