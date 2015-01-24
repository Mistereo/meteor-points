Router.configure({
  layoutTemplate: 'base',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  onBeforeAction: function () {
    document.title = 'Игра точки!';
    this.next();
  }
});

Router.plugin('dataNotFound');
