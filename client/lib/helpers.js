Template.registerHelper('formatDate', function (date, fmt) {
  date = date || new Date();
  return moment(date).format(fmt);
});

Template.registerHelper('formatRules', function (rules) {
  if (!rules) return "";
  var str = '<b>' + rules.type.toUpperCase()[0] + '</b> ';
  str += rules.field.width + '×' + rules.field.height + ', ';
  str += rules.clock.initial/60 + 'м+' + rules.clock.increment + 'c';
  return str;
});

Template.registerHelper('rank', function (rating) {
  var defaultRating = 500;
  var rankStep = 300;
  var ranks = [
    'default',
    'blue',
    'green',
    'yellow',
    'orange',
    'red'
  ];
  var id = Math.floor((rating - defaultRating)/rankStep);
  if (id < 0) id = 0;
  if (id >= ranks.length) id = ranks.length - 1;
  return ranks[id]
});

Template.registerHelper('round', function (num) {
  return Math.round(Number(num));
});
