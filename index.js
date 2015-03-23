var exec = require('child_process').exec;
var util = require('util');
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
		exec('cordova run browser');
		cb();
	});

	gulp.task('dev', ['build browser', 'run browser'], function() {
		gulp
		.watch('www/**', ['build browser']);
	});

	var apk = 'platforms/android/android/build/outputs/apk/android-armv7-debug.apk';

	gulp.task('build apk', function(cb) {
		exec(util.format('cordova build --release android'), cb);
	});

	gulp.task('sign', ['build apk'], function(cb) {
		exec(util.format('jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -storepass %s -keystore android-release-key.keystore %s alias_name', pkg.storepass, apk), cb);
	});

	gulp.task('release', ['sign'], function(cb) {
		exec(util.format('zipalign -v 4  %s %s.apk', apk, pkg.name), cb);
	});
}

module.exports = gulper;
