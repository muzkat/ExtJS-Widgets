module.exports = function (grunt) {

    var projectRoot = 'app/';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            map: {
                src: [
                    projectRoot + '**/*.js'
                ],
                dest: 'public/js/widgetdemos.debug.js'
            }
        },
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


        browserify : {
            dev : {
                src : ['src/app/**/*.js'],
                dest : './public/js/bundle.js',
                options : {
                    // watch : true, // use watchify for incremental builds!
                    //  keepAlive : true, // watchify will exit unless task is kept alive
                    browserifyOptions : {
                        debug : true // source mapping
                    }
                }
            },
            dist : {
                src : ["<%= paths.src %>"],
                dest : "<%= paths.dest %>"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');


    grunt.registerTask("dev", ["browserify:dev"]);
    grunt.registerTask('default', ['concat', 'watch']);
};