# ps-man

To install:

```bash
npm install --save ps-man
```

## Usage

- list
  * name : Process name - _optional_
  * pid : Process identifier - _optional_
- kill
  * pidList : Array of process identifier - _mandatory_
  * signal : The  default signal for kill is TERM. (see ``man ps``) - _optional - OSX/Linux only_


### List processes

#### Filter by name
```javascript
var ps = require('ps-man');

// Filter by name
var options = {
  name: 'node'
};

ps.list(options, function(err, result) {
  // my stuff here
});
```

#### Filter by pid

```javascript
var ps = require('ps-man');

// Filter by pid
var options = {
  pid: 1501
};

ps.list(options, function(err, result) {
  // my stuff here
});
```

### Kill processes

```javascript
var ps = require('ps-man');

var options = {
  pidList: ['1501'],
  signal: '-9'
};

ps.kill(options, function(err) {
  // stuff here
});

// or could be used as following
ps.kill(['1501'], function(err) {
  // stuff here
});
```

# License
MIT. Please see License file for more details.
