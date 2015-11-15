var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var concat = require('gulp-concat');
var shim = require('browserify-shim');

// Transpile
// -------------------------------------------------

function transpile(infiles, outfile, outdir, extraOpts, useShim) {

  var opts = assign({}, extraOpts);
  var bundler = browserify(infiles, opts)
    .transform(babelify.configure({sourceMaps:false}))

  if(useShim) bundler.transform(shim);

  return bundler.bundle()
    .on('error', function(err) { console.error(err); this.emit('end'); })
    .pipe(source(outfile))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(outdir));
}

// Build a browserified version that includes opentype, but ignores
// rune.js (as it should be on the page already), and shims the require.
gulp.task('build:browser', function() {
  return transpile('./src/noise.js', 'rune.noise.js', 'tmp', {
    standalone: "Rune.Noise",
    ignore:"rune.js",
    debug:true
  }, true)
});

// Build a node version with no bundled packages.
gulp.task('build:node', function() {
  return transpile('./src/noise.js', 'rune.noise.node.js', 'tmp', {
    bundleExternal:false,
    standalone: "Rune.Noise",
    debug:true
  })
});
