Meteor.publish('users', function () {
  return Users.find({
    'status.online': true
  }, {
    fields: {
      username: true,
      rating: true,
      'status.online': true
    }
  });
});

Meteor.publish('games', function () {
  return Games.find({
    status: 'playing'
  }, {
    fields: {
      status: true,
      blue: true,
      red: true,
      rules: true
    }
  });
});

Meteor.publish('game', function (gameId) {
  return [
    Games.find(gameId, {
      fields: {
        status: true,
        blue: true,
        red: true,
        rules: true,
        field: true,
        winner: true,
        moving: true,
        score: true,
        lastMove: true,
        stopped: true,
        clock: true,
        lastTick: true
      }
    }),
    Messages.find({
      chatId: gameId
    })
  ];
});

Meteor.publish('invites', function () {
  return Invites.find({}, {
    fields: {
      player: true,
      rules: true
    }
  });
});

Meteor.publish('mainChat', function () {
  return Messages.find({
    chatId: 'main'
  });
});

Meteor.publish('accepts', function () {
  return Accepts.find();
});
