var _ = require('underscore');

var actions = [
  "GET_CONFIDENCE"
];

var hash = {};

_.forEach(actions, function(action) {
  hash[action] = action;
});

module.exports = hash;

