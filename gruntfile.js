module.exports = function(grunt) {
    grunt.initConfig({
        babel: {
            options: {
                sourceMap: false,
                presets: ['es2015']
            },
            dist: {
                files: {
                    "dist/Moco.js": "dist/Moco.es",
                }
            }
        },
        concat: {
            dist: {
                src: [
                    "es6/intro.es",
                    "es6/global.es",
                    "es6/Util.es",
                    "es6/Timer.es",
                    "es6/Vec3.es",
                    "es6/Matrix3.es",
                    "es6/InteractiveEvent.es",
                    "es6/MouseEvent.es",
                    "es6/KeyboardEvent.es",
                    "es6/EventDispatcher.es",
                    "es6/DisplayObject.es",
                    "es6/InteractiveObject.es",
                    "es6/DisplayObjectContainer.es",
                    "es6/Stage.es",
                    "es6/Sprite.es",
                    "es6/Shape.es",
                    "es6/outro.es"
                ],
                dest: 'dist/Moco.es'
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
            files: ['es6/**/*.es'],
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