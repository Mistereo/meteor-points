var rules = {
  set: 'russian',
  size: [30, 30]
};

Tinytest.add('Points.CONSTANTS', function (test) {
  test.include(Points, 'EMPTY');
  test.include(Points, 'BLUE');
  test.include(Points, 'RED');
});

Tinytest.add('Points.createGame()', function (test) {
  var blue = Math.random();
  var red = Math.random();
  var game = Points.createGame(blue, red, rules);
  test.ok(game);
  test.equal(game.status, 'playing');
  test.equal(game.moving, Points.BLUE);
  test.equal(game.blue, blue);
  test.equal(game.red, red);
  test.ok(game.field);
  test.equal(game.field.width, rules.size[0]);
  test.equal(game.field.height, rules.size[1]);
});

Tinytest.add('Points.move()', function (test) {

});

Tinytest.add('Points.stop()', function (test) {
  var blue = Math.random();
  var red = Math.random();
  var game = Points.createGame(blue, red, rules);
  test.isFalse(game.stopped.blue);
  test.isFalse(game.stopped.red);
  Points.stop(game, 'blue');
  Points.stop(game, 'red');
  test.isTrue(game.stopped.blue);
  test.isTrue(game.stopped.red);
  test.equal(game.status, 'finished');
});

Tinytest.add('Points.resign()', function (test) {
  var blue = Math.random();
  var red = Math.random();
  var game = Points.createGame(blue, red, rules);
  Points.resign(game, 'blue');
  test.equal(game.status, 'finished');
  test.equal(game.winner, 'blue');
});

Tinytest.add('Points.finishGameWithCurrentResult()', function (test) {
  var blue = Math.random();
  var red = Math.random();
  var game = Points.createGame(blue, red, rules);
  game.score = {
    blue: 10,
    red: 0
  };
  Points.finishGameWithCurrentResult(game);
  test.equal(game.status, 'finished');
  test.equal(game.winner, 'blue');
});

Tinytest.add('Points.currentPlayer()', function (test) {
  var blue = Math.random();
  var red = Math.random();
  var game = Points.createGame(blue, red, rules);
  test.equal(Points.currentPlayer(game), blue);
});
