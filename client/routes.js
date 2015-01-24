Router.route('/', {
  name: 'index',
  data: function () {
    var userId = Meteor.userId();
    var usersFilter = (Session.get('users:filter') || '');
    var gamesFilter = (Session.get('games:filter') || '');
    var users = Users
      .find()
      .fetch()
      .filter(function (user) {
        var username = user.username;
        var rating = user.rating;
        return filterCheck(username, usersFilter) || filterCheck(rating, usersFilter);
      })
      .sort(function (a, b) {
        return b.rating - a.rating;
      });
    var games = Games
      .find({status: 'playing'})
      .fetch()
      .filter(function (game) {
        var blueUsername = game.blue.username;
        var redUsername = game.red.username;
        return filterCheck(blueUsername, gamesFilter) || filterCheck(redUsername, gamesFilter);
      })
      .map(function (game) {
        if (game.blue._id == userId || game.red._id == userId) {
          game.my = true;
        }
        return game;
      });
    var invites = Invites
      .find()
      .fetch()
      .filter(function (invite) {
        var playerUsername = invite.player.username;
        return filterCheck(playerUsername, gamesFilter);
      })
      .map(function (invite) {
        if (invite.player._id == userId) {
          invite.my = true;
        }
        invite.accepts = Accepts.find({inviteId: invite._id}).fetch()
        invite.accepts.forEach(function (accept) {
          if (accept.player._id == userId) {
            invite.joinedByMe = true;
          }
        });
        return invite;
      });
    var messages = Messages
      .find({chatId: 'main'})
      .map(function (message) {
        if (message.sender._id == userId) {
          message.owner = 'me';
        }
        return message;
      });
    return {
      users: users,
      messages: messages,
      games: games,
      invites: invites
    }
  }
});

Router.route('/game/:_id', {
  name: 'game',
  waitOn: function () {
    return Meteor.subscribe('game', this.params._id);
  },
  data: function () {
    var userId = Meteor.userId();
    var game = Games.findOne(this.params._id);
    if (game && (game.blue._id == userId || game.red._id == userId)) {
      game.my = true;
    }
    var messages = Messages
      .find({
        chatId: this.params._id
      })
      .fetch()
      .map(function (message) {
        if (message.sender._id == userId) {
          message.owner = 'me';
        }
        if (game) {
          switch (message.sender._id) {
            case game.blue._id:
              message.owner = 'blue';
              break;
            case game.red._id:
              message.owner = 'red';
              break;
            default:
              break;
          }
        }
        return message;
      });
    return {
      game: game,
      messages: messages
    }
  }
});

function filterCheck(str, filter) {
  filter = filter
    .toString()
    .toLowerCase();
  str = str
    .toString()
    .toLowerCase();
  return str.indexOf(filter) != -1;
}
