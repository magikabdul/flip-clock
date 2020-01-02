const gulp = require("gulp");
const del = require("del");
const browserSync = require("browser-sync");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const webpack = require("webpack-stream");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
const cleanCSS = require("gulp-clean-css");
const imagemin = require("gulp-imagemin");
const changed = require("gulp-changed");
const htmlReplace = require("gulp-html-replace");
const htmlMin = require("gulp-htmlmin");
const rename = require("gulp-rename");
const babel = require("gulp-babel");

const errorHandler = err => {
  notify.onError({
    title: `Gulp error in ${err.plugin}`,
    message: err.toString()
  })(err);
};

function cleanProcessing() {
  return del(["dist"]);
}

function assetsProcessing() {
  return gulp.src("./src/assets/**/*").pipe(gulp.dest("dist/assets"));
}

function imagesProcessing() {
  return gulp
    .src("./src/images/**/*.{jpg,jpeg,png,gif}")
    .pipe(plumber(errorHandler))
    .pipe(changed("dist/images"))
    .pipe(imagemin())
    .pipe(gulp.dest("dist/images"));
}

function htmlProcessing() {
  return gulp
    .src("./src/html/**/*.html")
    .pipe(plumber(errorHandler))
    .pipe(
      htmlMin({
        sortAttributes: true,
        sortClassName: true,
        collapseWhitespace: true
      })
    )
    .pipe(gulp.dest("./dist/"));
}

function sassProcessing() {
  return gulp
    .src("./src/scss/**/*.scss")
    .pipe(
      plumber({
        errorHandler: function(err) {
          notify.onError({
            title: `Gulp error in ${err.plugin}`,
            message: err.toString()
          })(err);
        }
      })
    )
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on("error", sass.logError)
    .pipe(
      postcss([
        autoprefixer({
          grid: true
        })
      ])
    )
    .pipe(sourcemaps.write("."))
    .pipe(cleanCSS())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
}

function jsProcessing() {
  return gulp
    .src("./src/js/**/*.js")
    .pipe(
      plumber({
        errorHandler: function(err) {
          notify.onError({
            title: `Gulp error in ${err.plugin}`,
            message: err.toString()
          })(err);
        }
      })
    )
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(webpack(require("../webpack.config.js")))
    .pipe(sourcemaps.write("."))
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest("dist/js"));
}

function serveProcessing() {
  browserSync.init({
    server: "./dist",
    open: true
  });

  gulp.watch("src/html/**/*.html", gulp.series(htmlProcessing));
  gulp.watch("src/assets/**/*", gulp.series(assetsProcessing));
  gulp.watch("src/scss/**/*", gulp.series(sassProcessing));
  gulp.watch("src/images/**/*", gulp.series(imagesProcessing));
  gulp.watch("src/js/**/*", gulp.series(jsProcessing));

  gulp.watch("dist/**/*").on("change", browserSync.reload);
}

//exports.bulid = bulid
exports.default = gulp.series(
  cleanProcessing,
  assetsProcessing,
  sassProcessing,
  imagesProcessing,
  jsProcessing,
  htmlProcessing,
  serveProcessing
);
exports.clean = cleanProcessing;
exports.assets = assetsProcessing;
exports.sass = sassProcessing;
exports.images = imagesProcessing;
exports.js = jsProcessing;
exports.html = htmlProcessing;
