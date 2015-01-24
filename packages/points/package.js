Package.describe({
  name: 'mistereo:points',
  summary: 'Points game engine and renderer.',
  version: '1.0.0'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.2.1');
  api.addFiles([
    'shared/points.js',
    'shared/field.js',
    'shared/rules/russian.js',
    'shared/game.js'
  ]);
  api.addFiles([
    'client/renderer.js'
  ], 'client');
  api.export('Points');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('mistereo:points');
  api.addFiles([
    'test/field.js',
    'test/points.js'
  ]);
});
