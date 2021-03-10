Ext.define('Mzk.Nrg.NewsGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.newsGrid',
    iconCls: 'fas fa-fire',
    //controller: 'accountGridController',
    listeners: {
        select: function (rowModel, record, index, eOpts) {
            if (rowModel.view) {
                // var view = rowModel.view;
                // view.up('#issueWrapper').updateIssue(record);
            }
        }
    },
    viewModel: {
        data: {
            resultCount: 0
        }
    },

    header: {
        xtype: 'header',
        title: 'Facts & News',
        titlePosition: 0
    },

    mBasetitle: 'Energy Marktpartner',

    hideHeaders: true,
    columns: [
        // {
        //     xtype: 'datecolumn',
        //     dataIndex: 'published',
        //     format: 'd.m.Y H:i:s',flex:1
        // },
        {
            flex: 8,
            dataIndex: 'title',
            renderer: function (value, meta, record, rIndex, cIndex, store, view) {
                var p = record.get('published');
                var dt = Ext.Date.parse(p, 'c');
                value = '<h3>' + Ext.Date.format(dt, 'd.m.Y H:i:s') + '&nbsp;&nbsp; - &nbsp;&nbsp;' +value + '</h3>';
                var c = record.get('company');
                var r = record.get('ressort');
                if (c) {
                    value += '<i>' + r + '&nbsp;&nbsp; - &nbsp;&nbsp;' + c.name + '</i>';
                }


                var keywords = record.get('keywords');
                if (keywords && 'keyword' in keywords) {
                    value += '&nbsp;&nbsp; - &nbsp;&nbsp;' + keywords.keyword.join(', ');
                }
                return value;
            }
        }
    ],

    plugins: [{
        ptype: 'rowwidget',
        widget: {
            xtype: 'container', layout: 'center', items: [], padding: '20 20 20 20'
        },
        onWidgetAttach: function (plugin, widget, record) {
            var storeData = record.get('body');
            storeData = storeData.replace(/\n+/g, '<br>');
            widget.removeAll();
            widget.add({
                xtype: 'container',
                html: storeData + '<br>News Service & Aggregation: Nepoli News, Berlin, Germany'
            });
        }
    }],

    initComponent: function () {

        this.store = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                url: Mzk.Nrg.Api.buildUrl('news/dpa'),
                reader: {
                    type: 'json',
                    rootProperty: 'content.story',
                },
                useDefaultXhrHeader: false,
                // username: 'bnz',
                // password: 'Fumakilla2020-',
                // withCredentials: true,
                extraParams: {
                    codesFrom: 'dvgw'
                }
            },
            autoLoad: true
        });

        this.callParent(arguments);
    }
});
Ext.define('mzk.harvest.grid.dayContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.mzkHarvestDay',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    dayBtnConfig: undefined,

    initComponent: function () {

        var btn = {
            xtype: 'button',
            flex: 1,
            handler: function (btn) {
                var main = btn.up('#editorMain');
                var grid = main.down('mzkHarvestTimeEntriesGrid');
                var s = grid.getStore(),
                    p = s.getProxy(),
                    extraParams = p.getExtraParams();

                var params = {
                    from: Ext.Date.format(btn.date, 'Y-m-d'),
                    to: Ext.Date.format(btn.date, 'Y-m-d')
                };

                if (extraParams) {
                    extraParams = Ext.apply(extraParams, params);
                } else {
                    extraParams = params;
                }
                p.setExtraParams(extraParams);
                s.load();
            }
        };


        var btnCfg = Ext.apply(btn, this.dayBtnConfig);
        var weekday = false;
        if (btnCfg.weekend !== true) {
            btnCfg.cls = 'weekday';
            weekday = true;
        }
        this.weekday = weekday;
        this.items = [
            btnCfg,
            {
                xtype: 'container',
                hidden: true,
                minHeight: 17,
                html: ''
            }];


        this.callParent(arguments);
    },

    analyseEntries: function () {
        var b = this.down('button');
        var total = 0;
        var dayResult = [];
        Ext.Array.each(b.entries, function (recordEntry) {
            var h = recordEntry.get('hours');
            total += h;
            var p = recordEntry.get('project');
            p.task = recordEntry.get('task');
            p.hours = h;
            p.client = recordEntry.get('client');
            dayResult.push(p);
        });
        var c = this.down('container');
        var bookings = '-';
        if(dayResult.length > 0){
            bookings = dayResult.length;
        }
        c.setHtml(total + '<br>' + bookings);
        c.show();
        return {
            total: total,
            weekday: this.weekday,
            dayResult: dayResult
        };
    }
});
Ext.define('Mzk.Harvest.Main', {
    extend: 'Ext.container.Container',
    alias: 'widget.mzkHarvestMain',
    layout: 'fit',
    title: 'Harvest',
    items: [{
        xtype: 'tabpanel',
        tabPosition: 'left',
        tabRotation: 0,
        items: [
            /*{
            xtype: 'mzkHarvestTimeEntriesGrid',
            title: 'Overview',
            iconCls: 'fas fa-clock'
        }, */{
                xtype: 'panel',
                title: 'Editor',
                iconCls: 'fas fa-edit',
                layout: {
                    type: 'vbox', align: 'stretch'
                },
                itemId: 'editorMain',
                items: [{
                    xtype: 'container',
                    layout: 'center',
                    padding: '5 5 5 5',
                    items: [{
                        xtype: 'container',
                        layout: {
                            type: 'vbox', align: 'stretch'
                        },
                        defaults: {
                            padding: '5 5 5 5'
                        },
                        items: [{
                            xtype: 'container',
                            layout: 'center',
                            items: [{
                                xtype: 'container',
                                layout: {
                                    type: 'hbox', align: 'stretch'
                                },
                                items: [{
                                    xtype: 'datefield',
                                    fieldLabel: 'From',
                                    format: 'Y-m-d',
                                    value: new Date()
                                }, {
                                    xtype: 'datefield',
                                    fieldLabel: 'To',
                                    format: 'Y-m-d',
                                    value: new Date()  // defaults to today
                                }, {
                                    xtype: 'button',
                                    iconCls: 'fas fa-check', handler: function (btn) {
                                        var main = btn.up('#editorMain');
                                        var grid = main.down('mzkHarvestTimeEntriesGrid');
                                        var dfs = main.query('datefield');
                                        var params = {};
                                        var dateRange = {};
                                        Ext.Array.each(dfs, function (df) {
                                            var l = df.getFieldLabel();
                                            params[l.toLowerCase()] = Ext.Date.format(df.getValue(), df.format);
                                            dateRange[l.toLowerCase()] = df.getValue();
                                        });
                                        var s = grid.getStore(),
                                            p = s.getProxy(),
                                            extraParams = p.getExtraParams();

                                        if (extraParams) {
                                            extraParams = Ext.apply(extraParams, params);
                                        } else {
                                            extraParams = params;
                                        }

                                        var firstDate = dateRange.from;
                                        var secondDate = dateRange.to;

                                        var diffDays = Ext.Date.diff(firstDate, secondDate, Ext.Date.DAY);

                                        var visu = main.down('#daysCon');
                                        visu.removeAll();
                                        for (i = 0; i <= diffDays; i++) {
                                            visu.add({
                                                dayBtnConfig: {
                                                    text: Ext.Date.format(firstDate, 'd.'),
                                                    tooltip: Ext.Date.format(firstDate, 'd.m.Y'),
                                                    itemId: 'd' + Ext.Date.format(firstDate, 'Ymd'),
                                                    date: firstDate,
                                                    weekend: Ext.Date.isWeekend(firstDate),
                                                    entries: []
                                                }
                                            });
                                            firstDate = Ext.Date.add(firstDate, Ext.Date.DAY, 1);
                                        }

                                        p.setExtraParams(extraParams);
                                        s.load();
                                    }
                                }]
                            }]
                        },
                            {
                                xtype: 'container',
                                itemId: 'daysCon',
                                defaultType: 'mzkHarvestDay',
                                layout: {
                                    type: 'hbox', align: 'stretch'
                                }
                            }, {
                                xtype: 'container',
                                layout: {
                                    type: 'hbox', align: 'stretch'
                                },
                                defaultType: 'container',
                                items: [{

                                        minHeight: 100,
                                        width: '80%',
                                        html: '',
                                        itemId: 'results', flex: 1
                                },{
                                    layout: 'center',
                                    items: [{
                                        xtype: 'container',
                                        minHeight: 100,
                                        width: '80%',
                                        flex: 1,
                                        itemId: 'projects', hidden:true,layout: {
                                            type: 'hbox', align: 'stretch'
                                        }
                                    }]
                                },]
                            }]
                    }]

                }, {
                    xtype: 'mzkHarvestTimeEntriesGrid',
                    header: false,
                    flex: 4,
                    onStoreLoad: function (store, records, success) {
                        if (success) {
                            var main = this.up('#editorMain');
                            if (main) {
                                if (records) {
                                    //main.query('mzkHarvestDay')
                                    var array = main.query('mzkHarvestDay');
                                    array.map(function (item) {
                                        var b = item.down('button');
                                        b.entries = [];
                                    });
                                    Ext.Array.each(records, function (record, index, array) {
                                        var d = record.get('spent_date');
                                        if (d) {
                                            var a = d.split('-');
                                            var b = main.down('#d' + a.join(''));
                                            if (b) {
                                                b.entries.push(record);
                                            }
                                        }
                                    });

                                    var analysis = [];
                                    array.map(function (item) {
                                        analysis.push(item.analyseEntries());
                                    });

                                    var hoursDone = 0;
                                    var hoursToDo = 0;
                                    var projects = {};
                                    Ext.Array.each(analysis, function (o) {

                                        if (o.weekday === true) {
                                            hoursToDo += 8;
                                        }

                                        hoursDone += o.total;
                                        Ext.Array.each(o.dayResult, function (day, index) {
                                            var o;
                                            if (day.id in projects) {
                                                projects[day.id]['hours'] = projects[day.id]['hours'] + day.hours;
                                            } else {
                                                projects[day.id] = {
                                                    hours: day.hours, name: day.name
                                                }
                                            }
                                        });
                                    });

                                    var p = main.down('#projects');

                                    var cmp = [];
                                    Ext.iterate(projects, function (projectId, obj) {
                                        cmp.push({
                                            xtype: 'container',
                                            html: obj.name,
                                            minHeight: 120,
                                            flex: parseInt(obj.hours)
                                        });
                                    });
                                    p.add(cmp);

                                    var res = main.down('#results');

                                    var daysSick = 4;
                                    var offsetDone = 0;
                                    var offsetToAdd = 0;
                                    var bruttoDays = hoursToDo / 8;
                                    hoursToDo = hoursToDo - daysSick * 8;
                                    var nettoDays = hoursToDo / 8;
                                    hoursDone = hoursDone - offsetDone + offsetToAdd;
                                    var saldo = hoursToDo - hoursDone;

                                    var html = '<table>';
                                    html += '<tr><td>STUNDEN (SOLL)</td><td>' + hoursToDo + '</td>';
                                    html += '<tr><td>STUNDEN (IST)</td><td>' + hoursDone + '</td>';
                                    html += '<tr><td>SALDO</td><td>' + saldo + '</td>';
                                    html += '<tr><td>&nbsp;</td><td>&nbsp;</td>';
                                    html += '<tr><td>ARBEITSTAGE (BRUTTO)</td><td>' + bruttoDays + '</td>';
                                    html += '<tr><td>ARBEITSTAGE (NETTO)</td><td>' + nettoDays + '</td>';
                                    html += '<tr><td>ARBEITSTAGE (SICK)</td><td>' + daysSick + '</td>';
                                    html += '<tr><td>&nbsp;</td><td>&nbsp;</td>';
                                    html += '<tr><td>OFFSET STUNDEN (DONE-)</td><td>' + offsetDone + '</td>';
                                    html += '<tr><td>OFFSET STUNDEN (ADD+)</td><td>' + offsetToAdd + '</td>';
                                    html += '</table>';

                                    res.setHtml(html);
                                }
                            }
                        } else {
                            // handle error
                        }
                    }
                }]
            }]
    }]
});


