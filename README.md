# grunt-less-themes [![Build Status](https://travis-ci.org/hollandben/grunt-less-themes.png?branch=master)](https://travis-ci.org/hollandben/grunt-less-themes)

> Compile multiple themed LESS files to CSS. This version has been modified to support font configurations as well for n^2 possible combinations.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-less-themes --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-less-themes');
```

*This plugin was designed to work with Grunt 0.4.x. If you're still using grunt v0.3.x it's strongly recommended that [you upgrade](http://gruntjs.com/upgrading-from-0.3-to-0.4).

## less-themes task
_Run this task with the `grunt lessThemes` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Options

This task is an extension of the [grunt-contrib-less](https://github.com/gruntjs/grunt-contrib-less) task. The options from that task are also compatible with this one.

#### output
Type: `String`
Default: 'generated'

This option defines the output directory for the `grunt-less-theme` task.

#### themeDir
Type: `String`
Default: 'themes'

This option defines the directory where all the themes are hosted

#### themeImport
Type: `String`
Default: 'theme'

This option is the name of the theme file that is imported into each LESS file for compilation.

#### fontDir
Type: `String`
Default: 'fonts'

This option defines the directory where all the fonts are hosted

#### fontImport
Type: `String`
Default: 'theme'

This option is the name of the font file that is imported into each LESS file for compilation.


#### placeholder
Type: `String`
Default: '{{themeDir}}'

This option is the placeholder string used in the output CSS filename. The name of each theme will replace this placeholder.

### Usage Examples

#### Simple

```js
lessThemes: {
    dev: {
        options: {
            output: 'path/to/output'
        },
        files: {
            'example_{{themeName}}.css': 'simple.less'
        }
    }
}
```

#### Complex

```js
lessThemes: {
    dev: {
        options: {
            output: 'path/to/output',
            themeDir: 'path/to/themes'
        },
        files: {
            'core_{{themeName}}.css': ['core/*.less'],
            'common_{{themeName}}.css': ['common/*.less'],
            'components_{{themeName}}.css': ['components/*.less']
        }
    }
}
```