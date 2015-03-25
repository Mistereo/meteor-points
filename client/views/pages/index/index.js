Template.index.helpers({
  modals: function () {
    var modals = {};
    modals.newGame = Session.get('modals:newGame');
    return modals;
  }
});

Template.index.events({
  'keyup #usersFilterField': function (event) {
    Session.set('users:filter', event.target.value);
  },
  'keyup #gamesFilterField': function (event) {
    Session.set('games:filter', event.target.value);
  },
  'click #createGameButton': function (event) {
    Session.set('modals:newGame', true);
  },
  'click .modal, click #modalCancel': function (event) {
    if (event.currentTarget == event.target) {
      Session.set('modals:newGame', false);
    }
  },
  'click #createGameFormSubmit': function (event) {
    // TODO: implement
    var form = $('#createGameForm')[0];
    var size = form.size.value.split(',');
    var rules = {
      type: form.type.value,
      set: 'russian',
      field: {
        width: parseInt(size[0]),
        height: parseInt(size[1])
      },
      clock: {
        initial: parseInt(form.initialTime.value) * 60,
        increment: parseInt(form.incrementTime.value)
      }
    };
    Meteor.call('invite:create', rules);
    Session.set('modals:newGame', false);
  },
  'keypress #mainChatField, click #mainChatSubmit': function (event, template) {
    if (event.type == 'keypress' && event.keyCode != 13) {
      return;
    }
    var target = template.find('#mainChatField');
    var text = target.value.trim();
    target.value = '';
    if (text) {
      Meteor.call('chat:write', 'main', text);
    }
    event.preventDefault();
    return false;
  },
  'click .game-item .game-item__remove': function () {
    Meteor.call('invite:remove', this._id);
  },
  'click .game-item .game-item__leave': function () {
    Meteor.call('invite:leave', this._id);
  },
  'click .game-item.game-item--invite .game-item__accept': function () {
    Meteor.call('invite:join', this._id);
  },
  'click .game-item .game-item__start': function () {
    Meteor.call('invite:startGame', this.inviteId, this.player._id);
  }
});
