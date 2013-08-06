# grunt-less-themes

> Compile multiple themed LESS files to CSS.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-contrib-copy --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-contrib-copy');
```

*This plugin was designed to work with Grunt 0.4.x. If you're still using grunt v0.3.x it's strongly recommended that [you upgrade](http://gruntjs.com/upgrading-from-0.3-to-0.4), but in case you can't please use [v0.3.2](https://github.com/gruntjs/grunt-contrib-copy/tree/grunt-0.3-stable).*

## Copy task
_Run this task with the `grunt copy` command._

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

#### themes
Type: `Array`

This option provides the `grunt-less-themes` task with the names of each theme. This name is used to in finding the theme and in the generated file.

#### placeholder
Type: `String`
Default: '{{theme}}'

This option is the placeholder string used in the output CSS filename. The name of each theme will replace this placeholder.

#### themeImport
Type: `String`
Default: 'theme'

This option is the name of the theme file that is imported into each LESS file for compilation.


### Usage Examples

#### Simple

```js
lessThemes: {
    dev: {
        options: {
            output: 'path/to/outpu'
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
            output: 'path/to/outpu',
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