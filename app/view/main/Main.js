Ext.define('Playground.view.main.Main', {
  extend: 'Ext.tab.Panel',
  xtype: 'app-main',

  requires: [
    'Ext.plugin.Viewport',
    'Ext.window.MessageBox',
    'Ext.panel.Panel',

    'Playground.view.main.MainModel',
    'Playground.view.winamp.Winamp'
  ],

  viewModel: 'main',

  ui: 'navigation',

  tabBarHeaderPosition: 1,
  titleRotation: 0,
  tabRotation: 0,

  header: {
    layout: {
      align: 'stretchmax'
    },
    title: {
      bind: {
        text: '{name}'
      },
      flex: 0
    },
    iconCls: 'fa-th-list'
  },

  tabBar: {
    flex: 1,
    layout: {
      align: 'stretch' //,      overflowHandler: 'none'
    }
  },

  responsiveConfig: {
    tall: {
      headerPosition: 'top'
    },
    wide: {
      headerPosition: 'left'
    }
  },

  defaults: {
    bodyPadding: 20,
    autoScroll: true,
    tabConfig: {
      plugins: 'responsive',
      responsiveConfig: {
        wide: {
          iconAlign: 'left',
          textAlign: 'left'
        },
        tall: {
          iconAlign: 'top',
          textAlign: 'center',
          width: 120
        }
      }
    }
  },

  items: [{
    title: 'Webamp',
    items: [{
      xtype: 'bnz-winamp'
    }]
  }, {
    title: 'Weather',
    items: [{
      xtype: 'bnz-weather'
    }]
  }]
});