Ext.define('mzk.harvest.grid.main', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.mzkHarvestTimeEntriesGrid',
    tbar: [],
    hideHeaders: true,
    columns: [
        {
            text: 'KEY',
            dataIndex: 'id',
            flex: 1
        }, {
            dataIndex: 'spent_date',
            flex: 1
        }, {
            dataIndex: 'hours',
            flex: 1
        }, {
            dataIndex: 'notes',
            flex: 1
        }, {
            dataIndex: 'project',
            flex: 1,
            renderer: function (value, metadata, record, rowIndex, colIndex, store, view) {
                //var recordData = record.getData();
                return value.name;
            }
        }, {
            dataIndex: 'external_reference',
            flex: 1,
            renderer: function (value, metadata, record, rowIndex, colIndex, store, view) {
                if (value && 'permalink' in value) {
                    return value.permalink;
                }
                return ' - ';
            }
        }, {
            dataIndex: 'spent_date',
            flex: 1
        },
        {
            text: 'SUMMARY', dataIndex: 'title', flex: 4, cellWrap: true,
            renderer: function (value, metadata, record, rowIndex, colIndex, store, view) {
                var recordData = record.getData();
                return JSON.stringify(recordData);
            }
        }
    ],
    bbar: {
        xtype: 'pagingtoolbar',
        displayInfo: true
    },
    onStoreLoad: function (store, records, success) {
        return null;
    },
    initComponent: function () {
        var me = this;
        this.store = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                url: '/time/users/me/bookings',
                reader: {
                    type: 'json',
                    rootProperty: 'time_entries',
                    totalProperty: 'total_entries'
                },
                noCache: false,
                pageSize: 100
            },
            pageSize: 100,
            autoLoad: false,
            listeners: {
                load: function (s, records, successful, operation, eOpts) {
                    me.onStoreLoad(s, records, successful);
                }
            }
        });
        this.callParent(arguments);
    }

});


/**
 * Created by bnz on 27.08.17
 */

Ext.define('MuzkatFinance.SprintView.GridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.sprintGridViewController',

    onSelect: function (rowModel, record, index, eOpts) {
        var key = record.get('id');
        if (rowModel.view) {
            // var view = rowModel.view;
            // view.up('#issueWrapper').updateIssue(key);
            Ext.log({dump: key});
            Ext.Ajax.request({
                method: 'GET',
                url: '/agile/boards/15/issues/' + key,
                disableCaching: false,
            }).then(function (response, opts) {
                    var obj = Ext.decode(response.responseText, true);
                    if (obj) {
                        var transformed = {};
                        transformed.total = obj.total ? obj.total : null;
                        if (transformed.total !== null && transformed.total > 0) {
                            transformed.items = [];
                            Ext.Array.each(obj.issues, function (jissue) {
                                var issue = {};
                                issue.key = jissue.key;
                                jissue = jissue.fields;
                                issue.status = jissue.status.name;
                                if (jissue.assignee && jissue.assignee.name) {
                                    issue.assignee = jissue.assignee.name;
                                    issue.assigneeKey = jissue.assignee.key;
                                }
                                transformed.items.push(issue);
                            });
                        }
                        Ext.log({dump: transformed});
                    }
                },
                function (response, opts) {
                    // me.getViewModel().set('profile.createAble', true);
                });
        }
    }
});


Ext.define('MuzkatFinance.SprintView.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.sprintGridView',

    viewModel: {
        data: {
            title: 'Closed'
        }
    },

    controller: 'sprintGridViewController',
    listeners: {
        select: 'onSelect'
    },

    hideHeaders: true,
    columns: [
        {text: 'Status', dataIndex: 'state', flex: 1},
        {
            text: 'ID',
            dataIndex: 'id',
            flex: 2
        },
        {text: 'Name', dataIndex: 'name', flex: 4, cellWrap: true},
        {text: 'ASSIGNEE', dataIndex: 'startDate', flex: 1},
        {text: 'CREATOR', dataIndex: 'endDate', flex: 1},
        {text: 'CREATOR', dataIndex: 'completeDate', flex: 1}
    ],

    bind: {
        title: '{title}'
    },

    jViewType: undefined,
    initComponent: function () {
        var url = '/agile/boards/15',
            title = 'Closed';

        if (Ext.isDefined(this.jViewType)) {
            if (this.jViewType === 'upcoming') {
                url += '/' + this.jViewType;
                title = 'Latest & upcoming';
                this.enableToolbarBottom();
            }
        } else {
            url += '/closed';
        }
        this.store = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                url: url,
                reader: {
                    type: 'json',
                    rootProperty: 'values'
                },
                noCache: false
            },
            autoLoad: true
        });

        this.callParent(arguments);
        this.getViewModel().set('title', title)
    },

    enableToolbarBottom: function () {
        this.bbar = [{
            xtype: 'container',
            flex: 1,
            height: 150,
            layout: 'fit',
            items: [{
                xtype: 'box',
                html: 'Kein Sprint gewählt'
            }]
        }]
    }

});


Ext.define('MuzkatFinance.SprintView.Overview', {
    extend: 'Ext.container.Container',
    alias: 'widget.sprintOverview',
    title: 'BPC Sprints',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'sprintGridView',
        jViewType: 'upcoming',
        flex: 1
    }, {
        xtype: 'sprintGridView',
        flex: 1
    }],

    initComponent: function () {
        // this.MuzkatFinance.Service.getIssueTypes();
        this.callParent(arguments);
    }
});
Ext.define('Mzk.Jira.GridLine', {
    extend: 'Ext.data.Model',
    fields: [
        'key',
        'fields',
        {
            name: 'title',
            calculate: function (data) {
                var value = null;
                if (data.fields.summary) {
                    value = data.fields.summary;
                }
                return value;
            }
        },
        {
            name: 'description',
            calculate: function (data) {
                var value = null;
                if (data.fields.description) {
                    value = data.fields.description;
                }
                return value;
            }
        },
        {
            name: 'created',
            calculate: function (data) {
                var value = null;
                if (data.fields.created) {
                    value = new Date(data.fields.created);
                }
                return value;
            }
        },
        {
            name: 'creator',
            calculate: function (data) {
                var value = null;
                if (data.fields.creator) {
                    value = data.fields.creator.displayName;
                }
                return value;
            }
        },
        {
            name: 'assignee',
            calculate: function (data) {
                var value = null;
                if (data.fields.assignee) {
                    value = data.fields.assignee.displayName;
                }
                return value;
            }
        }]
});

Ext.define('Mzk.Jira.GridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.issuesGridController',

    control: {
        '*': {
            collapsebody: 'collapsebody',
            expandbody: 'expandbody'
        }
    },

    collapsebody: function (rowNode, record, expandRow, eOpts) {
        Ext.Msg.alert('Collapse', 'The Add button was clicked');
    },

    expandbody: function (rowNode, record, expandRow, eOpts) {
        Ext.Msg.alert('Expand', 'The Add button was clicked');
    },

    onSelect: function (rowModel, record, index, eOpts) {
        var key = record.get('key');
        if (rowModel.view) {
            var view = rowModel.view;
            view.up('#issueWrapper').updateIssue(key);
            view.up('#issueWrapper').down('muzkatJsonTextArea').down('textareafield').setValue(JSON.stringify(record.getData()));
        }
    }
});

