(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 *
 * @param name
 * @param mainComponent
 * @param loginNeeded
 * @param file
 * @returns {{app: undefined, appMainComponent: *, appName: string, appLoginNeeded: *, start: (function(): *), defineBaseClass: (function(): void), launchApp: launchApp}}
 */
function muzkatApp(name, mainComponent, loginNeeded, file) {

    return {
        app: undefined,
        appName: 'mzk',
        appMainComponent: mainComponent,
        appLoginNeeded: loginNeeded,

        launchApp: function () {
            if (typeof window.Ext !== 'undefined') {
                //this.defineBaseClass(); // TODO async + singleton Api
                this.app = this.start();
                return this.app;
            } else {
                alert('Framework is not available. Application cannot be startet.');
                return false;
            }
        },

        defineBaseClass: function () {
            return Ext.define(this.appName + '.MainApplication', {
                extend: 'Ext.container.Container',
                alias: 'widget.' + this.appName + 'Main',
                layout: 'fit',

                requestLogin: this.appLoginNeeded,
                mainComponent: this.appMainComponent,
                appName: this.appName,

                fileArray: [],

                initComponent: function () {
                    var items = [];
                    if (this.requestLogin) {
                        items = [{
                            xtype: 'container',
                            html: 'login required...'
                        }]
                    } else {
                        if (this.mainComponent !== false) {
                            items = [{xtype: this.mainComponent}]
                        } else {
                            this.fileArray.push(file.url);
                            items = [{
                                xtype: 'button',
                                layout: 'fit',
                                text: 'Muzkat Frame was loaded without module OR supplied with a module url.'
                            }];
                        }
                    }
                    this.items = items;
                    this.callParent(arguments);
                },

                changeComponent: function () {
                    var me = this;
                    this.loadScripts(this.fileArray).then(function (success) {
                        Ext.defer(function () {
                            me.removeAll();
                            me.add({xtype: file.cmp});
                        }, 300);
                    });
                },

                loadScripts: function (jsCssArray) {
                    let loadingArray = [];
                    return new Promise(function (resolve, reject) {
                        loadingArray = jsCssArray.map(url => this.loadScript(url));
                        Promise.all(loadingArray).then(function (success) {
                                console.log('artefacts were loaded successfully');
                                resolve('');
                            },
                            function (error) {
                                reject('Error during artefact loading...');
                            });
                    });
                },

                loadScript: function (url) {
                    return new Promise(function (resolve, reject) {
                        Ext.Loader.loadScript({
                            url: url,
                            onLoad: function () {
                                console.log(url + ' was loaded successfully');
                                resolve('Loading was successful');
                            },
                            onError: function (error) {
                                reject('Loading was not successful for: ' + url);
                            }
                        });
                    });
                }
            });
        },

        start: function () {
            return Ext.application({
                name: 'mzk',
                mainView: {xtype: this.appMainComponent},
                launch: function () {
                    Ext.log('Mzk wrapper booted!');
                }
            });
        }
    };
}

module.exports = muzkatApp;
},{}],2:[function(require,module,exports){
const muzkatApp = require('@muzkat/muzkat-ext-app');
let pt = new muzkatApp('Muzkat ExtJS6 Widgets', 'app-main', false);
pt.launchApp();
},{"@muzkat/muzkat-ext-app":1}]},{},[2]);
