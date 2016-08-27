define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var UalHighlightRules = require("./ual_highlight_rules").UalHighlightRules;

var Mode = function() {
    this.HighlightRules = UalHighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = ["#"];
//    this.blockComment = [
//        {start: "(*", end: "*)"},
//        {start: "{", end: "}"}
//    ];

    this.$id = "ace/mode/ual";
}).call(Mode.prototype);

exports.Mode = Mode;
});