Ext.define('Mzk.Jira.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.issuesGrid',
    title: 'ISSUES',
    iconCls: 'x-fa fa-fire',
    controller: 'issuesGridController',
    listeners: {
        select: 'onSelect'
    },
    hideHeaders: true,
    columns: [
        {
            text: 'KEY',
            dataIndex: 'key',
            flex: 2,
            renderer: function (value, metadata, record, rowIndex, colIndex, store, view) {
                var record = record.getData();
                var closed = false;
                if (record && record.fields && record.fields.status.name === 'Closed') {
                    closed = true;
                    metadata.tdStyle = 'color:black;text-decoration: line-through;';
                }
                if (record && record.fields && record.fields.issuetype) {
                    var issueObj = Mzk.Jira.Service.issueTypeMap.get(record.fields.issuetype.id);
                    if (Ext.isObject(issueObj) && issueObj.iconCls) {
                        var color = issueObj.color;
                        if (closed === true) {
                            // color = '#000';
                        }
                        value = "<span class='" + issueObj.iconCls + "' style='color:" + color + ";margin-left:5px;'></span>&nbsp;&nbsp;" + value;
                    }
                    metadata.tdAttr = 'data-qtip=' + record.fields.issuetype.name;
                }
                return value;
            }
        },
        {text: 'SUMMARY', dataIndex: 'title', flex: 4, cellWrap: true},
        {
            text: 'CREATED',
            flex: 1,
            dataIndex: 'created',
            renderer: function (value, metadata, record, rowIndex, colIndex, store, view) {
                metadata.tdAttr = 'data-qtip=' + Ext.Date.format(value, 'd.m.Y H:i:s');
                var created = value,
                    now = new Date(),
                    fromDate = parseInt(created.getTime() / 1000),
                    toDate = parseInt(now.getTime() / 1000),
                    timeDiff = (toDate - fromDate) / 3600,
                    timeDiff = Math.round(timeDiff),
                    dateString = timeDiff + ' h ago';
                if (timeDiff === 0) {
                    dateString = 'now';
                }

                if (timeDiff === 1) {
                    dateString = timeDiff + ' h ago';
                }

                if (timeDiff > 24) {
                    timeDiff = timeDiff / 24;
                    timeDiff = Math.round(timeDiff);
                    dateString = timeDiff + ' d ago';
                }

                dateString = '<i>' + dateString + '</i>';
                dateString = '<span class="x-fa fa-clock-o" style="color:#4CAF50"></span>&nbsp;&nbsp;' + dateString;
                return dateString;
            }
        },
        {text: 'ASSIGNEE', dataIndex: 'assignee', flex: 1},
        {text: 'CREATOR', dataIndex: 'creator', flex: 1}
    ],

    isWidget: false,

    initComponent: function () {
        var url = null;
        if (Ext.isDefined(Mzk.Jira.Service.baseUrl)) {
            url = Mzk.Jira.Service.baseUrl;
        } else {
            Mzk.Jira.Service.baseUrl = this.backendUrl;
            Mzk.Jira.Service.getIssueTypes();
            url = this.backendUrl;
        }

        url += '/issues';

        if (this.isWidget === true) {
            Ext.Array.each(this.columns, function (col, index, array) {
                if (index > 2) {
                    col.hidden = true;
                }
            });
        }

        this.store = Ext.create('Ext.data.BufferedStore', {
            proxy: {
                type: 'ajax',
                url: url,
                reader: {
                    type: 'json',
                    rootProperty: 'issues',
                    totalProperty: 'total'
                },
                noCache: false,
                pageParam: ''
            },
            pageSize: 100,
            autoLoad: true,
            model: 'Mzk.Jira.GridLine'
        });

        this.callParent(arguments);
    }
});

Ext.define('Mzk.Jira.Grid.Reporter', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.mzkJiraReporterGrid',
    title: 'REPORTER',
    iconCls: 'x-fa fa-user',
    hideHeaders: true,
    columns: [
        {text: 'NAME', dataIndex: 'name', flex: 1},
        {
            text: 'REPORTED', dataIndex: 'reported', flex: 1,
            summaryType: 'count'
        }
    ], features: [{
        ftype: 'summary'
    }],

    isWidget: false,

    initComponent: function () {
        this.store = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                timeout: 90000,
                noCache: false,
                pageParam: '',
                limitParam: '',
                startParam: '',
                url: 'http://build.virtimo.net/node/jira/reporter/list',
                reader: {
                    type: 'json',
                    rootProperty: 'items',
                    totalProperty: 'total'
                }
            },
            autoLoad: true,
            fields: ['name', 'reported'],
            sorters: [{
                property: 'reported', direction: 'DESC'
            }]
        });

        this.callParent(arguments);
    }
});

Ext.define('Mzk.Jira.Grid.Tickets', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.mzkJiraTicketsGrid',
    title: 'TICKETS',
    iconCls: 'x-fa fa-ticket',
    hideHeaders: true,
    columns: [
        {text: 'TYPE', dataIndex: 'name', flex: 1},
        {
            text: 'REPORTED', dataIndex: 'reported', flex: 1,
            summaryType: 'count'
        }
    ], features: [{
        ftype: 'summary'
    }],

    isWidget: false,

    initComponent: function () {
        this.store = Ext.create('Ext.data.Store', {
            fields: ['name', 'reported'],
            proxy: {
                type: 'ajax',
                timeout: 90000,
                noCache: false,
                pageParam: '',
                limitParam: '',
                startParam: '',
                url: 'http://build.virtimo.net/node/jira/tickets/list',
                reader: {
                    type: 'json',
                    rootProperty: 'items',
                    totalProperty: 'total'
                }
            },
            autoLoad: true,
            sorters: [{
                property: 'reported', direction: 'DESC'
            }]
        });

        this.callParent(arguments);
    }
});


Ext.define('Mzk.Jira.Service', {
    singleton: true,
    issuetypes: [],
    issuesLoaded: false,
    baseUrl: undefined,
    getBase: function () {
        var base = null;
        if (Ext.isDefined(this.baseUrl)) {
            base = this.baseUrl.replace('jira', '');
        }
        return base;
    },
    getIssueTypes: function () {
        if (this.issuetypes.length > 0) {
            return this.issuetypes;
        } else {
            if (this.issuesLoaded === false) {
                this.issuesLoaded = true;
                var me = this;
                Ext.Ajax.request({
                    method: 'GET',
                    url: this.baseUrl + '/issuetypes',
                    disableCaching: false,
                }).then(function (response, opts) {
                        var array = Ext.decode(response.responseText, true);
                        if (array !== null) {
                            me.issuetypes = array;
                            Ext.Array.each(array, function (issue) {
                                var iconCls = 'x-fa fa-bug';
                                var color = '#607D8B';
                                if (issue.id === "1") {
                                    iconCls = 'x-fa fa-bug'
                                    color = '#ff1744'
                                }

                                if (issue.id === "2") {
                                    iconCls = 'x-fa fa-cogs'
                                    color = '#00BCD4'
                                }

                                if (issue.id === "3") {
                                    iconCls = 'x-fa fa-check-square'
                                    color = '#FFEB3B'
                                }

                                me.issueTypeMap.add(issue.id, {
                                    name: issue.name,
                                    desc: issue.description,
                                    iconCls: iconCls,
                                    color: color
                                });
                            });
                        }
                    },
                    function (response, opts) {
                        // me.getViewModel().set('profile.createAble', true);
                    });
            }
        }
    },
    issueTypeMap: new Ext.util.HashMap()
});

Ext.define('Mzk.Jira.Main', {
    extend: 'Ext.container.Container',
    alias: 'widget.mzkJiraMain',
    layout: 'fit',
    config: {
        backendUrl: null
    },
    padding: '15 15 15 15',
    items: [{
        xtype: 'panel',
        layout: 'card',
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'top',
            padding: '5 5 5 5',
            items: [{
                iconCls: 'x-fa fa-bullseye',
                scale: 'large',
                tooltip: 'BPC Issues',
                margin: '2 2 2 2',
                style: 'border-style: none; border-width: 0px;',
                handler: function (btn) {
                    btn.up('panel').setActiveItem('issueWrapper');
                }
            }, {
                iconCls: 'x-fa fa-plug',
                scale: 'large',
                tooltip: 'BPC Sprints',
                margin: '2 2 2 2',
                style: 'border-style: none; border-width: 0px;',
                handler: function (btn) {
                    btn.up('panel').setActiveItem('sprintOverview');
                }
            }, {
                iconCls: 'x-fa fa-user',
                scale: 'large',
                tooltip: 'USER / REPORTER',
                margin: '2 2 2 2',
                style: 'border-style: none; border-width: 0px;',
                handler: function (btn) {
                    btn.up('panel').setActiveItem('reporter');
                }
            }, {
                iconCls: 'x-fa fa-ticket',
                scale: 'large',
                tooltip: 'TICKETS',
                margin: '2 2 2 2',
                style: 'border-style: none; border-width: 0px;',
                handler: function (btn) {
                    btn.up('panel').setActiveItem('tickets');
                }
            }]
        }],
        items: [{
            xtype: 'container',
            title: 'ISSUES',
            padding: '5 5 5 5',
            iconCls: 'x-fa fa-fire',
            itemId: 'issueWrapper',
            viewModel: {
                data: {
                    activeItem: null
                }
            },
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'issuesGrid',
                    header: false,
                    flex: 4
                },
                {
                    xtype: 'muzkatJsonViewer',
                    flex: 3
                }],
            updateIssue: function (key) {
                this.getViewModel().set('activeItem', key);
            }
        }, {
            xtype: 'sprintOverview'
        }, {
            xtype: 'mzkJiraReporterGrid', itemId: 'reporter'
        }, {
            xtype: 'mzkJiraTicketsGrid', itemId: 'tickets'
        }]
    }],

    initComponent: function () {
        Mzk.Jira.Service.baseUrl = this.config.backendUrl;
        Mzk.Jira.Service.getIssueTypes();
        this.callParent(arguments);
    }
});




/**
 * Created by bnz on 27.08.17
 */

Ext.define('MuzkatFinance.SprintView.GridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.sprintGridViewController',

    onSelect: function (rowModel, record, index, eOpts) {
        var key = record.get('id');
        if (rowModel.view) {
            // var view = rowModel.view;
            // view.up('#issueWrapper').updateIssue(key);
            Ext.log({dump: key});
            Ext.Ajax.request({
                method: 'GET',
                url: Mzk.Jira.Service.getBase() + '/agile/boards/15/issues/' + key,
                disableCaching: false,
            }).then(function (response, opts) {
                    var obj = Ext.decode(response.responseText, true);
                    if (obj) {
                        var transformed = {};
                        transformed.total = obj.total ? obj.total : null;
                        if (transformed.total !== null && transformed.total > 0) {
                            transformed.items = [];
                            Ext.Array.each(obj.issues, function (jissue) {
                                var issue = {};
                                issue.key = jissue.key;
                                jissue = jissue.fields;
                                issue.status = jissue.status.name;
                                if (jissue.assignee && jissue.assignee.name) {
                                    issue.assignee = jissue.assignee.name;
                                    issue.assigneeKey = jissue.assignee.key;
                                }
                                transformed.items.push(issue);
                            });
                        }
                        Ext.log({dump: transformed});
                    }
                },
                function (response, opts) {
                    // me.getViewModel().set('profile.createAble', true);
                });
        }
    }
});


