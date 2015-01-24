Accounts.onCreateUser(function (options, user) {
  user.rating = Rating.initial();
  user.wins = 0;
  user.loses = 0;
  user.draws = 0;
  return user;
});

Accounts.addAutopublishFields({
  forLoggedInUser: ['rating', 'wins', 'loses', 'draws'],
  forOtherUsers: ['rating', 'wins', 'loses', 'draws']
});
