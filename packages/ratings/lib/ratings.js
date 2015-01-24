Rating = {};

function K(rating) {
  return 32;
}

function Q(rating) {
  return Math.exp(rating/400);
}

/**
 * Returns initial player rating.
 * @returns {number}
 */
Rating.initial = function () {
  return 500;
};

/**
 * Calculate new ratings.
 * @param {number} blue - Rating of red player.
 * @param {number} red - Rating of red player.
 * @param {number} score - Score of blue player -- 1 for win, 0 for lose, 0.5 for draw.
 * @returns {{blue: number, red: number}} - Expected scores for players.
 */
Rating.calc = function (blue, red, score) {
  var expected = Rating.expected(blue, red);
  return {
    blue: blue + K(blue) * (score - expected.blue),
    red: red + K(red) * ((1 - score) - expected.red)
  }
};

/**
 * Calculate expected scores for players.
 * @param {number} blue - Rating of red player.
 * @param {number} red - Rating of red player.
 * @returns {{blue: number, red: number}} - New ratings for players.
 */
Rating.expected = function (blue, red) {
  var qBlue = Q(blue);
  var qRed = Q(red);
  var denominator = qBlue + qRed;
  return {
    blue: qBlue/denominator,
    red: qRed/denominator
  }
};