Ext.define('MuzkatFinance.SprintView.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.sprintGridView',

    viewModel: {
        data: {
            title: 'Closed'
        }
    },

    controller: 'sprintGridViewController',
    listeners: {
        select: 'onSelect'
    },

    hideHeaders: true,
    columns: [
        {text: 'Status', dataIndex: 'state', flex: 1},
        {
            text: 'ID',
            dataIndex: 'id',
            flex: 2
        },
        {text: 'Name', dataIndex: 'name', flex: 4, cellWrap: true},
        {text: 'ASSIGNEE', dataIndex: 'startDate', flex: 1},
        {text: 'CREATOR', dataIndex: 'endDate', flex: 1},
        {text: 'CREATOR', dataIndex: 'completeDate', flex: 1}
    ],

    bind: {
        title: '{title}'
    },

    jViewType: undefined,
    initComponent: function () {
        var url = Mzk.Jira.Service.getBase() + '/agile/boards/15',
            title = 'Closed';

        if (Ext.isDefined(this.jViewType)) {
            if (this.jViewType === 'upcoming') {
                url += '/' + this.jViewType;
                title = 'Latest & upcoming';
                this.enableToolbarBottom();
            }
        } else {
            url += '/closed';
        }
        this.store = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                url: url,
                reader: {
                    type: 'json',
                    rootProperty: 'values'
                },
                noCache: false
            },
            autoLoad: true
        });

        this.callParent(arguments);
        this.getViewModel().set('title', title)
    },

    enableToolbarBottom: function () {
        this.bbar = [{
            xtype: 'container',
            flex: 1,
            height: 150,
            layout: 'fit',
            items: [{
                xtype: 'box',
                html: 'Kein Sprint gewählt'
            }]
        }]
    }

});


Ext.define('MuzkatFinance.SprintView.Overview', {
    extend: 'Ext.container.Container',
    alias: 'widget.sprintOverview',
    itemId: 'sprintOverview',
    title: 'BPC Sprints',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'sprintGridView',
        jViewType: 'upcoming',
        flex: 1
    }, {
        xtype: 'sprintGridView',
        flex: 1
    }],

    initComponent: function () {
        // this.MuzkatFinance.Service.getIssueTypes();
        this.callParent(arguments);
    }
});
/*
Created by Erik Woitschig @devbnz
*/
Ext.define('MuzkatFinance.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.mzkJiraProjectGrid',
    title: 'BPC ISSUES',
    iconCls: 'fas fa-ticket-alt',
    controller: 'accountGridController',
    listeners: {
        select: 'onSelect'
    },
    tbar: [],
    hideHeaders: true,
    columns: [
        {
            text: 'KEY',
            dataIndex: 'key',
            flex: 1, /*
            renderer: function (value, metadata, record, rowIndex, colIndex, store, view) {
                var record = record.getData();
                var closed = false;
                // var issueTypeArray = MuzkatFinance.Service.issuetypes;
                if (record && record.fields && record.fields.status.name === 'Closed') {
                    // var issueObj = MuzkatFinance.Service.issueTypeMap.get(record.fields.issuetype.id);
                    // if (Ext.isObject(issueObj) && issueObj.iconCls) {
                    //     value = "<span class='" + issueObj.iconCls + "' style='color:" + issueObj.color + ";margin-left:5px;'></span>&nbsp;&nbsp;" + value;
                    // }
                    closed = true;
                    metadata.tdStyle = 'color:black;text-decoration: line-through;';
                }
                if (record && record.fields && record.fields.issuetype) {
                    var issueObj = MuzkatFinance.Service.issueTypeMap.get(record.fields.issuetype.id);
                    if (Ext.isObject(issueObj) && issueObj.iconCls) {
                        var color = issueObj.color;
                        if (closed === true) {
                            // color = '#000';
                        }
                        value = "<span class='" + issueObj.iconCls + "' style='color:" + color + ";margin-left:5px;'></span>&nbsp;&nbsp;" + value;
                    }
                    metadata.tdAttr = 'data-qtip=' + record.fields.issuetype.name;
                }
                // dateString = '<i>' + dateString + '</i>';
                // dateString = '<span class="x-fa fa-clock-o" style="color:#4CAF50"></span>&nbsp;&nbsp;' + dateString;
                return value;
            }*/
        },{
            dataIndex: 'key',
            flex: 1,
            renderer: function (value, metadata, record, rowIndex, colIndex, store, view) {
                var record = record.getData();
                var closed = false;
                // var issueTypeArray = MuzkatFinance.Service.issuetypes;
                if (record && record.fields && record.fields.status && record.fields.status.name) {
                    value = record.fields.status.name;
                }
                return value;
            }
        },
        {text: 'SUMMARY', dataIndex: 'title', flex: 4, cellWrap: true},
        {
            text: 'CREATED',
            flex: 1,
            xtype: 'datecolumn',
            dataIndex: 'created',format: 'd.m.Y'
        },
        {text: 'ASSIGNEE', dataIndex: 'assignee', flex: 1},
        {text: 'CREATOR', dataIndex: 'creator', flex: 1}
    ],
    bbar: {
        xtype: 'pagingtoolbar',
        displayInfo: true
    },

    initComponent: function () {
        // this.MuzkatFinance.Service.getIssueTypes();


        this.store = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                url: '/jira/' + this.projectId + '/issues',
                reader: {
                    type: 'json',
                    rootProperty: 'issues',
                    totalProperty: 'total'
                },
                noCache: false,
                pageParam: ''
            },
            pageSize: 100,
            autoLoad: true,
            model: 'MuzkatFinance.GridLine'
        });

        this.callParent(arguments);
    }
});
Ext.define('MuzkatFinance.GridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.accountGridController',

    onSelect: function (rowModel, record, index, eOpts) {
        var key = record.get('key');
        if (rowModel.view) {
            var view = rowModel.view;
            view.up('#issueWrapper').updateIssue(key);
        }
    }
});








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
Ext.define('muzkatMap.baseMap', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.muzkatBaseMap',

    region: 'center',
    layout: 'fit',
    title: 'Map'
});

Ext.define('muzkatMap.mapDetails', {
    extend: 'Ext.container.Container',
    alias: 'widget.muzkatMapDetails',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    addMarkerToStore: function (markerObj) {
        this.down('#markerGrid').getStore().add(markerObj);
    },

    items: [
        {
            xtype: 'grid',
            itemId: 'markerGrid',
            store: Ext.create('Ext.data.Store', {
                data: []
            }),
            hideHeaders: true,
            columns: [
                {text: 'Typ', dataIndex: 'type'},
                {text: 'Name', dataIndex: 'desc', flex: 1},
                {
                    xtype: 'actioncolumn',
                    width: 50,
                    items: [{
                        iconCls: 'x-fa fa-eye',
                        tooltip: 'Ein/ausblenden',
                        handler: function (grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            var map = grid.up('muzkatOsm').getMapReference();
                            var markerRef = rec.get('ref');
                            var hidden = rec.get('hidden');
                            if (Ext.isDefined(hidden) && hidden === true) {
                                markerRef.addTo(map);
                                rec.set('hidden', false);
                            } else {
                                markerRef.remove();
                                rec.set('hidden', true);
                            }
                        }
                    }, {
                        iconCls: 'x-fa fa-remove',
                        tooltip: 'Eintrag entfernen',
                        handler: function (grid, rowIndex, colIndex) {
                            var store = grid.getStore();
                            var rec = store.getAt(rowIndex);
                            var markerRef = rec.get('ref');
                            markerRef.remove();
                            store.remove(rec);
                        }
                    }]
                }
            ],
            flex: 1,
            tbar: [
                {
                    value: 'Marker and other Overlays',
                    xtype: 'displayfield'
                }
            ],
            bbar: [
                {
                    iconCls: 'x-fa fa-plus',
                    menu: {
                        plain: true,
                        items: [
                            {
                                iconCls: 'x-fa fa-map-marker', text: 'Marker'
                            },
                            {
                                iconCls: 'x-fa fa-circle-o', text: 'Umkreis'
                            }
                        ]
                    }
                }, {
                    iconCls: 'x-fa fa-trash'
                }, {
                    iconCls: 'x-fa fa-download'
                }, {
                    value: 'Actions',
                    xtype: 'displayfield'
                }
            ]
        }
    ]
});
Ext.define('muzkatMap.muzkatMap', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.muzkatMap',

    layout: 'fit',
    title: 'ExtJs Universal Map component by muzkat',
    header: true,
    hideDetails: false,
    defaultCenter: 'berlin',
    point: undefined,

    initComponent: function () {

        this.items = [
            {
                xtype: 'muzkatOsm',
                defaultCenter: this.defaultCenter,
                header: this.header,
                hideDetails: this.hideDetails,
                point: this.point
            }
        ];

        this.callParent(arguments);
    }
});

Ext.define('muzkatMap.muzkatMapWidget', {
    extend: 'muzkatMap.muzkatMap',
    alias: 'widget.muzkatMapWidget',

    header: true,
    hideDetails: true
});

Ext.define('muzkatMap.muzkatosm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.muzkatOsm',

    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    title: 'Muzkat Open Street Map',

    hideDetails: undefined, // set by constructor - default: false
    defaultCenter: undefined,
    point: undefined,

    initComponent: function () {
        this.items =
            [
                {xtype: 'muzkatMapDetails', flex: 1, hidden: this.hideDetails},
                {xtype: 'muzkatOsmMap', flex: 5, defaultCenter: this.defaultCenter, point: this.point}
            ];
        this.callParent(arguments);
    },

    addMarker: function (markerObj) {
        this.down('muzkatMapDetails').addMarkerToStore(markerObj);
    },

    getMapReference: function () {
        return this.down('muzkatOsmMap').map;
    }
});

