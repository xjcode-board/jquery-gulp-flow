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
  fontSpider = require('gulp-font-spider'), //字蛛
  gutil = require('gulp-util'), // 如果有自定义方法，可能会用到
  shell = require("gulp-shell"), // 执行shell命令
  htmlmin = require('gulp-htmlmin'), // 压缩html
  clean = require('gulp-clean'), // 清理文件夹
  webserver = require('gulp-webserver'), // 静态文件服务器
  notify = require('gulp-notify'), // 桌面通知
  cache = require('gulp-cache'); // 只压缩修改的图片，没有修改的图片直接从缓存文件读取;

// 监测html时修改html
gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(fontSpider())
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('dist'))
    .pipe(notify({
      message: '页面处理完成'
    })); // 提示
});

// 样式处理
gulp.task('styles', function() {
  return gulp.src('src/css/*.scss') // 转换为数据流
    .pipe(sourcemaps.init()) // 生成sourcemaps
    .pipe(px2rem({
      'width_design': 750,
      'valid_num': 6,
      'pieces': 10,
      'ignore_px': [1, 2],
      'ignore_selector': []
    }))
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError)) // 编译sass，压缩
    .pipe(autoprefixer({
      browsers: ['last 4 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
      cascade: false
    })) // 生成前缀
    .pipe(sourcemaps.write('.')) // 输出sourcemaps
    .pipe(gulp.dest('dist/css')) // 输出css和map文件
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(minifycss({
      processImport: false
    }))
    .pipe(notify({
      message: '样式处理完成'
    })); // 提示
});

// 脚本处理
// var myDevConfig = Object.create(webpackConfig);
// var devCompiler = webpack(myDevConfig);
// gulp.task('scripts', function(callback) {
//   devCompiler.run(function(err, stats) {
//     if (err) {
//       throw new gutil.PluginError("webpack:scripts", err);
//     }
//     gutil.log("[webpack:scripts]", stats.toString({
//       colors: true
//     }));
//     callback();
//   });
// });

// js处理
gulp.task('scripts', function() {
  return gulp.src(['src/js/*.js', './lib/*.js'])
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    // .pipe(jshint('.jshintrc'))
    // .pipe(jshint.reporter('default'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({
      message: 'js处理完成'
    }));
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
    .pipe(gulp.dest('dist/img'))
    .pipe(notify({
      message: '图片处理完成'
    }));
});

// 不需要编译的文件直接复制，包括独立的外部系统页面
gulp.task('static', function() {
  return gulp.src('src/static/**')
    .pipe(gulp.dest('dist/static'));
});

// 字体处理
gulp.task('copyfont', function() {
  return gulp.src('src/fonts/*')
    .pipe(gulp.dest('dist/fonts'));
});

// favicon复制
gulp.task('favicon', function() {
  return gulp.src('src/favicon.ico')
    .pipe(gulp.dest('dist'));
});


// 静态文件服务器
gulp.task('webserver', ['images', 'copyfont', 'static', 'favicon', 'styles', 'scripts', 'html'], function() {
  gulp.src('')
    .pipe(webserver({
      host: 'localhost',
      port: 8888,
      open: 'http://localhost:8888/dist/index.html',
      livereload: true,
      directoryListing: {
        enable: true,
        path: './'
      },
      proxies: [{
        source: '/appweb',
        target: 'http://t-zxweb.lepass.cn/appweb'
      }, {
        source: '/merweb',
        target: 'http://t-merweb.lepass.cn/merweb'
      }]
    }));
});


// 清理
gulp.task('clean', function() {
  return gulp.src(['dist/*'], {
      read: false
    })
    .pipe(clean());
});

// 默认任务
gulp.task('default', ['clean'], function() {
  gulp.start('webserver');
});

// 动态跟踪
gulp.task('watch', function() {
  gulp.start('default');
  // 看守所有html档
  gulp.watch('src/*.html', ['html']);
  // 看守所有.scss档
  gulp.watch('src/css/**', ['styles']);
  // 看守所有.js档
  gulp.watch('src/js/**', ['scripts']);
  // 看守所有图片档
  gulp.watch('src/img/**', ['images']);
  // 看守所有的不需要编译的文件
  gulp.watch('src/static/**', ['static']);
});