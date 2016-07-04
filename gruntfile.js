module.exports = function(grunt) {
    grunt.initConfig({
        babel: {
            options: {
                sourceMap: false,
                presets: ['es2015']
            },
            dist: {
                files: {
                    "dist/Moco.js": "dist/Moco.js",
                }
            }
        },
        concat: {
            dist: {
                src: [
                    "es6/intro.js",
                    "es6/Vec3.js",
                    "es6/Matrix3.js",
                    "es6/global.js",
                    "es6/Util.js",
                    "es6/Timer.js",
                    "es6/InteractiveEvent.js",
                    "es6/MouseEvent.js",
                    "es6/KeyboardEvent.js",
                    "es6/EventDispatcher.js",
                    "es6/DisplayObject.js",
                    "es6/InteractiveObject.js",
                    "es6/DisplayObjectContainer.js",
                    "es6/Stage.js",
                    "es6/Sprite.js",
                    "es6/Shape.js",
                    "es6/outro.js"
                ],
                dest: 'dist/Moco.js'
            }
        },
        replace: {
            another_example: {
                src: ['dist/Moco.js'],
                overwrite: true,
                replacements: [{
                    from: /['"]use strict['"]/g,
                    to: ""
                }]
            }
        },
        uglify: {
            options: {
                compress: {
                    drop_console: true
                }
            },
            my_target: {
                files: {
                    'dist/Moco.min.js': ['dist/Moco.js']
                }
            }
        },
        watch: {
            files: ['es6/**/*.js'],
            tasks: ['concat', 'babel', 'replace', 'uglify']
        },
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-text-replace');

    grunt.registerTask('default', ['watch']);
};