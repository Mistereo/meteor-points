'use strict';

var EMPTY      = 1 << 0;
var BLUE       = 1 << 1;
var RED        = 1 << 2;
var OWNER_BLUE = 1 << 3;
var OWNER_RED  = 1 << 4;
var COLOR_BITS = EMPTY | BLUE | RED;
var OWNER_BITS = OWNER_BLUE | OWNER_RED;

var Field = {};

Field.create = function (width, height, value) {
  var field = {
    state: [],
    width: width,
    height: height
  };
  for (var i = 0; i < field.width * field.height; i++) {
    if (arguments.length == 3) {
      field.state.push(value);
    } else {
      field.state.push(EMPTY);
    }
  }
  return field;
};

Field.id = function (field, x, y) {
  return y * field.width + x;
};

Field.contains = function (field, x, y) {
  return 0 <= x && x < field.width && 0 <= y && y < field.height;
};

Field.each = function (field, func) {
  for (var i = 0; i < field.state.length; i++) {
    var x = i % field.width;
    var y = Math.floor(i / field.width);
    func.call(field, x, y, field.state[i]);
  }
};

Field.get = function (field, x, y) {
  var id = Field.id(field, x, y);
  return field.state[id];
};

Field.set = function (field, x, y, value) {
  var id = Field.id(field, x, y);
  field.state[id] = value;
  return field;
};

Field.color = function (field, x, y, color) {
  if (arguments.length === 4) {
    return Field.setColor(field, x, y, color);
  }
  return Field.getColor(field, x, y);
};
Field.getColor = function (field, x, y) {
  var data = Field.get(field, x, y);
  if ((data & BLUE)) {
    return Points.BLUE;
  }
  if ((data & RED)) {
    return Points.RED;
  }
  return Points.EMPTY;
};
Field.setColor = function (field, x, y, color) {
  var data = Field.get(field, x, y) & ~COLOR_BITS;
  switch (color) {
    case Points.BLUE:
      data |= BLUE;
      break;
    case Points.RED:
      data |= RED;
      break;
    default:
      data |= EMPTY;
      break;
  }
  Field.set(field, x, y, data);
};

Field.owner = function (field, x, y, owner) {
  if (arguments.length === 4) {
    return Field.setOwner(field, x, y, owner);
  }
  return Field.getOwner(field, x, y);
};
Field.getOwner = function (field, x, y) {
  var data = Field.get(field, x, y);
  if ((data & OWNER_BLUE)) {
    return Points.BLUE;
  }
  if ((data & OWNER_RED)) {
    return Points.RED;
  }
  return null;
};
Field.setOwner = function (field, x, y, owner) {
  var data = Field.get(field, x, y) & ~OWNER_BITS;
  switch (owner) {
    case Points.BLUE:
      data |= OWNER_BLUE;
      break;
    case Points.RED:
      data |= OWNER_RED;
      break;
    default:
      break;
  }
  Field.set(field, x, y, data);
};

Field.captured = function (field, x, y) {
  return (Field.owner(field, x, y) !== null);
};

Field.free = function (field, x, y) {
  return (Field.owner(field, x, y) === null);
};

Field.empty = function (field, x, y) {
  return (Field.color(field, x, y) === Points.EMPTY);
};

Field.clone = function (field) {
  var clone = Field.create(field.width, field.height);
  for (var i = 0; i < field.state.length; i++) {
    clone.state[i] = field.state[i];
  }
  return clone;
};

Points.Field = Field;
