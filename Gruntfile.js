module.exports = function (grunt) {

    var projectRoot = 'src/';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            app: {
                src: [
                    projectRoot + 'main/**/*.js'
                ],
                dest: 'build/js/app.debug.js'
            },
            weather: {
                src: [
                    projectRoot + 'widgets/weather/**/*.js'
                ],
                dest: 'build/js/weather.debug.js'
            },
            winamp: {
                src: [
                    projectRoot + 'widgets/winamp/**/*.js'
                ],
                dest: 'build/js/winamp.debug.js'
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
                src : ['build/js/winamp.debug.js', 'build/js/weather.debug.js', 'build/js/app.debug.js', 'src/wrapper/wrapper.js'],
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
    grunt.registerTask('default', ['concat', 'dev']);
};