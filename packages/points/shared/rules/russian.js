'use strict';
var Field = Points.Field;

var dx = [0, 1, 0, -1, 1, 1, -1, -1];
var dy = [1, 0, -1, 0, 1, -1, -1, 1];

var FREE = 1 << 1;
var CAPTURED = 1 << 2;

var RussianRules = {};

RussianRules.init = function (game) {
  var rules = game.rules;
  game.field = Field.create(rules.field.width, rules.field.height);
};

RussianRules.check = function (game, move) {
  if (game.status != 'playing') {
    return false;
  }
  if (game.moving != move.color) {
    return false;
  }
  var field = game.field;
  var x = move.x;
  var y = move.y;
  return Field.contains(field, x, y) && Field.empty(field, x, y) && Field.free(field, x, y);
};

RussianRules.apply = function (game, move) {
  var field = game.field;
  Field.color(field, move.x, move.y, move.color);
  var color = move.color;
  var captured = false;
  for (var t = 0; t < 4; t++) {
    var x = move.x + dx[t];
    var y = move.y + dy[t];
    if (processField(game.field, x, y, color)) {
      captured = true;
    }
  }
  // Check for suicide
  var opponentColor = (color == Points.BLUE) ? Points.RED : Points.BLUE;
  if (!captured) {
    processField(game.field, move.x, move.y, opponentColor);
  }
  game.lastMove = move;
  if (game.stopped.blue) {
    game.moving = Points.RED;
  } else if (game.stopped.red) {
    game.moving = Points.BLUE;
  } else {
    game.moving = opponentColor;
  }
  game.score = RussianRules.score(game);
};

RussianRules.score = function (game) {
  var field = game.field;
  var score = {
    blue: 0,
    red: 0
  };

  Field.each(field, function (x, y) {
    if (Field.free(this, x, y)) {
      return;
    }
    if (Field.color(this, x, y) == Points.RED) {
      score.blue++;
    }
    if (Field.color(this, x, y) == Points.BLUE) {
      score.red++;
    }
  });
  return score;
};

function processField(field, sx, sy, color) {
  var used = Field.create(field.width, field.height, 0);
  var enemy = false;
  var Q = [];
  Q.push({x: sx, y: sy});
  while (Q.length != 0) {
    var p = Q.pop();
    var x = p.x;
    var y = p.y;
    if (!Field.contains(field, x, y)) {
      return false;
    }
    if (Field.get(used, x, y)) {
      continue;
    }
    if (Field.color(field, x, y) == color && Field.free(field, x, y)) {
      continue;
    }

    Field.set(used, x, y, CAPTURED);
    if (Field.color(field, x, y) == color) {
      Field.set(used, x, y, FREE);
    } else if (!Field.empty(field, x, y)) {
      enemy = true;
    }

    for (var i = 0; i < 4; i++) {
      Q.push({
        x: x + dx[i],
        y: y + dy[i]
      });
    }
  }
  if (enemy) {
    Field.each(used, function (x, y, value) {
      switch (value) {
        case FREE:
          Field.owner(field, x, y, null);
          break;
        case CAPTURED:
          Field.owner(field, x, y, color);
          break;
        default:
          break;
      }
    });
    return true;
  }
  return false;
}

Points.Rules.russian = RussianRules;
