module.exports = function (grunt) {
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
                    "src/intro.js",
                    "src/Vec3.js",
                    "src/Matrix3.js",
                    "src/global.js",
                    "src/Util.js",
                    "src/Timer.js",
                    "src/InteractiveEvent.js",
                    "src/MouseEvent.js",
                    "src/KeyboardEvent.js",
                    "src/EventDispatcher.js",
                    "src/DisplayObject.js",
                    "src/InteractiveObject.js",
                    "src/DisplayObjectContainer.js",
                    "src/Stage.js",
                    "src/Sprite.js",
                    "src/Shape.js",
                    "src/Loader.js",
                    "src/Bitmap.js",
                    "src/BitmapData.js",
                    "src/URLLoader.js",
                    "src/outro.js"
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
            files: ['src/**/*.js'],
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