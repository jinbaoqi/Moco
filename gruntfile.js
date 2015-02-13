module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            dist: {
                src: [
                    "src/Util.js",
                    "src/EventCore.js",
                    "src/Event.js",
                    "src/MouseEvent.js",
                    "src/KeyBoardEvent.js",
                    "src/EventDispatcher.js",
                    "src/Base.js",
                    "src/DisplayObject.js",
                    "src/DisplayObjectContainer.js",
                    "src/raf.js",
                    "src/Stage.js",
                    "src/Shape.js",
                    "src/Sprite.js",
                    "src/Bitmap.js",
                    "src/BitmapData.js",
                    "src/Animation.js",
                    "src/URLLoader.js",
                    "src/Loader.js",
                    "src/Tween.js"
                ],
                dest: 'dist/moco.js'
            }
        },
        watch: {
            files: ['src/**/*.js'],
            tasks: ['concat']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['watch']);
};