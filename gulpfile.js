var gulp = require('gulp'),
	gutil = require('gulp-util'),
	browserSync = require('browser-sync').create(),
	concat = require('gulp-concat'),
	cssmin = require('gulp-cssmin'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	plumber = require('gulp-plumber'),
	autoprefixer = require('gulp-autoprefixer'),
	imagemin = require('gulp-imagemin'),
	clean = require('gulp-clean'),
	filesize = require('gulp-filesize'),
	stripDebug = require('gulp-strip-debug'),
	htmlmin = require('gulp-htmlmin'),
	less = require('gulp-less'),
	path = require('path'),
	changed = require('gulp-changed'),
	watch = require('gulp-watch'),
	connect = require('gulp-connect-php');

var paths = {
	css: './src/css/**/*.css',
	js: './src/js/**/*.js',
	img: './src/img/*',
	less: './src/less/*.less'
};

 //следим за стилями и минифицируем автоматом
gulp.task('watch', function(){
	browserSync.init({
		server: "./"
	});
	gulp.watch(paths.less, gulp.series('less'));
	gulp.watch(paths.css, gulp.series('cssConcat'));
	gulp.watch('./dist/*.js').on('change', browserSync.reload);
	gulp.watch(paths.js, gulp.series('compress'));
	gulp.watch('./*.html').on('change', browserSync.reload);
});

//объединение стилей css
gulp.task('cssConcat', gulp.series(function(done) {
	gulp.src(paths.css)
		.pipe(plumber())
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(concat('all.css'))
		.pipe(cssmin())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./dist/lib/'))
		.pipe(filesize())
		.pipe(plumber.stop())
		.pipe(browserSync.stream());
	done();
}));

//минификация css файлов в dist
gulp.task('cssMin', function () {
	gulp.src(paths.css)
		.pipe(plumber())
		.pipe(filesize())
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist/lib/'))
		.pipe(filesize())
		.pipe(plumber.stop())
		.on('error', gutil.log);
});

// gulp.task('less', function () {
// 		gulp.src(paths.less)
// 		.pipe(plumber())
// 		.pipe(less())
// 		.pipe(autoprefixer({
// 			browsers: ['last 2 versions']
// 		}))
// 		.pipe(gulp.dest('./dist/', {
// 			overwrite:true
// 		}))
//         .pipe(browserSync.stream());
// });

gulp.task('less', gulp.series(function(done) {
    gulp.src(paths.less)
		.pipe(plumber())
		.pipe(less())
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(concat('styles.css'))
		.pipe(gulp.dest('./dist/', {
			overwrite:true
		}))
        .pipe(browserSync.stream());
    done();
}));

//минификация js файлов + объединение
gulp.task('compress', gulp.series(function(done) {
  	gulp.src(paths.js)
		.pipe(plumber())
		.pipe(stripDebug()) //дебажим
		.pipe(uglify())
		.pipe(concat('all.js')) //объединение
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist/lib/'))
		.pipe(plumber.stop())
		.pipe(browserSync.stream());
    done();
}));

//минификация картинок
gulp.task('imagemin', function(){
	gulp.src(paths.img)
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img/'));
});

//Задача для удаление папки dist
gulp.task('clean', function() {
	gulp.src('./dist/*')
		.pipe(clean());
});
	//только js
	gulp.task('clean_js', function() {
		gulp.src('./dist/*.js')
			.pipe(clean());
	});
	//только css
	gulp.task('clean_css', function() {
		 gulp.src('./dist/*.css')
		.pipe(clean());
	});

//уменьшаем html
gulp.task('minify', function() {
    gulp.src('./*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist/'));
});


gulp.task('default', gulp.series( 'watch' ));

