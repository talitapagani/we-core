var _ = require('lodash');

var JSONAPI = {};

JSONAPI.middleware = function middleware(req, res, next) {
  if (!res.locals.data) return next();

  if (res.locals.data && res.locals.model) {
    res.locals.response.data = res.locals.data[res.locals.model];
  }

  if (res.locals.data.meta) {
    res.locals.response.meta = res.locals.data.meta;
  }

  res.locals.response.links = {
    self: req.getRequestPath()
  }

  return next();
}

module.exports = JSONAPI;