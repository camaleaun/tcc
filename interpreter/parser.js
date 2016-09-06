/*jslint devel: false, forin: true, nomen: true, plusplus: true, maxerr: 1000*/
(function (root, mod) {
  'use strict';
  if (!root.parser) { root.parser = {}; }
  mod(root.parser); // Plain browser env
}(this, function (exports) {
  'use strict';

  var options, input, inputLen,

    defaultOptions = exports.defaultOptions = {
      program: null
    },

    tokPos,

    tokStart, tokEnd,

    tokStartLoc, tokEndLoc,

    tokType, tokVal,

    tokRegexpAllowed,

    tokCurLine, tokLineStart,

    lastStart, lastEnd, lastEndLoc,

    inFunction, labels,

    keywords = 'prog fimprog imprima',
    isKeyword = function (word) {
      return keywords.split(' ').indexOf(word) >= 0;
    },

    nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/,
    nonASCIIidentifierStartChars = '\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc',
    nonASCIIidentifierChars = '\u0300-\u036f\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u0620-\u0649\u0672-\u06d3\u06e7-\u06e8\u06fb-\u06fc\u0730-\u074a\u0800-\u0814\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0840-\u0857\u08e4-\u08fe\u0900-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962-\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09d7\u09df-\u09e0\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5f-\u0b60\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2-\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d46-\u0d48\u0d57\u0d62-\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e34-\u0e3a\u0e40-\u0e45\u0e50-\u0e59\u0eb4-\u0eb9\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f41-\u0f47\u0f71-\u0f84\u0f86-\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1029\u1040-\u1049\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u170e-\u1710\u1720-\u1730\u1740-\u1750\u1772\u1773\u1780-\u17b2\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1920-\u192b\u1930-\u193b\u1951-\u196d\u19b0-\u19c0\u19c8-\u19c9\u19d0-\u19d9\u1a00-\u1a15\u1a20-\u1a53\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1b46-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1bb0-\u1bb9\u1be6-\u1bf3\u1c00-\u1c22\u1c40-\u1c49\u1c5b-\u1c7d\u1cd0-\u1cd2\u1d00-\u1dbe\u1e01-\u1f15\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2d81-\u2d96\u2de0-\u2dff\u3021-\u3028\u3099\u309a\ua640-\ua66d\ua674-\ua67d\ua69f\ua6f0-\ua6f1\ua7f8-\ua800\ua806\ua80b\ua823-\ua827\ua880-\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua8f3-\ua8f7\ua900-\ua909\ua926-\ua92d\ua930-\ua945\ua980-\ua983\ua9b3-\ua9c0\uaa00-\uaa27\uaa40-\uaa41\uaa4c-\uaa4d\uaa50-\uaa59\uaa7b\uaae0-\uaae9\uaaf2-\uaaf3\uabc0-\uabe1\uabec\uabed\uabf0-\uabf9\ufb20-\ufb28\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f',
    nonASCIIidentifierStart = new RegExp('[' + nonASCIIidentifierStartChars + ']'),
    nonASCIIidentifier = new RegExp('[' + nonASCIIidentifierStartChars + nonASCIIidentifierChars + ']'),

    newline = /[\n\r\u2028\u2029]/m,

    lineBreak = /\r\n|[\n\r\u2028\u2029]/g,

    isIdentifierChar = exports.isIdentifierChar = function (code) {
      if (code < 48) { return code === 36; }
      if (code < 58) { return true; }
      if (code < 65) { return false; }
      if (code < 91) { return true; }
      if (code < 97) { return code === 95; }
      if (code < 123) { return true; }
      return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code));
    },

    _regexp = {type: 'regexp'}, _string = {type: 'string'},
    _name = {type: 'name'}, _eof = {type: 'eof'},
    _progBegin = {keyword: 'prog'}, _progEnd = {keyword: 'fimprog'}, _print = {keyword: 'imprima'},

    _switch = {keyword: 'switch'},

    isIdentifierStart = exports.isIdentifierStart = function (code) {
      if (code < 65) { return code === 36; }
      if (code < 91) { return true; }
      if (code < 97) { return code === 95; }
      if (code < 123) { return true; }
      return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code));
    },

    getLineInfo = exports.getLineInfo = function (input, offset) {
      var line = 1, cur = 0, match;
      for (line = 1, cur = 0;;) {
        lineBreak.lastIndex = cur;
        match = lineBreak.exec(input);
        if (match && match.index < offset) {
          ++line;
          cur = match.index + match[0].length;
        } else { break; }
      }
      return {line: line, column: offset - cur};
    },

    containsEsc,

    _in = {keyword: 'in', binop: 7, beforeExpr: true},

    keywordTypes = {'imprima': _print, 'prog': _progBegin, 'fimprog': _progEnd},

    _braceL = {type: '{', beforeExpr: true},
    _braceR = {type: '}'}, _parenL = {type: '(', beforeExpr: true}, _parenR = {type: ')'},
    _comma = {type: ',', beforeExpr: true}, _semi = {type: ';', beforeExpr: true},
    _colon = {type: ':', beforeExpr: true},

    _slash = {binop: 10, beforeExpr: true},
    _assign = {isAssign: true, beforeExpr: true},

    _function = {keyword: 'function'},

    // testar com name var
    name;

  function LineLocT() {
    this.line = tokCurLine;
    this.column = tokPos - tokLineStart;
  }

  function setOptions() {
    var opt, i;
    options = {};
    Object.keys(defaultOptions).forEach(function (opt) {
      if (!Object.prototype.hasOwnProperty.call(options, opt)) {
        options[opt] = defaultOptions[opt];
      }
    });
  }

  function parseExprList(close, allowTrailingComma, allowEmpty) {
    var elts = [], first = true;
    while (!eat(close)) {
      if (!first) {
        expect(_comma);
        if (allowTrailingComma && options.allowTrailingCommas && eat(close)) break;
      } else first = false;

      if (allowEmpty && tokType === _comma) elts.push(null);
      else elts.push(parseExpression(true));
    }
    return elts;
  }

  function parseIdent(liberal) {
    var node = startNode();
    node.name = tokType === _name ? tokVal : (liberal && !options.forbidReserved && tokType.keyword) || unexpected();
    tokRegexpAllowed = false;
    next();
    return finishNode(node, 'Identifier');
  }

  function skipSpace() {
    while (tokPos < inputLen) {
      var ch = input.charCodeAt(tokPos),
        next;
      if (ch === 32) { // ' '
        tokPos += 1;
      } else if (ch === 13) {
        tokPos += 1;
        next = input.charCodeAt(tokPos);
        if (next === 10) {
          tokPos += 1;
        }
        if (options.locations) {
          tokCurLine += 1;
          tokLineStart = tokPos;
        }
      } else if (ch === 10 || ch === 8232 || ch === 8233) {
        tokPos += 1;
        if (options.locations) {
          tokCurLine += 1;
          tokLineStart = tokPos;
        }
      } else if (ch > 8 && ch < 14) {
        tokPos += 1;
      } else if (ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
        tokPos += 1;
      } else {
        break;
      }
    }
  }

  function finishToken(type, val) {
    tokEnd = tokPos;
    tokType = type;
    skipSpace();
    tokVal = val;
    tokRegexpAllowed = type.beforeExpr;
  }

  function raise(pos, message) {
    var loc = getLineInfo(input, pos),
      err;
    message += ' (' + loc.line + ':' + loc.column + ')';
    err = new SyntaxError(message);
    err.pos = pos;
    err.loc = loc;
    err.raisedAt = tokPos;
    throw err;
  }

  function readWord1() {
    containsEsc = false;
    var word, first = true, start = tokPos, ch, esc, escStr;
    for (;;) {
      ch = input.charCodeAt(tokPos);
      if (isIdentifierChar(ch)) {
        if (containsEsc) { word += input.charAt(tokPos); }
        ++tokPos;
      } else {
        break;
      }
      first = false;
    }
    return containsEsc ? word : input.slice(start, tokPos);
  }

  function readWord() {
    var word = readWord1(),
      type = _name;
    if (!containsEsc) {
      if (isKeyword(word)) {
        type = keywordTypes[word];
      } else if (options.forbidReserved) {
        raise(tokStart, "The keyword '" + word + "' is reserved");
      }
    }
    return finishToken(type, word);
  }

  function readString(quote) {
    tokPos++;
    var out = '', ch, octal;
    for (;;) {
      if (tokPos >= inputLen) { raise(tokStart, 'Unterminated string constant'); }
      ch = input.charCodeAt(tokPos);
      if (ch === quote) {
        ++tokPos;
        return finishToken(_string, out);
      }
      if (ch === 92) { // '\'
        ch = input.charCodeAt(++tokPos);
        octal = /^[0-7]+/.exec(input.slice(tokPos, tokPos + 3));
        if (octal) { octal = octal[0]; }
        while (octal && parseInt(octal, 8) > 255) { octal = octal.slice(0, -1); }
        if (octal === '0') { octal = null; }
        ++tokPos;
        if (octal) {
          //if (strict) raise(tokPos - 2, 'Octal literal in strict mode');
          out += String.fromCharCode(parseInt(octal, 8));
          tokPos += octal.length - 1;
        } else {
          switch (ch) {
          case 110: // 'n' -> '\n'
            out += '\n';
            break;
          case 114: // 'r' -> '\r'
            out += '\r';
            break;
          case 120: // 'x'
            out += String.fromCharCode(readHexChar(2));
            break;
          case 117: // 'u'
            out += String.fromCharCode(readHexChar(4));
            break;
          case 85: // 'U'
            out += String.fromCharCode(readHexChar(8));
            break;
          case 116: // 't' -> '\t'
            out += '\t';
            break;
          case 98: // 'b' -> '\b'
            out += '\b';
            break;
          case 118: // 'v' -> '\u000b'
            out += '\u000b';
            break;
          case 102: // 'f' -> '\f'
            out += '\f';
            break;
          case 48: // 0 -> '\0'
            out += '\\0';
            break;
          case 13: // '\r\n'
            if (input.charCodeAt(tokPos) === 10) { ++tokPos; }
            break;
          case 10: // ' \n'
            if (options.locations) { tokLineStart = tokPos; ++tokCurLine; }
            break;
          default:
            out += String.fromCharCode(ch);
            break;
          }
        }
      } else {
        if (ch === 13 || ch === 10 || ch === 8232 || ch === 8233) { raise(tokStart, 'Unterminated string constant'); }
        out += String.fromCharCode(ch); // '\'
        ++tokPos;
      }
    }
  }

  function getTokenFromCode(code) {
    switch (code) {

    case 59:
        ++tokPos;
        return finishToken(_semi);

    case 34:
    case 39:
      return readString(code);
    }

    return false;
  }

  function readToken() {
    var code, tok, ch;
    tokStart = tokPos;
    if (options.locations) { tokStartLoc = new LineLocT(); }
    if (tokPos >= inputLen) { return finishToken(_eof); }

    code = input.charCodeAt(tokPos);
    if (isIdentifierStart(code) || code === 92) { return readWord(); }

    tok = getTokenFromCode(code);

    if (tok === false) {
      ch = String.fromCharCode(code);
      if (ch === '\\' || nonASCIIidentifierStart.test(ch)) { return readWord(); }
      raise(tokPos, "Unexpected character '" + ch + "'");
    }
    return tok;
  }

  function NodeT() {
    this.type = null;
    this.start = tokStart;
    this.end = null;
  }

  function startNode() {
    var node = new NodeT();
    return node;
  }

  function next() {
    lastStart = tokStart;
    lastEnd = tokEnd;
    lastEndLoc = tokEndLoc;
    readToken();
  }

  function parseExprOp(left, minPrec, noIn) {
    return left;
  }

  function parseSubscripts(base, noCalls) {
    return base;
  }

  function parseExprAtom() {
    switch (tokType) {
    case _name:
      return parseIdent();

    case _string:
      var node = startNode();
      node.value = tokVal;
      node.raw = input.slice(tokStart, tokEnd);
      next();
      return finishNode(node, 'Literal');

    case _progBegin:
      var node = startNode();
      next();
      return parseProgram(node, false);

    default:
      unexpected();
    }
  }

  function parseExprSubscripts() {
    return parseSubscripts(parseExprAtom());
  }

  function parseMaybeUnary() {
    var expr = parseExprSubscripts();
    return expr;
  }

  function parseExprOps(noIn) {
    return parseExprOp(parseMaybeUnary(), -1, noIn);
  }

  function parseMaybeConditional(noIn) {
    var expr = parseExprOps(noIn);
    return expr;
  }

  function parseMaybeAssign(noIn) {
    var node, left = parseMaybeConditional(noIn);
    if (tokType.isAssign) {
      node = startNodeFrom(left);
      node.operator = tokVal;
      node.left = left;
      next();
      node.right = parseMaybeAssign(noIn);
      checkLVal(left);
      return finishNode(node, 'AssignmentExpression');
    }
    return left;
  }

  function parseExpression(noComma, noIn) {
    var expr = parseMaybeAssign(noIn);
    if (!noComma && tokType === _comma) {
      var node = startNodeFrom(expr);
      node.expressions = [expr];
      while (eat(_comma)) { node.expressions.push(parseMaybeAssign(noIn)); }
      return finishNode(node, 'SequenceExpression');
    }
    return expr;
  }

  function unexpected() {
    raise(tokStart, 'Unexpected token');
  }

  function expect(type) {
    if (tokType === type) {
      next();
    } else { unexpected(); }
  }

  function eat(type) {
    if (tokType === type) {
      next();
      return true;
    }
  }

  function finishNode(node, type) {
    node.type = type;
    node.end = lastEnd;
    return node;
  }

  function semicolon() {
    if (!eat(_semi)) { unexpected(); }
  }

  function startNodeFrom(other) {
    var node = new NodeT();
    node.start = other.start;
    return node;
  }

  function parsePrintCall(base) {
    var node = startNodeFrom(base);
    node.arguments = base;
    return finishNode(node, 'CallPrint');
  }

  function parsePrintStatement() {
    var expr = parseExpression(), node = startNode();
    node.print = parsePrintCall(expr);
    semicolon();
    return finishNode(node, 'PrintStatement');
  }

  function parseProgramBlock(allowStrict) {
    var node = startNode(), first = true, strict = false, oldStrict;
    node.body = [];

    while (!eat(_progEnd)) {
      var stmt = parseStatement();
      node.body.push(stmt);
      if (first && allowStrict) {
        oldStrict = strict;
      }
      first = false;
    }
    return finishNode(node, 'ProgramBlockStatement');
  }

  function parseProgram(node, isStatement) {
    if (tokType === _name) node.id = parseIdent();
    else if (isStatement) unexpected();
    else node.id = null;
    node.params = [];
    var first = true;

    var oldInFunc = inFunction, oldLabels = labels;
    inFunction = true; labels = [];
    node.body = parseProgramBlock(true);
    inFunction = oldInFunc; labels = oldLabels;

    if (node.body.body.length) {
      for (var i = node.id ? -1 : 0; i < node.params.length; ++i) {
        var id = i < 0 ? node.id : node.params[i];
        if (i >= 0) for (var j = 0; j < i; ++j) if (id.name === node.params[j].name)
          raise(id.start, 'Argument name clash in strict mode');
      }
    }

    return finishNode(node, isStatement ? 'ProgramDeclaration' : 'ProgramExpression');
  }

  function parseStatement() {
    var starttype = tokType, node = startNode();
    switch (starttype) {

    case _progBegin:
      next();
      return parseProgram(node, true);

    case _print:
      next();
      return parsePrintStatement(node);

    default:
      var maybeName = tokVal, expr = parseExpression();
      if (starttype === _name && expr.type === 'Identifier' && eat(_colon)) {
        for (var i = 0; i < labels.length; ++i)
          if (labels[i].name === maybeName) raise(expr.start, "Label '" + maybeName + "' is already declared");
        var kind = tokType.isLoop ? 'loop' : tokType === _switch ? 'switch' : null;
        labels.push({name: maybeName, kind: kind});
        node.body = parseStatement();
        labels.pop();
        node.label = expr;
        return finishNode(node, 'LabeledStatement');
      } else {
        node.expression = expr;
        semicolon();
        return finishNode(node, 'ExpressionStatement');
      }
    }
  }

  function parseTopLevel(program) {
    lastStart = lastEnd = tokPos;
    inFunction = null;
    labels = [];
    readToken();

    var node = program || startNode(), first = true;
    if (!program) node.body = [];
    while (tokType !== _eof) {
      var stmt = parseStatement();
      if (stmt.type === 'ProgramDeclaration') {
        node.id = stmt.id;
        node.body = stmt.body.body;
      }
      first = false;
    }
    return finishNode(node, 'Program');
  }

  function initTokenState() {
    tokCurLine = 1;
    tokPos = tokLineStart = 0;
    tokRegexpAllowed = true;
    skipSpace();
  }

  exports.parse = function (inpt) {
    input = String(inpt);
    inputLen = input.length;
    setOptions();
    initTokenState();
    return parseTopLevel(options.program);
  };

}));
