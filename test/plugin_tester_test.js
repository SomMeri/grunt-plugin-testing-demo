'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.plugin_tester = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  pass: function(test) {
    test.expect(1);

    test.equal("", "", 'pass');

    test.done();
  },
  fail_1: function(test) {
    test.expect(1);

    test.equal("", "", 'fail_1');

    test.done();
  },
  fail_2: function(test) {
    test.expect(1);

    test.equal("", "", 'fail_2');

    test.done();
  }
};
