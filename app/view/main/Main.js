Ext.define('Playground.view.main.Main', {
  extend: 'Ext.tab.Panel',
  xtype: 'app-main',

  requires: [
    'Ext.plugin.Viewport',
    'Ext.window.MessageBox',
    'Ext.panel.Panel',

    'Playground.view.main.MainController',
    'Playground.view.main.MainModel',
    'Playground.view.main.List',

    'Playground.view.winamp.Winamp'
  ],

  controller: 'main',
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
      align: 'stretch',
      overflowHandler: 'none'
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
      title: 'Winamp',
      //  iconCls: 'fa-music',
      items: [
        /* {
              xtype: 'mainlist'
          },*/
        {
          xtype: 'bnz-winamp'

        }
      ]
    }
    /*, {
    title: 'Users',
    iconCls: 'fa-user',
    bind: {
      html: '{loremIpsum}'
    }
  }, {
    title: 'Groups',
    iconCls: 'fa-users',
    bind: {
      html: '{loremIpsum}'
    }
  }, {
    title: 'Settings',
    iconCls: 'fa-cog',
    bind: {
      html: '{loremIpsum}'
    }
  }
*/
  ]
});
