var exec = require('child_process').exec;
var async = require('async');

function gulper(gulp, pkg) {
	gulp.task('platforms', function() {
		console.log('platforms', pkg.platforms);
		async.every(pkg.platforms, function(platform, cb) {
			console.log('platform', 'installing', platform);	
			exec('cordova platform add ' + platform, cb);
		}, function(err) {
			console.log('platform', 'done!', err);
		});
	});

	gulp.task('plugins', function() {
		console.log('plugins', pkg.plugins);
		async.every(pkg.plugins, function(plugin, cb) {
			console.log('plugin', 'installing', plugin);
			exec('cordova plugin add ' + plugin, cb);
		}, function(err) {
			console.log('plugins', 'done!', err);
		});
	});

	gulp.task('build browser', function(cb) {
		exec('cordova build browser', cb);	
	});

	gulp.task('run browser', function(cb) {
		exec('cordova run browser', cb);
	});

	gulp.task('dev', ['build browser', 'run browser'], function() {
		gulp
		.watch('www/**', ['build browser']);
	});
}

module.exports = gulper;
