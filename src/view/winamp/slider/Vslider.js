Ext.define('Playground.view.winamp.slider.Vslider', {
  extend: 'Ext.slider.Single',
  alias: 'widget.bnz-winampslider',

  requires: [
    'Ext.slider.Single'
  ],

  value: 100,
  increment: 100,
  minValue: 0,
  maxValue: 5000,
  vertical: true,
  height: 100
});
