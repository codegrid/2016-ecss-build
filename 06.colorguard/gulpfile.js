var gulp = require("gulp");
var postcss = require("gulp-postcss");
var colorguard = require("colorguard");

gulp.task("checkColorCollision", function() {

  // PostCSSのプラグインらを指定
  var processors = [
    colorguard()
  ];

  return gulp.src("src/styles.css") // CSSファイル全てが対象
    .pipe(postcss(processors));

});
