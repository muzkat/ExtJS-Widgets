Ext.define('Playground.view.winamp.WinampModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.winamp-main',
    data: {
        name: 'Playground',
        track: undefined,
        actualTrack: {},
        actualhms: '00:00:00'
    }
});
