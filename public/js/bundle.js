(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
Ext.define('Playground.view.main.Main', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.app-main',

    titleRotation: 0,
    tabRotation: 0,

    defaults: {
        xtype: 'panel',
        layout: 'center'
    },

    items: [],

    initComponent: function () {

        var cmpDefinitions = [{
            title: 'Webamp',
            iconCls: 'fas fa-play',
            items: [{
                xtype: 'bnz-winamp'
            }]
        }, {
            title: 'Weather',
            iconCls: 'fas fa-sun',
            items: [{
                xtype: 'bnz-weather'
            }]
        }, {
            title: 'JSONViewer Online',
            iconCls: 'fas fa-edit',
            items: [{
                xtype: 'devbnzJsonMain', height: 600, width: 800
            }]
        }];

        var me = this;
        Ext.Array.each(cmpDefinitions, function (o) {
            me.items.push(o);
        });

        me.callParent(arguments);
    }
});

},{}],2:[function(require,module,exports){
Ext.define('devbnz.jsonviewer.components.TextArea', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.devbnzJsonTextArea',

    title: 'Text',
    iconCls: 'fas fa-font',

    layout: 'fit',

    controller: 'devbnzJsonTextAreaController',

    tbar: [{
        iconCls: 'fas fa-paste',
        text: 'Paste',
        handler: 'pasteJson'
    }, {
        iconCls: 'fas fa-copy',
        text: 'Copy'
    }, {
        xtype: 'tbseparator'
    }, {
        text: 'Format',
        iconCls: 'fas fa-file-signature',
        handler: 'formatJson'
    }, {
        text: 'Remove white space',
        iconCls: 'fas fa-edit',
        handler: 'removeWhitespace'
    }, {
        xtype: 'tbseparator'
    }, {
        text: 'Clear',
        iconCls: 'fas fa-eraser',
    }, {
        xtype: 'tbseparator'
    }, {
        text: 'Load JSON Data',
        iconCls: 'fas fa-file',
    }],

    padding: '10 10 10 10',

    items: [
        {
            xtype: 'textareafield',
            emptyText: 'Paste / Load JSON Data',
            grow: true,
            maxLength: 100000000000000000000
        }
    ]
});
Ext.define('devbnz.jsonviewer.components.TextAreaController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.devbnzJsonTextAreaController',

    pasteJson: function () {
        var view = this.getView();
        var field = view.down('textareafield'),
            jsonString = field.getValue(),
            jsonObject = Ext.JSON.decode(jsonString, true);
        if (jsonObject !== null) {
            var leaf = this.json2leaf(jsonObject);
            view.up('devbnzJsonMain').add({
                xtype: 'devbnzJsonTreeView',
                jsonTreeConfig: leaf
            });
        } else {
            Ext.log({msg: 'Json Obj not valid'});
        }
    },

    formatJson: function () {
        var view = this.getView();
        var a = view.down('textareafield');
        var spaceFn = this.space;
        for (var b = a.getValue().replace(/\n/g, " ").replace(/\r/g, " "), e = [], c = 0, d = !1, f = 0, i = b.length; f < i; f++) {
            var g = b.charAt(f);
            if (d && g === d) b.charAt(f - 1) !== "\\" && (d = !1);
            else if (!d && (g === '"' || g === "'")) d = g;
            else if (!d && (g === " " || g === "\t")) g = "";
            else if (!d && g === ":") g += " ";
            else if (!d && g === ",") g += "\n" + spaceFn(c * 2); else if (!d && (g === "[" || g === "{")) c++, g += "\n" + spaceFn(c * 2);
            else if (!d && (g === "]" || g === "}")) c--, g = "\n" + spaceFn(c * 2) + g;
            e.push(g)
        }

        a.setValue(e.join(""));
    },

    removeWhitespace: function () {
        var view = this.getView();
        var a = view.down('textareafield');
        for (var b = a.getValue().replace(/\n/g, " ").replace(/\r/g, " "), e = [], c = !1, d = 0, f = b.length; d < f; d++) {
            var i = b.charAt(d);
            if (c && i === c) b.charAt(d - 1) !== "\\" && (c = !1);
            else if (!c && (i === '"' || i === "'")) c = i; else if (!c && (i === " " || i === "\t")) i = "";
            e.push(i)
        }
        a.setValue(e.join(""));
    },

    space: function (a) {
        var b = [], e;
        for (e = 0; e < a; e++) b.push(" ");
        return b.join("")
    },

    json2leaf: function (a) {
        var b = [], c;
        for (c in a) a.hasOwnProperty(c) && (a[c] === null ? b.push({
            text: c + " : null",
            leaf: !0,
            iconCls: "fas fa-bug"
        }) : typeof a[c] === "string" ? b.push({
            text: c + ' : "' + a[c] + '"',
            leaf: !0,
            iconCls: "fas fa-bug"
        }) : typeof a[c] === "number" ? b.push({
            text: c + " : " + a[c],
            leaf: !0,
            iconCls: "fas fa-bug"
        }) : typeof a[c] === "boolean" ? b.push({
            text: c + " : " + (a[c] ? "true" : "false"),
            leaf: !0,
            iconCls: "fas fa-bug"
        }) : typeof a[c] === "object" ? b.push({
            text: c,
            children: this.json2leaf(a[c]),
            icon: Ext.isArray(a[c]) ? "fas fa-folder" : "fas fa-file"
        }) : typeof a[c] === "function" && b.push({
            text: c + " : function",
            leaf: !0,
            iconCls: "fas fa-bug"
        }));
        return b
    }

});

