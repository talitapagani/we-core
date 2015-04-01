var assert = require('assert');
var request = require('supertest');
var helpers = require('../../helpers');
var stubs = require('../../stubs');
var _ = require('lodash');
var async = require('async');
var http;
var we;

describe('termFeature', function () {
  var salvedPage, salvedUser, salvedUserPassword, salvedVocabulary, savedTerms;

  before(function (done) {
    http = helpers.getHttp();
    we = helpers.getWe();

    async.series([
      function (done) {
        var userStub = stubs.userStub();
        helpers.createUser(userStub, function(err, user) {
          if (err) throw new Error(err);

          salvedUser = user;
          salvedUserPassword = userStub.password;

          var pageStub = stubs.pageStub(user.id);
          we.db.models.page.create(pageStub)
          .done(function (err, p) {
            if (err) return done(err);

            we.term.updateModelTerms(
              pageStub.tags, 'page', p.id,
              'tags',
              we.db.models.page.options.termFields.tags,
            function(err, tags) {
              if (err) return done(err);
              p.dataValues.tags = tags;
              salvedPage = p;
              return done();
            });
          })
        });
      },
      function createVocabulary(done) {
        var vocabularyStub = stubs.vocabularyStub(salvedUser.id);
        we.db.models.vocabulary.create(vocabularyStub)
        .done(function(err, v){
          if (err) return done(err);
          salvedVocabulary = v;
          done();
        });
      },
      function createTerms(done) {
        var termsStub = stubs.termsStub(
          salvedUser.id, salvedVocabulary.id
        );
        we.db.models.term.bulkCreate(termsStub)
        .done(function(){
          we.db.models.term.find()
          .done(function(err, ts){
            if (err) return done(err);

            savedTerms = ts;
            done();
          })
        });
      }
    ], done);
  });

  describe('find', function () {
    it('get /page route should find pages with salved tags and categories', function(done){

      request(http)
      .get('/page')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        assert.equal(200, res.status);
        assert(res.body.page);
        assert( _.isArray(res.body.page) , 'page not is array');
        assert(res.body.meta);

        var hasPageTags = false;
        res.body.page.forEach(function(page) {
          if (page.id == salvedPage.id) {
            if (_.isEqual(page.tags, salvedPage.dataValues.tags) ) {
              hasPageTags = true;
            }
          }
        });
        assert(hasPageTags, 'Dont has page tags!');

        done();
      });
    });
  });

  describe('create', function () {

    it('post /page create one page record with tags', function(done) {
      var pageStub = stubs.pageStub(salvedUser.id);

      request(http)
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

        var hasAllTags = true;
        for (var i = pageStub.tags.length - 1; i >= 0; i--) {
          if ( res.body.page[0].tags.indexOf(pageStub.tags[i]) == -1 ) {
            hasAllTags = false;
            break;
          }
        }
        assert(hasAllTags, 'Have all tags');

        assert(
          res.body.page[0].categories.indexOf('Saúde') >-1,
          'Has category Saúde'
        );

        assert(
          res.body.page[0].categories.indexOf('Saúde') -1,
          'Dont have the category Entreterimento'
        );

        done();
      });
    });
  });

  describe('update', function () {
    it('put /page/:id should upate page terms and return page with new terms', function(done){
      var newTitle = 'my new title';

      var newTags = [
        'Futebol',
        'Ze ramalho',
        'Valderrama'
      ];

      var newCategories = [
        'Universe'
      ];

      request(http)
      .put('/page/' + salvedPage.id)
      .send({
        title: newTitle,
        tags: newTags,
        categories: newCategories
      })
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) return done(err);
        assert.equal(200, res.status);
        assert(res.body.page);
        assert(res.body.page[0].title, newTitle);
        salvedPage.title = newTitle;

        we.db.models.modelsterms.findAll({
          where: {
            modelName: 'page',
            modelId: salvedPage.id,
            field: 'tags'
          },
          include: [{ all: true,  attributes: ['text'] }]
        }).done(function(err, result) {
          if (err) return done(err);

          var terms = result.map(function(modelterm) {
            return modelterm.get().term.get().text;
          });

          assert( _.isEqual(newTags, terms) );

          we.db.models.modelsterms.findAll({
            where: {
              modelName: 'page',
              modelId: salvedPage.id,
              field: 'categories'
            },
            include: [{ all: true,  attributes: ['text'] }]
          }).done(function(err, result) {
            if (err) return done(err);

            var terms = result.map(function(modelterm) {
              return modelterm.get().term.get().text;
            });

            assert( _.isEqual(newCategories, terms) );

            return done();
          });
        })

      });
    });
  });


  describe('destroy', function () {
    it('delete /page/:id should delete one page and all related modelsterms assoc', function(done){

      request(http)
      .delete('/page/' + salvedPage.id)
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) return done(err);
        assert.equal(204, res.status);

        we.db.models.modelsterms.findAll({
          where: {
            modelName: 'page',
            modelId: salvedPage.id,
            field: 'tags'
          }
        }).done(function(err, result) {
          if (err) return done(err);
          assert(_.isEmpty(result));
          return done();
        })
      })
    });
  });
});