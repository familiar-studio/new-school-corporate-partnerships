var gulp = require('gulp')
var nodemon = require('gulp-nodemon')
var sass = require('gulp-sass')
var webpack = require('webpack-stream')
var browserSync = require('browser-sync')
var autoprefixer = require('gulp-autoprefixer')
var concat = require('gulp-concat')

gulp.task('webpack', function() {
  return gulp.src('public/index.js')
  .pipe(webpack( require('./webpack.config.js') ))
  .pipe(gulp.dest(__dirname + '/public'));
})

gulp.task('styles', function(){   
  
  gulp.src(['scss/*.scss'])
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('public/'))
    .pipe(concat('styles.css'))
    .pipe(browserSync.stream());
});

gulp.task('nodemon', function (cb) {
  return nodemon({
    script: 'server'
  }).once('start', function() {    
    
    browserSync.init(null, {
      port: 8000,
      proxy: 'http://localhost:5000',
      files: [ 
        './pubilc/**/*.html'
      ],
      browser: 'google chrome'
    })
        
    gulp.watch('public/index.js', ['webpack']);
    return gulp.watch('scss/*.scss', ['styles'])    
  });
})

gulp.task('default', ['nodemon'], function () {})