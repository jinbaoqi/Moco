module.exports = function (grunt) {
    'use strict';

    var config = {

        pkg: grunt.file.readJSON('package.json'),

        browserify: {
            build: {
                src: ['src/**/*.js'],
                dest: 'dist/Moco.js',
                options: {
                    transform: [['babelify', {
                        blacklist: ['useStrict']
                    }]],
                    alias: {
                        Moco: './src/Moco.js'
                    }
                }
            }
        },

        uglify: {
            build: {
                src: 'dist/Moco.js',
                dest: 'dist/Moco.min.js'
            }
        },

        copy: {
            documentation: {
                files: [
                    {src: 'LICENSE', dest: 'dist/'},
                    {src: 'README.md', dest: 'dist/'}
                ]
            },
            code: {
                files: [
                    {expand: true, cwd: 'src/', src: ['**/*.html'], dest: 'dist/'},
                    {expand: true, cwd: 'src/', src: ['**/*.css'], dest: 'dist/'}
                ]
            }
        },

        jsdoc: {
            all: {
                src: ['src/**/*.js', 'tests/**/*.js'],
                dest: 'doc',
                options: {
                    ignoreWarnings: true
                }
            }
        },

        watch: {
            js: {
                files: ['src/**/*.js', 'tests/**/*.js'],
                tasks: ['force:jshint:all', 'browserify:build'],
                options: {
                    spawn: false
                }
            },
            code: {
                files: ['src/**/*.html', 'src/**/*.css'],
                tasks: ['copy:code'],
                options: {
                    spawn: false
                }
            }
        },

        clean: {
            all: ['dist/*']
        },

        karma: {
            production: {
                configFile: 'karma.conf.js',
                singleRun: true
            },
            development: {
                configFile: 'karma.conf.js',
                coverageReporter: {type: 'html'},
                autoWatch: true,
                singleRun: false
            }
        },

        jshint: {
            options: {
                bitwise: true,
                camelcase: true,
                curly: true,
                eqeqeq: true,
                forin: true,
                freeze: true,
                indent: 4,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                nonbsp: true,
                nonew: true,
                plusplus: true,
                quotmark: 'single',
                undef: true,
                unused: true,
                strict: false,
                maxlen: 180,
                browser: true,
                devel: false,
                jasmine: true,
                browserify: true,
                esnext: true
            },
            all: {
                src: ['Gruntfile.js', 'src/**/*.js', 'tests/**/*.js']
            }
        }
    };

    grunt.initConfig(config);

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-force-task');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-karma');

    grunt.event.on('watch', function (action, path) {
        var relative = path.replace(/^src\//, '');
        grunt.config('copy.code.files', [{expand: true, cwd: 'src/', src: [relative], dest: 'dist/'}]);
    });

    grunt.registerTask('development', [
        'clean:all',
        'force:jshint:all',
        'force:browserify:build',
        'copy:code',
        // TODO: Concat (and compress?) css.
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean:all',
        'force:jshint:all',
        //'karma:production',
        'browserify:build',
        // TODO: Concat and compres css.
        // TODO: Figure out how to fix script source for production.
        'copy:code',
        'uglify:build',
        'jsdoc:all'
    ]);

    grunt.registerTask('default', [
        'development'
    ]);

    grunt.registerTask('test', [
        'karma:development'
    ]);
};
