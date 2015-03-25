Meteor.setInterval(function () {
  var now = Date.now();
  Games.find({
    status: 'playing'
  }).forEach(function (game) {
    if (game.moving == Points.BLUE && now - game.lastTick > game.clock.blue) {
      Points.finish(game, Points.RED);
      Games.update(game._id, game);
    } else if (now - game.lastTick > game.clock.red) {
      Points.finish(game, Points.BLUE);
      Games.update(game._id, game);
    }
    if (game.status == 'finished' && game.rules.type == 'rated') {
      updateRatings(game.blue, game.red, game.winner);
    }
  });
}, 1000);