Ext.define('devbnz.jsonviewer.TreeView', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.devbnzJsonTreeView',

    rootVisible: false,
    jsonTreeConfig: undefined, // set by constructor

    listeners: {

        /*render: function (a) {
            a.getSelectionModel().on("selectionchange", function (a, b) {
                d.gridbuild(b)
            })
        },*/
        cellcontextmenu: function (view, td, cellIndex, record, tr, rowIndex, e, eOpts) {
            e.preventDefault();
            var b = e;
            (new Ext.menu.Menu({
                items: [{
                    text: "Expand", handler: function () {
                        a.expand()
                    }
                }, {
                    text: "Expand all", handler: function () {
                        a.expand(!0)
                    }
                }, "-", {
                    text: "Collapse", handler: function () {
                        a.collapse()
                    }
                },
                    {
                        text: "Collapse all", handler: function () {
                            a.collapse(!0)
                        }
                    }]
            })).showAt(b.getXY())
        }
    },

    initComponent: function () {

        var jsonTree = [
            {text: 'detention', leaf: true},
            {
                text: 'homework', expanded: true, children: [
                    {text: 'book report', leaf: true},
                    {text: 'algebra', leaf: true}
                ]
            },
            {text: 'buy lottery tickets', leaf: true}
        ];

        if (this.jsonTreeConfig) {
            jsonTree = this.jsonTreeConfig;
        }

        this.store = Ext.create('Ext.data.TreeStore', {
            root: {
                expanded: true,
                children: jsonTree
            }
        });

        this.callParent(arguments);
    }
});
Ext.define('devbnz.jsonviewer.JsonMain', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.devbnzJsonMain',

    controller: 'devbnzJsonMainController',

    items:
        [
            {
                xtype: 'panel',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                title: 'Viewer',
                iconCls: 'fas fa-eye',
                items:
                    [
                        {xtype: 'devbnzJsonTreeView', flex: 6, header: false},
                        {
                            xtype: 'container',
                            html: 'more soon', flex: 2
                        }]
            },
            {xtype: 'devbnzJsonTextArea'}
        ]
});
Ext.define('devbnz.jsonviewer.JsonMainController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.devbnzJsonMainController',


});

},{}],3:[function(require,module,exports){
Ext.define('Playground.view.weather.Weather', {
  extend: 'Ext.panel.Panel',
  xtype: 'bnz-weather',

  controller: 'weather-main',
  viewModel: 'weather-main',

  title: 'Weather Forecast',
  header: false,
  width: 600,
  height: 'auto',
  border: 0,
  items: [{
    xtype: 'panel',
    title: 'Weather Forecast',
    //  tools: [{
    //    type: 'close'
    //  }],
    border: 1,
    reference: 'winamp-eq',
    layout: {
      type: 'hbox',
      align: 'stretch'
    },
    tbar: [{
      text: 'ON'
    }, {
      text: 'AUTO'
    }],
    defaults: {
      // defaults are applied to items, not the container
      //flex: 1
    },
    items: []
  }],

  initComponent: function() {
    this.callParent();
  }
});

Ext.define('Playground.view.weather.WeatherController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.weather-main',

  audioContext: undefined,
  source: undefined,
  gainNode: undefined,
  panNode: undefined,
  splitter: undefined,
  gainL: undefined,
  gainR: undefined,

  mainFilter: undefined,

  control: {
/*
    tool:{
      click: 'onCloseClick'
    },
    'bnz-winampslider': {
      change: 'onSliderMove'
    },
      '#playBtn': {
        click: 'playSound'
      },
    '#volumeSilder': {
      change: 'setVolume'
    },
    '#panSlider': {
      change: 'setPan'
    },
    '#freqSilder': {
      change: 'setMainFilter'
    },
    '#pl': {
      click: 'showHide'
    },
    '#eq': {
      click: 'showHide'
    },
    grid: {
      itemdblclick: 'onItemClick'
    }*/
  },

  init: function(){

    Ext.Ajax.request({
            url: 'http://api.openweathermap.org/data/2.5/find?q=Berlin&units=metric&appid=44db6a862fba0b067b1930da0d769e98&mode=json',
            method: 'GET',
        //    headers: {'X-Requested-With': 'XMLHttpRequest'},
          //  params : Ext.JSON.encode(formPanel.getValues()),
            success: function(conn, response, options, eOpts) {
                var result = response.responseText;
                if (result.success) {
                  Ext.log({dump:result});
                  //  Packt.util.Alert.msg('Success!', 'Stock was saved.');
                  //  store.load();
                  //  win.close();
                } else {
                  //  Packt.util.Util.showErrorMsg(result.msg);
                }
            },
            failure: function(conn, response, options, eOpts) {
                // TODO get the 'msg' from the json and display it
                //Packt.util.Util.showErrorMsg(conn.responseText);
            }
        });
  }

});

Ext.define('Playground.view.weather.WeatherModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.weather-main',
    data: {
        name: 'Playground',
        track: undefined,
        actualTrack: {},
        actualhms: '00:00:00'
    }
});

},{}],4:[function(require,module,exports){
Ext.define('Playground.view.winamp.assets.Strings', {
  singleton: true,

  playerTitle: 'WEBAMP',
  playerEqBtn: 'EQ',
  playerPlBtn: 'PL',
  playlistTitle: 'PLAYLIST'

});

Ext.define('Playground.view.winamp.player.Player', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.bnz-player',

  title: Playground.view.winamp.assets.Strings.playerTitle,
  border: 0,
  reference: 'winamp-player',
  tools: [{
      type: 'close'
  }],

  items: [{
    xtype: 'panel',
    header: false,
    border: false,
    items: [{
      xtype: 'panel',
      header: false,
      border: false,
      layout: {
        type: 'column',
        align: 'left'
      },
      items: [{
        bind: {
          title: '{actualhms}'
        },
        columnWidth: 0.25
      }, {
        columnWidth: 0.75,
        xtype: 'textfield',
        width: '100%',
        height: '100%',
        allowBlank: true,
        bind: {
          value: '{actualTrack.title}'
        }
      }]
    }, {
      xtype: 'panel',
      header: false,
      border: false,
      layout: {
        type: 'column',
        align: 'left'
      },
      items: [{
        title: 'Column 1',
        columnWidth: 0.25
      }, {
        columnWidth: 0.55,
        layout: {
          type: 'hbox',
          align: 'stretch'
        },
        items: [{
          xtype: 'bnz-hslider',
          itemId: 'volumeSilder',
          flex: 2
        }, {
          xtype: 'bnz-hslider',
          itemId: 'panSlider',
          value: 0,
          increment: 1,
          minValue: -10,
          maxValue: 10,
          flex: 1
        }]
      }, {
        columnWidth: 0.20,
        items: [{
          text: Playground.view.winamp.assets.Strings.playerEqBtn,
          xtype: 'button',
          itemId: 'eq'
        }, {
          text: Playground.view.winamp.assets.Strings.playerPlBtn,
          xtype: 'button',
          itemId: 'pl'
        }]
      }]
    }, {
      xtype: 'panel',
      header: false,
      border: false,
      items: [{
        xtype: 'bnz-hslider',
        width: '100%'
      }]
    }]
  }],


  bbar: [{
    iconCls: 'x-fa fa-step-backward'
  }, {
    iconCls: 'x-fa fa-play',
    itemId: 'playBtn'
//    handler: 'playSound' // TODO listen to event in controller
  }, {
    iconCls: 'x-fa fa-pause',
    handler: 'stopPlay'
  }, {
    iconCls: 'x-fa fa-stop'
  }, {
    iconCls: 'x-fa fa-step-forward'
  }, {
    iconCls: 'x-fa fa-eject'
  }]

});

Ext.define('Playground.view.winamp.playlist.Playlist', {
  extend: 'Ext.grid.Panel',
  alias: 'widget.bnz-winamp-playlist',

  title: Playground.view.winamp.assets.Strings.playerTitle+ ' ' + Playground.view.winamp.assets.Strings.playlistTitle,
  border: 1,
  reference: 'winamp-playlist',
  tools: [{
      type: 'close'
  }],
  layout: {
    type: 'fit'
  },
  store: undefined,

  viewConfig: {
    plugins: {
      ptype: 'gridviewdragdrop',
      dragText: 'Drag and drop to reorganize'
    }
  },
  hideHeaders: true,
  columns: [{
    xtype: 'rownumberer'
  }, {
    dataIndex: 'title',
    flex: 1
  }, {
    dataIndex: 'duration',
    renderer: function(value, meta, record) {
      return Playground.view.winamp.Util.createhmsString(value);
    }
  }],

  bbar: [{
    text: 'ADD',
    menu: [{
      text: 'ADD URL'
    },{
      text: 'ADD LIST'
    },{
      text: 'ADD FILE'
    }]
  }, {
    text: 'REM'
  }, {
    text: 'SEL'
  }, {
    text: 'MISC'
  }],

  initComponent: function() {

    this.store = Ext.create('Ext.data.Store', {
      storeId: 'playList',
      fields: ['id', 'title', 'user', 'duration']
    });
    this.callParent();
  }
});

Ext.define('Playground.view.winamp.slider.Hslider', {
  extend: 'Ext.slider.Single',
  alias: 'widget.bnz-hslider',

  value: 50,
  increment: 10,
  minValue: 0,
  maxValue: 100,
  vertical: false
});

Ext.define('Playground.view.winamp.slider.Vslider', {
  extend: 'Ext.slider.Single',
  alias: 'widget.bnz-winampslider',

  value: 100,
  increment: 100,
  minValue: 0,
  maxValue: 5000,
  vertical: true,
  height: 100
});

Ext.define('Playground.view.winamp.Util', {
  singleton: true,

  welcomeTrack: 'https://soundcloud.com/bnzlovesyou/daktari-preview',
  initialPlaylist: '/users/1672444/tracks',

  // create duration h-m-s string from milliseconds
  createhmsString: function(milli) {
    var hours = Math.floor(milli / 36e5),
      mins = Math.floor((milli % 36e5) / 6e4),
      secs = Math.floor((milli % 6e4) / 1000);
    var hmsString = this.pad(hours) + ':' + this.pad(mins) + ':' + this.pad(secs);
    return hmsString;
  },

  // add leading zeros
  pad: function(number, size) {
    var s = String(number);
    while (s.length < (size || 2)) {
      s = "0" + s;
    }
    return s;
  }

});

Ext.define('Playground.view.winamp.Winamp', {
  extend: 'Ext.panel.Panel',
  xtype: 'bnz-winamp',

  controller: 'winamp-main',
  viewModel: 'winamp-main',

  title: 'Multimedia Player',
  header: false,
  width: 600,
  height: 'auto',
  border: 0,
  items: [{
    xtype: 'bnz-player'
  }, {
    xtype: 'panel',
    title: 'WINAMP EQUALIZER',
    tools: [{
      type: 'close'
    }],
    border: 1,
    reference: 'winamp-eq',
    layout: {
      type: 'hbox',
      align: 'stretch'
    },
    tbar: [{
      text: 'ON'
    }, {
      text: 'AUTO'
    }],
    defaults: {
      // defaults are applied to items, not the container
      //flex: 1
    },
    items: [{
      xtype: 'bnz-winampslider',
      itemId: 'freqSilder'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }, {
      xtype: 'bnz-winampslider'
    }]
  }, {
    xtype: 'bnz-winamp-playlist'
  }, {
    xtype: 'panel',
    title: Playground.view.winamp.assets.Strings.playerTitle + ' MONO MODE',
    items: [{
        /**
        Balance-Slider Left/Right
        -> aber ohne ALLES nach links/rechts zu ziehen,
        sondern den entsprechend anderen Stereokanal
        auszublenden (->ganz links bedeutet also nur noch
        linker Speaker ist aktiv, aber auch nur mit
        Inhalt des linken Stereo-Kanals)
        */
    }, {
      /*
           Stereo-Mono-Switch:
           beide Kanäle werden zu einem Monosignal zusammen
           gemischt und der Downmix auf einem/beiden
           Kanälen ausgegeben
           */
    }, {
      xtype: 'panel',
      title: 'Channel Selektor',
      items: [{
          xtype: 'segmentedbutton',
          allowMultiple: false,
          itemId: 'LeftRight',
          items: [{
            text: 'LEFT'
          }, {
            text: 'RIGHT',
          }, {
            text: 'BOTH',
          }]
        }, {
          xtype: 'container',
          items: [{
            xtype: 'bnz-hslider',
            itemId: 'balanceSliderLR',
            width: '100%',
            value: 0,
            increment: 1,
            minValue: -10,
            maxValue: 10,
            vertical: false
          }]
        },{
          xtype: 'container',
          layout: {
            type: 'hbox',
            align: 'stretch'
          },
          items: [{
            xtype: 'bnz-winampslider',
            itemId: 'sliderL',
            value: 5,
            increment: 1,
            minValue: 0,
            maxValue: 10,
            vertical: true,
            height: 100
          }, {
            xtype: 'bnz-winampslider',
            itemId: 'sliderR',
            value: 5,
            increment: 1,
            minValue: 0,
            maxValue: 10,
            vertical: true,
            height: 100
          }]
        }]
        /*
        Stereo-Signlechanel-Mono-Switch: man kann einen
        Stereo-Kanal auswählen welcher dann ausschließlich
        (dann aber auf beiden Kanälen) ausgegeben wird
        */
    }]
  }],

  initComponent: function() {
    this.callParent();
  }
});

Ext.define('Playground.view.winamp.WinampController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.winamp-main',

  audioContext: undefined,
  source: undefined,
  gainNode: undefined,
  panNode: undefined,
  splitter: undefined,
  gainL: undefined,
  gainR: undefined,
  merger: undefined,
  balL: undefined,
  balR: undefined,

  mainFilter: undefined,

  control: {
    tool: {
      click: 'onCloseClick'
    },
    'bnz-winampslider': {
      change: 'onSliderMove'
    },
    '#playBtn': {
      click: 'playSound'
    },
    '#volumeSilder': {
      change: 'setVolume'
    },
    '#panSlider': {
      change: 'setPan'
    },
    '#freqSilder': {
      change: 'setMainFilter'
    },
    '#pl': {
      click: 'showHide'
    },
    '#eq': {
      click: 'showHide'
    },
    '#LeftRight': {
      toggle: 'separateChannel'
    },
    '#sliderL': {
      change: 'setLeftGain'
    },
    '#sliderR': {
      change: 'setRightGain'
    },
    '#balanceSliderLR':{
      change: 'changeBalance'
    },
    grid: {
      itemdblclick: 'onItemClick'
    }
  },

  onCloseClick: function(tool, e, owner, eOpts) {
    if (!(owner.reference === 'winamp-player')) {
      owner.hide();
    }

  },

  defaultRouting: function(){
  this.merger.disconnect();
  this.splitter.disconnect();
  this.mainFilter.connect(this.panNode);
  this.panNode.connect(this.gainNode);
  /*
  this.mainFilter.connect(this.splitter);


  this.splitter.connect(this.gainL, 0);
  this.splitter.connect(this.gainR, 1);
  this.gainL.connect(this.merger, 0, 0);
  this.gainR.connect(this.merger, 0, 1);

  this.merger.connect(this.gainNode);
  */
  },

  detachDefaultRouting: function(){
  this.mainFilter.disconnect();
  this.panNode.disconnect();
  this.mainFilter.connect(this.splitter);


  this.splitter.connect(this.gainL, 0);
  this.splitter.connect(this.gainR, 1);
  this.gainL.connect(this.balL);
  this.gainR.connect(this.balR);
  this.balL.connect(this.merger, 0, 0)
  this.balR.connect(this.merger, 0, 1)

  this.merger.connect(this.gainNode);
  },

  changeBalance: function(cmp, x, y, eOpts){
    this.detachDefaultRouting();
   if (x >0 )
   {this.setLeftGain(0, 10-x)}
   if (x < 0)
   { x = Math.abs(x);
     this.setRightGain(0, 10-x);
   }
  },

  setLeftGain: function(cmp, x, y, eOpts) {
    this.detachDefaultRouting();
    this.gainL.gain.value = x / 10;
  },

  setRightGain: function(cmp, x, y, eOpts) {
    this.detachDefaultRouting();
    this.gainR.gain.value = x / 10;
  },

  separateChannel: function(container, button, pressed) {
    this.detachDefaultRouting();
    if (button.text === 'LEFT') {
      this.gainL.gain.value = 1.0;
      this.gainR.gain.value = 0.0;
    }
    if (button.text === 'RIGHT') {
      this.gainL.gain.value = 0.0;
      this.gainR.gain.value = 1.0;
    }
    if (button.text === 'BOTH') {
      this.gainL.gain.value = 1.0;
      this.gainR.gain.value = 1.0;
    }
  },

  //TODO refactoring needed
  showHide: function(cmp) {
    if (cmp.itemId === 'eq') {
      eq = this.lookupReference('winamp-eq')
      if (eq.hidden) {
        eq.show();
      } else {
        eq.hide();
      }
    }
    if (cmp.itemId === 'pl') {
      pl = this.lookupReference('winamp-playlist')
      if (pl.hidden) {
        pl.show();
      } else {
        pl.hide();
      }
    }
  },

  onItemClick: function(view, record, item, index, e, eOpts) {
    me = this;
    me.setActualTrack(record.data);
  },

  setPan: function(cmp, x, y, eOpts) {
    this.defaultRouting();
    this.panNode.pan.value = x / 10;
  },

  setActualTrack: function(TrackInfo) {
    if (this.source != undefined) {
      this.source.stop();
    }
    me.getView().getViewModel().set("actualTrack", TrackInfo);
    me.getView().getViewModel().set("actualhms", Playground.view.winamp.Util.createhmsString(TrackInfo.duration));
    this.getData(TrackInfo.stream_url);
  },

  onSliderMove: function(cmp, x, y, eOpts) {
    Ext.log({dump: cmp });
    Ext.log({dump: x});
    Ext.log({dump: y});
    Ext.log({dump: eOpts});
  },

  setVolume: function(cmp, x, y, eOpts) {
    this.gainNode.gain.value = x / 100;
  },

  setMainFilter: function(cmp, x, y, eOpts) {
    this.mainFilter.frequency.value = x;
  },

  volumeReset: function() {
    this.gainNode.gain.value = 0.5;
  },

  init: function(view) {
    this.audioContext = new AudioContext(),
    this.gainR = this.audioContext.createGain(),
    this.gainL = this.audioContext.createGain(),
    this.balR = this.audioContext.createGain(),
    this.balL = this.audioContext.createGain(),
    this.gainNode = this.audioContext.createGain(),
    this.merger = this.audioContext.createChannelMerger(2),
    this.mainFilter = this.audioContext.createBiquadFilter(),
    this.panNode = this.audioContext.createStereoPanner(),
    this.splitter = this.audioContext.createChannelSplitter(2);



    this.gainNode.gain.value = 0.5;

    this.gainR.gain.value = 0.5;
    this.gainL.gain.value = 0.5;

    this.balR.gain.value = 1;
    this.balL.gain.value = 1;

    this.gainNode.connect(this.audioContext.destination);

    this.mainFilter.type = 'lowpass';
    this.mainFilter.frequency.value = 100;


    //  this.splitter.connect(this.merger, 1, 0);

    this.mainFilter.connect(this.panNode);
    this.panNode.connect(this.gainNode);
    //    this.gainR.connect(this.audioContext.destination)
    //    this.splitter.connect(this.gainNode,0);

    me = this;
    Ext.Loader.loadScript({
      url: 'https://connect.soundcloud.com/sdk/sdk-3.0.0.js',
      onLoad: function() {
        console.log('SoundCloud libary successfully loaded.');
        me.initSoundcloud();

      },
      onError: function() {
        console.log('Error while loading the SoundCloud libary');
      }
    });
  },

  initSoundcloud: function() {
    SC.initialize({
      client_id: '40493f5d7f709a9881675e26c824b136'
    });

    SC.get(Playground.view.winamp.Util.initialPlaylist).then(function(tracks) {
      var store = Ext.data.StoreManager.lookup('playList');
      store.add(tracks);
    });
  },

  stopPlay: function() {
    this.source.stop();
  },

  playSound: function() {
    if (this.source != undefined) {
      this.source.stop();
      var actualSound = this.getView().getViewModel().get("actualTrack");
      this.getData(actualSound.stream_url);
      return;
    }
    this.soundcloud();
    //source.start(0);
  },

  soundcloud: function() {
    me = this;
    url = Playground.view.winamp.Util.welcomeTrack;
    SC.get('/resolve', {
      url: url
    }).then(function(sound) {
      me.getView().getViewModel().set("actualTrack", sound);
      me.getView().getViewModel().set("actualhms", Playground.view.winamp.Util.createhmsString(sound.duration));
      me.getData(sound.stream_url);
    });
  },

  getData: function(sample) {
    me = this.audioContext;

    source = me.createBufferSource(),
    this.source = source;

    source.connect(this.mainFilter);

    var url = new URL(sample + '?client_id=17a992358db64d99e492326797fff3e8');

    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = function() {
      me.decodeAudioData(request.response,
        function(buffer) {
          console.log("sample loaded!");
          sample.loaded = true;
          source.buffer = buffer;
          source.start();
        },
        function() {
          console.log("Decoding error! ");
        });
    }
    sample.loaded = false;
    request.send();
  }
});

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

},{}],5:[function(require,module,exports){
/**
 * ExtJS Prototype kit by muzkat
 *
 * @param name
 * @param mainComponent
 * @param loginNeeded
 * @returns {{appDescriptor: {name: *, mainComponent: *, loginNeeded: *}, app: undefined, launchApp: launchApp, defineBaseClass: defineBaseClass, start: start}}
 */
function muzkatApp(name, mainComponent, loginNeeded, file) {

    var appName = name;
    var appMainComponent = mainComponent;
    var appLoginNeeded = loginNeeded;

    return {
        app: undefined,
        appName: appName,
        appMainComponent: appMainComponent,
        appLoginNeeded: appLoginNeeded,
        /**
         *
         * @param descriptor
         */
        launchApp: function () {
            this.defineBaseClass();
            this.start();
        },
        /**
         *
         * @param name
         * @param mainComponent
         * @param loginNeeded
         */
        defineBaseClass: function () {
            var me = this;
            Ext.define(me.appName + '.MainApplication', {
                extend: 'Ext.container.Container',
                alias: 'widget.' + me.appName + 'Main',
                layout: 'fit',

                requestLogin: me.appLoginNeeded,
                mainComponent: me.appMainComponent,
                appName: me.appName,

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
                                text: 'Muzkat Frame was loaded without module OR supplied with a module url.',
                                handler: function (btn) {
                                    var mv = btn.up(appName + 'Main');
                                    mv.changeComponent();
                                }
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
                    var loadingArray = [], me = this;
                    return new Ext.Promise(function (resolve, reject) {
                        Ext.Array.each(jsCssArray, function (url) {
                            loadingArray.push(me.loadScript(url));
                        });

                        Ext.Promise.all(loadingArray).then(function (success) {
                                console.log('artefacts were loaded successfully');
                                resolve('');
                            },
                            function (error) {
                                reject('Error during artefact loading...');
                            });
                    });
                },

                loadScript: function (url) {
                    return new Ext.Promise(function (resolve, reject) {
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
        /**
         *
         */
        start: function () {
            var me = this;
            this.app = Ext.application({
                name: me.appName,
                muzkatAppRef: this,
                mainView: me.appName + '.MainApplication',
                launch: function () {
                    Ext.log(me.appName + ' booted!');
                }
            });
        }
    };
}

module.exports = muzkatApp;
},{}],6:[function(require,module,exports){
var muzkatApp = require('muzkat-ext-app');
var pt = new muzkatApp('Muzkat ExtJS6 Widgets', 'app-main', false);
pt.launchApp();
},{"muzkat-ext-app":5}]},{},[4,3,2,1,6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9qcy9hcHAuZGVidWcuanMiLCJidWlsZC9qcy9qc29udmlld2VyLmRlYnVnLmpzIiwiYnVpbGQvanMvd2VhdGhlci5kZWJ1Zy5qcyIsImJ1aWxkL2pzL3dpbmFtcC5kZWJ1Zy5qcyIsIm5vZGVfbW9kdWxlcy9tdXprYXQtZXh0LWFwcC9hcHAuanMiLCJzcmMvd3JhcHBlci93cmFwcGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySUE7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiRXh0LmRlZmluZSgnUGxheWdyb3VuZC52aWV3Lm1haW4uTWFpbicsIHtcbiAgICBleHRlbmQ6ICdFeHQudGFiLlBhbmVsJyxcbiAgICBhbGlhczogJ3dpZGdldC5hcHAtbWFpbicsXG5cbiAgICB0aXRsZVJvdGF0aW9uOiAwLFxuICAgIHRhYlJvdGF0aW9uOiAwLFxuXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgeHR5cGU6ICdwYW5lbCcsXG4gICAgICAgIGxheW91dDogJ2NlbnRlcidcbiAgICB9LFxuXG4gICAgaXRlbXM6IFtdLFxuXG4gICAgaW5pdENvbXBvbmVudDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciBjbXBEZWZpbml0aW9ucyA9IFt7XG4gICAgICAgICAgICB0aXRsZTogJ1dlYmFtcCcsXG4gICAgICAgICAgICBpY29uQ2xzOiAnZmFzIGZhLXBsYXknLFxuICAgICAgICAgICAgaXRlbXM6IFt7XG4gICAgICAgICAgICAgICAgeHR5cGU6ICdibnotd2luYW1wJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdGl0bGU6ICdXZWF0aGVyJyxcbiAgICAgICAgICAgIGljb25DbHM6ICdmYXMgZmEtc3VuJyxcbiAgICAgICAgICAgIGl0ZW1zOiBbe1xuICAgICAgICAgICAgICAgIHh0eXBlOiAnYm56LXdlYXRoZXInXG4gICAgICAgICAgICB9XVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICB0aXRsZTogJ0pTT05WaWV3ZXIgT25saW5lJyxcbiAgICAgICAgICAgIGljb25DbHM6ICdmYXMgZmEtZWRpdCcsXG4gICAgICAgICAgICBpdGVtczogW3tcbiAgICAgICAgICAgICAgICB4dHlwZTogJ2RldmJuekpzb25NYWluJywgaGVpZ2h0OiA2MDAsIHdpZHRoOiA4MDBcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH1dO1xuXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIEV4dC5BcnJheS5lYWNoKGNtcERlZmluaXRpb25zLCBmdW5jdGlvbiAobykge1xuICAgICAgICAgICAgbWUuaXRlbXMucHVzaChvKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbWUuY2FsbFBhcmVudChhcmd1bWVudHMpO1xuICAgIH1cbn0pO1xuIiwiRXh0LmRlZmluZSgnZGV2Ym56Lmpzb252aWV3ZXIuY29tcG9uZW50cy5UZXh0QXJlYScsIHtcbiAgICBleHRlbmQ6ICdFeHQucGFuZWwuUGFuZWwnLFxuICAgIGFsaWFzOiAnd2lkZ2V0LmRldmJuekpzb25UZXh0QXJlYScsXG5cbiAgICB0aXRsZTogJ1RleHQnLFxuICAgIGljb25DbHM6ICdmYXMgZmEtZm9udCcsXG5cbiAgICBsYXlvdXQ6ICdmaXQnLFxuXG4gICAgY29udHJvbGxlcjogJ2RldmJuekpzb25UZXh0QXJlYUNvbnRyb2xsZXInLFxuXG4gICAgdGJhcjogW3tcbiAgICAgICAgaWNvbkNsczogJ2ZhcyBmYS1wYXN0ZScsXG4gICAgICAgIHRleHQ6ICdQYXN0ZScsXG4gICAgICAgIGhhbmRsZXI6ICdwYXN0ZUpzb24nXG4gICAgfSwge1xuICAgICAgICBpY29uQ2xzOiAnZmFzIGZhLWNvcHknLFxuICAgICAgICB0ZXh0OiAnQ29weSdcbiAgICB9LCB7XG4gICAgICAgIHh0eXBlOiAndGJzZXBhcmF0b3InXG4gICAgfSwge1xuICAgICAgICB0ZXh0OiAnRm9ybWF0JyxcbiAgICAgICAgaWNvbkNsczogJ2ZhcyBmYS1maWxlLXNpZ25hdHVyZScsXG4gICAgICAgIGhhbmRsZXI6ICdmb3JtYXRKc29uJ1xuICAgIH0sIHtcbiAgICAgICAgdGV4dDogJ1JlbW92ZSB3aGl0ZSBzcGFjZScsXG4gICAgICAgIGljb25DbHM6ICdmYXMgZmEtZWRpdCcsXG4gICAgICAgIGhhbmRsZXI6ICdyZW1vdmVXaGl0ZXNwYWNlJ1xuICAgIH0sIHtcbiAgICAgICAgeHR5cGU6ICd0YnNlcGFyYXRvcidcbiAgICB9LCB7XG4gICAgICAgIHRleHQ6ICdDbGVhcicsXG4gICAgICAgIGljb25DbHM6ICdmYXMgZmEtZXJhc2VyJyxcbiAgICB9LCB7XG4gICAgICAgIHh0eXBlOiAndGJzZXBhcmF0b3InXG4gICAgfSwge1xuICAgICAgICB0ZXh0OiAnTG9hZCBKU09OIERhdGEnLFxuICAgICAgICBpY29uQ2xzOiAnZmFzIGZhLWZpbGUnLFxuICAgIH1dLFxuXG4gICAgcGFkZGluZzogJzEwIDEwIDEwIDEwJyxcblxuICAgIGl0ZW1zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHh0eXBlOiAndGV4dGFyZWFmaWVsZCcsXG4gICAgICAgICAgICBlbXB0eVRleHQ6ICdQYXN0ZSAvIExvYWQgSlNPTiBEYXRhJyxcbiAgICAgICAgICAgIGdyb3c6IHRydWUsXG4gICAgICAgICAgICBtYXhMZW5ndGg6IDEwMDAwMDAwMDAwMDAwMDAwMDAwMFxuICAgICAgICB9XG4gICAgXVxufSk7XG5FeHQuZGVmaW5lKCdkZXZibnouanNvbnZpZXdlci5jb21wb25lbnRzLlRleHRBcmVhQ29udHJvbGxlcicsIHtcbiAgICBleHRlbmQ6ICdFeHQuYXBwLlZpZXdDb250cm9sbGVyJyxcbiAgICBhbGlhczogJ2NvbnRyb2xsZXIuZGV2Ym56SnNvblRleHRBcmVhQ29udHJvbGxlcicsXG5cbiAgICBwYXN0ZUpzb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzLmdldFZpZXcoKTtcbiAgICAgICAgdmFyIGZpZWxkID0gdmlldy5kb3duKCd0ZXh0YXJlYWZpZWxkJyksXG4gICAgICAgICAgICBqc29uU3RyaW5nID0gZmllbGQuZ2V0VmFsdWUoKSxcbiAgICAgICAgICAgIGpzb25PYmplY3QgPSBFeHQuSlNPTi5kZWNvZGUoanNvblN0cmluZywgdHJ1ZSk7XG4gICAgICAgIGlmIChqc29uT2JqZWN0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgbGVhZiA9IHRoaXMuanNvbjJsZWFmKGpzb25PYmplY3QpO1xuICAgICAgICAgICAgdmlldy51cCgnZGV2Ym56SnNvbk1haW4nKS5hZGQoe1xuICAgICAgICAgICAgICAgIHh0eXBlOiAnZGV2Ym56SnNvblRyZWVWaWV3JyxcbiAgICAgICAgICAgICAgICBqc29uVHJlZUNvbmZpZzogbGVhZlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBFeHQubG9nKHttc2c6ICdKc29uIE9iaiBub3QgdmFsaWQnfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZm9ybWF0SnNvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdmlldyA9IHRoaXMuZ2V0VmlldygpO1xuICAgICAgICB2YXIgYSA9IHZpZXcuZG93bigndGV4dGFyZWFmaWVsZCcpO1xuICAgICAgICB2YXIgc3BhY2VGbiA9IHRoaXMuc3BhY2U7XG4gICAgICAgIGZvciAodmFyIGIgPSBhLmdldFZhbHVlKCkucmVwbGFjZSgvXFxuL2csIFwiIFwiKS5yZXBsYWNlKC9cXHIvZywgXCIgXCIpLCBlID0gW10sIGMgPSAwLCBkID0gITEsIGYgPSAwLCBpID0gYi5sZW5ndGg7IGYgPCBpOyBmKyspIHtcbiAgICAgICAgICAgIHZhciBnID0gYi5jaGFyQXQoZik7XG4gICAgICAgICAgICBpZiAoZCAmJiBnID09PSBkKSBiLmNoYXJBdChmIC0gMSkgIT09IFwiXFxcXFwiICYmIChkID0gITEpO1xuICAgICAgICAgICAgZWxzZSBpZiAoIWQgJiYgKGcgPT09ICdcIicgfHwgZyA9PT0gXCInXCIpKSBkID0gZztcbiAgICAgICAgICAgIGVsc2UgaWYgKCFkICYmIChnID09PSBcIiBcIiB8fCBnID09PSBcIlxcdFwiKSkgZyA9IFwiXCI7XG4gICAgICAgICAgICBlbHNlIGlmICghZCAmJiBnID09PSBcIjpcIikgZyArPSBcIiBcIjtcbiAgICAgICAgICAgIGVsc2UgaWYgKCFkICYmIGcgPT09IFwiLFwiKSBnICs9IFwiXFxuXCIgKyBzcGFjZUZuKGMgKiAyKTsgZWxzZSBpZiAoIWQgJiYgKGcgPT09IFwiW1wiIHx8IGcgPT09IFwie1wiKSkgYysrLCBnICs9IFwiXFxuXCIgKyBzcGFjZUZuKGMgKiAyKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKCFkICYmIChnID09PSBcIl1cIiB8fCBnID09PSBcIn1cIikpIGMtLSwgZyA9IFwiXFxuXCIgKyBzcGFjZUZuKGMgKiAyKSArIGc7XG4gICAgICAgICAgICBlLnB1c2goZylcbiAgICAgICAgfVxuXG4gICAgICAgIGEuc2V0VmFsdWUoZS5qb2luKFwiXCIpKTtcbiAgICB9LFxuXG4gICAgcmVtb3ZlV2hpdGVzcGFjZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdmlldyA9IHRoaXMuZ2V0VmlldygpO1xuICAgICAgICB2YXIgYSA9IHZpZXcuZG93bigndGV4dGFyZWFmaWVsZCcpO1xuICAgICAgICBmb3IgKHZhciBiID0gYS5nZXRWYWx1ZSgpLnJlcGxhY2UoL1xcbi9nLCBcIiBcIikucmVwbGFjZSgvXFxyL2csIFwiIFwiKSwgZSA9IFtdLCBjID0gITEsIGQgPSAwLCBmID0gYi5sZW5ndGg7IGQgPCBmOyBkKyspIHtcbiAgICAgICAgICAgIHZhciBpID0gYi5jaGFyQXQoZCk7XG4gICAgICAgICAgICBpZiAoYyAmJiBpID09PSBjKSBiLmNoYXJBdChkIC0gMSkgIT09IFwiXFxcXFwiICYmIChjID0gITEpO1xuICAgICAgICAgICAgZWxzZSBpZiAoIWMgJiYgKGkgPT09ICdcIicgfHwgaSA9PT0gXCInXCIpKSBjID0gaTsgZWxzZSBpZiAoIWMgJiYgKGkgPT09IFwiIFwiIHx8IGkgPT09IFwiXFx0XCIpKSBpID0gXCJcIjtcbiAgICAgICAgICAgIGUucHVzaChpKVxuICAgICAgICB9XG4gICAgICAgIGEuc2V0VmFsdWUoZS5qb2luKFwiXCIpKTtcbiAgICB9LFxuXG4gICAgc3BhY2U6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgIHZhciBiID0gW10sIGU7XG4gICAgICAgIGZvciAoZSA9IDA7IGUgPCBhOyBlKyspIGIucHVzaChcIiBcIik7XG4gICAgICAgIHJldHVybiBiLmpvaW4oXCJcIilcbiAgICB9LFxuXG4gICAganNvbjJsZWFmOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICB2YXIgYiA9IFtdLCBjO1xuICAgICAgICBmb3IgKGMgaW4gYSkgYS5oYXNPd25Qcm9wZXJ0eShjKSAmJiAoYVtjXSA9PT0gbnVsbCA/IGIucHVzaCh7XG4gICAgICAgICAgICB0ZXh0OiBjICsgXCIgOiBudWxsXCIsXG4gICAgICAgICAgICBsZWFmOiAhMCxcbiAgICAgICAgICAgIGljb25DbHM6IFwiZmFzIGZhLWJ1Z1wiXG4gICAgICAgIH0pIDogdHlwZW9mIGFbY10gPT09IFwic3RyaW5nXCIgPyBiLnB1c2goe1xuICAgICAgICAgICAgdGV4dDogYyArICcgOiBcIicgKyBhW2NdICsgJ1wiJyxcbiAgICAgICAgICAgIGxlYWY6ICEwLFxuICAgICAgICAgICAgaWNvbkNsczogXCJmYXMgZmEtYnVnXCJcbiAgICAgICAgfSkgOiB0eXBlb2YgYVtjXSA9PT0gXCJudW1iZXJcIiA/IGIucHVzaCh7XG4gICAgICAgICAgICB0ZXh0OiBjICsgXCIgOiBcIiArIGFbY10sXG4gICAgICAgICAgICBsZWFmOiAhMCxcbiAgICAgICAgICAgIGljb25DbHM6IFwiZmFzIGZhLWJ1Z1wiXG4gICAgICAgIH0pIDogdHlwZW9mIGFbY10gPT09IFwiYm9vbGVhblwiID8gYi5wdXNoKHtcbiAgICAgICAgICAgIHRleHQ6IGMgKyBcIiA6IFwiICsgKGFbY10gPyBcInRydWVcIiA6IFwiZmFsc2VcIiksXG4gICAgICAgICAgICBsZWFmOiAhMCxcbiAgICAgICAgICAgIGljb25DbHM6IFwiZmFzIGZhLWJ1Z1wiXG4gICAgICAgIH0pIDogdHlwZW9mIGFbY10gPT09IFwib2JqZWN0XCIgPyBiLnB1c2goe1xuICAgICAgICAgICAgdGV4dDogYyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiB0aGlzLmpzb24ybGVhZihhW2NdKSxcbiAgICAgICAgICAgIGljb246IEV4dC5pc0FycmF5KGFbY10pID8gXCJmYXMgZmEtZm9sZGVyXCIgOiBcImZhcyBmYS1maWxlXCJcbiAgICAgICAgfSkgOiB0eXBlb2YgYVtjXSA9PT0gXCJmdW5jdGlvblwiICYmIGIucHVzaCh7XG4gICAgICAgICAgICB0ZXh0OiBjICsgXCIgOiBmdW5jdGlvblwiLFxuICAgICAgICAgICAgbGVhZjogITAsXG4gICAgICAgICAgICBpY29uQ2xzOiBcImZhcyBmYS1idWdcIlxuICAgICAgICB9KSk7XG4gICAgICAgIHJldHVybiBiXG4gICAgfVxuXG59KTtcblxuRXh0LmRlZmluZSgnZGV2Ym56Lmpzb252aWV3ZXIuVHJlZVZpZXcnLCB7XG4gICAgZXh0ZW5kOiAnRXh0LnRyZWUuUGFuZWwnLFxuICAgIGFsaWFzOiAnd2lkZ2V0LmRldmJuekpzb25UcmVlVmlldycsXG5cbiAgICByb290VmlzaWJsZTogZmFsc2UsXG4gICAganNvblRyZWVDb25maWc6IHVuZGVmaW5lZCwgLy8gc2V0IGJ5IGNvbnN0cnVjdG9yXG5cbiAgICBsaXN0ZW5lcnM6IHtcblxuICAgICAgICAvKnJlbmRlcjogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIGEuZ2V0U2VsZWN0aW9uTW9kZWwoKS5vbihcInNlbGVjdGlvbmNoYW5nZVwiLCBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgIGQuZ3JpZGJ1aWxkKGIpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9LCovXG4gICAgICAgIGNlbGxjb250ZXh0bWVudTogZnVuY3Rpb24gKHZpZXcsIHRkLCBjZWxsSW5kZXgsIHJlY29yZCwgdHIsIHJvd0luZGV4LCBlLCBlT3B0cykge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdmFyIGIgPSBlO1xuICAgICAgICAgICAgKG5ldyBFeHQubWVudS5NZW51KHtcbiAgICAgICAgICAgICAgICBpdGVtczogW3tcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJFeHBhbmRcIiwgaGFuZGxlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYS5leHBhbmQoKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIkV4cGFuZCBhbGxcIiwgaGFuZGxlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYS5leHBhbmQoITApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCBcIi1cIiwge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIkNvbGxhcHNlXCIsIGhhbmRsZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGEuY29sbGFwc2UoKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJDb2xsYXBzZSBhbGxcIiwgaGFuZGxlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGEuY29sbGFwc2UoITApXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9KSkuc2hvd0F0KGIuZ2V0WFkoKSlcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBpbml0Q29tcG9uZW50OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIGpzb25UcmVlID0gW1xuICAgICAgICAgICAge3RleHQ6ICdkZXRlbnRpb24nLCBsZWFmOiB0cnVlfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiAnaG9tZXdvcmsnLCBleHBhbmRlZDogdHJ1ZSwgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAgICAge3RleHQ6ICdib29rIHJlcG9ydCcsIGxlYWY6IHRydWV9LFxuICAgICAgICAgICAgICAgICAgICB7dGV4dDogJ2FsZ2VicmEnLCBsZWFmOiB0cnVlfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7dGV4dDogJ2J1eSBsb3R0ZXJ5IHRpY2tldHMnLCBsZWFmOiB0cnVlfVxuICAgICAgICBdO1xuXG4gICAgICAgIGlmICh0aGlzLmpzb25UcmVlQ29uZmlnKSB7XG4gICAgICAgICAgICBqc29uVHJlZSA9IHRoaXMuanNvblRyZWVDb25maWc7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0b3JlID0gRXh0LmNyZWF0ZSgnRXh0LmRhdGEuVHJlZVN0b3JlJywge1xuICAgICAgICAgICAgcm9vdDoge1xuICAgICAgICAgICAgICAgIGV4cGFuZGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBqc29uVHJlZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmNhbGxQYXJlbnQoYXJndW1lbnRzKTtcbiAgICB9XG59KTtcbkV4dC5kZWZpbmUoJ2RldmJuei5qc29udmlld2VyLkpzb25NYWluJywge1xuICAgIGV4dGVuZDogJ0V4dC50YWIuUGFuZWwnLFxuICAgIGFsaWFzOiAnd2lkZ2V0LmRldmJuekpzb25NYWluJyxcblxuICAgIGNvbnRyb2xsZXI6ICdkZXZibnpKc29uTWFpbkNvbnRyb2xsZXInLFxuXG4gICAgaXRlbXM6XG4gICAgICAgIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB4dHlwZTogJ3BhbmVsJyxcbiAgICAgICAgICAgICAgICBsYXlvdXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2hib3gnLFxuICAgICAgICAgICAgICAgICAgICBhbGlnbjogJ3N0cmV0Y2gnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1ZpZXdlcicsXG4gICAgICAgICAgICAgICAgaWNvbkNsczogJ2ZhcyBmYS1leWUnLFxuICAgICAgICAgICAgICAgIGl0ZW1zOlxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7eHR5cGU6ICdkZXZibnpKc29uVHJlZVZpZXcnLCBmbGV4OiA2LCBoZWFkZXI6IGZhbHNlfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4dHlwZTogJ2NvbnRhaW5lcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaHRtbDogJ21vcmUgc29vbicsIGZsZXg6IDJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge3h0eXBlOiAnZGV2Ym56SnNvblRleHRBcmVhJ31cbiAgICAgICAgXVxufSk7XG5FeHQuZGVmaW5lKCdkZXZibnouanNvbnZpZXdlci5Kc29uTWFpbkNvbnRyb2xsZXInLCB7XG4gIGV4dGVuZDogJ0V4dC5hcHAuVmlld0NvbnRyb2xsZXInLFxuICBhbGlhczogJ2NvbnRyb2xsZXIuZGV2Ym56SnNvbk1haW5Db250cm9sbGVyJyxcblxuXG59KTtcbiIsIkV4dC5kZWZpbmUoJ1BsYXlncm91bmQudmlldy53ZWF0aGVyLldlYXRoZXInLCB7XG4gIGV4dGVuZDogJ0V4dC5wYW5lbC5QYW5lbCcsXG4gIHh0eXBlOiAnYm56LXdlYXRoZXInLFxuXG4gIGNvbnRyb2xsZXI6ICd3ZWF0aGVyLW1haW4nLFxuICB2aWV3TW9kZWw6ICd3ZWF0aGVyLW1haW4nLFxuXG4gIHRpdGxlOiAnV2VhdGhlciBGb3JlY2FzdCcsXG4gIGhlYWRlcjogZmFsc2UsXG4gIHdpZHRoOiA2MDAsXG4gIGhlaWdodDogJ2F1dG8nLFxuICBib3JkZXI6IDAsXG4gIGl0ZW1zOiBbe1xuICAgIHh0eXBlOiAncGFuZWwnLFxuICAgIHRpdGxlOiAnV2VhdGhlciBGb3JlY2FzdCcsXG4gICAgLy8gIHRvb2xzOiBbe1xuICAgIC8vICAgIHR5cGU6ICdjbG9zZSdcbiAgICAvLyAgfV0sXG4gICAgYm9yZGVyOiAxLFxuICAgIHJlZmVyZW5jZTogJ3dpbmFtcC1lcScsXG4gICAgbGF5b3V0OiB7XG4gICAgICB0eXBlOiAnaGJveCcsXG4gICAgICBhbGlnbjogJ3N0cmV0Y2gnXG4gICAgfSxcbiAgICB0YmFyOiBbe1xuICAgICAgdGV4dDogJ09OJ1xuICAgIH0sIHtcbiAgICAgIHRleHQ6ICdBVVRPJ1xuICAgIH1dLFxuICAgIGRlZmF1bHRzOiB7XG4gICAgICAvLyBkZWZhdWx0cyBhcmUgYXBwbGllZCB0byBpdGVtcywgbm90IHRoZSBjb250YWluZXJcbiAgICAgIC8vZmxleDogMVxuICAgIH0sXG4gICAgaXRlbXM6IFtdXG4gIH1dLFxuXG4gIGluaXRDb21wb25lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY2FsbFBhcmVudCgpO1xuICB9XG59KTtcblxuRXh0LmRlZmluZSgnUGxheWdyb3VuZC52aWV3LndlYXRoZXIuV2VhdGhlckNvbnRyb2xsZXInLCB7XG4gIGV4dGVuZDogJ0V4dC5hcHAuVmlld0NvbnRyb2xsZXInLFxuICBhbGlhczogJ2NvbnRyb2xsZXIud2VhdGhlci1tYWluJyxcblxuICBhdWRpb0NvbnRleHQ6IHVuZGVmaW5lZCxcbiAgc291cmNlOiB1bmRlZmluZWQsXG4gIGdhaW5Ob2RlOiB1bmRlZmluZWQsXG4gIHBhbk5vZGU6IHVuZGVmaW5lZCxcbiAgc3BsaXR0ZXI6IHVuZGVmaW5lZCxcbiAgZ2Fpbkw6IHVuZGVmaW5lZCxcbiAgZ2FpblI6IHVuZGVmaW5lZCxcblxuICBtYWluRmlsdGVyOiB1bmRlZmluZWQsXG5cbiAgY29udHJvbDoge1xuLypcbiAgICB0b29sOntcbiAgICAgIGNsaWNrOiAnb25DbG9zZUNsaWNrJ1xuICAgIH0sXG4gICAgJ2Juei13aW5hbXBzbGlkZXInOiB7XG4gICAgICBjaGFuZ2U6ICdvblNsaWRlck1vdmUnXG4gICAgfSxcbiAgICAgICcjcGxheUJ0bic6IHtcbiAgICAgICAgY2xpY2s6ICdwbGF5U291bmQnXG4gICAgICB9LFxuICAgICcjdm9sdW1lU2lsZGVyJzoge1xuICAgICAgY2hhbmdlOiAnc2V0Vm9sdW1lJ1xuICAgIH0sXG4gICAgJyNwYW5TbGlkZXInOiB7XG4gICAgICBjaGFuZ2U6ICdzZXRQYW4nXG4gICAgfSxcbiAgICAnI2ZyZXFTaWxkZXInOiB7XG4gICAgICBjaGFuZ2U6ICdzZXRNYWluRmlsdGVyJ1xuICAgIH0sXG4gICAgJyNwbCc6IHtcbiAgICAgIGNsaWNrOiAnc2hvd0hpZGUnXG4gICAgfSxcbiAgICAnI2VxJzoge1xuICAgICAgY2xpY2s6ICdzaG93SGlkZSdcbiAgICB9LFxuICAgIGdyaWQ6IHtcbiAgICAgIGl0ZW1kYmxjbGljazogJ29uSXRlbUNsaWNrJ1xuICAgIH0qL1xuICB9LFxuXG4gIGluaXQ6IGZ1bmN0aW9uKCl7XG5cbiAgICBFeHQuQWpheC5yZXF1ZXN0KHtcbiAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L2ZpbmQ/cT1CZXJsaW4mdW5pdHM9bWV0cmljJmFwcGlkPTQ0ZGI2YTg2MmZiYTBiMDY3YjE5MzBkYTBkNzY5ZTk4Jm1vZGU9anNvbicsXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAvLyAgICBoZWFkZXJzOiB7J1gtUmVxdWVzdGVkLVdpdGgnOiAnWE1MSHR0cFJlcXVlc3QnfSxcbiAgICAgICAgICAvLyAgcGFyYW1zIDogRXh0LkpTT04uZW5jb2RlKGZvcm1QYW5lbC5nZXRWYWx1ZXMoKSksXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihjb25uLCByZXNwb25zZSwgb3B0aW9ucywgZU9wdHMpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gcmVzcG9uc2UucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgRXh0LmxvZyh7ZHVtcDpyZXN1bHR9KTtcbiAgICAgICAgICAgICAgICAgIC8vICBQYWNrdC51dGlsLkFsZXJ0Lm1zZygnU3VjY2VzcyEnLCAnU3RvY2sgd2FzIHNhdmVkLicpO1xuICAgICAgICAgICAgICAgICAgLy8gIHN0b3JlLmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgIC8vICB3aW4uY2xvc2UoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgLy8gIFBhY2t0LnV0aWwuVXRpbC5zaG93RXJyb3JNc2cocmVzdWx0Lm1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZhaWx1cmU6IGZ1bmN0aW9uKGNvbm4sIHJlc3BvbnNlLCBvcHRpb25zLCBlT3B0cykge1xuICAgICAgICAgICAgICAgIC8vIFRPRE8gZ2V0IHRoZSAnbXNnJyBmcm9tIHRoZSBqc29uIGFuZCBkaXNwbGF5IGl0XG4gICAgICAgICAgICAgICAgLy9QYWNrdC51dGlsLlV0aWwuc2hvd0Vycm9yTXNnKGNvbm4ucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gIH1cblxufSk7XG5cbkV4dC5kZWZpbmUoJ1BsYXlncm91bmQudmlldy53ZWF0aGVyLldlYXRoZXJNb2RlbCcsIHtcbiAgICBleHRlbmQ6ICdFeHQuYXBwLlZpZXdNb2RlbCcsXG4gICAgYWxpYXM6ICd2aWV3bW9kZWwud2VhdGhlci1tYWluJyxcbiAgICBkYXRhOiB7XG4gICAgICAgIG5hbWU6ICdQbGF5Z3JvdW5kJyxcbiAgICAgICAgdHJhY2s6IHVuZGVmaW5lZCxcbiAgICAgICAgYWN0dWFsVHJhY2s6IHt9LFxuICAgICAgICBhY3R1YWxobXM6ICcwMDowMDowMCdcbiAgICB9XG59KTtcbiIsIkV4dC5kZWZpbmUoJ1BsYXlncm91bmQudmlldy53aW5hbXAuYXNzZXRzLlN0cmluZ3MnLCB7XG4gIHNpbmdsZXRvbjogdHJ1ZSxcblxuICBwbGF5ZXJUaXRsZTogJ1dFQkFNUCcsXG4gIHBsYXllckVxQnRuOiAnRVEnLFxuICBwbGF5ZXJQbEJ0bjogJ1BMJyxcbiAgcGxheWxpc3RUaXRsZTogJ1BMQVlMSVNUJ1xuXG59KTtcblxuRXh0LmRlZmluZSgnUGxheWdyb3VuZC52aWV3LndpbmFtcC5wbGF5ZXIuUGxheWVyJywge1xuICBleHRlbmQ6ICdFeHQucGFuZWwuUGFuZWwnLFxuICBhbGlhczogJ3dpZGdldC5ibnotcGxheWVyJyxcblxuICB0aXRsZTogUGxheWdyb3VuZC52aWV3LndpbmFtcC5hc3NldHMuU3RyaW5ncy5wbGF5ZXJUaXRsZSxcbiAgYm9yZGVyOiAwLFxuICByZWZlcmVuY2U6ICd3aW5hbXAtcGxheWVyJyxcbiAgdG9vbHM6IFt7XG4gICAgICB0eXBlOiAnY2xvc2UnXG4gIH1dLFxuXG4gIGl0ZW1zOiBbe1xuICAgIHh0eXBlOiAncGFuZWwnLFxuICAgIGhlYWRlcjogZmFsc2UsXG4gICAgYm9yZGVyOiBmYWxzZSxcbiAgICBpdGVtczogW3tcbiAgICAgIHh0eXBlOiAncGFuZWwnLFxuICAgICAgaGVhZGVyOiBmYWxzZSxcbiAgICAgIGJvcmRlcjogZmFsc2UsXG4gICAgICBsYXlvdXQ6IHtcbiAgICAgICAgdHlwZTogJ2NvbHVtbicsXG4gICAgICAgIGFsaWduOiAnbGVmdCdcbiAgICAgIH0sXG4gICAgICBpdGVtczogW3tcbiAgICAgICAgYmluZDoge1xuICAgICAgICAgIHRpdGxlOiAne2FjdHVhbGhtc30nXG4gICAgICAgIH0sXG4gICAgICAgIGNvbHVtbldpZHRoOiAwLjI1XG4gICAgICB9LCB7XG4gICAgICAgIGNvbHVtbldpZHRoOiAwLjc1LFxuICAgICAgICB4dHlwZTogJ3RleHRmaWVsZCcsXG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICBhbGxvd0JsYW5rOiB0cnVlLFxuICAgICAgICBiaW5kOiB7XG4gICAgICAgICAgdmFsdWU6ICd7YWN0dWFsVHJhY2sudGl0bGV9J1xuICAgICAgICB9XG4gICAgICB9XVxuICAgIH0sIHtcbiAgICAgIHh0eXBlOiAncGFuZWwnLFxuICAgICAgaGVhZGVyOiBmYWxzZSxcbiAgICAgIGJvcmRlcjogZmFsc2UsXG4gICAgICBsYXlvdXQ6IHtcbiAgICAgICAgdHlwZTogJ2NvbHVtbicsXG4gICAgICAgIGFsaWduOiAnbGVmdCdcbiAgICAgIH0sXG4gICAgICBpdGVtczogW3tcbiAgICAgICAgdGl0bGU6ICdDb2x1bW4gMScsXG4gICAgICAgIGNvbHVtbldpZHRoOiAwLjI1XG4gICAgICB9LCB7XG4gICAgICAgIGNvbHVtbldpZHRoOiAwLjU1LFxuICAgICAgICBsYXlvdXQ6IHtcbiAgICAgICAgICB0eXBlOiAnaGJveCcsXG4gICAgICAgICAgYWxpZ246ICdzdHJldGNoJ1xuICAgICAgICB9LFxuICAgICAgICBpdGVtczogW3tcbiAgICAgICAgICB4dHlwZTogJ2Juei1oc2xpZGVyJyxcbiAgICAgICAgICBpdGVtSWQ6ICd2b2x1bWVTaWxkZXInLFxuICAgICAgICAgIGZsZXg6IDJcbiAgICAgICAgfSwge1xuICAgICAgICAgIHh0eXBlOiAnYm56LWhzbGlkZXInLFxuICAgICAgICAgIGl0ZW1JZDogJ3BhblNsaWRlcicsXG4gICAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgICAgaW5jcmVtZW50OiAxLFxuICAgICAgICAgIG1pblZhbHVlOiAtMTAsXG4gICAgICAgICAgbWF4VmFsdWU6IDEwLFxuICAgICAgICAgIGZsZXg6IDFcbiAgICAgICAgfV1cbiAgICAgIH0sIHtcbiAgICAgICAgY29sdW1uV2lkdGg6IDAuMjAsXG4gICAgICAgIGl0ZW1zOiBbe1xuICAgICAgICAgIHRleHQ6IFBsYXlncm91bmQudmlldy53aW5hbXAuYXNzZXRzLlN0cmluZ3MucGxheWVyRXFCdG4sXG4gICAgICAgICAgeHR5cGU6ICdidXR0b24nLFxuICAgICAgICAgIGl0ZW1JZDogJ2VxJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgdGV4dDogUGxheWdyb3VuZC52aWV3LndpbmFtcC5hc3NldHMuU3RyaW5ncy5wbGF5ZXJQbEJ0bixcbiAgICAgICAgICB4dHlwZTogJ2J1dHRvbicsXG4gICAgICAgICAgaXRlbUlkOiAncGwnXG4gICAgICAgIH1dXG4gICAgICB9XVxuICAgIH0sIHtcbiAgICAgIHh0eXBlOiAncGFuZWwnLFxuICAgICAgaGVhZGVyOiBmYWxzZSxcbiAgICAgIGJvcmRlcjogZmFsc2UsXG4gICAgICBpdGVtczogW3tcbiAgICAgICAgeHR5cGU6ICdibnotaHNsaWRlcicsXG4gICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgIH1dXG4gICAgfV1cbiAgfV0sXG5cblxuICBiYmFyOiBbe1xuICAgIGljb25DbHM6ICd4LWZhIGZhLXN0ZXAtYmFja3dhcmQnXG4gIH0sIHtcbiAgICBpY29uQ2xzOiAneC1mYSBmYS1wbGF5JyxcbiAgICBpdGVtSWQ6ICdwbGF5QnRuJ1xuLy8gICAgaGFuZGxlcjogJ3BsYXlTb3VuZCcgLy8gVE9ETyBsaXN0ZW4gdG8gZXZlbnQgaW4gY29udHJvbGxlclxuICB9LCB7XG4gICAgaWNvbkNsczogJ3gtZmEgZmEtcGF1c2UnLFxuICAgIGhhbmRsZXI6ICdzdG9wUGxheSdcbiAgfSwge1xuICAgIGljb25DbHM6ICd4LWZhIGZhLXN0b3AnXG4gIH0sIHtcbiAgICBpY29uQ2xzOiAneC1mYSBmYS1zdGVwLWZvcndhcmQnXG4gIH0sIHtcbiAgICBpY29uQ2xzOiAneC1mYSBmYS1lamVjdCdcbiAgfV1cblxufSk7XG5cbkV4dC5kZWZpbmUoJ1BsYXlncm91bmQudmlldy53aW5hbXAucGxheWxpc3QuUGxheWxpc3QnLCB7XG4gIGV4dGVuZDogJ0V4dC5ncmlkLlBhbmVsJyxcbiAgYWxpYXM6ICd3aWRnZXQuYm56LXdpbmFtcC1wbGF5bGlzdCcsXG5cbiAgdGl0bGU6IFBsYXlncm91bmQudmlldy53aW5hbXAuYXNzZXRzLlN0cmluZ3MucGxheWVyVGl0bGUrICcgJyArIFBsYXlncm91bmQudmlldy53aW5hbXAuYXNzZXRzLlN0cmluZ3MucGxheWxpc3RUaXRsZSxcbiAgYm9yZGVyOiAxLFxuICByZWZlcmVuY2U6ICd3aW5hbXAtcGxheWxpc3QnLFxuICB0b29sczogW3tcbiAgICAgIHR5cGU6ICdjbG9zZSdcbiAgfV0sXG4gIGxheW91dDoge1xuICAgIHR5cGU6ICdmaXQnXG4gIH0sXG4gIHN0b3JlOiB1bmRlZmluZWQsXG5cbiAgdmlld0NvbmZpZzoge1xuICAgIHBsdWdpbnM6IHtcbiAgICAgIHB0eXBlOiAnZ3JpZHZpZXdkcmFnZHJvcCcsXG4gICAgICBkcmFnVGV4dDogJ0RyYWcgYW5kIGRyb3AgdG8gcmVvcmdhbml6ZSdcbiAgICB9XG4gIH0sXG4gIGhpZGVIZWFkZXJzOiB0cnVlLFxuICBjb2x1bW5zOiBbe1xuICAgIHh0eXBlOiAncm93bnVtYmVyZXInXG4gIH0sIHtcbiAgICBkYXRhSW5kZXg6ICd0aXRsZScsXG4gICAgZmxleDogMVxuICB9LCB7XG4gICAgZGF0YUluZGV4OiAnZHVyYXRpb24nLFxuICAgIHJlbmRlcmVyOiBmdW5jdGlvbih2YWx1ZSwgbWV0YSwgcmVjb3JkKSB7XG4gICAgICByZXR1cm4gUGxheWdyb3VuZC52aWV3LndpbmFtcC5VdGlsLmNyZWF0ZWhtc1N0cmluZyh2YWx1ZSk7XG4gICAgfVxuICB9XSxcblxuICBiYmFyOiBbe1xuICAgIHRleHQ6ICdBREQnLFxuICAgIG1lbnU6IFt7XG4gICAgICB0ZXh0OiAnQUREIFVSTCdcbiAgICB9LHtcbiAgICAgIHRleHQ6ICdBREQgTElTVCdcbiAgICB9LHtcbiAgICAgIHRleHQ6ICdBREQgRklMRSdcbiAgICB9XVxuICB9LCB7XG4gICAgdGV4dDogJ1JFTSdcbiAgfSwge1xuICAgIHRleHQ6ICdTRUwnXG4gIH0sIHtcbiAgICB0ZXh0OiAnTUlTQydcbiAgfV0sXG5cbiAgaW5pdENvbXBvbmVudDogZnVuY3Rpb24oKSB7XG5cbiAgICB0aGlzLnN0b3JlID0gRXh0LmNyZWF0ZSgnRXh0LmRhdGEuU3RvcmUnLCB7XG4gICAgICBzdG9yZUlkOiAncGxheUxpc3QnLFxuICAgICAgZmllbGRzOiBbJ2lkJywgJ3RpdGxlJywgJ3VzZXInLCAnZHVyYXRpb24nXVxuICAgIH0pO1xuICAgIHRoaXMuY2FsbFBhcmVudCgpO1xuICB9XG59KTtcblxuRXh0LmRlZmluZSgnUGxheWdyb3VuZC52aWV3LndpbmFtcC5zbGlkZXIuSHNsaWRlcicsIHtcbiAgZXh0ZW5kOiAnRXh0LnNsaWRlci5TaW5nbGUnLFxuICBhbGlhczogJ3dpZGdldC5ibnotaHNsaWRlcicsXG5cbiAgdmFsdWU6IDUwLFxuICBpbmNyZW1lbnQ6IDEwLFxuICBtaW5WYWx1ZTogMCxcbiAgbWF4VmFsdWU6IDEwMCxcbiAgdmVydGljYWw6IGZhbHNlXG59KTtcblxuRXh0LmRlZmluZSgnUGxheWdyb3VuZC52aWV3LndpbmFtcC5zbGlkZXIuVnNsaWRlcicsIHtcbiAgZXh0ZW5kOiAnRXh0LnNsaWRlci5TaW5nbGUnLFxuICBhbGlhczogJ3dpZGdldC5ibnotd2luYW1wc2xpZGVyJyxcblxuICB2YWx1ZTogMTAwLFxuICBpbmNyZW1lbnQ6IDEwMCxcbiAgbWluVmFsdWU6IDAsXG4gIG1heFZhbHVlOiA1MDAwLFxuICB2ZXJ0aWNhbDogdHJ1ZSxcbiAgaGVpZ2h0OiAxMDBcbn0pO1xuXG5FeHQuZGVmaW5lKCdQbGF5Z3JvdW5kLnZpZXcud2luYW1wLlV0aWwnLCB7XG4gIHNpbmdsZXRvbjogdHJ1ZSxcblxuICB3ZWxjb21lVHJhY2s6ICdodHRwczovL3NvdW5kY2xvdWQuY29tL2JuemxvdmVzeW91L2Rha3RhcmktcHJldmlldycsXG4gIGluaXRpYWxQbGF5bGlzdDogJy91c2Vycy8xNjcyNDQ0L3RyYWNrcycsXG5cbiAgLy8gY3JlYXRlIGR1cmF0aW9uIGgtbS1zIHN0cmluZyBmcm9tIG1pbGxpc2Vjb25kc1xuICBjcmVhdGVobXNTdHJpbmc6IGZ1bmN0aW9uKG1pbGxpKSB7XG4gICAgdmFyIGhvdXJzID0gTWF0aC5mbG9vcihtaWxsaSAvIDM2ZTUpLFxuICAgICAgbWlucyA9IE1hdGguZmxvb3IoKG1pbGxpICUgMzZlNSkgLyA2ZTQpLFxuICAgICAgc2VjcyA9IE1hdGguZmxvb3IoKG1pbGxpICUgNmU0KSAvIDEwMDApO1xuICAgIHZhciBobXNTdHJpbmcgPSB0aGlzLnBhZChob3VycykgKyAnOicgKyB0aGlzLnBhZChtaW5zKSArICc6JyArIHRoaXMucGFkKHNlY3MpO1xuICAgIHJldHVybiBobXNTdHJpbmc7XG4gIH0sXG5cbiAgLy8gYWRkIGxlYWRpbmcgemVyb3NcbiAgcGFkOiBmdW5jdGlvbihudW1iZXIsIHNpemUpIHtcbiAgICB2YXIgcyA9IFN0cmluZyhudW1iZXIpO1xuICAgIHdoaWxlIChzLmxlbmd0aCA8IChzaXplIHx8IDIpKSB7XG4gICAgICBzID0gXCIwXCIgKyBzO1xuICAgIH1cbiAgICByZXR1cm4gcztcbiAgfVxuXG59KTtcblxuRXh0LmRlZmluZSgnUGxheWdyb3VuZC52aWV3LndpbmFtcC5XaW5hbXAnLCB7XG4gIGV4dGVuZDogJ0V4dC5wYW5lbC5QYW5lbCcsXG4gIHh0eXBlOiAnYm56LXdpbmFtcCcsXG5cbiAgY29udHJvbGxlcjogJ3dpbmFtcC1tYWluJyxcbiAgdmlld01vZGVsOiAnd2luYW1wLW1haW4nLFxuXG4gIHRpdGxlOiAnTXVsdGltZWRpYSBQbGF5ZXInLFxuICBoZWFkZXI6IGZhbHNlLFxuICB3aWR0aDogNjAwLFxuICBoZWlnaHQ6ICdhdXRvJyxcbiAgYm9yZGVyOiAwLFxuICBpdGVtczogW3tcbiAgICB4dHlwZTogJ2Juei1wbGF5ZXInXG4gIH0sIHtcbiAgICB4dHlwZTogJ3BhbmVsJyxcbiAgICB0aXRsZTogJ1dJTkFNUCBFUVVBTElaRVInLFxuICAgIHRvb2xzOiBbe1xuICAgICAgdHlwZTogJ2Nsb3NlJ1xuICAgIH1dLFxuICAgIGJvcmRlcjogMSxcbiAgICByZWZlcmVuY2U6ICd3aW5hbXAtZXEnLFxuICAgIGxheW91dDoge1xuICAgICAgdHlwZTogJ2hib3gnLFxuICAgICAgYWxpZ246ICdzdHJldGNoJ1xuICAgIH0sXG4gICAgdGJhcjogW3tcbiAgICAgIHRleHQ6ICdPTidcbiAgICB9LCB7XG4gICAgICB0ZXh0OiAnQVVUTydcbiAgICB9XSxcbiAgICBkZWZhdWx0czoge1xuICAgICAgLy8gZGVmYXVsdHMgYXJlIGFwcGxpZWQgdG8gaXRlbXMsIG5vdCB0aGUgY29udGFpbmVyXG4gICAgICAvL2ZsZXg6IDFcbiAgICB9LFxuICAgIGl0ZW1zOiBbe1xuICAgICAgeHR5cGU6ICdibnotd2luYW1wc2xpZGVyJyxcbiAgICAgIGl0ZW1JZDogJ2ZyZXFTaWxkZXInXG4gICAgfSwge1xuICAgICAgeHR5cGU6ICdibnotd2luYW1wc2xpZGVyJ1xuICAgIH0sIHtcbiAgICAgIHh0eXBlOiAnYm56LXdpbmFtcHNsaWRlcidcbiAgICB9LCB7XG4gICAgICB4dHlwZTogJ2Juei13aW5hbXBzbGlkZXInXG4gICAgfSwge1xuICAgICAgeHR5cGU6ICdibnotd2luYW1wc2xpZGVyJ1xuICAgIH0sIHtcbiAgICAgIHh0eXBlOiAnYm56LXdpbmFtcHNsaWRlcidcbiAgICB9LCB7XG4gICAgICB4dHlwZTogJ2Juei13aW5hbXBzbGlkZXInXG4gICAgfSwge1xuICAgICAgeHR5cGU6ICdibnotd2luYW1wc2xpZGVyJ1xuICAgIH0sIHtcbiAgICAgIHh0eXBlOiAnYm56LXdpbmFtcHNsaWRlcidcbiAgICB9LCB7XG4gICAgICB4dHlwZTogJ2Juei13aW5hbXBzbGlkZXInXG4gICAgfSwge1xuICAgICAgeHR5cGU6ICdibnotd2luYW1wc2xpZGVyJ1xuICAgIH0sIHtcbiAgICAgIHh0eXBlOiAnYm56LXdpbmFtcHNsaWRlcidcbiAgICB9XVxuICB9LCB7XG4gICAgeHR5cGU6ICdibnotd2luYW1wLXBsYXlsaXN0J1xuICB9LCB7XG4gICAgeHR5cGU6ICdwYW5lbCcsXG4gICAgdGl0bGU6IFBsYXlncm91bmQudmlldy53aW5hbXAuYXNzZXRzLlN0cmluZ3MucGxheWVyVGl0bGUgKyAnIE1PTk8gTU9ERScsXG4gICAgaXRlbXM6IFt7XG4gICAgICAgIC8qKlxuICAgICAgICBCYWxhbmNlLVNsaWRlciBMZWZ0L1JpZ2h0XG4gICAgICAgIC0+IGFiZXIgb2huZSBBTExFUyBuYWNoIGxpbmtzL3JlY2h0cyB6dSB6aWVoZW4sXG4gICAgICAgIHNvbmRlcm4gZGVuIGVudHNwcmVjaGVuZCBhbmRlcmVuIFN0ZXJlb2thbmFsXG4gICAgICAgIGF1c3p1YmxlbmRlbiAoLT5nYW56IGxpbmtzIGJlZGV1dGV0IGFsc28gbnVyIG5vY2hcbiAgICAgICAgbGlua2VyIFNwZWFrZXIgaXN0IGFrdGl2LCBhYmVyIGF1Y2ggbnVyIG1pdFxuICAgICAgICBJbmhhbHQgZGVzIGxpbmtlbiBTdGVyZW8tS2FuYWxzKVxuICAgICAgICAqL1xuICAgIH0sIHtcbiAgICAgIC8qXG4gICAgICAgICAgIFN0ZXJlby1Nb25vLVN3aXRjaDpcbiAgICAgICAgICAgYmVpZGUgS2Fuw6RsZSB3ZXJkZW4genUgZWluZW0gTW9ub3NpZ25hbCB6dXNhbW1lblxuICAgICAgICAgICBnZW1pc2NodCB1bmQgZGVyIERvd25taXggYXVmIGVpbmVtL2JlaWRlblxuICAgICAgICAgICBLYW7DpGxlbiBhdXNnZWdlYmVuXG4gICAgICAgICAgICovXG4gICAgfSwge1xuICAgICAgeHR5cGU6ICdwYW5lbCcsXG4gICAgICB0aXRsZTogJ0NoYW5uZWwgU2VsZWt0b3InLFxuICAgICAgaXRlbXM6IFt7XG4gICAgICAgICAgeHR5cGU6ICdzZWdtZW50ZWRidXR0b24nLFxuICAgICAgICAgIGFsbG93TXVsdGlwbGU6IGZhbHNlLFxuICAgICAgICAgIGl0ZW1JZDogJ0xlZnRSaWdodCcsXG4gICAgICAgICAgaXRlbXM6IFt7XG4gICAgICAgICAgICB0ZXh0OiAnTEVGVCdcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICB0ZXh0OiAnUklHSFQnLFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIHRleHQ6ICdCT1RIJyxcbiAgICAgICAgICB9XVxuICAgICAgICB9LCB7XG4gICAgICAgICAgeHR5cGU6ICdjb250YWluZXInLFxuICAgICAgICAgIGl0ZW1zOiBbe1xuICAgICAgICAgICAgeHR5cGU6ICdibnotaHNsaWRlcicsXG4gICAgICAgICAgICBpdGVtSWQ6ICdiYWxhbmNlU2xpZGVyTFInLFxuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIHZhbHVlOiAwLFxuICAgICAgICAgICAgaW5jcmVtZW50OiAxLFxuICAgICAgICAgICAgbWluVmFsdWU6IC0xMCxcbiAgICAgICAgICAgIG1heFZhbHVlOiAxMCxcbiAgICAgICAgICAgIHZlcnRpY2FsOiBmYWxzZVxuICAgICAgICAgIH1dXG4gICAgICAgIH0se1xuICAgICAgICAgIHh0eXBlOiAnY29udGFpbmVyJyxcbiAgICAgICAgICBsYXlvdXQ6IHtcbiAgICAgICAgICAgIHR5cGU6ICdoYm94JyxcbiAgICAgICAgICAgIGFsaWduOiAnc3RyZXRjaCdcbiAgICAgICAgICB9LFxuICAgICAgICAgIGl0ZW1zOiBbe1xuICAgICAgICAgICAgeHR5cGU6ICdibnotd2luYW1wc2xpZGVyJyxcbiAgICAgICAgICAgIGl0ZW1JZDogJ3NsaWRlckwnLFxuICAgICAgICAgICAgdmFsdWU6IDUsXG4gICAgICAgICAgICBpbmNyZW1lbnQ6IDEsXG4gICAgICAgICAgICBtaW5WYWx1ZTogMCxcbiAgICAgICAgICAgIG1heFZhbHVlOiAxMCxcbiAgICAgICAgICAgIHZlcnRpY2FsOiB0cnVlLFxuICAgICAgICAgICAgaGVpZ2h0OiAxMDBcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICB4dHlwZTogJ2Juei13aW5hbXBzbGlkZXInLFxuICAgICAgICAgICAgaXRlbUlkOiAnc2xpZGVyUicsXG4gICAgICAgICAgICB2YWx1ZTogNSxcbiAgICAgICAgICAgIGluY3JlbWVudDogMSxcbiAgICAgICAgICAgIG1pblZhbHVlOiAwLFxuICAgICAgICAgICAgbWF4VmFsdWU6IDEwLFxuICAgICAgICAgICAgdmVydGljYWw6IHRydWUsXG4gICAgICAgICAgICBoZWlnaHQ6IDEwMFxuICAgICAgICAgIH1dXG4gICAgICAgIH1dXG4gICAgICAgIC8qXG4gICAgICAgIFN0ZXJlby1TaWdubGVjaGFuZWwtTW9uby1Td2l0Y2g6IG1hbiBrYW5uIGVpbmVuXG4gICAgICAgIFN0ZXJlby1LYW5hbCBhdXN3w6RobGVuIHdlbGNoZXIgZGFubiBhdXNzY2hsaWXDn2xpY2hcbiAgICAgICAgKGRhbm4gYWJlciBhdWYgYmVpZGVuIEthbsOkbGVuKSBhdXNnZWdlYmVuIHdpcmRcbiAgICAgICAgKi9cbiAgICB9XVxuICB9XSxcblxuICBpbml0Q29tcG9uZW50OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNhbGxQYXJlbnQoKTtcbiAgfVxufSk7XG5cbkV4dC5kZWZpbmUoJ1BsYXlncm91bmQudmlldy53aW5hbXAuV2luYW1wQ29udHJvbGxlcicsIHtcbiAgZXh0ZW5kOiAnRXh0LmFwcC5WaWV3Q29udHJvbGxlcicsXG4gIGFsaWFzOiAnY29udHJvbGxlci53aW5hbXAtbWFpbicsXG5cbiAgYXVkaW9Db250ZXh0OiB1bmRlZmluZWQsXG4gIHNvdXJjZTogdW5kZWZpbmVkLFxuICBnYWluTm9kZTogdW5kZWZpbmVkLFxuICBwYW5Ob2RlOiB1bmRlZmluZWQsXG4gIHNwbGl0dGVyOiB1bmRlZmluZWQsXG4gIGdhaW5MOiB1bmRlZmluZWQsXG4gIGdhaW5SOiB1bmRlZmluZWQsXG4gIG1lcmdlcjogdW5kZWZpbmVkLFxuICBiYWxMOiB1bmRlZmluZWQsXG4gIGJhbFI6IHVuZGVmaW5lZCxcblxuICBtYWluRmlsdGVyOiB1bmRlZmluZWQsXG5cbiAgY29udHJvbDoge1xuICAgIHRvb2w6IHtcbiAgICAgIGNsaWNrOiAnb25DbG9zZUNsaWNrJ1xuICAgIH0sXG4gICAgJ2Juei13aW5hbXBzbGlkZXInOiB7XG4gICAgICBjaGFuZ2U6ICdvblNsaWRlck1vdmUnXG4gICAgfSxcbiAgICAnI3BsYXlCdG4nOiB7XG4gICAgICBjbGljazogJ3BsYXlTb3VuZCdcbiAgICB9LFxuICAgICcjdm9sdW1lU2lsZGVyJzoge1xuICAgICAgY2hhbmdlOiAnc2V0Vm9sdW1lJ1xuICAgIH0sXG4gICAgJyNwYW5TbGlkZXInOiB7XG4gICAgICBjaGFuZ2U6ICdzZXRQYW4nXG4gICAgfSxcbiAgICAnI2ZyZXFTaWxkZXInOiB7XG4gICAgICBjaGFuZ2U6ICdzZXRNYWluRmlsdGVyJ1xuICAgIH0sXG4gICAgJyNwbCc6IHtcbiAgICAgIGNsaWNrOiAnc2hvd0hpZGUnXG4gICAgfSxcbiAgICAnI2VxJzoge1xuICAgICAgY2xpY2s6ICdzaG93SGlkZSdcbiAgICB9LFxuICAgICcjTGVmdFJpZ2h0Jzoge1xuICAgICAgdG9nZ2xlOiAnc2VwYXJhdGVDaGFubmVsJ1xuICAgIH0sXG4gICAgJyNzbGlkZXJMJzoge1xuICAgICAgY2hhbmdlOiAnc2V0TGVmdEdhaW4nXG4gICAgfSxcbiAgICAnI3NsaWRlclInOiB7XG4gICAgICBjaGFuZ2U6ICdzZXRSaWdodEdhaW4nXG4gICAgfSxcbiAgICAnI2JhbGFuY2VTbGlkZXJMUic6e1xuICAgICAgY2hhbmdlOiAnY2hhbmdlQmFsYW5jZSdcbiAgICB9LFxuICAgIGdyaWQ6IHtcbiAgICAgIGl0ZW1kYmxjbGljazogJ29uSXRlbUNsaWNrJ1xuICAgIH1cbiAgfSxcblxuICBvbkNsb3NlQ2xpY2s6IGZ1bmN0aW9uKHRvb2wsIGUsIG93bmVyLCBlT3B0cykge1xuICAgIGlmICghKG93bmVyLnJlZmVyZW5jZSA9PT0gJ3dpbmFtcC1wbGF5ZXInKSkge1xuICAgICAgb3duZXIuaGlkZSgpO1xuICAgIH1cblxuICB9LFxuXG4gIGRlZmF1bHRSb3V0aW5nOiBmdW5jdGlvbigpe1xuICB0aGlzLm1lcmdlci5kaXNjb25uZWN0KCk7XG4gIHRoaXMuc3BsaXR0ZXIuZGlzY29ubmVjdCgpO1xuICB0aGlzLm1haW5GaWx0ZXIuY29ubmVjdCh0aGlzLnBhbk5vZGUpO1xuICB0aGlzLnBhbk5vZGUuY29ubmVjdCh0aGlzLmdhaW5Ob2RlKTtcbiAgLypcbiAgdGhpcy5tYWluRmlsdGVyLmNvbm5lY3QodGhpcy5zcGxpdHRlcik7XG5cblxuICB0aGlzLnNwbGl0dGVyLmNvbm5lY3QodGhpcy5nYWluTCwgMCk7XG4gIHRoaXMuc3BsaXR0ZXIuY29ubmVjdCh0aGlzLmdhaW5SLCAxKTtcbiAgdGhpcy5nYWluTC5jb25uZWN0KHRoaXMubWVyZ2VyLCAwLCAwKTtcbiAgdGhpcy5nYWluUi5jb25uZWN0KHRoaXMubWVyZ2VyLCAwLCAxKTtcblxuICB0aGlzLm1lcmdlci5jb25uZWN0KHRoaXMuZ2Fpbk5vZGUpO1xuICAqL1xuICB9LFxuXG4gIGRldGFjaERlZmF1bHRSb3V0aW5nOiBmdW5jdGlvbigpe1xuICB0aGlzLm1haW5GaWx0ZXIuZGlzY29ubmVjdCgpO1xuICB0aGlzLnBhbk5vZGUuZGlzY29ubmVjdCgpO1xuICB0aGlzLm1haW5GaWx0ZXIuY29ubmVjdCh0aGlzLnNwbGl0dGVyKTtcblxuXG4gIHRoaXMuc3BsaXR0ZXIuY29ubmVjdCh0aGlzLmdhaW5MLCAwKTtcbiAgdGhpcy5zcGxpdHRlci5jb25uZWN0KHRoaXMuZ2FpblIsIDEpO1xuICB0aGlzLmdhaW5MLmNvbm5lY3QodGhpcy5iYWxMKTtcbiAgdGhpcy5nYWluUi5jb25uZWN0KHRoaXMuYmFsUik7XG4gIHRoaXMuYmFsTC5jb25uZWN0KHRoaXMubWVyZ2VyLCAwLCAwKVxuICB0aGlzLmJhbFIuY29ubmVjdCh0aGlzLm1lcmdlciwgMCwgMSlcblxuICB0aGlzLm1lcmdlci5jb25uZWN0KHRoaXMuZ2Fpbk5vZGUpO1xuICB9LFxuXG4gIGNoYW5nZUJhbGFuY2U6IGZ1bmN0aW9uKGNtcCwgeCwgeSwgZU9wdHMpe1xuICAgIHRoaXMuZGV0YWNoRGVmYXVsdFJvdXRpbmcoKTtcbiAgIGlmICh4ID4wIClcbiAgIHt0aGlzLnNldExlZnRHYWluKDAsIDEwLXgpfVxuICAgaWYgKHggPCAwKVxuICAgeyB4ID0gTWF0aC5hYnMoeCk7XG4gICAgIHRoaXMuc2V0UmlnaHRHYWluKDAsIDEwLXgpO1xuICAgfVxuICB9LFxuXG4gIHNldExlZnRHYWluOiBmdW5jdGlvbihjbXAsIHgsIHksIGVPcHRzKSB7XG4gICAgdGhpcy5kZXRhY2hEZWZhdWx0Um91dGluZygpO1xuICAgIHRoaXMuZ2FpbkwuZ2Fpbi52YWx1ZSA9IHggLyAxMDtcbiAgfSxcblxuICBzZXRSaWdodEdhaW46IGZ1bmN0aW9uKGNtcCwgeCwgeSwgZU9wdHMpIHtcbiAgICB0aGlzLmRldGFjaERlZmF1bHRSb3V0aW5nKCk7XG4gICAgdGhpcy5nYWluUi5nYWluLnZhbHVlID0geCAvIDEwO1xuICB9LFxuXG4gIHNlcGFyYXRlQ2hhbm5lbDogZnVuY3Rpb24oY29udGFpbmVyLCBidXR0b24sIHByZXNzZWQpIHtcbiAgICB0aGlzLmRldGFjaERlZmF1bHRSb3V0aW5nKCk7XG4gICAgaWYgKGJ1dHRvbi50ZXh0ID09PSAnTEVGVCcpIHtcbiAgICAgIHRoaXMuZ2FpbkwuZ2Fpbi52YWx1ZSA9IDEuMDtcbiAgICAgIHRoaXMuZ2FpblIuZ2Fpbi52YWx1ZSA9IDAuMDtcbiAgICB9XG4gICAgaWYgKGJ1dHRvbi50ZXh0ID09PSAnUklHSFQnKSB7XG4gICAgICB0aGlzLmdhaW5MLmdhaW4udmFsdWUgPSAwLjA7XG4gICAgICB0aGlzLmdhaW5SLmdhaW4udmFsdWUgPSAxLjA7XG4gICAgfVxuICAgIGlmIChidXR0b24udGV4dCA9PT0gJ0JPVEgnKSB7XG4gICAgICB0aGlzLmdhaW5MLmdhaW4udmFsdWUgPSAxLjA7XG4gICAgICB0aGlzLmdhaW5SLmdhaW4udmFsdWUgPSAxLjA7XG4gICAgfVxuICB9LFxuXG4gIC8vVE9ETyByZWZhY3RvcmluZyBuZWVkZWRcbiAgc2hvd0hpZGU6IGZ1bmN0aW9uKGNtcCkge1xuICAgIGlmIChjbXAuaXRlbUlkID09PSAnZXEnKSB7XG4gICAgICBlcSA9IHRoaXMubG9va3VwUmVmZXJlbmNlKCd3aW5hbXAtZXEnKVxuICAgICAgaWYgKGVxLmhpZGRlbikge1xuICAgICAgICBlcS5zaG93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlcS5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChjbXAuaXRlbUlkID09PSAncGwnKSB7XG4gICAgICBwbCA9IHRoaXMubG9va3VwUmVmZXJlbmNlKCd3aW5hbXAtcGxheWxpc3QnKVxuICAgICAgaWYgKHBsLmhpZGRlbikge1xuICAgICAgICBwbC5zaG93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwbC5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIG9uSXRlbUNsaWNrOiBmdW5jdGlvbih2aWV3LCByZWNvcmQsIGl0ZW0sIGluZGV4LCBlLCBlT3B0cykge1xuICAgIG1lID0gdGhpcztcbiAgICBtZS5zZXRBY3R1YWxUcmFjayhyZWNvcmQuZGF0YSk7XG4gIH0sXG5cbiAgc2V0UGFuOiBmdW5jdGlvbihjbXAsIHgsIHksIGVPcHRzKSB7XG4gICAgdGhpcy5kZWZhdWx0Um91dGluZygpO1xuICAgIHRoaXMucGFuTm9kZS5wYW4udmFsdWUgPSB4IC8gMTA7XG4gIH0sXG5cbiAgc2V0QWN0dWFsVHJhY2s6IGZ1bmN0aW9uKFRyYWNrSW5mbykge1xuICAgIGlmICh0aGlzLnNvdXJjZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc291cmNlLnN0b3AoKTtcbiAgICB9XG4gICAgbWUuZ2V0VmlldygpLmdldFZpZXdNb2RlbCgpLnNldChcImFjdHVhbFRyYWNrXCIsIFRyYWNrSW5mbyk7XG4gICAgbWUuZ2V0VmlldygpLmdldFZpZXdNb2RlbCgpLnNldChcImFjdHVhbGhtc1wiLCBQbGF5Z3JvdW5kLnZpZXcud2luYW1wLlV0aWwuY3JlYXRlaG1zU3RyaW5nKFRyYWNrSW5mby5kdXJhdGlvbikpO1xuICAgIHRoaXMuZ2V0RGF0YShUcmFja0luZm8uc3RyZWFtX3VybCk7XG4gIH0sXG5cbiAgb25TbGlkZXJNb3ZlOiBmdW5jdGlvbihjbXAsIHgsIHksIGVPcHRzKSB7XG4gICAgRXh0LmxvZyh7ZHVtcDogY21wIH0pO1xuICAgIEV4dC5sb2coe2R1bXA6IHh9KTtcbiAgICBFeHQubG9nKHtkdW1wOiB5fSk7XG4gICAgRXh0LmxvZyh7ZHVtcDogZU9wdHN9KTtcbiAgfSxcblxuICBzZXRWb2x1bWU6IGZ1bmN0aW9uKGNtcCwgeCwgeSwgZU9wdHMpIHtcbiAgICB0aGlzLmdhaW5Ob2RlLmdhaW4udmFsdWUgPSB4IC8gMTAwO1xuICB9LFxuXG4gIHNldE1haW5GaWx0ZXI6IGZ1bmN0aW9uKGNtcCwgeCwgeSwgZU9wdHMpIHtcbiAgICB0aGlzLm1haW5GaWx0ZXIuZnJlcXVlbmN5LnZhbHVlID0geDtcbiAgfSxcblxuICB2b2x1bWVSZXNldDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5nYWluTm9kZS5nYWluLnZhbHVlID0gMC41O1xuICB9LFxuXG4gIGluaXQ6IGZ1bmN0aW9uKHZpZXcpIHtcbiAgICB0aGlzLmF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKSxcbiAgICB0aGlzLmdhaW5SID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpLFxuICAgIHRoaXMuZ2FpbkwgPSB0aGlzLmF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCksXG4gICAgdGhpcy5iYWxSID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpLFxuICAgIHRoaXMuYmFsTCA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKSxcbiAgICB0aGlzLmdhaW5Ob2RlID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpLFxuICAgIHRoaXMubWVyZ2VyID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlQ2hhbm5lbE1lcmdlcigyKSxcbiAgICB0aGlzLm1haW5GaWx0ZXIgPSB0aGlzLmF1ZGlvQ29udGV4dC5jcmVhdGVCaXF1YWRGaWx0ZXIoKSxcbiAgICB0aGlzLnBhbk5vZGUgPSB0aGlzLmF1ZGlvQ29udGV4dC5jcmVhdGVTdGVyZW9QYW5uZXIoKSxcbiAgICB0aGlzLnNwbGl0dGVyID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlQ2hhbm5lbFNwbGl0dGVyKDIpO1xuXG5cblxuICAgIHRoaXMuZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9IDAuNTtcblxuICAgIHRoaXMuZ2FpblIuZ2Fpbi52YWx1ZSA9IDAuNTtcbiAgICB0aGlzLmdhaW5MLmdhaW4udmFsdWUgPSAwLjU7XG5cbiAgICB0aGlzLmJhbFIuZ2Fpbi52YWx1ZSA9IDE7XG4gICAgdGhpcy5iYWxMLmdhaW4udmFsdWUgPSAxO1xuXG4gICAgdGhpcy5nYWluTm9kZS5jb25uZWN0KHRoaXMuYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcblxuICAgIHRoaXMubWFpbkZpbHRlci50eXBlID0gJ2xvd3Bhc3MnO1xuICAgIHRoaXMubWFpbkZpbHRlci5mcmVxdWVuY3kudmFsdWUgPSAxMDA7XG5cblxuICAgIC8vICB0aGlzLnNwbGl0dGVyLmNvbm5lY3QodGhpcy5tZXJnZXIsIDEsIDApO1xuXG4gICAgdGhpcy5tYWluRmlsdGVyLmNvbm5lY3QodGhpcy5wYW5Ob2RlKTtcbiAgICB0aGlzLnBhbk5vZGUuY29ubmVjdCh0aGlzLmdhaW5Ob2RlKTtcbiAgICAvLyAgICB0aGlzLmdhaW5SLmNvbm5lY3QodGhpcy5hdWRpb0NvbnRleHQuZGVzdGluYXRpb24pXG4gICAgLy8gICAgdGhpcy5zcGxpdHRlci5jb25uZWN0KHRoaXMuZ2Fpbk5vZGUsMCk7XG5cbiAgICBtZSA9IHRoaXM7XG4gICAgRXh0LkxvYWRlci5sb2FkU2NyaXB0KHtcbiAgICAgIHVybDogJ2h0dHBzOi8vY29ubmVjdC5zb3VuZGNsb3VkLmNvbS9zZGsvc2RrLTMuMC4wLmpzJyxcbiAgICAgIG9uTG9hZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdTb3VuZENsb3VkIGxpYmFyeSBzdWNjZXNzZnVsbHkgbG9hZGVkLicpO1xuICAgICAgICBtZS5pbml0U291bmRjbG91ZCgpO1xuXG4gICAgICB9LFxuICAgICAgb25FcnJvcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciB3aGlsZSBsb2FkaW5nIHRoZSBTb3VuZENsb3VkIGxpYmFyeScpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIGluaXRTb3VuZGNsb3VkOiBmdW5jdGlvbigpIHtcbiAgICBTQy5pbml0aWFsaXplKHtcbiAgICAgIGNsaWVudF9pZDogJzQwNDkzZjVkN2Y3MDlhOTg4MTY3NWUyNmM4MjRiMTM2J1xuICAgIH0pO1xuXG4gICAgU0MuZ2V0KFBsYXlncm91bmQudmlldy53aW5hbXAuVXRpbC5pbml0aWFsUGxheWxpc3QpLnRoZW4oZnVuY3Rpb24odHJhY2tzKSB7XG4gICAgICB2YXIgc3RvcmUgPSBFeHQuZGF0YS5TdG9yZU1hbmFnZXIubG9va3VwKCdwbGF5TGlzdCcpO1xuICAgICAgc3RvcmUuYWRkKHRyYWNrcyk7XG4gICAgfSk7XG4gIH0sXG5cbiAgc3RvcFBsYXk6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc291cmNlLnN0b3AoKTtcbiAgfSxcblxuICBwbGF5U291bmQ6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnNvdXJjZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc291cmNlLnN0b3AoKTtcbiAgICAgIHZhciBhY3R1YWxTb3VuZCA9IHRoaXMuZ2V0VmlldygpLmdldFZpZXdNb2RlbCgpLmdldChcImFjdHVhbFRyYWNrXCIpO1xuICAgICAgdGhpcy5nZXREYXRhKGFjdHVhbFNvdW5kLnN0cmVhbV91cmwpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnNvdW5kY2xvdWQoKTtcbiAgICAvL3NvdXJjZS5zdGFydCgwKTtcbiAgfSxcblxuICBzb3VuZGNsb3VkOiBmdW5jdGlvbigpIHtcbiAgICBtZSA9IHRoaXM7XG4gICAgdXJsID0gUGxheWdyb3VuZC52aWV3LndpbmFtcC5VdGlsLndlbGNvbWVUcmFjaztcbiAgICBTQy5nZXQoJy9yZXNvbHZlJywge1xuICAgICAgdXJsOiB1cmxcbiAgICB9KS50aGVuKGZ1bmN0aW9uKHNvdW5kKSB7XG4gICAgICBtZS5nZXRWaWV3KCkuZ2V0Vmlld01vZGVsKCkuc2V0KFwiYWN0dWFsVHJhY2tcIiwgc291bmQpO1xuICAgICAgbWUuZ2V0VmlldygpLmdldFZpZXdNb2RlbCgpLnNldChcImFjdHVhbGhtc1wiLCBQbGF5Z3JvdW5kLnZpZXcud2luYW1wLlV0aWwuY3JlYXRlaG1zU3RyaW5nKHNvdW5kLmR1cmF0aW9uKSk7XG4gICAgICBtZS5nZXREYXRhKHNvdW5kLnN0cmVhbV91cmwpO1xuICAgIH0pO1xuICB9LFxuXG4gIGdldERhdGE6IGZ1bmN0aW9uKHNhbXBsZSkge1xuICAgIG1lID0gdGhpcy5hdWRpb0NvbnRleHQ7XG5cbiAgICBzb3VyY2UgPSBtZS5jcmVhdGVCdWZmZXJTb3VyY2UoKSxcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcblxuICAgIHNvdXJjZS5jb25uZWN0KHRoaXMubWFpbkZpbHRlcik7XG5cbiAgICB2YXIgdXJsID0gbmV3IFVSTChzYW1wbGUgKyAnP2NsaWVudF9pZD0xN2E5OTIzNThkYjY0ZDk5ZTQ5MjMyNjc5N2ZmZjNlOCcpO1xuXG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgdXJsLCB0cnVlKTtcbiAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9IFwiYXJyYXlidWZmZXJcIjtcblxuICAgIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICBtZS5kZWNvZGVBdWRpb0RhdGEocmVxdWVzdC5yZXNwb25zZSxcbiAgICAgICAgZnVuY3Rpb24oYnVmZmVyKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJzYW1wbGUgbG9hZGVkIVwiKTtcbiAgICAgICAgICBzYW1wbGUubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICBzb3VyY2UuYnVmZmVyID0gYnVmZmVyO1xuICAgICAgICAgIHNvdXJjZS5zdGFydCgpO1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkRlY29kaW5nIGVycm9yISBcIik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzYW1wbGUubG9hZGVkID0gZmFsc2U7XG4gICAgcmVxdWVzdC5zZW5kKCk7XG4gIH1cbn0pO1xuXG5FeHQuZGVmaW5lKCdQbGF5Z3JvdW5kLnZpZXcud2luYW1wLldpbmFtcE1vZGVsJywge1xuICAgIGV4dGVuZDogJ0V4dC5hcHAuVmlld01vZGVsJyxcbiAgICBhbGlhczogJ3ZpZXdtb2RlbC53aW5hbXAtbWFpbicsXG4gICAgZGF0YToge1xuICAgICAgICBuYW1lOiAnUGxheWdyb3VuZCcsXG4gICAgICAgIHRyYWNrOiB1bmRlZmluZWQsXG4gICAgICAgIGFjdHVhbFRyYWNrOiB7fSxcbiAgICAgICAgYWN0dWFsaG1zOiAnMDA6MDA6MDAnXG4gICAgfVxufSk7XG4iLCIvKipcbiAqIEV4dEpTIFByb3RvdHlwZSBraXQgYnkgbXV6a2F0XG4gKlxuICogQHBhcmFtIG5hbWVcbiAqIEBwYXJhbSBtYWluQ29tcG9uZW50XG4gKiBAcGFyYW0gbG9naW5OZWVkZWRcbiAqIEByZXR1cm5zIHt7YXBwRGVzY3JpcHRvcjoge25hbWU6ICosIG1haW5Db21wb25lbnQ6ICosIGxvZ2luTmVlZGVkOiAqfSwgYXBwOiB1bmRlZmluZWQsIGxhdW5jaEFwcDogbGF1bmNoQXBwLCBkZWZpbmVCYXNlQ2xhc3M6IGRlZmluZUJhc2VDbGFzcywgc3RhcnQ6IHN0YXJ0fX1cbiAqL1xuZnVuY3Rpb24gbXV6a2F0QXBwKG5hbWUsIG1haW5Db21wb25lbnQsIGxvZ2luTmVlZGVkLCBmaWxlKSB7XG5cbiAgICB2YXIgYXBwTmFtZSA9IG5hbWU7XG4gICAgdmFyIGFwcE1haW5Db21wb25lbnQgPSBtYWluQ29tcG9uZW50O1xuICAgIHZhciBhcHBMb2dpbk5lZWRlZCA9IGxvZ2luTmVlZGVkO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgYXBwOiB1bmRlZmluZWQsXG4gICAgICAgIGFwcE5hbWU6IGFwcE5hbWUsXG4gICAgICAgIGFwcE1haW5Db21wb25lbnQ6IGFwcE1haW5Db21wb25lbnQsXG4gICAgICAgIGFwcExvZ2luTmVlZGVkOiBhcHBMb2dpbk5lZWRlZCxcbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBkZXNjcmlwdG9yXG4gICAgICAgICAqL1xuICAgICAgICBsYXVuY2hBcHA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuZGVmaW5lQmFzZUNsYXNzKCk7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAgICAgKiBAcGFyYW0gbWFpbkNvbXBvbmVudFxuICAgICAgICAgKiBAcGFyYW0gbG9naW5OZWVkZWRcbiAgICAgICAgICovXG4gICAgICAgIGRlZmluZUJhc2VDbGFzczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIEV4dC5kZWZpbmUobWUuYXBwTmFtZSArICcuTWFpbkFwcGxpY2F0aW9uJywge1xuICAgICAgICAgICAgICAgIGV4dGVuZDogJ0V4dC5jb250YWluZXIuQ29udGFpbmVyJyxcbiAgICAgICAgICAgICAgICBhbGlhczogJ3dpZGdldC4nICsgbWUuYXBwTmFtZSArICdNYWluJyxcbiAgICAgICAgICAgICAgICBsYXlvdXQ6ICdmaXQnLFxuXG4gICAgICAgICAgICAgICAgcmVxdWVzdExvZ2luOiBtZS5hcHBMb2dpbk5lZWRlZCxcbiAgICAgICAgICAgICAgICBtYWluQ29tcG9uZW50OiBtZS5hcHBNYWluQ29tcG9uZW50LFxuICAgICAgICAgICAgICAgIGFwcE5hbWU6IG1lLmFwcE5hbWUsXG5cbiAgICAgICAgICAgICAgICBmaWxlQXJyYXk6IFtdLFxuXG4gICAgICAgICAgICAgICAgaW5pdENvbXBvbmVudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucmVxdWVzdExvZ2luKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtcyA9IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeHR5cGU6ICdjb250YWluZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWw6ICdsb2dpbiByZXF1aXJlZC4uLidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tYWluQ29tcG9uZW50ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zID0gW3t4dHlwZTogdGhpcy5tYWluQ29tcG9uZW50fV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maWxlQXJyYXkucHVzaChmaWxlLnVybCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXMgPSBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4dHlwZTogJ2J1dHRvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxheW91dDogJ2ZpdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdNdXprYXQgRnJhbWUgd2FzIGxvYWRlZCB3aXRob3V0IG1vZHVsZSBPUiBzdXBwbGllZCB3aXRoIGEgbW9kdWxlIHVybC4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyOiBmdW5jdGlvbiAoYnRuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbXYgPSBidG4udXAoYXBwTmFtZSArICdNYWluJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdi5jaGFuZ2VDb21wb25lbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbXMgPSBpdGVtcztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWxsUGFyZW50KGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGNoYW5nZUNvbXBvbmVudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRTY3JpcHRzKHRoaXMuZmlsZUFycmF5KS50aGVuKGZ1bmN0aW9uIChzdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBFeHQuZGVmZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lLnJlbW92ZUFsbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lLmFkZCh7eHR5cGU6IGZpbGUuY21wfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAzMDApO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgbG9hZFNjcmlwdHM6IGZ1bmN0aW9uIChqc0Nzc0FycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsb2FkaW5nQXJyYXkgPSBbXSwgbWUgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEV4dC5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEV4dC5BcnJheS5lYWNoKGpzQ3NzQXJyYXksIGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2FkaW5nQXJyYXkucHVzaChtZS5sb2FkU2NyaXB0KHVybCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIEV4dC5Qcm9taXNlLmFsbChsb2FkaW5nQXJyYXkpLnRoZW4oZnVuY3Rpb24gKHN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2FydGVmYWN0cyB3ZXJlIGxvYWRlZCBzdWNjZXNzZnVsbHknKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCdFcnJvciBkdXJpbmcgYXJ0ZWZhY3QgbG9hZGluZy4uLicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgbG9hZFNjcmlwdDogZnVuY3Rpb24gKHVybCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEV4dC5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEV4dC5Mb2FkZXIubG9hZFNjcmlwdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHVybCArICcgd2FzIGxvYWRlZCBzdWNjZXNzZnVsbHknKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgnTG9hZGluZyB3YXMgc3VjY2Vzc2Z1bCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25FcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCgnTG9hZGluZyB3YXMgbm90IHN1Y2Nlc3NmdWwgZm9yOiAnICsgdXJsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLmFwcCA9IEV4dC5hcHBsaWNhdGlvbih7XG4gICAgICAgICAgICAgICAgbmFtZTogbWUuYXBwTmFtZSxcbiAgICAgICAgICAgICAgICBtdXprYXRBcHBSZWY6IHRoaXMsXG4gICAgICAgICAgICAgICAgbWFpblZpZXc6IG1lLmFwcE5hbWUgKyAnLk1haW5BcHBsaWNhdGlvbicsXG4gICAgICAgICAgICAgICAgbGF1bmNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIEV4dC5sb2cobWUuYXBwTmFtZSArICcgYm9vdGVkIScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtdXprYXRBcHA7IiwidmFyIG11emthdEFwcCA9IHJlcXVpcmUoJ211emthdC1leHQtYXBwJyk7XG52YXIgcHQgPSBuZXcgbXV6a2F0QXBwKCdNdXprYXQgRXh0SlM2IFdpZGdldHMnLCAnYXBwLW1haW4nLCBmYWxzZSk7XG5wdC5sYXVuY2hBcHAoKTsiXX0=
