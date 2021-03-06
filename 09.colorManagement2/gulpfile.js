const gulp = require("gulp");
const mustache = require("gulp-mustache");
const postcss = require("gulp-postcss");
const base64 = require("gulp-base64");

/* PostCSSのプラグイン */

const reporter = require("postcss-reporter");
const colorguard = require("colorguard");
const colorguardFormatter = require("postcss-colorguard-formatter");
const simpleVars = require("postcss-simple-vars");
const nested = require("postcss-nested");
const easyImport = require("postcss-easy-import");
const mixins = require("postcss-mixins");
const colorFunction = require("postcss-color-function");

/* その他 */

const notify = require("gulp-notify");
const plumber = require("gulp-plumber");

/* 各種パス */

const PATH = {};
PATH.mixinsOptions =             "./src/css/baseCss/globalMixins.js";
PATH.colorMap =                  "./src/color/colorMap.js";
PATH.rootCssFile =               "./src/css/styles.css";
PATH.allCssFiles =               "./src/css/**/*";
PATH.allStaticFiles =            "./src/static/**/*";
PATH.staticFilesDir =            "./src/static";
PATH.colorGuideGeneratorPath =   "./src/color/guideDataGenerator.js";
PATH.colorGuideSrcFiles       =  "./src/color/**/*";
PATH.colorGuideTmplPath =        "./src/color/guideTemplates/*.html";
PATH.destinationDir =            "./dest";
PATH.outputCssFiles =            "./dest/**/*.css";
PATH.colorGuideDestinationPath = "./dest/colorGuide/";

/* gulpのタスク登録 */

gulp.task("compileColorGuide", compileColorGuide);
gulp.task("compileCss", compileCss);
gulp.task("copyStatics", copyStatics);
gulp.task("checkColorCollision", checkColorCollision);
gulp.task("watch", () => {
  watchColorGuideChanges();
  watchStaticChages();
  watchCssChanges();
});
gulp.task("default", [
  "compileCss", "copyStatics", "compileColorGuide", "watch"
]);

/* CSSファイルのコンパイル */

function compileCss() {
  // PostCSSのプラグインらを指定
  const processors = [
    easyImport({ glob: true }),
    mixins({ mixins: require(PATH.mixinsOptions) }),
    simpleVars({ variables: require(PATH.colorMap) }),
    colorFunction(),
    nested,
    reporter({ throwError: true })
  ];
  return gulp.src(PATH.rootCssFile)
    // エラーで通知
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(postcss(processors)) // PostCSSに渡して処理させる
    .pipe(gulp.dest(PATH.destinationDir)) // destに出力
    .pipe(notify("CSS compiled.")); // 通知
}

/* 静的ファイルのコピー */

function copyStatics() {
  return gulp.src(
    [PATH.allStaticFiles],
    { base: PATH.staticFilesDir }
  )
  .pipe( gulp.dest(PATH.destinationDir) );
}

/* Colorguardのチェック */

function checkColorCollision() {
  // PostCSSのプラグインらを指定
  const processors = [
    colorguard({
      // #000 と rgb(0,0,0) みたいな組み合わせの警告を無視
      allowEquivalentNotation: true
    }),
    // レポータのフォーマッタとしてcolorguardFormatterを使用
    reporter({ formatter: colorguardFormatter.default })
  ];
  return gulp.src(PATH.outputCssFiles)
    .pipe(postcss(processors));
}

/* カラーガイドのコンパイル */

function compileColorGuide() {
  const generator = require(PATH.colorGuideGeneratorPath);
  const colorArray = generator.generateAsArray();
  const colorObject = generator.generateAsObject();
  return gulp.src(PATH.colorGuideTmplPath)
    .pipe(mustache({
      // mustacheで使う用
      colorArray: colorArray,
      colorObject: colorObject,
      // HTML内でJSとして使う用
      colorArray_str: JSON.stringify(colorArray),
      colorObject_str: JSON.stringify(colorObject),
    }))
    .pipe(base64())
    .pipe(gulp.dest(PATH.colorGuideDestinationPath));
}

/* 各種watch処理 */

function watchColorGuideChanges() {
  gulp.watch(PATH.colorGuideSrcFiles, compileColorGuide);
}
function watchCssChanges() {
  gulp.watch(PATH.allCssFiles, compileCss);
}
function watchStaticChages() {
  gulp.watch(PATH.allStaticFiles, copyStatics);
}
