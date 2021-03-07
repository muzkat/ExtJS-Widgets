// todo improve
// browserify src/application/wrapper.js -o bundle.js
const muzkatApp = require('@muzkat/muzkat-ext-app');
let pt = new muzkatApp('Muzkat ExtJS6 Widgets', 'app-main', false);
pt.launchApp();