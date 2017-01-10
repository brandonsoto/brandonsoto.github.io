var gulp         = require('gulp');
var browserSync  = require('browser-sync').create();
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var bootlint     = require('gulp-bootlint');
var sourcemaps   = require('gulp-sourcemaps');
var sassLint     = require('gulp-sass-lint');
var pkg          = require('./package.json');

// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
    ' */\n',
    ''
].join('');

gulp.task( 'bootlint', ['sass'], function() {
    return gulp.src('index.html')
        .pipe(bootlint({
            stoponerror: true
        }));
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src('assets/css/main.sass')
       .pipe(sourcemaps.init())
       .pipe(sass().on('error', sass.logError))
       .pipe(sourcemaps.write())
       .pipe(autoprefixer())
       .pipe(gulp.dest('assets/css/'))
       .pipe(browserSync.reload({stream:true}));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('assets/css/**', ['sass-lint', 'sass']);
    gulp.watch('assets/js/**', browserSync.reload );
    gulp.watch('index.html', ['bootlint', browserSync.reload] );
});


// Configure the browserSync task
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        }
    })
});

gulp.task('sass-lint', function() {
    return stream = gulp.src('assets/css/**/*.sass')
        .pipe( sassLint({
            options: {
                formatter: 'stylish',
                'max-warnings': 50
            },
            files: {
                ignore: 'assets/vendor/**/*.sass'
            }
        }) )
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError());
});

gulp.task('default', ['sass-lint', 'sass', 'bootlint']);
gulp.task('dev', ['sass-lint', 'sass', 'bootlint', 'browser-sync', 'watch']);
