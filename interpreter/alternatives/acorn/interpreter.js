'use strict';

var Interpreter = function(code, opt_initFunc) {
  if (typeof code == 'string') {
    code = acorn.parse(code, Interpreter.PARSE_OPTIONS);
    console.log(code);
    console.log(JSON.stringify(code));
  }
};

Interpreter.prototype.run = function() {
};