Ext.define('muzkatMap.contextmenu.MapContextmenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.muzkatOsmCm',

    parentCmpReference: undefined,
    mapEventReference: undefined,

    margin: '0 0 10 0',
    plain: true,
    items: [{
        iconCls: 'x-fa fa-map-marker',
        text: 'Marker platzieren',
        handler: function (btn) {
            var muzkatOsmCm = btn.up('muzkatOsmCm');
            var me = muzkatOsmCm.parentCmpReference,
                e = muzkatOsmCm.mapEventReference;
            me.placeMarker({
                id: new Date().getTime(),
                lat: e.latlng.lat,
                lng: e.latlng.lng,
                desc: 'dummy'
            })
        }
    }, {
        iconCls: 'x-fa fa-circle-o',
        text: 'Umkreis setzen',
        handler: function (btn) {
            var muzkatOsmCm = btn.up('muzkatOsmCm');
            var me = muzkatOsmCm.parentCmpReference,
                e = muzkatOsmCm.mapEventReference;
            L.circle(e.latlng, 500, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5
            }).addTo(me.map).bindPopup("Umkreis");
        }
    }]
});


Ext.define('muzkatMap.maps.osm', {
    extend: 'muzkatMap.baseMap',
    alias: 'widget.muzkatOsmMap',

    viewModel: {
        data: {
            lastLatLng: 'nothing clicked'
        }
    },

    header: false,

    bind: {
        title: 'Open Street / Open Sea Map - Last click: {lastLatLng}'
    },

    coords: {
        berlin: {
            lat: 52.5,
            lng: 13.4,
            zoom: 12
        },
        trogir: {
            lat: 43.51561484804046,
            lng: 16.250463724136356,
            zoom: 15
        }
    },

    markers: [{
        id: 'hotel',
        desc: 'Bifora Hotel',
        lat: 43.51386,
        lng: 16.25036
    }],

    point: undefined,

    placeMarkers: function () {
        var me = this;
        Ext.Array.each(this.markers, function (markerObj) {
            me.placeMarker(markerObj);
        });
    },

    placeMarker: function (markerObj) {
        var marker = L.marker([markerObj.lat, markerObj.lng]).addTo(this.map);
        marker.bindTooltip(markerObj.desc).openTooltip();
        markerObj.type = 'marker';
        markerObj.ref = marker;
        this.up('muzkatOsm').addMarker(markerObj);
    },

    defaultCenter: 'trogir',

    map: undefined, // map reference

    listeners: {
        afterrender: function (cmp) {
            if (Ext.isDefined(cmp.point)) {
                cmp.coords[cmp.defaultCenter] = cmp.point;
                cmp.coords[cmp.defaultCenter]['zoom'] = 12;
                cmp.markers = [{
                    id: 'tbd',
                    desc: cmp.defaultCenter,
                    lat: cmp.point.lat,
                    lng: cmp.point.lng
                }];
            }
            cmp.initMap(cmp.coords[cmp.defaultCenter]);
        },
        resize: function (cmp) {
            cmp.reLayoutMap();
        }
    },

    reLayoutMap: function () {
        if (Ext.isDefined(this.map)) {
            this.map.invalidateSize();
        }
    },

    onMapClick: function (e) {
        var me = this,
            vm = me.getViewModel(),
            lastLatLng = e.latlng.toString();

        vm.set('lastLatLng', lastLatLng);
    },

    onMapContextmenu: function (e) {
        var xy = [100, 100];
        if (e.originalEvent) {
            xy[0] = e.originalEvent.clientX;
            xy[1] = e.originalEvent.clientY;
        }

        var position = xy;
        var m = Ext.createByAlias('widget.muzkatOsmCm', {
            parentCmpReference: this,
            mapEventReference: e
        });

        m.showAt(position);
    },

    addMapToCmp: function (loc) {
        var me = this;

        var tileLayer = 'OpenStreetMap.BlackAndWhite';
        var layer = L.tileLayer.provider(tileLayer);

        me.map = L.map(me.body.dom.id, {
            center: [loc.lat, loc.lng],
            zoom: loc.zoom,
            zoomControl: false,
            preferCanvas: false,
            layers: [layer]
        });

        // me.toggleLayer('OpenStreetMap.BlackAndWhite');
        me.reLayoutMap();
        me.placeMarkers();
        me.map.on('click', me.onMapClick.bind(me));
        me.map.on('contextmenu', me.onMapContextmenu.bind(me));
        me.setLoading(false);
    },

    initMap: function (loc) {
        var me = this;
        this.setLoading('Map wird geladen...');
        if (!muzkatMap.Module.filesLoaded) {
            muzkatMap.Module.loadAssets().then(function (success) {
                muzkatMap.Module.filesLoaded = true;
                Ext.defer(function () {
                    me.addMapToCmp(loc);
                }, 1500);

            }, function (error) {
                console.log('errrror');
            });
        } else {
            Ext.log({msg: 'Asset loading skipped...'});
            me.addMapToCmp(loc);
        }

    },

    addTileLayer: function (tileLayer) {
        this.activeLayers[tileLayer] = L.tileLayer.provider(tileLayer).addTo(this.map);
    },

    activeLayers: {},

    toggleLayer: function (tileLayer) {
        if (tileLayer in this.activeLayers) {
            this.map.removeLayer(this.activeLayers[tileLayer]);
            delete this.activeLayers[tileLayer];
            Ext.log('layer ' + tileLayer + ' removed');
        } else {
            Ext.log('layer ' + tileLayer + ' added');
            this.addTileLayer(tileLayer);
        }
    },

    cssPaths: [],

    getMapInfo: function () {
        var array = [];
        array.push(
            {key: 'Map Center', value: this.getMapCenter().toString()},
            {key: 'Map Zoom', value: this.map.getZoom()},
            {key: 'Zoom Max', value: this.map.getMaxZoom()},
            {key: 'Zoom Min', value: this.map.getMinZoom()},
            {key: 'Map Bounds', value: JSON.stringify(this.map.getBounds())});
        return array;
    },

    getMapCenter: function () {
        return this.map.getCenter();
    },

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            iconCls: 'x-fa fa-plus',
            tooltip: 'ZoomIn',
            handler: function (btn) {
                btn.up('muzkatOsmMap').map.zoomIn();
            }
        }, {
            iconCls: 'x-fa fa-minus',
            tooltip: 'ZoomOut',
            handler: function (btn) {
                btn.up('muzkatOsmMap').map.zoomOut();
            }
        }, {
            value: 'Map Controls',
            xtype: 'displayfield'
        }, {
            xtype: 'tbfill'
        }, {
            value: 'Map Settings',
            xtype: 'displayfield'
        }, {
            iconCls: 'x-fa fa-bullseye',
            tooltip: 'Map zurücksetzen'
        }, {
            iconCls: 'x-fa fa-info',
            listeners: {
                'render': function (cmp) {
                    Ext.create({
                        xtype: 'tooltip',
                        target: cmp.getEl(),
                        listeners: {
                            scope: this,
                            beforeshow: function (tip) {
                                var infoArray = cmp.up('muzkatOsmMap').getMapInfo();
                                var html = '<table>';
                                Ext.Array.each(infoArray, function (item) {
                                    html += '<tr><td>' + item.key + '</td>' + '<td>' + item.value + '</td></tr>';
                                });
                                html += '<tr><td> Uhrzeit </td>' + '<td>' + new Date().toTimeString() + '</td></tr>';
                                html += '</table>';
                                tip.setHtml(html);
                            }
                        }
                    });
                }
            }
        }, {
            iconCls: 'x-fa fa-cog',
            tooltip: 'Map konfigurieren'
        }]
    }, {
        xtype: 'toolbar',
        dock: 'bottom',
        items: [{
            iconCls: 'x-fa fa-map-marker',
            tooltip: 'Marker ein/ausblenden',
            handler: function (btn) {
                // btn.up('muzkatOsmMap').toggleLayer('Esri.WorldImagery');
            }
        }, {
            value: 'Map Interaktionen',
            xtype: 'displayfield'
        }, {
            xtype: 'tbfill'
        }, {
            value: 'Map Layer',
            xtype: 'displayfield'
        }, {
            iconCls: 'x-fa fa-map',
            tooltip: 'Bildkarte einblenden',
            handler: function (btn) {
                btn.up('muzkatOsmMap').toggleLayer('Esri.WorldImagery');
            }
        }, {
            iconCls: 'x-fa fa-ship',
            tooltip: 'Open Sea Map ein/ausblenden',
            handler: function (btn) {
                btn.up('muzkatOsmMap').toggleLayer('OpenSeaMap');
            }
        }]
    }]
});

