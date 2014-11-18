/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
*/

var gulp  = require('gulp');
var config= require('../config');

gulp.task('watch', ['setWatch'], function() {
  gulp.watch(config.sass.src, ['sass']);
  gulp.watch(config.markup.src, ['markup']);
  gulp.watch(config.images.src, ['images']);
  gulp.watch(config.images.audio, ['audio']);
});
