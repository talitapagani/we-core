var assert = require('assert');
var request = require('supertest');
var helpers = require('we-test-tools').helpers;
var _ = require('lodash');
var http;
var we;

describe('permissionsFeature', function() {
  before(function (done) {
    http = helpers.getHttp();
    we = helpers.getWe();
    done();
  });

  it ('get /admin/permission should return all permissions', function (done){
    request(http)
    .get('/admin/permission')
    .set('Accept', 'application/json')
    .end(function (err, res) {
      if (err) throw err;

      assert(res.body.role);
      assert(res.body.role.length);

      res.body.role.forEach(function (r){
        assert(r.name);
        assert(r.id);
        assert(r.createdAt);
      });

      done();
    });
  });

  describe('Model', function() {
    it('we.acl.addPermissionToRole should add a role to permission', function(done) {
      var roleName = we.acl.roles.owner.name;
      var permissionName = 'user_findOneByUsername';
      we.acl.addPermissionToRole(we, roleName, permissionName, function(err, role) {
        if (err) return done(err);
        assert(role);
        assert(role.permissions);
        assert(role.permissions.indexOf(permissionName) > -1);
        done();
      })
    });

    it('we.acl.removePermissionFromRole should remove a permission from role');
  });
})