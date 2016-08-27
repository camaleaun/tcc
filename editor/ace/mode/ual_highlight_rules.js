define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var UalHighlightRules = function() {
    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = { start:
       [ { caseInsensitive: true,
           token: 'keyword.control.ual',
           regex: '\\b(?:(prog|imprima|fimprog))\\b' },
         { token: 'punctuation.definition.comment.pascal',
           regex: '#.*$',
           push_:
            [ { token: 'comment.line.hash.ual.one',
                regex: '$',
                next: 'pop' },
              { defaultToken: 'comment.line.hash.ual.one' } ] } ] }

    this.normalizeRules();
};

oop.inherits(UalHighlightRules, TextHighlightRules);

exports.UalHighlightRules = UalHighlightRules;
});
