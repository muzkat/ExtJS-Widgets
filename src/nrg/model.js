Ext.define('Mzk.Nrg.GridLine', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id'
        },
        {
            name: 'code',
            mapping: '_source.Code'
        },
        {
            name: 'codeenum',
            mapping: '_source.CodeTypeEnum'
        },
        {
            name: 'type',
            mapping: '_source.CodeType'
        },
        {
            name: 'function',
            mapping: '_source.MarketFunction'
        },
        {
            name: 'status',
            mapping: '_source.LocalizedStatus'
        },
        {
            name: 'city',
            mapping: '_source.city'
        },
        {
            name: 'company',
            mapping: '_source.companyName'
        },
        {
            name: 'zip',
            mapping: '_source.zipCode'
        }]
});