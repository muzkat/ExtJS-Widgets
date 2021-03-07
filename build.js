let builder = require('@muzkat/nextjs-tools');


// todo request targetFolder
// todo bundle true

let extjsBuilder;

// build app
extjsBuilder = builder({
    srcDir: 'src',
    packagesDir: 'application'
});
extjsBuilder.build();

// build modules
extjsBuilder = builder({
    srcDir: 'src',
    packagesDir: 'components'
});
extjsBuilder.build();