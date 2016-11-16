var gulp = require("gulp");
var postcss = require("gulp-postcss");
// PostCSSのプラグイン
var simpleVars = require("postcss-simple-vars");
var nested = require("postcss-nested");
var easyImport = require("postcss-easy-import");
var mixins = require("postcss-mixins");
// その他
var sizeOf = require("image-size");
var notify = require("gulp-notify");

// postcss-mixinsのオプション
var mixinsOptions = {
  mixins: {
    icon: function(mixin, path) {
      path = path.replace(/\"/gi, ""); // パス前後の"を削除
      // gulpから引くためのパス
      var path_src = "src/namespaces/" + path;
      // 結果のCSSに出力するパス
      var path_result = "/assets/" + path;
      // サイズを計算
      var dimensions = sizeOf(path_src);
      return {
        "display": "inline-block",
        "width": dimensions.width,
        "height": dimensions.height,
        "&::after": {
          "content": '""',
          "background-image": 'url("' + path_result + '")',
        }
      };
    }
  }
};

gulp.task("compileCss", function() {
  // PostCSSのプラグインらを指定
  var processors = [
    easyImport({ glob: true }),
    mixins(mixinsOptions),
    simpleVars,
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
