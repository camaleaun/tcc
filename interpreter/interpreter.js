'use strict';

var Interpreter = function(code) {
  if (typeof code == 'string') {
    code = parser.parse(code);
    console.log(code);
    console.log(JSON.stringify(code));
  }
};

Interpreter.prototype.run = function() {
};
