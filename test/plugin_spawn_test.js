'use strict';

var grunt = require('grunt'), cp = require("child_process"), command, options;

function findGruntFilename(callback) {
  var command = "grunt", options, extensionsStr, extensions, i, child, onErrorFnc, hasRightExtension = false;

  onErrorFnc = function(data) {
    if (data.message!=="spawn ENOENT"){
      grunt.warn("Unexpected error on spawn " +extensions[i]+ " error: " + data);
    }
  };

  function tryExtension(extension) {
    var child = cp.spawn(command + extension, ['--version']);
    child.on("error", onErrorFnc);
    child.on("exit", function(code, signal) {
      hasRightExtension = true;
      callback(command + extension);
    });
  }

  extensionsStr = process.env.PATHEXT || '';
  extensions = [''].concat(extensionsStr.split(';'));
  for (i=0; !hasRightExtension && i<extensions.length;i++) {
    tryExtension(extensions[i]);
  }
}

/**
 *callGruntfile
 * @param command
 * @param filename
 * @param callbacks onProcessError(error), onProcessExit(code, signal), onStdout(data), onStderr(data)
 */
function callGruntfile(command, filename, callbacks) {
  var comArg, options, child;
  callbacks = callbacks || {};

  comArg = ["--gruntfile", filename, "--no-color"];
  options = {cwd: 'test/'};
  child = cp.spawn(command, comArg, options);

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
    var wasPassMessage = false;
    test.expect(2);
    findGruntFilename(function(gruntCommand){
      var callbacks = {
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
      callGruntfile(gruntCommand, 'gruntfile-pass.js', callbacks);
    });
  },
  fail_1: function(test) {
    var wasPassMessage = false;
    test.expect(2);
    findGruntFilename(function(gruntCommand){
      var callbacks = {
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
      callGruntfile(gruntCommand, 'gruntfile-fail-complete.js', callbacks);
    });
  },
  fail_2: function(test) {
    var wasPassMessage = false;
    test.expect(2);
    findGruntFilename(function(gruntCommand){
      var callbacks = {
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
      callGruntfile(gruntCommand, 'gruntfile-fail-partial.js', callbacks);
    });
  }

};

