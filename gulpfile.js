var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var sassdoc = require('sassdoc');

// Development Tasks
// -----------------

// ... variables
var autoprefixerOptions = {
    browsers: ['last 2 versions','ie >= 9', '> 5%', 'Firefox ESR']
};

// Start browserSync server
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: 'dev'
        }
    })
});

gulp.task('sass', function() {
    return gulp.src('dev/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on("error", sass.logError)
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dev/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
})

// Watchers
gulp.task('watch', function() {
    gulp.watch('dev/scss/**/*.scss', ['sass']);
    gulp.watch('dev/*.html', browserSync.reload);
    gulp.watch('dev/js/**/*.js', browserSync.reload);
})

// Optimization Tasks
// ------------------

// Optimizing CSS and JavaScript
gulp.task('useref', function() {
    var assets = useref.assets();

    return gulp.src('dev/*.html')
        .pipe(assets)
        // Minifies only if it's a CSS file
        .pipe(gulpIf('*.css', minifyCSS()))
        // Uglifies only if it's a Javascript file
        .pipe(gulpIf('*.js', uglify()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'))
});

// Optimizing Images
gulp.task('images', function() {
    return gulp.src('dev/images/**/*.+(png|jpg|jpeg|gif|svg)')
        // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: true,
        })))
        .pipe(gulp.dest('dist/images'))
});

// Copying fonts
gulp.task('fonts', function() {
    return gulp.src('dev/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});

// Cleaning
gulp.task('clean', function(callback) {
    del('dist');
    return cache.clearAll(callback);
});

gulp.task('clean:dist', function(callback) {
    del(['dist/**/*', '!dist/images', '!dist/images/**/*'], callback)
});

// Build Sequences
// ---------------

gulp.task('default', function(callback) {
    runSequence(['sass', 'browserSync', 'watch'],
        callback
    )
});

gulp.task('build', function(callback) {
    runSequence(/*'clean:dist',*/
        ['sass', 'useref', 'images', 'fonts'],
        callback
    )
});
