'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var mode = 'production';

gulp.task('apply-prod-environment', function() {
    process.stdout.write("Setting NODE_ENV to 'production'" + "\n");
    process.env.NODE_ENV = mode;
    if (process.env.NODE_ENV != 'production') {
        process.stdout.write("Failed to set NODE_ENV to production!!!!");
    } else {
        process.stdout.write("Successfully set NODE_ENV to production" + "\n");
    }
});

gulp.task('build', function () {
    return browserify({ entries: './main.jsx', extensions: ['.jsx'], debug: true }).transform(babelify).bundle().pipe(source('mainBundle.js')).pipe(gulp.dest('../public/js'));
});

gulp.task('watch', ['build'], function () {
    gulp.watch('*.jsx', ['build']);
});

gulp.task('default', ['apply-prod-environment','watch']);
