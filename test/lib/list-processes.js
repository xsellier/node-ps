'use strict';

var expect = require('chai').expect;
var path   = require('path');
var ps     = require('../../lib');

var processName = process.title;

describe('ps module', function() {
  it('should list all processes', function(done) {
    ps.list(function(err, result) {
      expect(err).to.not.exist;
      expect(result).to.be.an.array;

      var commands = result.map(function(item) {
        return item.command;
      }).filter(function(command) {
        return command.indexOf(processName) >= 0;
      });

      expect(commands).to.have.length.above(0);

      done();
    })
  });

  it('should filter processes', function(done) {
    var options = {
      name: processName
    };

    ps.list(options, function(err, result) {
      expect(err).to.not.exist;
      expect(result).to.be.an.array;

      var commands = result.filter(function(item) {
        return item.command.indexOf(processName) >= 0;
      });

      expect(commands).to.have.length.above(0);

      done();
    });
  });
});
