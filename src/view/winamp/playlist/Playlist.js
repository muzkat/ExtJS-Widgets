Ext.define('Playground.view.winamp.playlist.Playlist', {
  extend: 'Ext.grid.Panel',
  alias: 'widget.bnz-winamp-playlist',

  requires: [
    'Ext.grid.Panel',
    'Ext.data.Store',
    'Ext.grid.plugin.DragDrop'
  ],

  title: Playground.view.winamp.assets.Strings.playerTitle+ ' ' + Playground.view.winamp.assets.Strings.playlistTitle,
  border: 1,
  reference: 'winamp-playlist',
  tools: [{
      type: 'close'
  }],
  layout: {
    type: 'fit'
  },
  store: undefined,

  viewConfig: {
    plugins: {
      ptype: 'gridviewdragdrop',
      dragText: 'Drag and drop to reorganize'
    }
  },
  hideHeaders: true,
  columns: [{
    xtype: 'rownumberer'
  }, {
    dataIndex: 'title',
    flex: 1
  }, {
    dataIndex: 'duration',
    renderer: function(value, meta, record) {
      return Playground.view.winamp.Util.createhmsString(value);
    }
  }],

  bbar: [{
    text: 'ADD',
    menu: [{
      text: 'ADD URL'
    },{
      text: 'ADD LIST'
    },{
      text: 'ADD FILE'
    }]
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
