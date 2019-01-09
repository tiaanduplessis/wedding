const csso = require('gulp-csso')
const del = require('del')
const gulp = require('gulp')
const babel = require('gulp-babel')
const htmlmin = require('gulp-htmlmin')
const runSequence = require('run-sequence')
const imagemin = require('gulp-imagemin')
const uglify = require('gulp-uglify')
const autoprefixer = require('autoprefixer')
const postcss = require('gulp-postcss')
const postcssFixes = require('postcss-fixes')

const BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
]

gulp.task('styles', function () {
  return gulp.src('./src/**/*.css')
    .pipe(postcss([
      postcssFixes(),
      autoprefixer({ browsers: BROWSERS })
    ]))
    .pipe(csso())
    .pipe(gulp.dest('./dist'))
})

gulp.task('scripts', function () {
  return gulp.src('./src/**/*.js')
    .pipe(babel({
      presets: [
        [
          'env',
          {
            'targets': {
              'browsers': BROWSERS
            }
          }
        ]
      ],
      'comments': false
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
})

gulp.task('images', function () {
  return gulp.src('./src/assets/images/*')
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true, optimizationLevel: 2 }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(gulp.dest('./dist/assets/images'))
})

gulp.task('vendor', function () {
  return gulp.src(['./src/assets/vendor/**/*'], { allowEmpty: true })
    .pipe(gulp.dest('./dist/assets/vendor'))
})

gulp.task('php', function () {
  return gulp.src(['./src/**/*.php'], { allowEmpty: true })
    .pipe(gulp.dest('./dist'))
})

gulp.task('fonts', function () {
  return gulp.src(['./src/assets/fonts/**/*'], { allowEmpty: true })
    .pipe(gulp.dest('./dist/assets/fonts'))
})

gulp.task('pages', function () {
  return gulp.src(['./src/**/*.html'])
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('clean', () => del(['dist']))

gulp.task('default', ['clean'], function () {
  runSequence(
    'styles',
    'vendor',
    'scripts',
    'pages',
    'images',
    'fonts',
    'php'
  )
})
