const {readdirSync} = require('fs')
const {readFileSync} = require('fs')

const helper = require('./buildExtHelder')

const getDirectories = source =>
    readdirSync(source, {withFileTypes: true})
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)


module.exports = function (grunt) {

    const sourceRoot = 'src/';
    const componentDir = 'components/'
    const appDir = 'app/'
    const applicationWrapper = 'wrapper.js';

    const buildDir = 'build/';
    const buildArtefactType = 'js';

    // build concat conf
    var concatConf = {};

    // get all folder names inside /src/components/
    let componentNames = getDirectories(sourceRoot + componentDir);

    // build each individually and store them temp under /build/js/
    let buildArtefactPaths = componentNames.map(name => {
        let debugPath = buildDir + buildArtefactType + '/' + name + '.debug.js';
        concatConf[name] = {
            src: [sourceRoot + componentDir + name + '/**/*.js'],
            dest: debugPath
        }
        return debugPath
    });

    // application wrapper
    let appPath = buildDir + buildArtefactType + '/' + 'app.debug.js';
    concatConf.app = {
        src: [sourceRoot + appDir + '/**/*.js'],
        dest: appPath
    };
    buildArtefactPaths.push(appPath);

    //console.log(helper.getClassObjects(readFileSync(appPath)))

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: concatConf,

        watch: {
            scripts: {
                files: ['src/**/*.js', 'public/**/*.html'],
                tasks: ['concat', 'dev'],
                options: {
                    spawn: false,
                    livereload: true
                }
            }
        },


        browserify: {
            dev: {
                src: buildArtefactPaths.concat([sourceRoot + applicationWrapper]),
                dest: './public/js/bundle.js',
                options: {
                    // watch : true, // use watchify for incremental builds!
                    //  keepAlive : true, // watchify will exit unless task is kept alive
                    browserifyOptions: {
                        debug: true // source mapping
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');


    grunt.registerTask("dev", ["browserify:dev"]);
    grunt.registerTask('default', ['concat', 'dev']);
};