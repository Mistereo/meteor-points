Template.game.helpers({
  isActivePlayer: function (player) {
    var movingColor = this.game.moving == Points.BLUE ? 'blue' : 'red';
    return player == movingColor;
  },
  mousePosition: function () {
    var mouse = Session.get('mousePosition') || {x: 0, y: 0};
    return mouse.x + ' ' + mouse.y;
  },
  gameWinner: function () {
    var game = this.game || {};
    if (game.winner == Points.BLUE) {
      return game.blue.username;
    } else if (game.winner == Points.RED) {
      return game.red.username;
    }
  },
  timer: function (game, color) {
    var now = TimeSync.serverTime();
    var time;
    if (game.moving == Points.BLUE && color == 'blue') {
      time = game.clock.blue - (now - game.lastTick);
    } else if (game.moving == Points.RED && color == 'red') {
      time = game.clock.red - (now - game.lastTick);
    } else {
      time = game.clock[color];
    }
    if (game.status != 'playing') {
      time = game.clock[color];
    }
    if (time < 0) {
      time = 0;
    }
    return moment(0).milliseconds(time).format("mm:ss");
  }
});

Template.game.rendered = function () {
  var renderer;
  var canvas = this.find('#gameField');
  this.autorun(function () {
    var game = Template.currentData().game;
    if (!game) {
      return;
    }
    if (!renderer) {
      renderer = new Points.Renderer(canvas, {
        xSize: game.rules.field.width,
        ySize: game.rules.field.height,
        clickHandler: function (x, y) {
          Meteor.call('game:move', game._id, {
            x: x,
            y: y
          });
        },
        mouseMoveHandler: function (x, y) {
          Session.set('mousePosition', {
            x: x,
            y: y
          });
        }
      });
    }
    renderer.clear();
    renderer.renderField(game.field);
    if (game.lastMove) {
      renderer.renderLastMoveMarker(game.lastMove);
    }
  });
};

Template.game.events({
  'click #gameBackButton': function () {
    Router.go('index');
  },
  'click #gameResignButton': function () {
    Meteor.call('game:resign', this.game._id);
  },
  'click #gameStopButton': function () {
    Meteor.call('game:stop', this.game._id);
  },
  'keypress #gameChatField, click #gameChatSubmit': function (event, template) {
    if (event.type == 'keypress' && event.keyCode != 13) {
      return;
    }
    var target = template.find('#gameChatField');
    var text = target.value.trim();
    target.value = '';
    if (text) {
      Meteor.call('chat:write', this.game._id, text);
    }
    event.preventDefault();
    return false;
  }
});
