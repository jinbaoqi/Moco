module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                // 将要被合并的文件
                src: ['src/**/*.js'],
                // 合并后的JS文件的存放位置
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