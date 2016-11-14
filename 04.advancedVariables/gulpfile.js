var gulp = require("gulp");
var postcss = require("gulp-postcss");
// PostCSSのプラグイン
var simpleVars = require("postcss-simple-vars");
var nested = require("postcss-nested");
var easyImport = require("postcss-easy-import");
var mixins = require("postcss-mixins");
var advancedVariables = require("postcss-advanced-variables");
// その他
var notify = require("gulp-notify");

// mixinsのオプション
var mixinsOptions = {
  mixins: {
    colorBox: function(mixin, color) {
      return {
        'border': '8px solid ' + color,
        'color': color,
        'font-size': '18px',
        'padding': '20px 5px',
      };
    }
  }
};

gulp.task("compileCss", function() {
  // PostCSSのプラグインらを指定
  var processors = [
    easyImport({ glob: true }),
    advancedVariables,
    mixins(mixinsOptions),
    nested,
  ];
  return gulp.src("src/styles.css") // CSSファイル全てが対象
    .pipe(postcss(processors)) // PostCSSに渡して処理させる
    .pipe(gulp.dest("./dest")) // destに出力
    .pipe(notify("CSS compiled.")); // 通知
});

// CSSファイルの変更を検知してcompileCssを実行
gulp.task("watch", function () {
  gulp.watch("src/**/*.css", ["compileCss"]);
});

// 実行時にはcompileCssしてwatch
gulp.task("default", ["compileCss", "watch"]);
