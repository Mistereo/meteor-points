function updateRatings(blue, red, winner) {
  if (!winner) {
    return;
  }
  var blueScore = 0;
  if (winner == Points.BLUE) {
    blueScore = 1;
  }
  var ratings = Rating.calc(blue.rating, red.rating, blueScore);
  Users.update(blue._id, {
    $set: {
      rating: ratings.blue
    }
  });
  Users.update(red._id, {
    $set: {
      rating: ratings.red
    }
  });
}

Meteor.methods({
  'game:move': function (gameId, move) {
    check(this.userId, String);
    check(gameId, String);
    check(move, {
      x: Number,
      y: Number
    });
    // TODO improve
    var game = Games.findOne({
      $or: [{
        _id: gameId,
        'blue._id': this.userId
      }, {
        _id: gameId,
        'red._id': this.userId
      }]
    });
    if (!game) {
      throw new Meteor.Error('not-found');
    }
    if (game.blue._id == this.userId) {
      move.color = Points.BLUE;
    } else {
      move.color = Points.RED;
    }
    if (Points.move(game, move)) {
      Games.update(gameId, game);
    }
  },
  'game:stop': function (gameId) {
    check(this.userId, String);
    check(gameId, String);

    var game = Games.findOne({
      $or: [{
        _id: gameId,
        'blue._id': this.userId
      }, {
        _id: gameId,
        'red._id': this.userId
      }]
    });
    if (!game) {
      throw new Meteor.Error('not-found');
    }
    var color;
    if (game.blue._id == this.userId) {
      color = Points.BLUE;
    } else {
      color = Points.RED;
    }
    if (Points.stop(game, color)) {
      if (game.status == 'finished' && game.rules.type == 'rated') {
        updateRatings(game.blue, game.red, game.winner);
      }
      Games.update(gameId, game);
    }
  },
  'game:resign': function (gameId) {
    check(this.userId, String);
    check(gameId, String);

    var game = Games.findOne({
      $or: [{
        _id: gameId,
        'blue._id': this.userId
      }, {
        _id: gameId,
        'red._id': this.userId
      }]
    });
    var color;
    if (game.blue._id == this.userId) {
      color = Points.BLUE;
    } else {
      color = Points.RED;
    }
    if (Points.resign(game, color)) {
      if (game.status == 'finished' && game.rules.type == 'rated') {
        updateRatings(game.blue, game.red, game.winner);
      }
      Games.update(gameId, game);
    }
  }
});
