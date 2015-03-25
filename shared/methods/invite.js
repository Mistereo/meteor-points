leaveAllInvites = function (userId) {
  Accepts.remove({
    'player._id': userId
  });
};

removeAllInvites = function (userId) {
  Invites.find({
    'player._id': userId
  }).forEach(function (invite) {
    Accepts.remove({
      inviteId: invite._id
    });
  });
  Invites.remove({
    'player._id': userId
  });
};

Meteor.methods({
  'invite:create': function (rules) {
    check(this.userId, String);
    check(rules, {
      type: String,
      set: String,
      field: {
        width: Number,
        height: Number
      },
      clock: {
        initial: Number,
        increment: Number
      }
    });
    // TODO validate rules
    // TODO deny multiple invites
    rules = _.defaults(rules, Points.defaultRules);
    var user = Users.findOne(this.userId, {
      fields: {
        _id: true,
        username: true,
        rating: true
      }
    });
    Invites.insert({
      player: user,
      rules: rules
    });
  },
  'invite:remove': function (inviteId) {
    check(this.userId, String);
    check(inviteId, String);

    var invite = Invites.findOne({
      _id: inviteId,
      'player._id': this.userId
    });
    if (!invite) {
      throw new Meteor.Error('not-found');
    }
    Accepts.remove({
      inviteId: inviteId
    });
    Invites.remove({
      _id: inviteId
    });
  },
  'invite:removeAll': function () {
    check(this.userId, String);

    removeAllInvites(this.userId);
  },
  'invite:join': function (inviteId) {
    check(this.userId, String);
    check(inviteId, String);

    var invite = Invites.findOne(inviteId);
    if (!invite) {
      throw new Meteor.Error('not-found');
    }
    var user = Users.findOne(this.userId, {
      fields: {
        _id: true,
        username: true,
        rating: true
      }
    });
    Accepts.upsert({
      inviteId: inviteId,
      player: user
    }, {
      inviteId: inviteId,
      player: user
    });
  },
  'invite:leave': function (inviteId) {
    check(this.userId, String);
    check(inviteId, String);

    Accepts.remove({
      inviteId: inviteId,
      'player._id': this.userId
    });
  },
  'invite:startGame': function (inviteId, opponentId) {
    check(this.userId, String);
    check(inviteId, String);
    check(opponentId, String);

    var invite = Invites.findOne({
      _id: inviteId,
      'player._id': this.userId
    });
    if (!invite) {
      throw new Meteor.Error('not-found');
    }
    var accept = Accepts.findOne({
      inviteId: inviteId,
      'player._id': opponentId
    });
    if (!accept) {
      throw new Meteor.Error('access-denied');
    }
    var blue = invite.player;
    var red = accept.player;

    leaveAllInvites(blue._id);
    leaveAllInvites(red._id);
    removeAllInvites(blue._id);
    removeAllInvites(red._id);

    var game = Points.createGame(blue, red, invite.rules);
    Games.insert(game);
  },
  'invite:reject': function (inviteId, opponentId) {
    check(this.userId, String);
    check(inviteId, String);
    check(opponentId, String);

    var invite = Invites.findOne({
      _id: inviteId,
      player: this.userId
    });
    if (!invite) {
      throw new Meteor.Error('not-found');
    }
    Accepts.remove({
      inviteId: inviteId,
      'player._id': opponentId
    });
  }
});
