Template.messageItem.rendered = function () {
  $('.chat .block__content').scrollTop(1e9);
  if (Meteor.user()) {
    var username = Meteor.user().username;
    this.$('.message__text')
      .html(function (id, html) {
        return html.replace(new RegExp('(' + username + ')', 'gi'), '<span class="message__hightlight">$1</span>')
      });
  }
};
