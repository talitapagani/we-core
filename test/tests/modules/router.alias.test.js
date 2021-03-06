var assert = require('assert');
var helpers = require('we-test-tools').helpers;
var we;

describe('router.alias', function () {
  before(function (done) {
    we = helpers.getWe();
    done();
  });

  it('should load and cache all alias in initialize', function (done) {
    we.db.models.urlAlias.create({
      alias: '/friends',
      target: '/user'
    }).then(function (alias){
      assert(alias);
      we.router.alias.initialize(we, function (err){
        if (err) throw err;
        assert(we.router.alias.cache['/user']);
        assert.equal(we.router.alias.cache['/user'].id, alias.id);
        done();
      });
    }).catch(done);
  });

  // it('should load and cache all alias in initialize', function (done) {

  // });

});