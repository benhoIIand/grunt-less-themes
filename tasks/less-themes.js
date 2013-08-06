/*
 * grunt-less-themes
 *
 *
 * Adapted from the grunt-contrib-less module.
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Tyler Kellen, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    var path = require('path'),
        less = require('less'),
        fs   = require('fs');

    var lessOptions = {
        parse: ['paths', 'optimization', 'filename', 'strictImports', 'dumpLineNumbers'],
        render: ['compress', 'yuicompress', 'ieCompat']
    };

    grunt.registerMultiTask('lessThemes', 'Compile LESS files to CSS', function() {
        var done = this.async();

        var options = this.options(),
            srcFiles = this.files;

        grunt.verbose.writeflags(options, 'Options');

        if (srcFiles.length < 1) {
            grunt.log.warn('Destination not written because no source files were provided.');
        }

        grunt.util.async.forEachSeries(options.themes, function(theme, nextTheme) {
            fs.createReadStream(options.themeDir + theme +'.less').pipe(fs.createWriteStream(options.rootDir +'theme.less'));

            grunt.util.async.forEachSeries(srcFiles, function(f, nextFileObj) {
                var destFile = options.outputDir + f.dest.replace(options.placeholder, theme);

                var files = f.src.filter(function(filepath) {
                    // Warn on and remove invalid source files (if nonull was set).
                    if (!grunt.file.exists(filepath)) {
                        grunt.log.warn('Source file "' + filepath + '" not found.');
                        return false;
                    } else {
                        return true;
                    }
                });

                if (files.length === 0) {
                    if (f.src.length < 1) {
                        grunt.log.warn('Destination not written because no source files were found.');
                    }

                    // No src files, goto next target. Warn would have been issued above.
                    return nextFileObj();
                }

                var compiled = [];
                grunt.util.async.concatSeries(files, function(file, next) {
                    compileLess(file, options, function(css, err) {
                        if (!err) {
                            compiled.push(css);
                            next();
                        } else {
                            nextFileObj(err);
                        }
                    });
                }, function() {
                    if (compiled.length < 1) {
                        grunt.log.warn('Destination not written because compiled files were empty.');
                    } else {
                        grunt.file.write(destFile, compiled.join(grunt.util.normalizelf(grunt.util.linefeed)));
                        grunt.log.writeln('File ' + destFile.cyan + ' created.');
                    }
                    nextFileObj();
                });

            }, nextTheme);

        }, done);
    });

    var compileLess = function(srcFile, options, callback) {
        options = grunt.util._.extend({
            filename: srcFile
        }, options);
        options.paths = options.paths || [path.dirname(srcFile)];

        var css;
        var srcCode = grunt.file.read(srcFile);

        var parser = new less.Parser(grunt.util._.pick(options, lessOptions.parse));

        parser.parse(srcCode, function(parse_err, tree) {
            if (parse_err) {
                lessError(parse_err);
                callback('', true);
            }

            try {
                css = tree.toCSS(grunt.util._.pick(options, lessOptions.render));
                callback(css, null);
            } catch (e) {
                lessError(e);
                callback(css, true);
            }
        });
    };

    var formatLessError = function(e) {
        var pos = '[' + 'L' + e.line + ':' + ('C' + e.column) + ']';
        return e.filename + ': ' + pos + ' ' + e.message;
    };

    var lessError = function(e) {
        var message = less.formatError ? less.formatError(e) : formatLessError(e);

        grunt.log.error(message);
        grunt.fail.warn('Error compiling LESS.');
    };
};