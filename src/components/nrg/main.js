Ext.define('Mzk.Nrg.Main', {
    extend: 'Ext.container.Container',
    alias: 'widget.muzkatNrgMain',
    layout: 'fit',
    items: [{
        xtype: 'container',
        itemId: 'issueWrapper',
        viewModel: {
            data: {
                storeRecordCount: 0,
                activeItem: null,
                recordActive: null,
                activeContact: {
                    ansprechpartner: {
                        anrede: null,
                        email: null,
                        fax: null,
                        nachname: null,
                        telefon: null,
                        vorname: null
                    },
                    codenummer: {
                        bis: null,
                        codenummer: null,
                        codetyp: null,
                        von: null,
                        marktfunktion: null
                    },
                    firmenanschrift: {
                        ort: null,
                        plz: null,
                        unternehmen: null,
                        url: null
                    }
                }
            },
            formulas: {}
        },
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [
            {
                xtype: 'accountGrid',
                flex: 4
            },
            {
                xtype: 'container',
                flex: 3,
                layout: 'fit',
                defaults: {
                    padding: '10 10 10 10'
                },
                padding: '25 25 25 25',
                items: [
                    {
                        xtype: 'panel', layout: {
                            type: 'vbox',
                            align: 'stretch'
                        }, flex: 4, header: false,
                        tbar: [{
                            iconCls: 'x-fa fa-phone', tooltip: 'Anrufen', scale: 'medium'
                        }, {
                            iconCls: 'x-fa fa-fax', tooltip: 'Fax an Partner versenden', scale: 'medium'
                        }, {
                            iconCls: 'x-fa fa-envelope-o', tooltip: 'Mail an Partner verschicken', scale: 'medium'
                        }, {
                            iconCls: 'x-fa fa-desktop', tooltip: 'Webseite aufrufen', scale: 'medium'
                        }, {
                            xtype: 'tbfill'
                        }, {
                            iconCls: 'x-fa fa-bookmark', tooltip: 'Als Favorit ablegen', scale: 'medium'
                        }, {
                            iconCls: 'x-fa fa-camera', tooltip: 'Screenshot erstellen', scale: 'medium'
                        }, {
                            iconCls: 'x-fa fa-print', tooltip: 'Kontaktinformationen ausdrucken', scale: 'medium'
                        }],
                        defaults: {
                            flex: 1,
                            padding: '3 3 3 3'
                        }, items: [{
                            xtype: 'fieldset',
                            bind: {
                                title: 'Ansprechpartner - {activeContact.firmenanschrift.unternehmen}'
                            },
                            collapsible: true,
                            defaultType: 'textfield',
                            defaults: {anchor: '100%', padding: '0 0 0 0'},
                            layout: 'anchor',
                            items: [{
                                fieldLabel: 'Name',
                                bind: {
                                    value: '{activeContact.ansprechpartner.vorname} {activeContact.ansprechpartner.nachname}'
                                }
                            }, {
                                fieldLabel: 'E-Mail',
                                bind: {
                                    value: '{activeContact.ansprechpartner.email}'
                                }
                            }, {
                                fieldLabel: 'Telefon',
                                bind: {
                                    value: '{activeContact.ansprechpartner.telefon}'
                                }
                            }, {
                                fieldLabel: 'Fax',
                                bind: {
                                    value: '{activeContact.ansprechpartner.fax}'
                                }
                            }]
                        }, {
                            xtype: 'fieldset',
                            bind: {
                                title: 'Code Informationen - {activeContact.codenummer.codenummer} - {activeContact.codenummer.marktfunktion}'
                            },
                            collapsible: true,
                            defaultType: 'textfield',
                            defaults: {anchor: '100%', padding: '0 0 0 0'},
                            layout: 'anchor',
                            items: [{
                                fieldLabel: 'CodeTyp',
                                bind: {
                                    value: '{activeContact.codenummer.codetyp}'
                                }
                            }, {
                                fieldLabel: 'CodeNummer',
                                bind: {
                                    value: '{activeContact.codenummer.codenummer}'
                                }
                            }, {
                                fieldLabel: 'Von',
                                bind: {
                                    value: '{activeContact.codenummer.von}'
                                }
                            }, {
                                fieldLabel: 'Bis',
                                bind: {
                                    value: '{activeContact.codenummer.bis}'
                                }
                            }]

                        }, {
                            xtype: 'fieldset',
                            title: 'Firmendetails',
                            collapsible: true,
                            defaultType: 'textfield',
                            defaults: {anchor: '100%', padding: '0 0 0 0'},
                            layout: 'anchor',
                            items: [{
                                fieldLabel: 'Ort',
                                bind: {
                                    value: '{activeContact.firmenanschrift.plz} {activeContact.firmenanschrift.ort}'
                                }
                            }, {
                                fieldLabel: 'Unternehmen',
                                bind: {
                                    value: '{activeContact.firmenanschrift.unternehmen}'
                                }
                            }, {
                                fieldLabel: 'Web',
                                bind: {
                                    value: '{activeContact.firmenanschrift.url}'
                                }
                            }]

                        }]
                    }]
            }],
        updateIssue: function (record) {
            if (Ext.isDefined(record)) {
                var recordData = record.getData();
                if (recordData['_source'] && recordData['_source']['contact']) {
                    var contactData = recordData['_source']['contact'];
                    if (contactData['code-nummern-vergabe']) {
                        contactData.codenummer = contactData['code-nummern-vergabe'];
                        delete contactData['code-nummern-vergabe'];
                        if (contactData.codenummer['code typ']) {
                            contactData.codenummer.codetyp = contactData.codenummer['code typ'];
                            delete contactData.codenummer['code typ'];
                        }
                    }

                    var me = this;
                    Ext.iterate(contactData, function (key, obj) {
                        Ext.iterate(obj, function (subkey, val) {
                            me.getViewModel().set('activeContact.' + key + '.' + subkey, val);
                        });
                    });
                    Ext.log({dump: contactData, msg: 'data..'});
                    // this.getViewModel().set('activeContact', contactData);
                }
                this.getViewModel().set('activeItem', JSON.stringify(recordData));
                this.getViewModel().set('recordActive', record);
            }


        }
    }]
});