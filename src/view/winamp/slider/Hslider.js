Ext.define('Playground.view.winamp.slider.Hslider', {
  extend: 'Ext.slider.Single',
  alias: 'widget.bnz-hslider',

  requires: [
    'Ext.slider.Single'
  ],

  value: 50,
  increment: 10,
  minValue: 0,
  maxValue: 100,
  vertical: false
});
