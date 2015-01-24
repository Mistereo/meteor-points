Package.describe({
  name: 'mistereo:ratings',
  summary: 'Ratings calculator.',
  version: '1.0.0'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.2.1');
  api.addFiles('lib/ratings.js');
  api.export('Rating');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('mistereo:ratings');
  api.addFiles('test/ratings.js');
});
