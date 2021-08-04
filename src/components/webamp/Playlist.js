Ext.define('muzkat.player.Playlist', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.bnz-webamp-playlist',

    tools: [{
        type: 'close'
    }],

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
        renderer: function (value, meta, record) {
            return muzkat.player.Util.createhmsString(value);
        }
    }],

    bbar: [{
        text: 'ADD',
        menu: [{
            text: 'ADD URL'
        }, {
            text: 'ADD LIST'
        }, {
            text: 'ADD FILE'
        }]
    }, {
        text: 'REM'
    }, {
        text: 'SEL'
    }, {
        text: 'MISC'
    }],

    initComponent: function () {
        this.title = muzkat.player.Util.playerTitle + ' ' + muzkat.player.Util.playlistTitle;
        this.store = Ext.create('Ext.data.Store', {
            storeId: 'playList',
            fields: ['id', 'title', 'user', 'duration']
        });
        this.callParent();
    }
});
