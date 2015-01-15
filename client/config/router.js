Router.configure({
  layoutTemplate: 'base',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

Router.plugin('dataNotFound');
