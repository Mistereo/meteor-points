var Field = Points.Field;

Points.defaultRules = {
  type: 'rated',
  set: 'russian',
  field: {
    width: 30,
    height: 30
  },
  clock: {
    initial: 600,
    increment: 15
  }
};

Points.createGame = function (blue, red, rules) {
  rules = _.defaults(rules, Points.defaultRules);
  var game = {
    date: new Date(),
    status: 'playing',
    score: {blue: 0, red: 0},
    winner: null,
    blue: blue,
    red: red,
    moving: Points.BLUE,
    stopped: {blue: false, red: false},
    rules: rules
  };
  Points.Rules[game.rules.set].init(game);
  return game;
};

Points.move = function (game, move) {
  var Rules = Points.Rules[game.rules.set];
  if (!Rules.check(game, move)) {
    return false;
  }
  Rules.apply(game, move);
  return true;
};

Points.finish = function (game, winner) {
  game.winner = winner;
  game.status = 'finished';
};

Points.finishGameWithCurrentResult = function (game) {
  if (game.score.blue > game.score.red) {
    Points.finish(game, Points.BLUE);
  } else {
    Points.finish(game, Points.RED);
  }
};

Points.opponentColor = function (color) {
  return (color == Points.BLUE) ? Points.RED : Points.BLUE;
};

Points.stop = function (game, color) {
  var player = (color == Points.BLUE) ? 'blue' : 'red';
  game.stopped[player] = true;
  game.moving = Points.opponentColor(color);
  if (game.stopped.blue && game.stopped.red) {
    Points.finishGameWithCurrentResult(game);
  }
  return true;
};

Points.resign = function (game, color) {
  if (game.status != 'playing') {
    return false;
  }
  var winner = color == Points.BLUE ? Points.RED : Points.BLUE;
  Points.finish(game, winner);
  return true;
};

Points.currentPlayer = function (game) {
  if (game.moving == Points.BLUE) {
    return game.blue;
  }
  return game.red;
};
