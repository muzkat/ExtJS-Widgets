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
    me = this;
    var scurl = 'https://soundcloud.com/bnzlovesyou/daktari-preview';

    SC.initialize({
      client_id: '40493f5d7f709a9881675e26c824b136',
    });

    SC.get('/resolve', {
      url: scurl
    }).then(function(sound) {
      Ext.log('sound download');
      me.playSound(sound.stream_url);
    });
  },

  playSound: function(sample) {
    var audioContext = new AudioContext(),
    source = audioContext.createBufferSource(),
    gainNode = audioContext.createGain();

    source.connect(gainNode);
    gainNode.gain.value = 0.5;
    gainNode.connect(audioContext.destination);

    var url = new URL(sample + '?client_id=17a992358db64d99e492326797fff3e8');

    var request = new XMLHttpRequest();
      request.open("GET", url, true);
      request.responseType = "arraybuffer";

    request.onload = function() {
      audioContext.decodeAudioData(request.response,
        function(buffer) {
          console.log("sample loaded!");
          sample.loaded = true;
          source.buffer = buffer;
          source.start(0);
        },
        function() {
          console.log("Decoding error! ");
        });
    }
    sample.loaded = false;
    request.send();
  }
});
