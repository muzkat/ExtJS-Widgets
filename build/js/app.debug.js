Ext.define('Playground.view.main.Main', {
  extend: 'Ext.tab.Panel',
  alias: 'widget.app-main',

  viewModel: 'main',

  titleRotation: 0,
  tabRotation: 0,

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

/**
 * This class is the widgets model for the Main widgets of the application.
 */
Ext.define('Playground.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.main',

    data: {
        name: 'Playground',

        loremIpsum: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    }

    //TODO - add data, formulas and/or methods to support your widgets
});
