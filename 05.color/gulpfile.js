var gulp = require("gulp");
var postcss = require("gulp-postcss");
// PostCSSのプラグイン
var mixins = require("postcss-mixins");
var simpleVars = require("postcss-simple-vars");
var nested = require("postcss-nested");
var colorHwb = require("postcss-color-hwb");
var colorFunction = require("postcss-color-function");
// その他
var notify = require("gulp-notify");
var plumber = require("gulp-plumber");

gulp.task("copyStatic", function() {
  return gulp.src("src/static/**/*")
    .pipe(gulp.dest("./dest"));
});

gulp.task("compileCss", function() {
  // PostCSSのプラグインらを指定
  var processors = [
    mixins,
    simpleVars,
    colorHwb(),
    colorFunction(),
    nested,
  ];
  return gulp.src("src/css/**/*.css") // CSSファイル全てが対象
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(postcss(processors)) // PostCSSに渡して処理させる
    .pipe(gulp.dest("./dest")) // destに出力
    .pipe(notify("CSS compiled.")); // 通知
});

// CSSファイルの変更を検知してcompileCssを実行
gulp.task("watch", function () {
  gulp.watch("src/css/**/*.css", ["compileCss"]);
  gulp.watch("src/static/**/*", ["copyStatic"]);
});

// 実行時にはcompileCssしてwatch
gulp.task("default", ["compileCss", "copyStatic", "watch"]);
