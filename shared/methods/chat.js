Meteor.methods({
  'chat:write': function (chatId, text) {
    check(this.userId, String);
    check(text, String);
    check(chatId, String);

    if (chatId == 'main' || Games.find({_id: chatId}).count() != 0) {
      var sender = Users.findOne(this.userId, {
        fields: {
          username: true,
          rating: true
        }
      });
      Messages.insert({
        date: new Date(),
        sender: sender,
        text: text,
        chatId: chatId
      });
    }
  }
});
