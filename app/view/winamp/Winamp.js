Ext.define('Playground.view.winamp.Winamp', {
  extend: 'Ext.panel.Panel',
  xtype: 'bnz-winamp',

  requires: [
    'Ext.panel.Panel',

    'Playground.view.winamp.WinampController',
    'Playground.view.winamp.WinampModel',
  ],

  controller: 'winamp-main',
  viewModel: 'winamp-main',

  title: 'Multimedia Player',
  header: false,
  width: 600,
  height: 500,
  border: 0,
  items: [{
    xtype: 'panel',
    title: 'WINAMP',
    border: 1,
    reference: 'winamp-player',
    bbar: [{
      iconCls: 'x-fa fa-step-backward'
    }, {
      iconCls: 'x-fa fa-play'
    }, {
      iconCls: 'x-fa fa-pause'
    }, {
      iconCls: 'x-fa fa-stop'
    }, {
      iconCls: 'x-fa fa-step-forward'
    }, {
      iconCls: 'x-fa fa-eject'
    }]
  }, {
    xtype: 'panel',
    title: 'WINAMP EQUALIZER',
    border: 1,
    reference: 'winamp-eq'
  }, {
    xtype: 'panel',
    title: 'WINAMP PLAYLIST',
    border: 1,
    reference: 'winamp-playlist'
  }],

  initComponent: function(){
    // Ext.log('test');
    this.getController().hello();
    this.callParent();
  }
});
