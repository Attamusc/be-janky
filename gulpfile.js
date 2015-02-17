var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');

var webpack = require('webpack');

var webpackConfig = require('./webpack.config');

var webpackInst = webpack(webpackConfig);
gulp.task("webpack", function(cb) {
  webpackInst.run(function(err, stats) {
    if (err) { throw new gutil.PluginError("webpack", err); }

    gutil.log("[webpack]", "Build modules successfully");
    cb();
  });
});

gulp.task('sass', function() {
  gulp.src('client/css/**/*.scss')
      .pipe(plumber())
      .pipe(sass())
      .pipe(gulp.dest('public/css'));
});

gulp.task('watch', function() {
  livereload.listen();

  watch(['client/js/**/*'], function() { gulp.start('webpack'); });
  watch(['client/css/**/*.scss'], function() { gulp.start('sass'); });

  gulp.watch(['public/**/*']).on('change', livereload.changed);
});
