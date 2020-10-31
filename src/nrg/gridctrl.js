Ext.define('Mzk.Nrg.GridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.accountGridController',

    onSelect: function (rowModel, record, index, eOpts) {
        if (rowModel.view) {
            var view = rowModel.view;
            view.up('#issueWrapper').updateIssue(record);
        }
    }
});
