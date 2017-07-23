var gulp          = require("gulp");
var notify        = require("gulp-notify");
var source        = require("vinyl-source-stream");
var browserify    = require("browserify");
var babelify      = require("babelify");
var ngAnnotate    = require("browserify-ngannotate");
var browserSync   = require("browser-sync").create();
var sass          = require("gulp-sass");
var rename        = require("gulp-rename");
var minifyCSS     = require("gulp-minify-css");
var templateCache = require("gulp-angular-templatecache");
var del           = require("del");

// Where our files are located
var sassFiles = "src/style/*.scss";
var jsFiles   = "src/**/*.js";
var viewFiles = "src/**/*.html";
var dataFiles  = "src/public/*";
var buildDir = "./build/";
var assetsDir = buildDir + "assets/";

var interceptErrors = function(error) {
  var args = Array.prototype.slice.call(arguments);

  // Send error to notification center with gulp-notify
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);

  // Keep gulp from hanging on this task
  this.emit("end");
};


gulp.task("browserify", function() {
  return browserify("./src/index.js")
      .transform(babelify, {presets: ["es2015"]})
      .transform(ngAnnotate)
      .bundle()
      .on("error", interceptErrors)
      //Pass desired output filename to vinyl-source-stream
      .pipe(source("main.js"))
      // Start piping stream to tasks!
      .pipe(gulp.dest(assetsDir));
});

gulp.task("sass", function() {
  return gulp.src(sassFiles)
      .pipe(sass())
      .on("error", interceptErrors)
      .pipe(minifyCSS())
      .pipe(gulp.dest(assetsDir));
});

gulp.task("html", function() {
  return gulp.src("src/index.html")
      .on("error", interceptErrors)
      .pipe(gulp.dest(buildDir));
});

gulp.task("views", function() {
  return gulp.src(viewFiles)
      .pipe(templateCache({
        standalone: true
      }))
      .on("error", interceptErrors)
      .pipe(rename("app.templates.js"))
      .pipe(gulp.dest("./src/js/config/"));
});

// Copy mock data to dist directly
gulp.task("copyData", function() {
  gulp.src(dataFiles)
      .pipe(gulp.dest(assetsDir));
});

gulp.task("copyDirectories", function() {
  gulp.src(["./src/images/*", "./src/fonts/*"], {base: "src"})
      .pipe(gulp.dest(assetsDir));
});



// clean build folder
gulp.task("clean", function(){
  del.sync([assetsDir], {force: true});
})


gulp.task("default", ["clean", "sass", "copyData", "copyDirectories", "html", "views"], function() {

  gulp.start(["browserify"]);

  browserSync.init([buildDir + "**/**.**"], {
    server: buildDir,
    port: 4000,
    ui: {
      port: 4001
    }
  });

  gulp.watch(sassFiles, ["sass"]);
  gulp.watch("src/index.html", ["html"]);
  gulp.watch(viewFiles, ["views"]);
  gulp.watch(jsFiles, ["browserify"]);
  gulp.watch(dataFiles, ["copyData"]);
});