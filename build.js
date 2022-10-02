let builder = require('@muzkat/nextjs-tools');

let appBuilder = builder({
    srcDir: 'src',
    appDir: 'application',
    bundleFiles: true,
    deployDir: 'public/app'
});

appBuilder.build().then((success) => {
    if (success) appBuilder.deploy()
});