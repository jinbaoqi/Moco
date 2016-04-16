module.exports = function(grunt) {
    grunt.initConfig({
        babel: {
            options: {
                sourceMap: false,
                presets: ['es2015']
            },
            dist: {
                files: {
                    "dist/es6/Util.js": "es6/Util.es",
                    "dist/es6/EventDispatcher.js": "es6/EventDispatcher.es"
                }
            }
        },
        concat: {
            dist: {
                src: [
                    "dist/es6/Util.js",
                    "dist/es6/EventDispatcher.js"
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