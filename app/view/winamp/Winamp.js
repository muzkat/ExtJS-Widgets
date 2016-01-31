Ext.define('Playground.view.winamp.Winamp', {
  extend: 'Ext.panel.Panel',
  xtype: 'bnz-winamp',

  requires: [
    'Ext.panel.Panel',

    'Playground.view.winamp.WinampController',
    'Playground.view.winamp.WinampModel',
    'Playground.view.winamp.player.Player',
    'Playground.view.winamp.slider.Vslider',
    'Playground.view.winamp.slider.Hslider',
    'Playground.view.winamp.playlist.Playlist',
    'Playground.view.winamp.Util',
    'Playground.view.winamp.assets.*'
  ],

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
