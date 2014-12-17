'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('plugin_tester', 'Testing grunt plugins from inside grunt.', function() {
    //merge supplied options with default options
    var options = this.options({ action: 'pass', message: 'unknown error'});

    //pass or fail - depending on what is needed
    if (options.action==='pass') {
      grunt.log.writeln('Plugin worked correctly.');
    } else {
      grunt.warn('Plugin failed: ' + options.message);
    }
  });

};
