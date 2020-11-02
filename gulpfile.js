var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCSS = require('gulp-clean-css'),
	browserSync = require('browser-sync').create(),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	cache = require('gulp-cache'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    sassGlob = require('gulp-sass-glob'),
	jade = require('gulp-pug');

var source = './source';
var dist = './dist';

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: dist
        }
    });
});

gulp.task('jade', function() {
    return gulp.src(source+'/jade/**/*.pug')
        .pipe(jade({
            locals: '',
            pretty : true
        })).on('error', function (err) {
        console.log(err);
    })
        .pipe(gulp.dest(dist+'/html/'))
        .pipe(browserSync.stream());
});

gulp.task('html', function() {
    return gulp.src(source+'/html/*.html')
        .pipe(gulp.dest(dist))
        .pipe(browserSync.stream());
});

gulp.task('fonts', function() {
    return gulp.src(source+'/fonts/**/*')
        .pipe(gulp.dest(dist+'/fonts'))
        .pipe(browserSync.stream());
});

gulp.task('img', function() {
	return gulp.src([source+'/img/*',source+'/img/**/*'])
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest(dist+'/img'))
        .pipe(browserSync.stream());
});

gulp.task('scss:build', function () {
	return gulp.src(source+'/scss/main.scss')
		.pipe(sassGlob())
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.on('error', notify.onError())
		.pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
		.pipe(cleanCSS())
		.pipe(gulp.dest(dist+'/css'));
});

gulp.task('scss', function () {
	return gulp.src(source+'/scss/main.scss')
        .pipe(sassGlob())
        .pipe(plumber())
        .pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
        .on('error', notify.onError())
		.pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(dist+'/css'))
		.pipe(browserSync.stream());
});

gulp.task('watch', function () {
	gulp.watch(source+'/scss/*.scss', ['scss']);
	gulp.watch(source+'/html/*.html', ['html']);
    // gulp.watch(source+'/jade/*.jade', ['jade']);
    gulp.watch([source+'/img/*',source+'/img/**/*'], ['img']);
});

gulp.task('default', ['fonts','html','jade','img','scss','watch','browser-sync']);
gulp.task('build', ['fonts','html','jade','img','scss:build']);
gulp.task('dist', ['html','scss', 'img']);
gulp.task('serv', ['browser-sync']);