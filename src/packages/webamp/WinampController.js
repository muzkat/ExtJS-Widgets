Ext.define('muzkat.player.webampController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.webamp-main',

    control: {
        tool: {
            click: 'onCloseClick'
        },
        // 'bnz-webampslider': {
        //     change: 'onSliderMove'
        // },
        // '#LeftRight': {
        //     toggle: 'separateChannel'
        // },
        // '#sliderL': {
        //     change: 'setLeftGain'
        // },
        // '#sliderR': {
        //     change: 'setRightGain'
        // },
        // '#balanceSliderLR': {
        //     change: 'changeBalance'
        // }
    },

    onCloseClick: function (tool, e, owner, eOpts) {
        if (!(owner.reference === 'webamp-player')) {
            owner.hide();
        }
    }
});
