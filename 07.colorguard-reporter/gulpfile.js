var gulp = require("gulp");
var postcss = require("gulp-postcss");
// PostCSSのプラグイン
var reporter = require("postcss-reporter");
var colorguard = require("colorguard");
var colorguardFormatter = require("postcss-colorguard-formatter");

gulp.task("checkColorCollision", function() {

  // PostCSSのプラグインらを指定
  var processors = [
    colorguard(),
    // レポータのフォーマッタとしてcolorguardFormatterを使用
    reporter({ formatter: colorguardFormatter.default })
  ];

  return gulp.src("src/styles.css") // CSSファイル全てが対象
    .pipe(postcss(processors));

});
