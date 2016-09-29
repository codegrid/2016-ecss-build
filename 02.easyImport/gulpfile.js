var gulp = require("gulp");
var postcss = require("gulp-postcss");
var simpleVars = require("postcss-simple-vars");
var nested = require("postcss-nested");
var easyImport = require("postcss-easy-import");
var notify = require("gulp-notify");

gulp.task("compileCss", function() {
  // PostCSSのプラグインらを指定
  var processors = [
    easyImport({ glob: true }),
    simpleVars,
    nested,
  ];
  return gulp.src("src/styles.css")
    .pipe(postcss(processors))
    .pipe(gulp.dest("./dest"))
    .pipe(notify("CSS compiled."));
});

gulp.task("watch", function () {
  gulp.watch("src/**/*.css", ["compileCss"]);
});

gulp.task("default", ["compileCss", "watch"]);
