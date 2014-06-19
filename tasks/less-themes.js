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

module.exports = function (grunt) {

    var path = require('path'),
        less = require('less'),
        fs   = require('fs');

    var _     = grunt.util._,
        async = grunt.util.async;

    var lessOptions = {
        parse: ['paths', 'optimization', 'filename', 'strictImports', 'dumpLineNumbers'],
        render: ['compress', 'cleancss', 'yuicompress', 'ieCompat','sourceMap', 'sourceMapFilename', 'sourceMapURL', 'sourceMapBasepath', 'sourceMapRootpath', 'outputSourceFiles']
    };

    grunt.registerMultiTask('lessThemes', 'Compile multiple themed LESS files to CSS', function() {

        var options = {
            themes: 'themes/*.less',
            fonts: null,
            placeholder: '{{themeName}}',
            font_placeholder: '{{fontName}}',
            themeImport: 'theme',
            fontImport: 'font'
        };

        var done = this.async();

        var options = _.extend(options, this.options()),
            srcFiles = this.files;

        lessOptions = _.extend(lessOptions, this.options().lessOptions)

        var themes = grunt.file.expand(options.themes);
        var fonts = options.fonts ? grunt.file.expand(options.fonts) : null;
        var fontPath = null;

        var compilationFunction = function(themePath, nextTheme) {
            var rs = fs.createReadStream(themePath);
            rs.pipe(fs.createWriteStream(options.themeImport));

            rs.on('end', function () {

                var compilationInnerFunction = function() {
                    async.forEachSeries(srcFiles, function(f, nextFileObj) {
                        var themeName = themePath.toString().split('\/').pop().replace(/\..+$/, '');
                        var destFile = f.dest.replace(options.placeholder, themeName);
                        if (fontPath) {
                            var fontName = fontPath.toString().split('\/').pop().replace(/\..+$/, '');
                            destFile = destFile.replace(options.font_placeholder, fontName);
                        }

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

                        async.concatSeries(files, function(file, next) {
                            compileLess(file, options, function(err, css) {
                                if (!err) {
                                    compiled.push(css);
                                    next();
                                } else {
                                    nextFileObj(err);
                                }
                            }, function (sourceMapContent) {
                                grunt.file.write(options.sourceMapFilename, sourceMapContent);
                            });
                        }, function () {
                            if (compiled.length < 1) {
                                grunt.log.warn('Destination not written because compiled files were empty.');
                            } else {
                                grunt.file.write(destFile, compiled.join(grunt.util.normalizelf(grunt.util.linefeed)));
                                grunt.log.writeln('File ' + destFile.cyan + ' created.');
                            }
                            nextFileObj();
                        });

                    }, nextTheme);
                };

                if (fontPath) {
                    var rsFont = fs.createReadStream(fontPath);
                    rsFont.pipe(fs.createWriteStream(options.fontImport));
                    rsFont.on('end', compilationInnerFunction);
                } else {
                    compilationInnerFunction();
                }

            });
        };


        if (fonts) {
            async.forEachSeries(fonts, function(fontPathInner, nextFont) {
                fontPath = fontPathInner;
                async.forEachSeries(themes, compilationFunction, nextFont);
            }, done);
        } else {
            async.forEachSeries(themes, compilationFunction, done);
        }
    });

    var compileLess = function(srcFile, options, callback, sourceMapCallback) {
        options = _.extend({
            filename: srcFile
        }, options);
        options.paths = options.paths || [path.dirname(srcFile)];

        if (typeof options.sourceMapBasepath === 'function') {
            try {
                options.sourceMapBasepath = options.sourceMapBasepath(srcFile);
            } catch (e) {
                grunt.fail.warn(wrapError(e, 'Generating sourceMapBasepath failed.'));
            }
        }

        var css;
        var srcCode = grunt.file.read(srcFile);

        var parser = new less.Parser(_.pick(options, lessOptions.parse));

        parser.parse(srcCode, function(parse_err, tree) {
            var minifyOptions = _.pick(options, lessOptions.render);

            if (parse_err) {
                lessError(parse_err);
                callback(true, '');
            }

            if (minifyOptions.sourceMapFilename) {
                minifyOptions.writeSourceMap = sourceMapCallback;
            }

            try {
                css = tree.toCSS(minifyOptions);
                callback(null, css);
            } catch (e) {
                lessError(e);
                callback(true, css);
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