Ext.define('muzkat.pi.camera.Api', {
    singleton: true,

    getPromise: function (url) {
        return new Ext.Promise(function (resolve, reject) {
            Ext.Ajax.request({
                url: url,
                success: function (response) {
                    resolve(Ext.decode(response.responseText, true));
                },

                failure: function (response) {
                    reject(response.status);
                }
            });
        });
    },

    takePhoto: function () {
        return muzkat.pi.camera.Api.getPromise('/photos/take');
    },

    getPhotos: function () {
        return muzkat.pi.camera.Api.getPromise('/photos');
    }
});
Ext.define('muzkat.pi.camera.Main', {
    extend: 'Ext.container.Container',
    alias: 'widget.mzkPiCameraMain',

    title: 'Muzkat Pi Camera',

    layout: 'center',

    items: [{
        xtype: 'panel',

        width: '80%',
        height: '80%',
        layout: 'fit',

        items: [{
            xtype: 'panel',
            itemId: 'preview',
            layout: 'fit',
            items: [{
                xtype: 'container',
                defaultHtmlHeadline: '<h3>Muzkat Pi Camera</h3>',
                html: '<h3>Muzkat Pi Camera</h3>',
                updateHtmlContent: function (html) {
                    this.setHtml(this.defaultHtmlHeadline + html);
                },
                updateImage: function (imageUrl) {
                    var html = '<img src="/serve/' + imageUrl + '" height="480" width="640">';
                    this.updateHtmlContent(html);
                }
            }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                overflowHandler: 'scroller',
                items: []
            }]
        }],

        bbar: [{
            text: 'Take Picture',
            scale: 'medium',
            iconCls: 'x-fa fa-photo',
            handler: function (btn) {
                var mainView = btn.up('mzkPiCameraMain');
                muzkat.pi.camera.Api.takePhoto().then(function (success) {
                    mainView.refreshGui();
                }, function (error) {
                    Ext.toast(error);
                });
            }
        }, {
            text: 'Gallery',
            scale: 'medium',
            iconCls: 'x-fa fa-file-image-o'
        }, {
            xtype: 'tbfill'
        }, {
            text: 'API',
            scale: 'medium',
            iconCls: 'x-fa fa-file-image-o'
        }, {
            text: 'About',
            scale: 'medium',
            iconCls: 'x-fa fa-file-image-o'
        }]
    }],

    initComponent: function () {
        this.callParent(arguments);
        this.refreshGui();
    },

    refreshGui: function () {
        var me = this;
        muzkat.pi.camera.Api.getPhotos().then(function (array) {
            var preview = me.down('#preview');
            if (array.length > 0) {
                array = array.reverse();
                var imgContainer = preview.down('container');
                imgContainer.updateImage(array[0].name);
                var dockedItems = preview.getDockedItems('toolbar[dock="bottom"]');
                dockedItems[0].removeAll();

                Ext.Array.each(array, function (imgObj) {
                    dockedItems[0].add({
                        xtype: 'image',
                        src: '/serve/' + imgObj.name,
                        height: 90,
                        width: 120
                    })
                });
            }
        }, function (error) {
            Ext.toast(error);
        });
    }
});
Ext.define('sysmon.view.restclient.RestMain', {
    extend: 'Ext.container.Container',
    alias: 'widget.bpcSysMonRestMain',

    requires: ['sysmon.view.restclient.client.*'],

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    initComponent: function () {

        this.items = [{
            xtype: 'container',
            flex: 1,
            defaults: {
                padding: '5 5 5 5'
            },
            items: [{
                xtype: 'textfield',
                value: 'Search'
            }, {
                xtype: 'tabpanel',
                items: [{
                    xtype: 'sysMonRestHistoryPanel'
                }]
            }]
        },
            {
                xtype: 'tabpanel',
                flex: 7,
                items: [{
                    xtype: 'container',
                    title: 'url',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [{
                        xtype: 'sysMonRestRequestPanel'
                    }, {
                        xtype: 'tabpanel',
                        items: [{
                            xtype: 'panel',
                            title: 'Authorizastion',
                            items: [{
                                xtype: 'textfield',
                                fieldLabel: 'QUERYFIELD'
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'QUERYFIELD'
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'QUERYFIELD'
                            }]
                        }]
                    }, {
                        xtype: 'tabpanel',
                        items: [{
                            xtype: 'sysMonRestClientBody'
                        },{
                            xtype: 'sysMonRestClientCookies'
                        },{
                            xtype: 'sysMonRestClientHeaders'
                        },{
                            xtype: 'sysMonRestClientTests'
                        }]
                    }]
                }]
            }
        ];

        this.callParent(arguments);
    }
});
/**
 * Created by bnz on 12.03.17.
 */
Ext.define('sysmon.view.restclient.client.headerType.RequestPanel', {
    extend: 'Ext.container.Container',
    alias: 'widget.sysMonRestRequestPanel',

    items: [{
        xtype: 'textfield',
        fieldLabel: 'QUERYFIELD'
    }]

});



/**
 * Created by bnz on 12.03.17.
 */

/**
 * Created by bnz on 12.03.17.
 */

/**
 * Created by bnz on 12.03.17.
 */

/**
 * Created by bnz on 12.03.17.
 */

/**
 * Created by bnz on 12.03.17.
 */

Ext.define('storage.view.Main', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.mxStorage',

    title: 'Virtimo Storage Manager',

    scrollable: 'vertical',

    activeTab: 1,

    initComponent: function () {
        this.items = [
            {
                xtype: 'panel',
                moduleId: this.moduleId,
                title: 'Virtimo Cloudview'
            },
            {
                xtype: 'bpcStorageOverview',
                title: 'Index Analyzer',
                moduleId: this.moduleId
            },
            {
                xtype: 'panel',
                moduleId: this.moduleId,
                title: 'Einstellungen',
                tbar: [
                    {xtype: 'button', text: 'Node hinzufügen'},
                    {xtype: 'button', text: 'Node restarten'},
                    {xtype: 'button', text: 'Node entfernen'}
                ]
            },
            {
                xtype: 'panel',
                moduleId: this.moduleId,
                title: 'Backup-Manager',
                tbar: [
                    {xtype: 'button', text: 'Einstellungen ändern'},
                    {xtype: 'button', text: 'Auf Standard zurücksetzen'}
                ]
            },
            {
                xtype: 'panel',
                moduleId: this.moduleId,
                title: 'Backup',
                tbar: [
                    {xtype: 'button', text: 'Manuelles Backup starten'},
                    {xtype: 'button', text: 'Auto-Backup Einstellungen'}
                ]
            },
            {
                xtype: 'panel',
                moduleId: this.moduleId,
                title: 'Restore',
                tbar: [
                    {xtype: 'button', text: 'Backup einspielen'},
                    {xtype: 'button', text: 'Backup entfernen'}
                ]
            }
        ];
        this.callParent();
    }
});
Ext.define('storage.view.StorageOverview', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.bpcStorageOverview',
    xtype: 'bpcStorageOverview',

    requires: [],

    title: "Übersicht",
    header: false,

    viewModel: {
        data: {
            selectedIndex: undefined,
            aliasData: undefined
        },

        stores: {
            storageAliasesStore: {
                data: '{aliasData}'
            },
            storageMappingsStore: {
                data: '{mappingsData}'
            }
        },

        formulas: {
            activeAliasJSON: {
                get: function (get) {
                    var aliasObj = get("activeAlias");
                    return JSON.stringify(aliasObj);
                }
            },

            activeMappingJSON: {
                get: function (get) {
                    var aliasObj = get("activeMapping");
                    return JSON.stringify(aliasObj);
                }
            }
        }
    },

    moduleId: undefined,

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    defaults: {
        padding: '10 10 10 10'
    },

    items: [{
        xtype: 'container',
        flex: 2,
        items: [{
            xtype: 'fieldset',
            title: 'Index',
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items: [{
                xtype: 'combobox',
                fieldLabel: 'Datenbank wählen',
                store: Ext.create('Ext.data.Store', {
                    fields: ['indexName'],
                    storeId: 'storageIndicesStore'
                }),
                queryMode: 'local',
                displayField: 'indexName',
                valueField: 'indexName',
                listeners: {
                    change: function (cmp, newValue, oldValue, eOpts) {
                        cmp.up('bpcStorageOverview').updateIndexView(newValue);
                    }
                }
            }]
        },
            {
                xtype: 'fieldset',
                title: 'Index Informationsn',
                layout: 'anchor',
                defaults: {
                    xtype: 'textfield',
                    readOnly: true,
                    anchor: '100%'
                },
                itemId: 'indexInfos',
                hidden: true,
                items: [{
                    fieldLabel: 'Erstellt:',
                    bind: '{selectedIndex.settings.index.creation_date}'
                }, {
                    fieldLabel: 'Max Result Window:',
                    bind: '{selectedIndex.settings.index.max_result_window}'
                }, {
                    fieldLabel: 'Replicas:',
                    bind: '{selectedIndex.settings.index.number_of_replicas}'
                }, {
                    fieldLabel: 'Shards:',
                    bind: '{selectedIndex.settings.index.number_of_shards}'
                }, {
                    fieldLabel: 'ID:',
                    bind: '{selectedIndex.settings.index.uuid}'
                }, {
                    fieldLabel: 'Version / created:',
                    bind: '{selectedIndex.settings.index.version.created}'
                }]
            }]
    }, {
        xtype: 'container',
        flex: 4,
        itemId: 'chartContainer',
        layout: 'fit',
        items: []
    }]
    ,

    initComponent: function () {
        this.callParent();
        this.fillIndicesStore();
    },

    fillIndicesStore: function () {
        Ext.log(this.self.getName() + ": loadConfig");
        try {
            Ext.Ajax.request({
                url: '/cxf/bpc-httpproxy/httpProxy/1475932506433/*/_stats/store',

                success: function (response, opts) {
                    var responseObj = Ext.decode(response.responseText);
                    var indices = [];
                    Ext.iterate(responseObj.indices, function (index, values) {
                        indices.push({
                            indexName: index
                        });
                    });

                    var store = Ext.StoreManager.lookup('storageIndicesStore');
                    store.loadData(indices);
                },

                failure: function (response) {
                    Ext.log('server-side failure with status code ' + response.status);
                }
            });

        }
        catch (e) {
            Ext.log({msg: this.self.getName() + ": ERROR loadConfig", dump: e, stack: true, level: "error"});
        }
    },

    updateIndexView: function (indice) {
        var me = this;
        Ext.Ajax.request({
            url: '/cxf/bpc-httpproxy/httpProxy/1475932506433/' + indice,

            success: function (response, opts) {
                var responseObj = Ext.decode(response.responseText);
                me.getViewModel().set('selectedIndex', responseObj[indice]);
                me.down('#indexInfos').setVisible(true);
                me.createIndexPanel();
            },

            failure: function (response) {
                Ext.log('server-side failure with status code ' + response.status);
            }
        });

    },

    createIndexPanel: function () {
        Ext.log(this.self.getName() + ": createIndexPanel");
        try {

            var indexObj = this.getViewModel().get('selectedIndex');

            var aliasData = [];
            Ext.iterate(indexObj.aliases, function (alias, valuesObj) {
                aliasData.push({
                    name: alias,
                    details: valuesObj
                });
            });
            this.getViewModel().set('aliasData', aliasData);

            var mappingsData = [];
            Ext.iterate(indexObj.mappings, function (mapping, valuesObj) {
                mappingsData.push({
                    name: mapping,
                    details: valuesObj.properties
                });
            });

            this.getViewModel().set('mappingsData', mappingsData);

            var panel = {
                xtype: 'container',
                items: [
                    {
                        xtype: 'fieldset',
                        layout: 'anchor',
                        title: 'Aliases',
                        defaults: {
                            xtype: 'textarea',
                            readOnly: true,
                            anchor: '100%'
                        },
                        items: [{
                            xtype: 'grid',
                            forceFit: true,
                            hideHeaders: false,
                            emptyText: 'keine Datenbanken vorhanden',
                            columns: [
                                {dataIndex: 'name', width: 60, text: 'Alias'}
                            ],
                            bind: {
                                store: '{storageAliasesStore}'
                            },
                            listeners: {
                                rowclick: function (row, record, tr, rowIndex, e, eOpts) {
                                    Ext.log({dump: record});
                                    this.up('bpcStorageOverview').getViewModel().set('activeAlias', record.data);
                                }
                            }
                        }, {
                            fieldLabel: 'Details',
                            bind: '{activeAliasJSON}',
                            height: 200
                        }]
                    },
                    {
                        xtype: 'fieldset',
                        layout: 'anchor',
                        title: 'Mappings',
                        defaults: {
                            xtype: 'textarea',
                            readOnly: true,
                            anchor: '100%'
                        },
                        items: [{
                            xtype: 'grid',
                            forceFit: true,
                            hideHeaders: false,
                            emptyText: 'keine Mappings vorhanden',
                            columns: [
                                {dataIndex: 'name', width: 60, text: 'Mappings'}
                            ],
                            bind: {
                                store: '{storageMappingsStore}'
                            },
                            listeners: {
                                rowclick: function (row, record, tr, rowIndex, e, eOpts) {
                                    Ext.log({dump: record});
                                    this.up('bpcStorageOverview').getViewModel().set('activeMapping', record.data);
                                }
                            }
                        }, {
                            fieldLabel: 'Details',
                            bind: '{activeMappingJSON}',
                            padding: '10 10 10 10',
                            height: 400
                        }]
                    }
                ]
            };
            this.down('#chartContainer').removeAll();
            this.down('#chartContainer').add([panel]);
        }
        catch (e) {
            Ext.log({msg: this.self.getName() + ": ERROR createIndexPanel", dump: e, stack: true, level: "error"});
        }
    }
})
;

