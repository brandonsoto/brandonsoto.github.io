var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var pkg         = require('./package.json');

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
    return gulp.src('./css/**/*.sass')
       .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
       .pipe(gulp.dest('./css/'))
       .pipe(browserSync.reload({stream:true}));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('css/**', ['sass']);
    gulp.watch('js/**', browserSync.reload );
    gulp.watch('index.html', browserSync.reload );
});



// Run everything
gulp.task('default', ['browser-sync', 'sass', 'watch']);

// Configure the browserSync task
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        },
    })
});
