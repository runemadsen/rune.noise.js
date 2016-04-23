var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var assign = require('lodash.assign');
var concat = require('gulp-concat');
var shim = require('browserify-shim');
var rename = require('gulp-rename');

// Transpile
// -------------------------------------------------

function transpile(infiles, outfile, outdir, extraOpts, useShim) {

  var opts = assign({}, extraOpts);
  var bundler = browserify(infiles, opts);
  if(useShim) bundler.transform(shim);
  return bundler.bundle()
    .on('error', function(err) { console.error(err); this.emit('end'); })
    .pipe(source(outfile))
    .pipe(buffer())
    .pipe(gulp.dest(outdir));
}

// Build a browserified version that includes opentype, but ignores
// rune.js (as it should be on the page already), and shims the require.
gulp.task('build', function() {
  return transpile('./src/noise.js', 'rune.noise.js', 'tmp', {
    standalone: "Rune.Noise",
    ignore:"rune.js"
  }, true)
});

gulp.task('minify', ['build'], function() {
  return gulp.src(['tmp/rune.noise.js'])
    .pipe(uglify())
    .on('error', function(err) { console.error(err); })
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('tmp'))
});
