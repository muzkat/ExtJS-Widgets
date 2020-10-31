Ext.define('muzkatMap.Module', {
    singleton: true,

    loadAssets: function () {
        return this.loadMapScripts();
    },

    filesLoaded: false,

    scriptPaths: [
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.css',
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.js',
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet-providers/1.1.17/leaflet-providers.js'
    ],

    loadMapScripts: function () {
        var loadingArray = [], me = this;
        return new Ext.Promise(function (resolve, reject) {
            Ext.Array.each(me.scriptPaths, function (url) {
                loadingArray.push(me.loadMapScript(url));
            });

            Ext.Promise.all(loadingArray).then(function (success) {
                    console.log('artefacts were loaded successfully');
                    resolve('Loading was successful');
                },
                function (error) {
                    reject('Error during artefact loading...');
                });
        });
    },

    loadMapScript: function (url) {
        return new Ext.Promise(function (resolve, reject) {
            Ext.Loader.loadScript({
                url: url,
                onLoad: function () {
                    console.log(url + ' was loaded successfully');
                    resolve();
                },
                onError: function (error) {
                    reject('Loading was not successful for: ' + url);
                }
            });
        });
    }

});