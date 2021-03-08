let builder = require('@muzkat/nextjs-tools'),
    fs = require('fs');

// todo request targetFolder
// todo bundle true

// build app
// builder({
//     srcDir: 'src',
//     packagesDir: 'application'
// }).build();

// build modules
builder({
    srcDir: 'src',
    packagesDir: 'components',
    bundleFiles: true
}).build();

// todo  await
// let oldPath = 'build/bundle.js'
// let newPath = 'public/app/bundle.js'
//
// if(fs.existsSync(newPath)) console.log('yo');
//
// fs.rename(oldPath, newPath, function (err) {
//     if (err) throw err
//     console.log('moved.')
// })