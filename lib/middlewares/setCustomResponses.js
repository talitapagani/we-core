/**
 * Custom we.js responses feature
 */

var requireAll = require('require-all');
var path = require('path');

// preload all responses
var responses = requireAll({
  dirname     :  path.resolve( __dirname, '..', 'responses/res'),
  filter      :  /(.+)\.js$/
});

module.exports = function setCustomResponses(req, res, next) {
  for (var response in responses ) {
    res[response] = responses[response].bind({req: req, res: res, next: next});
  }

  return next();
}