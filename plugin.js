/**
 * We.js plugin config
 */
var moment = require('moment');

module.exports = function loadPlugin(projectPath, Plugin) {
  var plugin = new Plugin(__dirname);
  // set plugin configs
  plugin.setConfigs({
    // // flag to skip project and plugin install methods
    // skipInstall: false,

    // enable suport to parse req.query.where to sequelize query
    enableQueryWhere: false,
    // update route methods
    updateMethods: ['POST', 'PUT', 'PATCH'],
    // default find limit
    queryDefaultLimit: 25,
    queryMaxLimit: 300,
    // map reponseType response types
    responseTypes: ['html', 'json'],
    // send nested models in response
    sendNestedModels: true,
    // default app permissions
    permissions: require('./lib/acl/corePermissions.json'),

    port: process.env.PORT || '4000',
    hostname: 'http://localhost:' + ( process.env.PORT || '4000' ),
    // default favicon, change in your project config/local.js
    favicon: __dirname + '/files/public/core-favicon.ico',

    appName: 'We.js app',
    appLogo: '/public/plugin/we-core/files/images/logo-small.png',

    defaultUserAvatar: projectPath + '/node_modules/we-core/files/public/images/avatars/user-avatar.png',

    log: { level: 'debug' },
    // we.js url alias feature
    enableUrlAlias: true,

    session: {
      secret: 'setASecreteKeyInYourAppConfig',
      resave: false,
      saveUninitialized: true,
      name: 'wejs.sid',
      rolling: false,
      cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: null
      }
    },
    // body parser settings to use in bodyParser.json()
    bodyParser: { limit: 20000000 },
    // auth settings
    auth : {
      // flags to enable or disable the login and register
      allowLogin: true,
      allowRegister: true,

      requireAccountActivation: true
    },
    acl : { disabled: true },
    passport: {
      // session is required for local strategy
      enableSession: true,

      accessTokenTime: 300000000,
      cookieDomain: 'localhost:' + ( process.env.PORT || '3000' ),
      cookieName: 'weoauth',
      cookieSecure: false,
      expiresTime: 900000, // time to expires token and session

      strategies: {
        // session
        local: {
          Strategy: require('passport-local').Strategy,
          // url to image icon
          icon: '/public/plugin/we-core/files/images/login.png',
          authUrl: '/login',

          usernameField: 'email',
          passwordField: 'password',
          session: true,
          findUser: function findUserAndValidPassword(email, password, done) {
            var we = this.we;
            // build the find user query
            var query = { where: {} };
            query.where[we.config.passport.strategies.local.usernameField] = email;
            // find user in DB
            we.db.models.user.find(query).then (function (user) {
              if (!user) {
                return done(null, false, { message: 'auth.login.wrong.email.or.password' });
              }
              // get the user password
              user.getPassword().then(function (passwordObj) {
                if (!passwordObj)
                  return done(null, false, { message: 'auth.login.user.dont.have.password' });

                passwordObj.validatePassword(password, function (err, isValid) {
                  if (err) return done(err);
                  if (!isValid) {
                    return done(null, false, { message: 'auth.login.user.incorrect.password.or.email' });
                  } else {
                    return done(null, user);
                  }
                });
              })
            });
          }
        }
      }
    },

    // see https://github.com/andris9/nodemailer-smtp-transport for config options
    email: {
      // default mail options
      mailOptions: {
        // by default log emails in console
        sendToConsole: true,
        // default from and to
        from: 'We.js project <contato@wejs.org>', // sender address
        subject: 'A We.js project email', // Subject line
      },
      // connection configs
      port: 25,
      auth: {
        user: '',
        pass: ''
      },
      debug: true,
      ignoreTLS: false,
      name: null,
      // optional params
      // host: 'localhost',
      // secure: 'true',
      // localAddress: '',
      // connectionTimeout: '',
      // greetingTimeout: '',
      // socketTimeout: '',

      // authMethod: '',
      // tls: ''
    },
    // external services API keys
    apiKeys: {
      // add google recaptcha key and secret in project config/local.js file for enable this feature
      // Requires cliend side recaptcha implementation in registration form how is avaible in we-plugin-form
      recaptcha: {
        key: null,
        secret: null
      }
    },
    // node-i18n configs
    i18n: {
      // setup some locales - other locales default to en silently
      locales:[],
      // you may alter a site wide default locale
      defaultLocale: 'en-us',
      // sets a custom cookie name to parse locale settings from  - defaults to NULL
      cookie: 'weLocale',
      // where to store json files - defaults to './locales' relative to modules directory
      directory: projectPath + '/config/locales',
      // whether to write new locale information to disk - defaults to true
      updateFiles: false,
      // what to use as the indentation unit - defaults to "\t"
      indent: '\t',
      // setting extension of json files - defaults to '.json'
      // (you might want to set this to '.js' according to webtranslateit)
      extension: '.json',
      // setting prefix of json files name - default to none ''
      // (in case you use different locale files naming scheme
      // (webapp-en.json), rather then just en.json)
      prefix: '',
      // enable object notation
      objectNotation: false
    },
    clientside: {
      // client side logs
      log: {},
      // publivars
      publicVars: {
        // set to true to enable the page.js partial loader
        dynamicLayout: false
      }
    },
    metadata: {},
    // // theme configs
    themes: {
      // list of all enabled themes how will be load in bootstrap
      enabled: [],
      // default app theme
      app: null,
      // default admin theme
      admin: null
    },
    clientComponentTemplates: { 'components-core': true },
    database: { resetAllData: false },
    // services register
    // { url: '', oauthCallback: '', name: ''}
    services: {},

    date: { defaultFormat: 'L LT' },
    // cache configs
    cache: {
      // resource cache, Last-Modified cache
      resourceCacheActions: 'findOne',
      skipResourceCache: false,
      //Cache-Control: public, max-age=[maxage]
      maxage: 86400000 // one day
    },
    security: {
      // see https://github.com/expressjs/cors#configuration-options for configuration options
      // This may be override by every route configs
      CORS: {
        // block all CORS requests by default
        origin: function(origin, cb){ cb(null, false) },
        // default methods
        methods: ['GET', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
      }
    },
    router: {
      alias: {
        // dont load alias for this routes
        excludePaths: [ '/public', '/favicon.ico', '/admin' ]
      }
    }
  });

  plugin.setLayouts({
    default: __dirname + '/server/templates/default-layout.hbs',
    'user/layout': __dirname + '/server/templates/user/layout.hbs'
  });

  plugin.assets.addCoreAssetsFiles(plugin);

  plugin.events.on('we:express:set:params', function(data) {
    // user pre-loader
    data.express.param('userId', function (req, res, next, id) {
      if (!/^\d+$/.exec(String(id))) return res.notFound();
      data.we.db.models.user.findById(id)
      .then(function (user) {
        if (!user) return res.notFound();
        res.locals.user = user;
        // set user context if userId is the first param
        if (Object.keys(req.params)[0] == 'userId'){
          res.locals.widgetContext = 'user-' + id;
        }

        next();
      });
    });
  })

  /**
   * Convert body data fields to database data tipo
   */
  plugin.hooks.on('we:router:request:after:load:context', function (data, next) {
    var we = data.req.getWe();
    var res = data.res;
    var req = data.req;

    if (data.req.method !== 'POST') return next();
    if (!res.locale) return next();

    if (res.locals.Model && req.body)  {
      res.locals.Model._dateAttributes.forEach(function (d) {
        if (req.body[d]) {
          req.body[d] = moment(req.body[d], we.config.date.defaultFormat).locale('en').format('L LT');
        }
      });
    }
    next();
  });

  return plugin;
};
