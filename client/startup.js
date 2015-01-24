Meteor.autorun(function () {
  Games.find({
    $or: [{
      'blue._id': Meteor.userId()
    }, {
      'red._id': Meteor.userId()
    }]
  }).observe({
    added: function (game) {
      setTimeout(function () {
        Router.go('game', {
          _id: game._id
        });
      }, 1000);
    }
  });
});
