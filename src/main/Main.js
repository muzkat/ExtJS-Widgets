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
