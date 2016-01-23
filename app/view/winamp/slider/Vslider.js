Ext.define('Playground.view.winamp.slider.Vslider', {
  extend: 'Ext.slider.Single',
  alias: 'widget.bnz-winampslider',

  requires: [
    'Ext.slider.Single'
  ],

  value: 50,
  increment: 10,
  minValue: 0,
  maxValue: 100,
  vertical: true,
  height: 100
});
