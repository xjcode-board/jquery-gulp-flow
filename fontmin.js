var Fontmin = require('fontmin');
var fs = require("fs");
var path = require("path");

var config = require('./config');

var srcPath = './src/fonts/';
var destPath = './dist/fonts/';

config.fontConfig.forEach(item => {
  var fontmin = new Fontmin()
    .src(srcPath + item.file) // 输入配置
    .use(Fontmin.glyph({ // 字型提取插件
      text: item.text // 所需文字
    }))
    // .use(Fontmin.ttf2eot()) // eot 转换插件
    // .use(Fontmin.ttf2woff()) // woff 转换插件
    // .use(Fontmin.ttf2svg()) // svg 转换插件
    // .use(Fontmin.css()) // css 生成插件
    .dest(destPath); // 输出配置

  // 执行
  fontmin.run(function(err, files, stream) {
    if (err) { // 异常捕捉
      console.error(err);
    }
    console.log(item.file + ':done'); // 成功
  });
})