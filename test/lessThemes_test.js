var grunt = require('grunt');

String.prototype.removeWhitespace = function() {
    return this.replace(/(\s)/gm, '');
};

exports.lessThemes = {
    main: function(test) {
        test.expect(4);

        test.ok(grunt.file.exists('tmp/simple_black.css'), 'simple black exists');
        test.ok(grunt.file.exists('tmp/simple_white.css'), 'simple white exists');

        var actualBlack   = grunt.file.read('tmp/simple_black.css').removeWhitespace();
        var expectedBlack = grunt.file.read('test/expected/simple_black.css').removeWhitespace();
        test.equals(actualBlack, expectedBlack, 'simple black is as expected');

        var actualWhite   = grunt.file.read('tmp/simple_white.css').removeWhitespace();
        var expectedWhite = grunt.file.read('test/expected/simple_white.css').removeWhitespace();
        test.equals(actualWhite, expectedWhite, 'simple white is as expected');

        test.done();
    }
};