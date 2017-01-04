var gulp        = require('gulp');
var browserSync = require('browser-sync').create()
var header      = require('gulp-header')
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cleanCSS    = require('gulp-clean-css')
var pkg         = require('./package.json')

// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
    ' */\n',
    ''
].join('');


/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src('css/main.sass')
        .pipe(sass({
            includePaths: ['css'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('css/'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('css/'));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('css/**', ['sass', browserSync.reload]);
    gulp.watch('js/**', browserSync.reload );
    gulp.watch('index.html', browserSync.reload );
});



// Run everything
gulp.task('default', ['browser-sync', 'watch']);

// Configure the browserSync task
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        },
    })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'watch'], function() {
    // Reloads the browser whenever HTML, JS, CSS files change
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('js/*.js', browserSync.reload);
    gulp.watch('cs/*.css', browserSync.reload);
});
