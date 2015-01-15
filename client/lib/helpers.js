Template.registerHelper('formatDate', function (date, fmt) {
  date = date || new Date();
  return moment(date).format(fmt);
});
