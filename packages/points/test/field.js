var Field = Points.Field;
var width = 10;
var height = 15;
var value = Math.random();

Tinytest.add('Field.create()', function (test) {
  var field = Field.create(width, height, value);
  test.ok(field);
  test.equal(field.width, width);
  test.equal(field.height, height);
  test.include(field, 'state');
  test.equal(field.state.length, width * height);
  for (var i = 0; i < field.state.length; i++) {
    test.equal(field.state[i], value);
  }
});

Tinytest.add('Field.id()', function (test) {
  var field = Field.create(width, height);
  test.equal(typeof Field.id, 'function');
  test.equal(typeof Field.id(field, 0, 0), 'number');
});

Tinytest.add('Field.contains()', function (test) {
  var field = Field.create(width, height);
  test.equal(typeof Field.contains, 'function');
  test.isTrue(Field.contains(field, 0, 0));
  test.isFalse(Field.contains(field, -1, 0));
  test.isFalse(Field.contains(field, 0, -1));
  test.isFalse(Field.contains(field, 10000, 10000));
});

Tinytest.add('Field.each()', function (test) {
  var field = Field.create(width, height);
  test.equal(typeof Field.each, 'function');
});

Tinytest.add('Field.color()', function (test) {
  var field = Field.create(width, height);
  test.equal(typeof Field.color, 'function');
  test.equal(Field.color(field, 0, 0), Points.EMPTY);
  Field.color(field, 0, 0, Points.BLUE);
  test.equal(Field.color(field, 0, 0), Points.BLUE);
});

Tinytest.add('Field.owner()', function (test) {
  var field = Field.create(width, height);
  test.equal(typeof Field.owner, 'function');
  test.isNull(Field.owner(field, 0, 0));
  Field.owner(field, 0, 0, Points.BLUE);
  test.equal(Field.owner(field, 0, 0), Points.BLUE);
});

Tinytest.add('Field.captured()', function (test) {
  var field = Field.create(width, height);
  test.equal(typeof Field.captured, 'function');
  test.isFalse(Field.captured(field, 0, 0));
  Field.owner(field, 0, 0, Points.BLUE);
  test.isTrue(Field.captured(field, 0, 0));
});

Tinytest.add('Field.free()', function (test) {
  var field = Field.create(width, height);
  test.equal(typeof Field.free, 'function');
  test.isTrue(Field.free(field, 0, 0));
  Field.owner(field, 0, 0, Points.BLUE);
  test.isFalse(Field.free(field, 0, 0));
});

Tinytest.add('Field.empty()', function (test) {
  var field = Field.create(width, height);
  test.equal(typeof Field.empty, 'function');
  test.isTrue(Field.empty(field, 0, 0));
  Field.color(field, 0, 0, Points.BLUE);
  test.isFalse(Field.empty(field, 0, 0));
});

Tinytest.add('Field.clone()', function (test) {
  var field = Field.create(width, height, value);
  test.equal(typeof Field.clone, 'function');
  var clone = Field.clone(field);
  test.equal(field.width, clone.width);
  test.equal(field.height, clone.height);
  test.equal(field.state.length, clone.state.length);
  for (var i = 0; i < field.state.length; i++) {
    test.equal(field.state[i], clone.state[i]);
  }
});
