/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('Playground.view.main.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',

    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',

        'Playground.view.main.MainController',
        'Playground.view.main.MainModel',
        'Playground.view.main.List'
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
        title: 'Home',
        iconCls: 'fa-home',
        // The following grid shares a store with the classic version's grid as well!
        items: [
          /* {
            xtype: 'mainlist'
        },*/ {
          xtype: 'panel',
          title: 'Multimedia Player',
          header: false,
          width: 600,
          height: 500,
          border: 0,
          items: [
            {
              xtype: 'panel',
              title: 'WINAMP',
              border: 1,
              bbar: [
                {
                  iconCls: 'x-fa fa-step-backward'
                },
                {
                  iconCls: 'x-fa fa-play'
                },                {
                  iconCls: 'x-fa fa-pause'
                },
                {
                  iconCls: 'x-fa fa-stop'
                },
                {
                  iconCls: 'x-fa fa-step-forward'
                },
                {
                  iconCls: 'x-fa fa-eject'
                },
              ]
            },
            {
              xtype: 'panel',
              title: 'WINAMP EQUALIZER',
              border: 1
            },
            {
              xtype: 'panel',
              title: 'WINAMP PLAYLIST',
              border: 1
            }
          ]
        }]
    }, {
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
    }]
});
