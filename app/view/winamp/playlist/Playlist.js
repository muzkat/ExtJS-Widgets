Ext.define('Playground.view.winamp.playlist.Playlist', {
  extend: 'Ext.grid.Panel',
  alias: 'widget.bnz-winamp-playlist',

  requires: [
    'Ext.grid.Panel',
    'Ext.data.Store'
  ],

  title: 'WINAMP PLAYLIST',
  border: 1,
  reference: 'winamp-playlist',
  layout: {
    type: 'fit'
  },
  store: undefined,

  columns: [{
    xtype: 'rownumberer'
  }, {
    dataIndex: 'title',
    flex:1
  }, {
    dataIndex: 'duration'
  }],

  bbar: [{
    text: 'ADD'
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
