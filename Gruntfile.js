'use strict';
module.exports = function(grunt) {
    // load all grunt tasks matching the `grunt-*` pattern
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // Meta definitions
        meta: {
            header: "/*!\n" +
                " *  <%= pkg.title || pkg.name %> - v<%= pkg.version %> (<%= grunt.template.today('yyyy-mm-dd') %>)\n" +
                " *  <%= pkg.homepage %>\n" +
                " *\n" +
                " *  <%= pkg.description %>\n" +
                " *\n" +
                " *  Copyright (c) <%= grunt.template.today('yyyy') %> <%= pkg.author.name %> <<%= pkg.author.url %>>\n" +
                " *  License: <%= pkg.author.license %>\n" +
                " */\n"
        },

        // javascript linting with jshint
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                "force": true
            },

            src: {
                // you can overrides global options for this target here
                options: {},
                files: {
                    src: ['src/**/*.js']
                }
            }
        },

        // Copy files from bower_component folder to right places
        copy: {
            toDist: {
                files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        cwd: 'sandbox/assets/js',      // Src matches are relative to this path.
                        src: ['*.js'],      // Actual pattern(s) to match.
                        dest: 'dist/'   // Destination path prefix.
                    }
                ]
            }
        },

        // merge js files
        concat: {
            scripts: {
                options: {
                    banner: '<%= meta.header %>',
                    process: function(src, filepath) {
                        var separator = "\n\n/* -------------------- " + filepath + " -------------------- */\n\n\n";
                        return (separator + src).replace(/;\s*$/, "") + ";"; // make sure always a semicolon is at the end
                    },
                },
                src: ['src/**/*.js'],
                dest: 'sandbox/assets/js/<%= pkg.name %>.js'
            }
        },

        // uglify to concat, minify, and make source maps
        uglify: {
            options: {
                compress: {
                    drop_console: true
                },
                banner: ""
            },

            front_script_js: {
                options: {
                    sourceMap: true,
                    mangle: false,
                    compress: false,
                    preserveComments: 'some'
                },
                files: {
                    'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
                }
            }
        },

        // watch for changes and trigger sass, jshint, uglify and livereload
        watch: {

            autoreload: {
                options: { livereload: true },
                files: [ 'src/**/*.js'],
                tasks: ['dev']
            }
        },

    });

    // rename tasks
    // grunt.renameTask('rsync', 'deploy');

    // register task
    grunt.registerTask( 'default', ['dev','watch']);
    grunt.registerTask( 'build', ['dev', 'copy:toDist', 'uglify']);
    grunt.registerTask( 'dev', ['jshint', 'concat'] );
};
