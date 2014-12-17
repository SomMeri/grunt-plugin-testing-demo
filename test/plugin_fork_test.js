'use strict';

var grunt = require('grunt'), cp = require("child_process"), command, options;

/**
 *callGruntfile
 * @param command
 * @param filename
 * @param callbacks onProcessError(error), onProcessExit(code, signal), onStdout(data), onStderr(data)
 */
function callGruntfile(filename, callbacks) {
  var comArg, options, child;
  callbacks = callbacks || {};

  child = cp.fork('./test/call-grunt.js', [filename], {silent: true});

  if (callbacks.onProcessError) {
    child.on("error", callbacks.onProcessError);
  }

  if (callbacks.onProcessExit) {
    child.on("exit", callbacks.onProcessExit);
  }

  if (callbacks.onStdout) {
    child.stdout.on('data', callbacks.onStdout);
  }
  if (callbacks.onStderr) {
    child.stderr.on('data', callbacks.onStderr);
  }
}

function contains(where, what) {
  var index = where.toString().indexOf(what);
  return index>-1;
}

function containsWarning(buffer, warning) {
  return contains(buffer, 'Warning: Plugin failed: ' + warning);
}

exports.plugin_tester = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  pass: function(test) {
    var wasPassMessage = false, callbacks;
    test.expect(2);
    callbacks = {
      onProcessError: function(error) {
        test.ok(false, "Unexpected error: " + error);
        test.done();
      },
      onProcessExit: function(code, signal) {
        test.equal(code, 0, "Exit code should have been 0");
        test.ok(wasPassMessage, "Pass message was never sent ");
        test.done();
      },
      onStdout: function(data) {
        if (contains(data, 'Plugin worked correctly.')) {
          wasPassMessage = true;
        }
      },
      onStderr: function(data) {
        test.ok(false, "Stderr should have been empty: " + data);
      }
    };
    callGruntfile('test/gruntfile-pass.js', callbacks);
  },
  fail_1: function(test) {
    var wasPassMessage = false, callbacks;
    test.expect(2);
    callbacks = {
      onProcessError: function(error) {
        test.ok(false, "Unexpected error: " + error);
        test.done();
      },
      onProcessExit: function(code, signal) {
        test.notEqual(code, 0, "Exit code should NOT have been 0");
        test.ok(wasPassMessage, "Error message was never sent ");
        test.done();
      },
      onStdout: function(data) {
        if (containsWarning(data, 'complete failure')) {
          wasPassMessage = true;
        }
      },
      onStderr: function(data) {
        test.ok(false, "Stderr should have been empty: " + data);
      }
    };
    callGruntfile('test/gruntfile-fail-complete.js', callbacks);
  },
  fail_2: function(test) {
    var wasPassMessage = false, callbacks;
    test.expect(2);
    callbacks = {
      onProcessError: function(error) {
        test.ok(false, "Unexpected error: " + error);
        test.done();
      },
      onProcessExit: function(code, signal) {
        test.notEqual(code, 0, "Exit code should NOT have been 0");
        test.ok(wasPassMessage, "Error message was never sent ");
        test.done();
      },
      onStdout: function(data) {
        if (containsWarning(data, 'partial failure')) {
          wasPassMessage = true;
        }
      },
      onStderr: function(data) {
        test.ok(false, "Stderr should have been empty: " + data);
      }
    };
    callGruntfile('test/gruntfile-fail-partial.js', callbacks);
  }

};

