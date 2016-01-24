Ext.define('Playground.view.winamp.player.Player', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.bnz-player',

  requires: ['Ext.panel.Panel',
    'Ext.layout.*',
    'Playground.view.winamp.slider.Hslider'
  ],

  title: 'WINAMP',
  border: 0,
  reference: 'winamp-player',

  items: [{
    xtype: 'panel',
    header: false,
    border: false,
    items: [{
      xtype: 'panel',
      header: false,
      border: false,
      layout: {
        type: 'column',
        align: 'left'
      },
      items: [{
        bind: {
          title: '{actualhms}'
        },
        columnWidth: 0.25
      }, {
        columnWidth: 0.75,
        xtype: 'textfield',
        width: '100%',
        height: '100%',
        allowBlank: true,
        bind: {
          value: '{actualTrack.title}'
        }
      }]
    }, {
      xtype: 'panel',
      header: false,
      border: false,
      layout: {
        type: 'column',
        align: 'left'
      },
      items: [{
        title: 'Column 1',
        columnWidth: 0.25
      }, {
        columnWidth: 0.55,
        layout: {
          type: 'hbox',
          align: 'stretch'
        },
        items: [{
          xtype: 'bnz-hslider',
          itemId: 'volumeSilder',
          flex: 2,
          listener: {change: 'setVolume'}
        }, {
          xtype: 'bnz-hslider',
          flex: 1
        }]
      }, {
        columnWidth: 0.20,
        items: [{
          text: 'EQ',
          xtype: 'button'
        }, {
          text: 'PL',
          xtype: 'button'
        }]
      }]
    }, {
      xtype: 'panel',
      header: false,
      border: false,
      items: [{
        xtype: 'bnz-hslider',
        width: '100%'
      }]
    }]
  }],


  bbar: [{
    iconCls: 'x-fa fa-step-backward'
  }, {
    iconCls: 'x-fa fa-play',
    handler: 'playSound' // TODO listen to event in controller
  }, {
    iconCls: 'x-fa fa-pause',
    handler: 'stopPlay'
  }, {
    iconCls: 'x-fa fa-stop'
  }, {
    iconCls: 'x-fa fa-step-forward'
  }, {
    iconCls: 'x-fa fa-eject'
  }]

});
