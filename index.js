/**
 * License: https://github.com/fex-team/fis-spriter-csssprites
 * make some changes
 */

'use strict';

var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var cssParser = require('./lib/cssParser.js');
var imgGen;

var pluginName = 'gulp-her-cssSprite';

try {
  imgGen = require('./lib/image.js');
} catch (e) {
  throw new PluginError(pluginName, 'csssprites does not support your node ' + process.version);
}

module.exports = function (ret, opt) {
  if (!imgGen) {
    return;
  }

  opt = opt || {};

  opt.hash = her.config.get('useHash');
  opt.domain = her.config.get('useDomain');

  var settings = her.config.get('setting.spriter.csssprites');

  //文件属性中useSprite == true的css做图片合并
  her.util.map(ret.ids, function (id, file) {
    if (file.isCssLike) {
      processCss(file, ret, settings, opt);
    }
  });

  //打包后的css文件做图片合并
  her.util.map(ret.pkg, function (subpath, file) {
    if (file.rExt == '.css') {
      processCss(file, ret, settings, opt);
    }
  });
};

function processCss(file, ret, settings, opt) {
  var content = String(file.contents);
  content = _process(content, file, null, ret, settings, opt);
  file.contents = new Buffer(content);
}

function _process(content, file, index, ret, settings, opt) {
  var images = {};
  her.util.map(ret.ids, function (id, file) {
    if (file.isImage()) {
      images[file.getUrl(opt.hash, opt.domain)] = file;
    }
  });
  var res = cssParser(content, images);
  var content = res.content;
  if (res.map && res.map.length > 0) {
    var css = imgGen(file, index, res.map, images, ret, settings, opt);
    content = content + css;
  }
  return content;
}