/**
 * Created by bnz on 08.10.16.
 */
Ext.define('BPC.view.widgets.storage.Storage', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.bpcStorage',
    xtype: 'bpcStorage',

    requires: [],

    autoDestroy: false,

    controller: 'bpcStorageController',
    viewModel: {
        type: 'bpcStorageModel'
    },


    header: false,
    activeTab: 0,

    defaults: {
        xtype: 'panel'
    },

    items: [{
        title: 'Overview',
        items: [{
            xtype: 'fieldset',
            layout: 'anchor',
            defaultType: 'textfield',
            defaults: {anchor: '100%'},
            title: 'Gesamt',
            items: [{
                bind: '{all.total.store.size_in_bytes}',
                fieldLabel: 'Size in bts'
            }, {
                bind: '{all.total.store.throttle_time_in_millis}',
                fieldLabel: 'Throttle Time in ms'
            }]
        }, {
            xtype: 'fieldset',
            layout: 'anchor',
            defaultType: 'textfield',
            defaults: {anchor: '100%'},
            title: 'Indices',
            items: [{
                bind: '{shards.total}',
                fieldLabel: 'Total'
            }, {
                bind: '{shards.successful}',
                fieldLabel: 'Successful'
            }, {
                bind: '{shards.failed}',
                fieldLabel: 'Failed'
            }]
        }]
    },{
            title: 'Datenbanken',
            items: [{
                xtype: 'grid',
                forceFit: true,
                hideHeaders: false,
                emptyText: 'keine Datenbanken vorhanden',
                columns: [
                    {dataIndex: 'index', width: 60, text: 'Index'},
                    {dataIndex: 'sizeTotal', width: 20, text: 'Size'},
                    {dataIndex: 'throttleTime', width: 20, text: 'ThrottleTime'}
                ],
                bind: {
                    store: '{indicesStore}'
                }
            }]
        }
    ],

    initComponent: function () {
        this.callParent();
        this.addSingleClusterPanel();
        this.addSingleNodePanel();
    },

    refreshWidget: function () {
        Ext.log(this.self.getName() + ": refreshWidget");
        try {
            var widgetCtrl = this.getController();
            widgetCtrl.getBpcStatus();
        }
        catch (e) {
            Ext.log({msg: this.self.getName() + ": ERROR refreshWidget", dump: e, stack: true, level: "error"});
        }
    },

    addSingleClusterPanel: function () {
        Ext.log(this.self.getName() + ": addNodePanel");

            this.add([{
                xtype: 'fieldset',
                layout: 'anchor',
                defaultType: 'textfield',
                defaults: {anchor: '100%'},
                title: 'Virtimo Cloud Cluster Stats',
                items: [{
                    bind: '{singleCluster.nodeId}',
                    fieldLabel: 'Id'
                }, {
                    bind: '{singleCluster.nodeName}',
                    fieldLabel: 'Name'
                }, {
                    bind: '{singleCluster.nodeHost}',
                    fieldLabel: 'Host'
                }, {
                    bind: '{singleCluster.transportAddress}',
                    fieldLabel: 'Transport'
                }, {
                    bind: '{singleCluster.filesystemAvailable}',
                    fieldLabel: 'Available'
                }, {
                    bind: '{singleCluster.filesystemFree}',
                    fieldLabel: 'Free'
                }, {
                    bind: '{singleCluster.filesystemTotal}',
                    fieldLabel: 'Total'
                }, {
                    bind: '{singleCluster.filesystemSpins}',
                    fieldLabel: 'Spins'
                }]
            }]);

    },

    addSingleNodePanel: function () {
        Ext.log(this.self.getName() + ": addNodePanel");

        this.add([{
            xtype: 'fieldset',
            layout: 'anchor',
            defaultType: 'textfield',
            defaults: {anchor: '100%'},
            title: 'Cloud Node Stats',
            items: [{
                bind: '{singleNode.available_in_bytes}',
                fieldLabel: 'Available'
            }, {
                bind: '{singleNode.free_in_bytes}',
                fieldLabel: 'Free'
            },{
                bind: '{singleNode.total_in_bytes}',
                fieldLabel: 'Total in Bytes'
            }, {
                bind: '{singleNode.mount}',
                fieldLabel: 'Mountpoint'
            }, {
                bind: '{singleNode.path}',
                fieldLabel: 'Node Pfade'
            }, {
                bind: '{singleNode.spins}',
                fieldLabel: 'FS Spins'
            },{
                bind: '{singleNode.type}',
                fieldLabel: 'FS Type'
            }]
        }]);

    }
});
/**
 * Created by bnz on 08.10.16.
 */
Ext.define('BPC.view.widgets.storage.StorageController', {

    extend: 'Ext.app.ViewController',
    alias: 'controller.bpcStorageController',

    init: function () {
        Ext.log(this.self.getName() + ": init");
        try {
            this.getBpcStatus();
        }
        catch (e) {
            Ext.log({msg: this.self.getName() + ": ERROR init", dump: e, stack: true, level: "error"});
        }
    },

    getBpcStatus: function () {
        Ext.log(this.self.getName() + ": getBpcStatus");
        try {
            var me = this;
            Ext.Ajax.request({
                url: '/cxf/bpc-httpproxy/httpProxy/1475932506433/*/_stats/store',
                method: 'GET',

                success: function (response) {
                    var obj = Ext.decode(response.responseText);
                    me.updateViewModel(obj);
                },

                failure: function (response) {
                    BPC.Api.showNotification('Fehler: ' + response.status);
                }
            });

            Ext.Ajax.request({
                url: '/cxf/bpc-httpproxy/httpProxy/1475932506433/_nodes/stats/fs',
                method: 'GET',

                success: function (response) {
                    var obj = Ext.decode(response.responseText);
                    me.updateViewModelwithNodeStats(obj);
                },

                failure: function (response) {
                    BPC.Api.showNotification('Fehler: ' + response.status);
                }
            });
        }
        catch (e) {
            Ext.log({msg: this.self.getName() + ": ERROR getBpcStatus", dump: e, stack: true, level: "error"});
        }
    },

    updateViewModel: function (obj) {
        Ext.log(this.self.getName() + ": setBpcStatus");
        try {
            this.getViewModel().set("response", obj);
            this.getViewModel().set("all", obj._all);
            this.getViewModel().set("shards", obj._shards);
            this.getViewModel().set("indices", obj.indices);
            var indicesData = [];
            Ext.iterate(obj.indices, function (index, values) {
                var entry = {
                    index: index,
                    sizeTotal: values.total.store.size_in_bytes,
                    throttleTime: values.total.store.throttle_time_in_millis
                };
                indicesData.push(entry);
            });
            this.getViewModel().set("indicesStoreData", indicesData);
        }
        catch (e) {
            Ext.log({msg: this.self.getName() + ": ERROR setBpcStatus", dump: e, stack: true, level: "error"});
        }
    },
    updateViewModelwithNodeStats: function (obj) {
        Ext.log(this.self.getName() + ": updateViewModelwithNodeStats");
        try {
            this.getViewModel().set("statsResponse", obj);
            this.getViewModel().set("clusterName", obj.cluster_name);
            var clusterData = [];
            var nodeData = [];
            var nodeCount = 0;
            Ext.iterate(obj.nodes, function (index, values) {
                var entry = {
                    nodeId: index,
                    nodeName: values.name,
                    nodeHost: values.host,
                    transportAddress: values.transport_address,
                    filesystemAvailable: values.fs.total.available_in_bytes,
                    filesystemFree: values.fs.total.free_in_bytes,
                    filesystemTotal: values.fs.total.total_in_bytes,
                    filesystemSpins: values.fs.total.spins
                };
                nodeData = values.fs.data;
                clusterData.push(entry);
                nodeCount = nodeCount + 1;
            });
            this.getViewModel().set("clusterData", clusterData);
            this.getViewModel().set("nodeData", nodeData);
            this.getViewModel().set("nodeCount", nodeCount);

            if (nodeCount === 1) {
                this.getViewModel().set('singleNode', nodeData[0]);
            }
            if (clusterData.length === 1) {
                this.getViewModel().set('singleCluster', clusterData[0]);
            }
        }
        catch (e) {
            Ext.log({msg: this.self.getName() + ": ERROR setBpcStatus", dump: e, stack: true, level: "error"});
        }
    }
});
/**
 * Created by bnz on 08.10.16.
 */
