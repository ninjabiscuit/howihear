var plumber  = require('gulp-plumber');
var gulp = require('gulp');
var sass = require('gulp-sass');
var config = require('../config').sass;
var merge = require("merge");
var rename = require("gulp-rename");

gulp.task('sass', ['images'], function () {

  var opts =
    merge({}, global.isWatching ? config.opts.dev : config.opts.build, config.includes);

  return gulp.src(config.src)
    .pipe(plumber())
    .pipe(sass(opts))
    .pipe(rename("application.css"))
    .pipe(gulp.dest(config.dest));
});
