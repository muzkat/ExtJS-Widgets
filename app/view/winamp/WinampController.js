/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('Playground.view.winamp.WinampController', {
  extend: 'Ext.app.ViewController',

  alias: 'controller.winamp-main',

  hello: function() {
    me = this;
    Ext.Loader.loadScript({
      url: 'https://connect.soundcloud.com/sdk/sdk-3.0.0.js',
      onLoad: function() {
        me.initSoundcloud();
      },
      onError: function() {
        console.log('Error while loading the SoundCloud libary');
      }
    });
  },

  initSoundcloud: function() {
    mme = this;
    SC.initialize({
      client_id: '40493f5d7f709a9881675e26c824b136',
    });

    var scurl = 'https://soundcloud.com/bnzlovesyou/daktari-preview';

    SC.get('/resolve', {
      url: scurl
    }).then(function(sound) {
      Ext.log('sound download');
      mme.playSound(sound.stream_url);
    });

  },

  playSound: function(sample) {
    Ext.log('play');
    var audioContext = new AudioContext();
    var url = new URL(sample + '?client_id=17a992358db64d99e492326797fff3e8');
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    var source = audioContext.createBufferSource(),
    gainNode = audioContext.createGain();
    source.connect(gainNode);
    gainNode.gain.value = 0.5;
    gainNode.connect(audioContext.destination);
    request.onload = function() {
      audioContext.decodeAudioData(request.response,
        function(buffer) {
          console.log("sample loaded!");
          sample.loaded = true;
          source.buffer = buffer;
          source.start(0);
          Ext.log({
            dump: audioContext
          });
          Ext.log({
            dump: source
          });
          //            initVisualizer();
        },
        function() {
          console.log("Decoding error! ");
        });
    }
    sample.loaded = false;
    request.send();

  }
});
