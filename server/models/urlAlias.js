/**
 * Url alias Model
 *
 * @module      :: Model
 */

module.exports = function UrlSlugModel(we) {
  return {
    definition: {
      alias: {
        type: we.db.Sequelize.TEXT,
        allowNull: false,
        formFieldType: 'text',
        uniqueAliasName: function (val, cb) {
          if(!val) return cb();
          return we.db.models.urlAlias.findOne({
            where: { alias: val }, attributes: ['id']
          }).then(function (r) {
            if (r) return cb('urlAlias.alias.not-unique');
            cb();
          }).catch(cb);
        }
      },
      target: {
        type: we.db.Sequelize.TEXT,
        allowNull: false,
        formFieldType: 'text',
        uniqueTargetName: function (val, cb) {
          if(!val) return cb();
          return we.db.models.urlAlias.findOne({
            where: { target: val }, attributes: ['id']
          }).then(function (r) {
            if (r) return cb('urlAlias.target.not-unique');
            cb();
          }).catch(cb);
        }
      },
      locale: {
        type: we.db.Sequelize.STRING,
        formFieldType: null
      }
    },

    options: {
      // Model tableName will be the same as the model name
      freezeTableName: true,

      hooks: {
        afterCreate: function(record, opts, done) {
          // cache after create a record
          we.router.alias.cache[record.target] = record;
          done();
        },
        afterUpdate: function(record, opts, done) {
          // cache after udate the record
          we.router.alias.cache[record.target] = record;
          done();
        },
        afterDestroy: function(record, opts, done) {
          delete we.router.alias.cache[record.target];
          done();
        }
      }
    }
  }
}