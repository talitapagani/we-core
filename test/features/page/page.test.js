var assert = require('assert');
var request = require('supertest');
var helpers = require('../../helpers');
var stubs = require('../../stubs');
var _ = require('lodash');
var http;
var we;

describe('pageFeature', function () {
  var salvedPage, salvedUser, salvedUserPassword;
  var authenticatedRequest;

  before(function (done) {
    http = helpers.getHttp();
    we = helpers.getWe();

    var userStub = stubs.userStub();
    helpers.createUser(userStub, function(err, user) {
      if (err) throw new Error(err);

      salvedUser = user;
      salvedUserPassword = userStub.password;

      // login user and save the browser
      authenticatedRequest = request.agent(http);
      authenticatedRequest.post('/login')
      .set('Accept', 'application/json')
      .send({
        email: salvedUser.email,
        password: salvedUserPassword
      })
      .expect(200)
      .set('Accept', 'application/json')
      .end(function (err, res) {

        var pageStub = stubs.pageStub(user.id);
        we.db.models.page.create(pageStub)
        .done(function (err, p) {
          if (err) return done(err);

          salvedPage = p;

          done();
        })

      });

    });
  });

  describe('find', function () {
    it('get /page route should find one page', function(done){
      request(http)
      .get('/page')
      .set('Accept', 'application/json')
      .end(function (err, res) {

        console.log('res.body',res.body);
        assert.equal(200, res.status);
        assert(res.body.data);
        assert( _.isArray(res.body.data) , 'page not is array');
        assert(res.body.meta);
        assert(res.body.links);

        done();
      });
    });
  });

  describe('create', function () {

    it('post /page create one page record', function(done) {
      var pageStub = stubs.pageStub(salvedUser.id);

      authenticatedRequest
      .post('/page')
      .send(pageStub)
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) return done(err);

        assert.equal(201, res.status);
        assert(res.body.page);
        assert(res.body.page[0].title, pageStub.title);
        assert(res.body.page[0].about, pageStub.about);
        assert(res.body.page[0].body, pageStub.body);
        done();
      });
    });
  });

  describe('findOne', function () {
    it('get /page/:id should return one page', function(done) {

      request(http)
      .get('/page/' + salvedPage.id)
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) return done(err);

        console.log('res.body>',res.body);

        assert.equal(200, res.status);
        assert(res.body.data);
        assert(res.body.data.title, salvedPage.title);
        assert(res.body.data.about, salvedPage.about);
        assert(res.body.data.body, salvedPage.body);
        assert(res.body.links);

        done();
      });
    });
  });

  describe('update', function () {
    it('put /page/:id should upate and return page', function(done){
      var newTitle = 'my new title';

      authenticatedRequest
      .put('/page/' + salvedPage.id)
      .send({
        title: newTitle
      })
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) return done(err);
        assert.equal(200, res.status);
        assert(res.body.page);
        assert(res.body.page[0].title, newTitle);

        salvedPage.title = newTitle;
        done();
      });
    });
  });

  describe('destroy', function () {
    it('delete /page/:id should delete one page', function(done){
      var pageStub = stubs.pageStub(salvedUser.id);
      we.db.models.page.create(pageStub)
      .done(function (err, p) {
        if (err) return done(err);
        authenticatedRequest
        .delete('/page/' + p.id)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          if (err) return done(err);
          assert.equal(204, res.status);

          we.db.models.page.find(p.id).done( function(err, page){
            if (err) return done(err);

            assert.equal(page, null);
            done();
          })
        });
      })
    });
  });
});
