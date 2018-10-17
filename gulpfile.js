/*
  todo:
  svg спрайты gulp-svg-sprite
*/

const gulp = require('gulp');
const babel = require('gulp-babel');
const del = require('del');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const prefixer = require('gulp-autoprefixer');
const watch = require('gulp-watch');
const htmlBeautify = require('gulp-html-beautify');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync');
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');

const refresh = browserSync.reload;

const path = {
  build: {
    root: 'build',
    js: 'build/js',
    css: 'build/css',
    img: 'build/img',
    sprite: 'build/img/sprite.svg'
  },
  src: {
    img: {
      root: 'src/img/',
      files: 'src/img/**.*'
    },
    icons: 'src/img/icons/*.svg',
    js: {
      main: 'src/js/main.js',
      extends: 'src/js/extends/**/*.js'
    },
    pug: 'src/*.pug',
    scss: {
      main: 'src/scss/main.scss',
      template: 'src/scss/utils/sprite_template.scss'
    }
  },
  watch: {
    js: 'src/js/**/*.js',
    pug: 'src/**/*.pug',
    scss: 'src/scss/**/*.scss',
    img: 'src/img/**.*',
    icons: 'src/img/icons/*.svg'
  }
};

const serverConfig = {
  server: {
    baseDir: path.build.root
  },
  port: 3000,
  notify: false
};

gulp.task('clean', () => del(path.build.root));
gulp.task('server', (done) => {
  browserSync(serverConfig);
  done();
});

gulp.task('html', () => gulp.src(path.src.pug)
  .pipe(pug())
  .pipe(htmlBeautify())
  .pipe(gulp.dest(path.build.root))
  .pipe(refresh({ stream: true })));

gulp.task('js', () => gulp.src(path.src.js.main)
  .pipe(babel({ presets: ['@babel/env'] }))
  .pipe(gulp.dest(path.build.js))
  .pipe(refresh({ stream: true })));

gulp.task('js-extends', () => gulp.src(path.src.js.extends)
  .pipe(gulp.dest(path.build.js))
  .pipe(refresh({ stream: true })));

gulp.task('scss', () => gulp.src(path.src.scss.main)
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(prefixer({ browsers: ['last 10 versions'] }))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(path.build.css))
  .pipe(refresh({ stream: true })));

gulp.task('svg', () => gulp.src('src/img/icons/*.svg')
  .pipe(svgmin())
  .pipe(cheerio({
    run($) {
      $('[fill]').removeAttr('fill');
      $('[stroke]').removeAttr('stroke');
      $('[style]').removeAttr('style');
    }
  }))
  .pipe(replace('&gt;', '>'))
  .pipe(svgSprite({
    mode: {
      symbol: {
        sprite: '../sprite.svg',
        render: {
          scss: {
            dest: '../../scss/blocks/sprite.scss',
            template: path.src.scss.template
          }
        }
      }
    }
  }))
  .pipe(gulp.dest(path.build.img))
  .pipe(refresh({ stream: true })));

gulp.task('img', () => gulp.src(path.src.img.files)
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{ removeViewBox: false }],
    interlaced: true
  }))
  .pipe(gulp.dest(path.build.img))
  .pipe(refresh({ stream: true })));

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel(
    'svg',
    'img',
    'html',
    'js',
    'js-extends',
    'scss'
  )
));

gulp.task('watch', () => {
  watch(path.watch.pug).on('change', gulp.series('html'));
  watch(path.watch.scss).on('change', gulp.series('scss'));
  watch(path.watch.js).on('change', gulp.series('js', 'js-extends'));
  watch(path.watch.img).on('change', gulp.series('img'));
  watch(path.watch.icons).on('change', gulp.series('svg'));
});

gulp.task('run', gulp.series(
  'build',
  gulp.parallel(
    'watch',
    'server'
  )
));
