Ext.define('Playground.view.winamp.Util',{
    singleton: true,

    welcomeTrack: 'https://soundcloud.com/bnzlovesyou/daktari-preview',
    initialPlaylist: '/users/1672444/tracks',

    createhmsString: function(milli){
      var hours = Math.floor(milli / 36e5),
          mins = Math.floor((milli % 36e5) / 6e4),
          secs = Math.floor((milli % 6e4) / 1000);
      var hmsString = hours + ':' + mins + ':' + secs;
      return hmsString;
    }

});
