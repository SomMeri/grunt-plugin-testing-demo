/*jslint node: true */
'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    // prove that npm plugin works too
    jshint: {
      all: [ 'gruntfile-pass.js' ]
    },

    // Configuration to be run (and then tested).
    plugin_tester: {
      pass: {
        options: { action: 'pass' }
      }
    }

  });

  grunt.loadTasks('./../tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['plugin_tester', 'jshint']);

};