Ext.define('BPC.view.widgets.storage.StorageModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.bpcStorageModel',

    data: {

    },

    stores: {
        indicesStore: {
            data: '{indicesStoreData}'
        },
        clusterStore: {
            data: '{clusterData}'
        },
        nodeStore: {
            data: '{nodeData}'
        }
    }
});
Ext.define('mzk.textviewer.Editor', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.muzkatJsonTextArea',

    title: 'Editor',

    layout: 'fit',

    space: function (a) {
        var b = [], e;
        for (e = 0; e < a; e++) b.push(" ");
        return b.join("")
    },

    initComponent: function () {
        this.jsonField = Ext.create({
            xtype: 'textareafield',
            grow: true,
            emptyText: 'Paste your JSON here',
            maxLength: 100000000000000000000,
            anchor: '100%'
        });

        this.items = [this.jsonField];

        this.tbar = [{
            iconCls: 'x-fa fa-tree',
            text: 'Tree',
            handler: function (btn) {
                var jsonString = this.jsonField.getValue(),
                    jsonObject = Ext.JSON.decode(jsonString, true);
                if (jsonObject) {
                    Ext.log({dump: jsonObject, msg: 'valid Json Obj'});
                    this.mainView.tabPanel.add({
                        xtype: 'muzkatJsonTreeView',
                        jsonData: this.json2leaf(jsonObject)
                    });
                } else {
                    Ext.log({msg: 'Json Obj not valid'});
                }

            }
        }, {
            iconCls: 'x-fa fa-copy',
            text: 'Copy'
        }, {
            iconCls: 'x-fa fa-paint-brush',
            text: 'Format',
            handler: function (btn) {
                for (var b = this.jsonField.getValue().replace(/\n/g, " ").replace(/\r/g, " "), e = [], c = 0, d = !1, f = 0, i = b.length; f < i; f++) {
                    var g = b.charAt(f);
                    if (d && g === d) b.charAt(f - 1) !== "\\" && (d = !1);
                    else if (!d && (g === '"' || g === "'")) d = g;
                    else if (!d && (g === " " || g === "\t")) g = "";
                    else if (!d && g === ":") g += " ";
                    else if (!d && g === ",") g += "\n" + this.space(c * 2); else if (!d && (g === "[" || g === "{")) c++, g += "\n" + this.space(c * 2);
                    else if (!d && (g === "]" || g === "}")) c--, g = "\n" + this.space(c * 2) + g;
                    e.push(g)
                }

                this.jsonField.setValue(e.join(""));
            }
        }, {
            iconCls: 'x-fa fa-compress',
            text: 'Remove white space',
            handler: function (btn) {
                var a = this.jsonField;
                for (var b = a.getValue().replace(/\n/g, " ").replace(/\r/g, " "), e = [], c = !1, d = 0, f = b.length; d < f; d++) {
                    var i = b.charAt(d);
                    if (c && i === c) b.charAt(d - 1) !== "\\" && (c = !1);
                    else if (!c && (i === '"' || i === "'")) c = i; else if (!c && (i === " " || i === "\t")) i = "";
                    e.push(i)
                }
                a.setValue(e.join(""));
            }
        }, {
            iconCls: 'x-fa fa-times',
            text: 'Clear'
        }, {
            iconCls: 'x-fa fa-cloud-upload',
            text: 'Load JSON data'
        }].map(btn => {
            btn.scope = this;
            return btn;
        });

        this.callParent(arguments);
    },

    json2leaf: function (a) {
        var b = [], c;
        for (c in a) a.hasOwnProperty(c) && (a[c] === null ? b.push({
            text: c + " : null",
            leaf: !0,
            iconCls: "x-fa fa-bug"
        }) : typeof a[c] === "string" ? b.push({
            text: c + ' : "' + a[c] + '"',
            leaf: !0,
            iconCls: "x-fa fa-bug"
        }) : typeof a[c] === "number" ? b.push({
            text: c + " : " + a[c],
            leaf: !0,
            iconCls: "x-fa fa-bug"
        }) : typeof a[c] === "boolean" ? b.push({
            text: c + " : " + (a[c] ? "true" : "false"),
            leaf: !0,
            iconCls: "x-fa fa-file"
        }) : typeof a[c] === "object" ? b.push({
            text: c,
            children: this.json2leaf(a[c]),
            iconCls: Ext.isArray(a[c]) ? "x-fa fa-folder" : "x-fa fa-file"
        }) : typeof a[c] === "function" && b.push({
            text: c + " : function",
            leaf: !0,
            iconCls: "x-fa fa-superscript"
        }));
        return b
    }
});
Ext.define('mzk.textviewer.Main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mzkJsonViewerMain',

    layout: 'fit',
    header: false,

    initComponent: function () {
        var defaults = {
            mainView: this,
            padding: '5 5 5 5'
        };

        this.treePanel = Ext.create(Ext.apply({xtype: 'muzkatJsonTreeView'}, defaults));
        this.editorPanel = Ext.create(Ext.apply({xtype: 'muzkatJsonTextArea'}, defaults));
        this.tabPanel = Ext.create({xtype: 'tabpanel', items: [this.treePanel, this.editorPanel]});
        this.tabPanel.setActiveTab(this.editorPanel);

        this.items = [
            this.tabPanel
        ];

        this.callParent(arguments);
    },

    prettifyXml: function (sourceXml) {
        var xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');

        var xsltDoc = new DOMParser().parseFromString([
            '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
            '  <xsl:output omit-xml-declaration="yes" indent="yes"/>',
            '    <xsl:template match="node()|@*">',
            '      <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
            '    </xsl:template>',
            '</xsl:stylesheet>',
        ].join('\n'), 'application/xml');

        var xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsltDoc);
        var resultDoc = xsltProcessor.transformToDocument(xmlDoc);
        return new XMLSerializer().serializeToString(resultDoc);
    }
});
Ext.define('mzk.textviewer.Viewer', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.muzkatJsonTreeView',

    title: 'Viewer',

    rootVisible: false,

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

    jsonData: undefined,

    initComponent: function () {
        Ext.log({dump: this.jsonData, msg: 'json data'});

        this.store = Ext.create('Ext.data.TreeStore', {
            root: {
                expanded: false,
                children: this.jsonData || []
            }
        });

        // this.columns = [{
        //     xtype: 'treecolumn',
        //     text: 'Flight Endpoints',
        //     dataIndex: 'text',
        //     flex: 1,
        //     renderer: function (val, meta, rec) {
        //         if (rec.get('isLayover')) {
        //             meta.tdStyle = 'color: gray; font-style: italic;';
        //         }
        //         return val;
        //     }
        // }, {
        //     text: 'Duration',
        //     dataIndex: 'duration',
        //     width: 100
        // }];

        this.callParent(arguments);
    }
});
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

    initComponent: function () {

        this.items = [{
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
                }, {
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
        }];
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

    border: 0,
    reference: 'winamp-player',
    tools: [{
        type: 'close'
    }],

    initComponent: function () {
        this.title = Playground.view.winamp.assets.Strings.playerTitle;

        this.items = [{
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
        }];

        this.callParent(arguments);
    },

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
        renderer: function (value, meta, record) {
            return Playground.view.winamp.Util.createhmsString(value);
        }
    }],

    bbar: [{
        text: 'ADD',
        menu: [{
            text: 'ADD URL'
        }, {
            text: 'ADD LIST'
        }, {
            text: 'ADD FILE'
        }]
    }, {
        text: 'REM'
    }, {
        text: 'SEL'
    }, {
        text: 'MISC'
    }],

    initComponent: function () {
        this.title = Playground.view.winamp.assets.Strings.playerTitle + ' ' + Playground.view.winamp.assets.Strings.playlistTitle;
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

Ext.define('Playground.view.main.Main', {
    extend: 'Ext.container.Container',
    alias: 'widget.app-main',

    titleRotation: 0,
    tabRotation: 0,

    defaults: {
        xtype: 'panel',
        layout: 'center'
    },

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    initComponent: function () {
        this.nav = Ext.create({
            xtype: 'toolbar',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            flex: 1,
            defaults: {
                textAlign: 'left'
            },
            items: [{
                iconCls: 'fas fa-info',
                text: 'Info',
                style: {
                    marginBottom: '15px'
                }
            }, {
                xtype: 'tbfill'
            }, {
                iconCls: 'fas fa-cogs',
                text: 'Settings'
            }]
        });

        let components = ['mzkJsonViewerMain', 'muzkatMap', 'mzkPiCameraMain', 'bnz-weather', 'bnz-winamp'].map(xtype => {
            var i = {};
            i.title = xtype.toUpperCase();
            i.items = [{xtype: xtype}];
            return i;
        }).map((item, i) => {
            item._cmp = item.items;
            item.text = item.title;
            item.handler = function (b) {
                this.setComponentActive(b._cmp[0].xtype);
            }
            item.scope = this
            if (!Ext.isDefined(item._cmp)) {
                delete item.handler;
                item.disabled = true;
            }
            this.nav.insert(i + 1, item);
        });

        this.mainFrame = Ext.create({
            xtype: 'panel',
            header: false,
            flex: 8,
            layout: 'card',
            padding: '15 15 15 15',
            items: [{xtype: 'container', html: 'hello'}]
        });

        this.items = [this.nav, this.mainFrame];
        this.callParent(arguments);
    },

    setComponentActive: function (xtype, config) {
        let cmpCfg = {} || config;
        if (xtype) cmpCfg = Ext.apply(cmpCfg, {
            xtype: xtype
        })
        this.mainFrame.removeAll();
        this.mainFrame.add(cmpCfg);
    }
});
