let builder = require('@muzkat/nextjs-tools');

const buildFile = {
    srcDir: 'src',
    packagesDir: 'components',

}
let extjsBuilder = builder(buildFile);
extjsBuilder.build();