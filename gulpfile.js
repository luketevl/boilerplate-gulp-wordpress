const THEME = 'landing_gat';
const gulp  = require('gulp');
const $ = require('gulp-load-plugins')({rename: {'gulp-rev-delete-original':'revdel', 'gulp-if': 'if'}});


/* Tasks base */
gulp.task('copy', function() {
    return gulp.src(['site/assets/{img,font}/**/*', 'site/app.yaml'], {base: 'site'})
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
    return gulp.src([`wp-content/themes/${THEME}/css`, `wp-content/themes/${THEME}/js`,`wp-content/themes/${THEME}/img`], {read: false})
        .pipe($.clean());
});



/* Minificação */
gulp.task('minify-js', function() {
  return gulp.src(`wp-content/themes/${THEME}/dev/js/**/*.js`)
    .pipe($.uglify())
    .pipe(gulp.dest(`wp-content/themes/${THEME}/js/`))
});

gulp.task('minify-css', function() {
  return gulp.src(`wp-content/themes/${THEME}/dev/css/**/*.css`)
    .pipe($.cssnano({safe: true}))
    .pipe(gulp.dest(`wp-content/themes/${THEME}/css/`))
});

/* Concatenação */
gulp.task('useref', function () {
    return gulp.src('site/index.html')
        .pipe($.useref())
        .pipe($.if('*.html', $.inlineSource()))
        .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.cssnano({safe: true})))
        .pipe(gulp.dest('dist'));
});

/* Imagens */
gulp.task('imagemin', function() {
    return gulp.src(`wp-content/themes/${THEME}/dev/img/**/*`)
        .pipe($.imagemin({
            progressive: true,
            svgoPlugins: [
                {removeViewBox: false},
                {cleanupIDs: false}
            ]
        }))
        .pipe(gulp.dest(`wp-content/themes/${THEME}/img/`));
});

gulp.task('imagemin-uploads', function() {
    return gulp.src(`wp-content/themes/uploads/**/*`)
        .pipe($.imagemin({
            progressive: true,
            svgoPlugins: [
                {removeViewBox: false},
                {cleanupIDs: false}
            ]
        }))
        .pipe(gulp.dest('wp-content/themes/uploads/'));
});



/* Revisão de arquivos */
gulp.task('rev', function(){
  return gulp.src([`wp-content/themes/${THEME}/**/*.{css,js}`])
    .pipe($.rev())
    .pipe($.revdel())
    .pipe(gulp.dest(`wp-content/themes/${THEME}/`))
    .pipe($.rev.manifest())
    .pipe(gulp.dest(`wp-content/themes/${THEME}/`))
})

gulp.task('revreplace', ['rev'], function(){
  return gulp.src(`wp-content/themes/${THEME}/dev/css/**/*.css`)
    .pipe($.revReplace({
        manifest: gulp.src(`wp-content/themes/${THEME}/rev-manifest.json`),
        replaceInExtensions: ['.html', '.yaml', '.js', '.css']
    }))
    .pipe(gulp.dest(`wp-content/themes/${THEME}/css/`));
});

/* Alias */
gulp.task('minify', ['minify-js', 'minify-css']);
gulp.task('images', ['imagemin', 'imagemin-uploads']);
gulp.task('build', $.sequence(['minify', 'images']));
gulp.task('complete', $.sequence('clean', 'build'));
gulp.task('default', $.sequence('build'));
gulp.task('daily', $.sequence('imagemin-uploads'));
