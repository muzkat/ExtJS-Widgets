const vm = require('vm');

module.exports = {
    getClassObjects: function (fileSource) {
        const Ext = {
            objs: [],
            define: function (name, config) {
                this.objs.push({
                    className: name || 'UNDEFINED',
                    config: config || {}
                });
                console.log(name);
            }
        }

        var ctx = {Ext: Ext};
        vm.createContext(ctx);
        vm.runInNewContext(fileSource, ctx);
        return ctx.Ext.objs;
    }
}