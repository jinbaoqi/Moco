module.exports = function(grunt) {
    grunt.initConfig({
        babel: {
            options: {
                sourceMap: false,
                presets: ['es2015']
            },
            dist: {
                files: {
                    "dist/es6/global.js": "es6/global.es",
                    "dist/es6/Util.js": "es6/Util.es",
                    "dist/es6/EventDispatcher.js": "es6/EventDispatcher.es",
                    "dist/es6/DisplayObject.js": "es6/DisplayObject.es",
                    "dist/es6/DisplayObjectContainer.js": "es6/DisplayObjectContainer.es",
                    "dist/es6/Stage.js": "es6/Stage.es"
                }
            }
        },
        concat: {
            dist: {
                src: [
                    "es6/intro.es",
                    "dist/es6/global.js",
                    "dist/es6/Util.js",
                    "dist/es6/EventDispatcher.js",
                    "dist/es6/DisplayObject.js",
                    "dist/es6/DisplayObjectContainer.js",
                    "dist/es6/Stage.js",
                    "es6/outro.es"
                ],
                dest: 'dist/Moco.js'
            }
        },
        watch: {
            files: ['es6/**/*.es'],
            tasks: ['babel', 'concat']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-babel');

    grunt.registerTask('default', ['watch']);
};