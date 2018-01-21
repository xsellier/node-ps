'use strict';

var os       = require('os');
var spawn    = require('child_process').spawn;

var platform     = os.platform();
var operations   = {
  ps : {
    command  : 'ps',
    arguments: ['axo','pid,args'],
    indexes  : {
      pid: 0,
      command: 1
    }
  },
  kill : {
    command  : 'kill',
    arguments: []
  }
};

if (/win32/.test(platform)) {
  operations.ps.command   = 'tasklist';
  operations.ps.arguments = ['/v', '/FO', 'CSV'];

  operations.kill.command   = 'taskkill';
  operations.kill.arguments = [];

  operations.ps.indexes.pid     = 1;
  operations.ps.indexes.command = 0;
}

var listProcesses = function(options, done) {
  // Prevent errors
  if(options.clean && !/win32/.test(platform)) {
    operations.ps.arguments =  ['axco','pid,command'];
  }
  if (done == null){
    done    = options;
    options = {};
  } else {
    options = options || {};
  }

  var ps          = spawn(operations.ps.command, operations.ps.arguments);
  var processList = '';
  var processErr  = '';
  var options     = {
    name: options.name,
    pid : options.pid
  }

  ps.on('error', function(err) {
    done(err);
  });

  ps.stdout.on('data', function (data) {
    processList += data.toString();
  });

  ps.stderr.on('data', function (data) {
    processErr += data.toString();
  });

  ps.on('close', function (code) {
    if (code !== 0 || processErr.length > 0) {
      done(new Error('Process exited with code ' + code + ', output:\n' + processErr));
    } else {
      processList = processList.replace(/\"/g, '').split(/[\r]{0,1}\n/).map(function(item) {
        var splittedItem = item.replace(/[ ]*([0-9]+)\ /,'$1,').split(',');
        var command      = splittedItem[operations.ps.indexes.command] || '';
        var pid          = splittedItem[operations.ps.indexes.pid] || '';

        return {
          command: command.replace(/(^[ ]+|[ ]+$)/g, ''),
          pid: pid
        };
      }).filter(function(item) {
        // Keep only process with valid pid, others are filtere (title line for example)
        return /^[0-9]+$/.test(item.pid);
      });

      if (options.name != null) {
        var optionsName = options.name;
        var name;

        if (options.name instanceof RegExp) {
          name = options.name;
        } else {
          name = new RegExp(options.name);
        }

        processList = processList.filter(function(item) {
          return name.test(item.command);
        });
      }

      if (options.pid != null) {
        var pid = options.pid;

        processList = processList.filter(function(item) {
          return parseInt(pid) === parseInt(item.pid);
        });
      }

      done(null, processList);
    }
  });
};

var killProcesses = function(options, done) {
  // Prevent errors
  options = options || {};

  var pidList  = options.pidList;

  // Not valid on windows
  var signals  = options.signals || [];

  // If options is an array => shortcut
  if (Array.isArray(options)) {
    pidList = options;
  }

  // Guardian clause, exit on invalid arguments
  if (pidList == null || pidList.length == 0) {
    return done();
  }

  var killArguments = operations.kill.arguments.concat(signals, pidList)

  if (/win32/.test(platform)) {
    killArguments = ['/F', '/T'];
    pidList.forEach(function(pid) {
      killArguments.push('/PID');
      killArguments.push(pid);
    });
  }

  var kill          = spawn(operations.kill.command, killArguments);
  var processErr    = '';

  kill.on('error', done);

  kill.stderr.on('data', function (data) {
    processErr += data.toString();
  });

  kill.on('close', function (code) {
    if (code !== 0 || processErr.length > 0) {
      done(new Error('Process exited with code ' + code + ', output:\n' + processErr));
    } else {
      done();
    }
  });
}

module.exports = {
  list: listProcesses,
  kill: killProcesses
};
