/*jshint browser: true*/
/*jslint devel: true*/
var lex = function (code) {
    'use strict';
    var regexProgInit = /^(\s+)?prog\s+([\w\d]+)/,
      regexProgEnd = /(\s+)?fimprog(\s+)?$/,
      isProgInit = function (c) { var re = regexProgInit, m; return re.test(c); },
      progName = function (c) { var re = regexProgInit, m; if (re.test(c)) { if ((m = re.exec(c)) !== null) { if (m.index === re.lastIndex) { re.lastIndex += 1; } return m[2]; } } else { return null; } },
      isProgEnd = function (c) { var re = regexProgEnd, m; return re.test(c); },
      lines = code.split('\n'),
      prog = {},
      i,
      line,
      ended = false;
    for (i = 0; i < lines.length; i += 1) {
      line = lines[i];
      if (Object.keys(prog).length === 0 && line.trim() !== '') {
        if (!isProgInit(line)) {
          return '\nFail: Erro sintatico na linha ' + (i + 1) + '\n\n';
        } else {
          prog.name = progName(line);
          line = line.replace(regexProgInit, '').trim();
          if (isProgEnd(line)) {
            line = line.replace(regexProgEnd, '').trim();
            ended = true;
          }
          prog.content = line;
        }
      } else if (!ended && line.trim() !== '') {
        if (!isProgEnd(line)) {
          if (prog.content !== '') {
            prog.content += "\n";
          }
          prog.content += line.trim();
        } else {
          prog.content += line.replace(regexProgEnd, '').trim();
          ended = true;
        }
      } else if (ended && line.trim() !== '') {
        return '\nFail: Erro sintatico na linha ' + (i + 1) + '\n\n';
      }
    }
    return prog;
  },
  run = function () {
    'use strict';
    var code = document.getElementById('code').value;
    console.log(lex(code));
  },
  init = function () {
    'use strict';
    document.getElementById('run').addEventListener('click', run);
  };

document.addEventListener('DOMContentLoaded', init);
