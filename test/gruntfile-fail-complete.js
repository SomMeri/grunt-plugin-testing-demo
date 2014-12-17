/*jslint node: true */
'use strict';

module.exports = function(grunt) {
  var loader = require("./grunt-hacks.js");

  grunt.initConfig({
    // prove that npm plugin works too
    jshint: {
      all: [ 'gruntfile-pass.js' ]
    },

    // Configuration to be run (and then tested).
    plugin_tester: {
      fail_1: { // first failure
        options: { action: 'fail', message: 'complete failure' }
      }
    }

  });

  grunt.loadTasks('./../tasks');
  loader.loadParentNpmTasks(grunt, 'grunt-contrib-jshint');

  grunt.registerTask('default', ['plugin_tester', 'jshint']);

};

