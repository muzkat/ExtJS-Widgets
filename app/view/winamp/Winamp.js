Ext.define('Playground.view.winamp.Winamp', {
  extend: 'Ext.panel.Panel',
  xtype: 'bnz-winamp',

  requires: [
    'Ext.panel.Panel',

    'Playground.view.winamp.WinampController',
    'Playground.view.winamp.WinampModel',
    'Playground.view.winamp.player.Player',
    'Playground.view.winamp.slider.Vslider',
    'Playground.view.winamp.playlist.Playlist',
    'Playground.view.winamp.Util'
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
    border: 1,
    reference: 'winamp-eq',
    layout: {
       type: 'hbox',
       align: 'stretch'
     },
    tbar: [{
      text: 'ON'
    },
    {
      text: 'AUTO'
    }
  ],
  defaults: { // defaults are applied to items, not the container
      //flex: 1
  },
    items: [{
      xtype: 'bnz-winampslider'
    },{
      xtype: 'bnz-winampslider'
    },{
      xtype: 'bnz-winampslider'
    },{
      xtype: 'bnz-winampslider'
    },{
      xtype: 'bnz-winampslider'
    },{
      xtype: 'bnz-winampslider'
    },{
      xtype: 'bnz-winampslider'
    },{
      xtype: 'bnz-winampslider'
    },{
      xtype: 'bnz-winampslider'
    },{
      xtype: 'bnz-winampslider'
    },{
      xtype: 'bnz-winampslider'
    },{
      xtype: 'bnz-winampslider'
    }]
  },
  {
    xtype: 'bnz-winamp-playlist'
  }],

  initComponent: function() {
    this.callParent();
  }
});
