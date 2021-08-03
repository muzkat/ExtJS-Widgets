Ext.define('muzkat.player.Util', {
    singleton: true,

    welcomeTrack: 'https://soundcloud.com/bnzlovesyou/daktari-preview',
    initialPlaylist: '/users/1672444/tracks',

    playerTitle: 'WEBAMP',
    playerEqBtn: 'EQ',
    playerPlBtn: 'PL',
    playlistTitle: 'PLAYLIST',

    // create duration h-m-s string from milliseconds
    createhmsString: function (milli) {
        var hours = Math.floor(milli / 36e5),
            mins = Math.floor((milli % 36e5) / 6e4),
            secs = Math.floor((milli % 6e4) / 1000);
        var hmsString = this.pad(hours) + ':' + this.pad(mins) + ':' + this.pad(secs);
        return hmsString;
    },

    // add leading zeros
    pad: function (number, size) {
        var s = String(number);
        while (s.length < (size || 2)) {
            s = "0" + s;
        }
        return s;
    },

    getHorizontalSlider: function () {
        return {
            xtype: 'slider',
            value: 50,
            increment: 10,
            minValue: 0,
            maxValue: 100,
            vertical: false
        }
    },

    getVerticalSlider: function () {
      return {
        xtype: 'slider',
        value: 100,
        increment: 100,
        minValue: 0,
        maxValue: 5000,
        vertical: true,
        height: 100
      }
    },

});
