Ext.define('Playground.view.winamp.playlist.Playlist', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.bnz-winamp-playlist',

    requires:[
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
    columns: [
        { text: 'Name', dataIndex: 'name' },
        { text: 'Email', dataIndex: 'email', flex: 1 },
        { text: 'Phone', dataIndex: 'phone' }
    ],
    initComponent: function(){
      this.store = Ext.create('Ext.data.Store', {
          storeId: 'simpsonsStore',
          fields:[ 'name', 'email', 'phone'],
          data: [
              { name: 'Lisa', email: 'lisa@simpsons.com', phone: '555-111-1224' },
              { name: 'Bart', email: 'bart@simpsons.com', phone: '555-222-1234' },
              { name: 'Homer', email: 'homer@simpsons.com', phone: '555-222-1244' },
              { name: 'Marge', email: 'marge@simpsons.com', phone: '555-222-1254' }
          ]
      });
      this.callParent();
    }
  });
