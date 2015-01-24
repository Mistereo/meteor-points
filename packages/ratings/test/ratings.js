Tinytest.add('Rating.initial()', function (test) {
  var initial = Rating.initial();
  test.ok(initial);
  test.equal(typeof initial, 'number');
});

Tinytest.add('Rating.expected()', function (test) {
  var EPS = 1e-9;
  var blue = Math.random() * 1000 + 500;
  var red = Math.random() * 1000 + 500;
  var expected = Rating.expected(blue, red);
  test.ok(expected);
  test.equal(typeof expected.blue, 'number');
  test.equal(typeof expected.red, 'number');
  test.isTrue(Math.abs(expected.blue + expected.red - 1.0) < EPS);
});

Tinytest.add('Rating.calc()', function (test) {
  var blue = Math.random() * 1000 + 500;
  var red = Math.random() * 1000 + 500;
  var draw = Rating.calc(blue, red, 0.5);
  test.ok(draw);
  test.equal(typeof draw.blue, 'number');
  test.equal(typeof draw.red, 'number');

  var win = Rating.calc(blue, red, 1);
  test.ok(win);
  test.equal(typeof win.blue, 'number');
  test.equal(typeof win.red, 'number');
  test.isTrue(blue < win.blue);
  test.isTrue(red > win.red);

  var lose = Rating.calc(blue, red, 0);
  test.ok(lose);
  test.equal(typeof lose.blue, 'number');
  test.equal(typeof lose.red, 'number');
  test.isTrue(blue > lose.blue);
  test.isTrue(red < lose.red);
});
