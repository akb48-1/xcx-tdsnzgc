module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1592308719428, function(require, module, exports) {
module.exports = require('./lib/px2rpx');

}, function(modId) {var map = {"./lib/px2rpx":1592308719429}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1592308719429, function(require, module, exports) {


var css = require('css');
var extend = require('extend');

var defaultConfig = {
  rpxUnit: 1,            // rpx unit value (default: 1)
  rpxPrecision: 6,        // rpx value precision (default: 6)
  keepComment: 'no'       // no transform value comment (default: `no`)
};

var pxRegExp = /\b(\d+(\.\d+)?)px\b/;

function Px2rpx(options) {
  this.config = {};
  extend(this.config, defaultConfig, options);
}

// generate rpx version stylesheet
Px2rpx.prototype.generateRpx = function (cssText) {
  var self = this;
  var config = self.config;
  var astObj = css.parse(cssText);

  function processRules(rules) { // FIXME: keyframes do not support `force px` comment
    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i];
      if (rule.type === 'media') {
        processRules(rule.rules); // recursive invocation while dealing with media queries
        continue;
      } else if (rule.type === 'keyframes') {
        processRules(rule.keyframes); // recursive invocation while dealing with keyframes
        continue;
      } else if (rule.type !== 'rule' && rule.type !== 'keyframe') {
        continue;
      }

      var declarations = rule.declarations;
      for (var j = 0; j < declarations.length; j++) {
        var declaration = declarations[j];
        // need transform: declaration && has 'px'
        if (declaration.type === 'declaration' && pxRegExp.test(declaration.value)) {
          var nextDeclaration = declarations[j + 1];
          if (nextDeclaration && nextDeclaration.type === 'comment') { // next next declaration is comment
            if (nextDeclaration.comment.trim() === config.keepComment) { // no transform
              declarations.splice(j + 1, 1); // delete corresponding comment
              continue;
            } else {
              declaration.value = self._getCalcValue('rpx', declaration.value); // common transform
            }
          } else {
            declaration.value = self._getCalcValue('rpx', declaration.value); // common transform
          }
        }
      }

      // if the origin rule has no declarations, delete it
      if (!rules[i].declarations.length) {
        rules.splice(i, 1);
        i--;
      }
    }
  }

  processRules(astObj.stylesheet.rules);

  return css.stringify(astObj);
};

// get calculated value of px or rpx
Px2rpx.prototype._getCalcValue = function (type, value) {
  var config = this.config;
  var pxGlobalRegExp = new RegExp(pxRegExp.source, 'g');

  function getValue(val) {
    val = parseFloat(val.toFixed(config.rpxPrecision)); // control decimal precision of the calculated value
    return val == 0 ? val : val + type;
  }

  return value.replace(pxGlobalRegExp, function ($0, $1) {
    return getValue($1 / config.rpxUnit);
  });
};

module.exports = Px2rpx;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1592308719428);
})()
//# sourceMappingURL=index.js.map