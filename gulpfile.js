var gulp = require('gulp');
var $ = require('gulp-load-plugins')({rename: {'gulp-rev-delete-original':'revdel', 'gulp-if': 'if'}});



/* Tasks base */
gulp.task('copy', function() {
    return gulp.src(['site/assets/{img,font}/**/*', 'site/app.yaml'], {base: 'site'})
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
    return gulp.src(['wp-content/themes/landing_gat/css', 'wp-content/themes/landing_gat/js','wp-content/themes/landing_gat/img'], {read: false})
        .pipe($.clean());
});



/* Minificação */
gulp.task('minify-js', function() {
  return gulp.src('wp-content/themes/landing_gat/dev/js/**/*.js')
    .pipe($.uglify())
    .pipe(gulp.dest('wp-content/themes/landing_gat/js/'))
});

gulp.task('minify-css', function() {
  return gulp.src('wp-content/themes/landing_gat/dev/css/**/*.css')
    .pipe($.cssnano({safe: true}))
    .pipe(gulp.dest('wp-content/themes/landing_gat/css/'))
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
    return gulp.src('wp-content/themes/landing_gat/dev/img/**/*')
        .pipe($.imagemin({
            progressive: true,
            svgoPlugins: [
                {removeViewBox: false},
                {cleanupIDs: false}
            ]
        }))
        .pipe(gulp.dest('wp-content/themes/landing_gat/img/'));
});

gulp.task('imagemin-uploads', function() {
    return gulp.src('wp-content/themes/uploads/**/*')
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
  return gulp.src(['wp-content/themes/landing_gat/**/*.{css,js}'])
    .pipe($.rev())
    .pipe($.revdel())
    .pipe(gulp.dest('wp-content/themes/landing_gat/'))
    .pipe($.rev.manifest())
    .pipe(gulp.dest('wp-content/themes/landing_gat/'))
})

gulp.task('revreplace', ['rev'], function(){
  return gulp.src('wp-content/themes/landing_gat/dev/css/**/*.css')
    .pipe($.revReplace({
        manifest: gulp.src('wp-content/themes/landing_gat/rev-manifest.json'),
        replaceInExtensions: ['.html', '.yaml', '.js', '.css']
    }))
    .pipe(gulp.dest('wp-content/themes/landing_gat/css/'));
});

/* Alias */
gulp.task('minify', ['minify-js', 'minify-css']);
gulp.task('images', ['imagemin', 'imagemin-uploads']);
gulp.task('build', $.sequence(['minify', 'images']));
gulp.task('complete', $.sequence('clean', 'build'));
gulp.task('default', $.sequence('build'));
gulp.task('daily', $.sequence('imagemin-uploads'));
