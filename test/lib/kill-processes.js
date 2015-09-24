'use strict';

var expect         = require('chai').expect;
var child_process  = require('child_process');
var path           = require('path');

var ps             = require('../../lib');

var httpServerPath = 'test/helpers/http-server.js';
var httpServer;

describe('ps module', function() {

  before(function(done) {
    httpServer = child_process.fork(httpServerPath);

    // Let http server spawn;
    setTimeout(done, 1000);
  });

  after(function(done) {
    // In case of tests failed
    httpServer.kill();

    done();
  })

  it('should find spawned http server', function(done) {
    var options = {
      name: httpServerPath
    };

    ps.list(options, function(err, result) {
      expect(err).to.not.exist;
      expect(result).to.be.an.array;

      expect(result).to.have.length(1);
      expect(parseInt(result[0].pid)).to.be.equal(httpServer.pid);

      done();
    })
  });

  it('should kill http server, and not able to list it', function(done) {
    var options = {
      pidList: [httpServer.pid],
      signal: '-9'
    };

    httpServer.on('exit', done);

    ps.kill(options, function(err) {
      expect(err).to.not.exist;
    });
  });
});
