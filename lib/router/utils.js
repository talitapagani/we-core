var utils = {};

utils.getRoutePath = function getRoutePath(r) {
  var path = [ r.config.path ];

  if (r.parentRoute) {
    getParentPath(r.parentRoute)
  }

  function getParentPath(p) {
    if (p.type == 'resource') {
      path.push(':' + p.config.model + 'Id');
    }

    path.push(p.config.path);

    if (p.parentRoute) {
      getParentPath(p.parentRoute)
    }
  }

  return path.reverse().join('/');
}

module.exports = utils;