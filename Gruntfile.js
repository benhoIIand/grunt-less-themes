module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({

        clean: {
            tmp: 'tmp'
        },

        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        lessThemes: {
            main: {
                options: {
                    output: 'tmp',
                    themes: ['black', 'white'],
                    themeDir: 'test/fixtures/themes',
                    themeImport: 'test/fixtures/theme.less'
                },
                files: {
                    'simple_{{themeName}}.css': ['test/fixtures/simple.less']
                }
            }
        },

        nodeunit: {
            tests: ['test/*_test.js']
        }

    });


    // Load this plugins tasks
    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('test', ['clean', 'lessThemes', 'nodeunit']);
};