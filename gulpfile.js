// 载入插件
var gulp = require('gulp'),
  sass = require('gulp-sass'), // 编译并压缩sass
  sourcemaps = require('gulp-sourcemaps'), // 生成sourcemap
  autoprefixer = require('gulp-autoprefixer'), // css前缀
  rename = require('gulp-rename'), //重命名
  minifycss = require('gulp-minify-css'), //压缩css
  px2rem = require('gulp-px2rem-plugin'), //px转rem
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  babel = require('gulp-babel'),
  concat = require('gulp-concat'),
  imagemin = require('gulp-imagemin'), // 最小化图片
  gutil = require('gulp-util'), // 如果有自定义方法，可能会用到
  shell = require("gulp-shell"), // 执行shell命令
  htmlmin = require('gulp-htmlmin'), // 压缩html
  clean = require('gulp-clean'), // 清理文件夹
  webserver = require('gulp-webserver'), // 静态文件服务器
  notify = require('gulp-notify'), // 桌面通知
  gutil = require('gulp-util'),
  stripDebug = require('gulp-strip-debug'), //去掉debug
  rev = require('gulp-rev'), //md5后缀
  revCollector = require('gulp-rev-collector'),
  runSequence = require('run-sequence'),
  cache = require('gulp-cache'); // 只压缩修改的图片，没有修改的图片直接从缓存文件读取;

// 样式处理
gulp.task('styles', function() {
  return gulp.src(['./rev/img/*.json', 'src/css/*.scss'])
    // .pipe(sourcemaps.init()) // 生成sourcemaps
    .pipe(revCollector()) // 根据对应的json 替换 所有css 内的图片
    .pipe(rev())
    .pipe(px2rem({
      'width_design': 750,
      'valid_num': 6,
      'pieces': 10,
      'ignore_px': [0.5, 1, 2],
      'ignore_selector': ['.sep']
    }))
    .pipe(sass().on('error', sass.logError)) // 编译sass，压缩
    .pipe(autoprefixer({
      browsers: ['last 4 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
      cascade: false
    })) // 生成前缀
    // .pipe(sourcemaps.write('.')) // 输出sourcemaps
    .pipe(gulp.dest('dist/css')) // 输出css和map文件
    .pipe(minifycss({
      processImport: false
    }))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./rev/css'))
});

// js处理
gulp.task('scripts', function() {
  return gulp.src(['src/js/**/*.js'])
    // .pipe(sourcemaps.init())
    .pipe(stripDebug())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .on('error', function(err) {
      gutil.log('babel Error!', err.message);
      this.end();
    })
    .pipe(rev())
    // .pipe(sourcemaps.write('.'))
    // .pipe(jshint('.jshintrc'))
    // .pipe(jshint.reporter('default'))
    .pipe(gulp.dest('dist/js'))
    .pipe(uglify())
    .on('error', function(err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(gulp.dest('dist/js'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./rev/js'))
});


// 图片处理
gulp.task('images', function() {
  return gulp.src('src/img/**/*') // 压缩图片:优化等级，无损压缩jpg图片，隔行扫描gif进行渲染，多次优化svg直到完全优化
    .pipe(cache(imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true,
      multipass: true
    })))
    .pipe(rev())
    .pipe(gulp.dest('dist/img'))
    .pipe(rev.manifest()) // 生成名称对应的json
    .pipe(gulp.dest('./rev/img')) // json 文件保存位置
});

// 监测html时修改html
gulp.task('html', function() {
  return gulp.src(['./rev/css/*.json', './rev/js/*.json', 'src/*.html'])
    .pipe(revCollector({
      replaceReved: true
    }))
    // .pipe(htmlmin({
    //   removeComments: true,
    //   collapseWhitespace: true,
    //   minifyJS: true
    // }))
    .pipe(gulp.dest('dist'))
});

// 复制字体
gulp.task('copyfont', function() {
  return gulp.src('src/fonts/*')
    .pipe(gulp.dest('dist/fonts'));
});

//md5后缀
gulp.task('rev', function() {
  return gulp.src(['./rev/css/*.json', './rev/js/*.json', 'src/*.html'])
    .pipe(revCollector({
      replaceReved: true
    }))
    .pipe(gulp.dest('dist'))
});

// 静态文件服务器
gulp.task('webserver', function() {
  gulp.src('')
    .pipe(webserver({
      host: 'localhost',
      port: 3366,
      open: 'http://localhost:3366/dist/index.html',
      livereload: true,
      directoryListing: {
        enable: true,
        path: './'
      },
      proxies: [{
        source: '/employee-statistics',
        target: 'http://web-checkin.lepass.cn/employee-statistics'
      }]
    }))
    .on('error', function(err) {
      console.log(err)
    })
});

// css文件监听
gulp.task('watch-css', function() {
  runSequence('styles', 'rev')
})

// js文件监听
gulp.task('watch-js', function() {
  runSequence('scripts', 'rev')
})

// 清理
gulp.task('clean', function() {
  return gulp.src(['dist/*'], {
      read: false
    })
    .pipe(clean());
});

//编译打包
gulp.task('build', ['images', 'styles', 'scripts', 'html', 'copyfont'], function() {})

// 默认任务
gulp.task('default', ['clean'], function() {
  runSequence('build', 'rev')
});

// 动态跟踪
gulp.task('watch', function() {
  gulp.start('default');
  // 看守所有html档
  gulp.watch('src/*.html', ['html']);
  // 看守所有.scss档
  gulp.watch('src/css/**', ['watch-css']);
  // 看守所有.js档
  gulp.watch('src/js/**', ['watch-js']);
  // 看守所有图片档
  gulp.watch('src/img/**', ['images']);
});

// 本地
gulp.task('dev', function() {
  runSequence('watch', 'webserver')
})