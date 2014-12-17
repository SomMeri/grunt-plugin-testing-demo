'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('plugin_tester', 'Demo grunt task.', function() {
    //merge supplied options with default options
    var options = this.options({ action: 'pass', message: 'unknown error'});

    //pass or fail - depending on configured options
    if (options.action==='pass') {
      grunt.log.writeln('Plugin worked correctly.');
    } else {
      grunt.warn('Plugin failed: ' + options.message);
    }
  });

};
