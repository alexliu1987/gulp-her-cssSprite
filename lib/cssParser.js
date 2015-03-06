/**
 * License: https://github.com/fex-team/fis-spriter-csssprites/blob/master/libs/cssParer.js
 * make some changes
 */

'use strict';

var Rules = require('./cssRule.js');
module.exports = function (content, images) {
  var _arr_css = []
    , _content;
  var reg = /(?:\/\*[\s\S]*?(?:\*\/|$))|([^\{\}\/]*)\{([^\{\}]*)\}/gi;
  _content = content.replace(reg, function(m, selector, css) {
    if (css) {
      var rules = Rules.wrap(selector.trim(), css.trim());
      if (rules.isSprites() && images.hasOwnProperty(rules.getImageUrl())) {
        _arr_css.push(rules);
        css = rules.getCss();
      }
      return selector + '{' + css + '}';
    }
    return m;
  });
  return {
    content: _content,
    map: _arr_css
  };
};

