/**
 * We.js plugin config
 */
var moment = require('moment');

module.exports = function loadPlugin(projectPath, Plugin) {
  var plugin = new Plugin(__dirname);

  // set plugin configs
  plugin.setConfigs({
    queryDefaultLimit: 25,
    queryMaxLimit: 300,
    // default app permissions
    permissions: require('./lib/acl/corePermissions.json'),

    port: process.env.PORT || '3000',
    hostname: 'http://localhost:' + ( process.env.PORT || '3000' ),
    // default favicon, change in your project config/local.js
    favicon: __dirname + '/files/public/core-favicon.ico',

    appName: 'We.js app',
    appLogo: '/public/plugin/we-core/files/images/logo-small.png',

    defaultUserAvatar: projectPath + '/node_modules/we-core/files/public/images/avatars/user-avatar.png',

    log: { level: 'debug' },

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
      requireAccountActivation: true,
      allowUserSignup: true
    },
    acl : { disabled: true },
    passport: {
      accessTokenTime: 300000000,
      cookieDomain: 'localhost:' + ( process.env.PORT || '3000' ),
      cookieName: 'weoauth',
      cookieSecure: false,
      expiresTime: 900000, // time to expires token and session

      strategies: {
        // session
        local: {
          usernameField: 'email',
          passwordField: 'password',
          session: true
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
    apiKeys: {},
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
      publicVars: {}
    },
    metadata: {},
    forms: {
      'login': __dirname + '/server/forms/login.json',
      'register': __dirname + '/server/forms/register.json',
      'forgot-password': __dirname + '/server/forms/forgot-password.json',
      'new-password': __dirname + '/server/forms/new-password.json',
      'change-password': __dirname + '/server/forms/change-password.json'
    },
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
      //Cache-Control: public, max-age=[maxage]
      maxage: 86400000 // one day
    }
  });

  plugin.setResource({
    namePrefix: 'admin.',
    name: 'role',
    namespace: '/admin/permission',
    templateFolderPrefix: 'admin/'
  });

  plugin.setResource({
    namePrefix: 'admin.',
    name: 'user',
    namespace: '/admin',
    templateFolderPrefix: 'admin/',
    findAll: {
      search: {
        id:  {
          parser: 'equal',
          target: {
            type: 'field',
            field: 'id'
          }
        },
        email:  {
          parser: 'equal',
          target: {
            type: 'field',
            model: 'user',
            field: 'email'
          }
        },
        fullName:  {
          parser: 'contains',
          target: {
            type: 'field',
            model: 'user',
            field: 'fullName'
          }
        }
      }
    }
  });

  // set plugin routes
  plugin.setRoutes({
    // homepage | default home page
    'get /': {
      controller: 'main',
      action: 'index',
      template   : 'home/index',
      layoutName : 'home'
    },
    //
    // -- config routes
    //
    'get /api/v1/configs.json': {
      controller: 'main',
      action: 'getConfigsJS',
      responseType  : 'json'
    },
    //
    // - Auth routes
    //
    'get /account': {
      controller: 'auth',
      action: 'current',
      model: 'user'
    },

    'get /signup': {
      controller: 'auth',
      action: 'signup',
      template: 'auth/register',
      titleHandler  : 'i18n',
      titleI18n: 'Register'
    },

    'post /signup': {
      controller: 'auth',
      action: 'signup',
      template: 'auth/register',
      titleHandler  : 'i18n',
      titleI18n: 'Register'
    },

    // form login
    'get /login': {
      controller: 'auth',
      action: 'login',
      titleHandler  : 'i18n',
      titleI18n: 'Login',
      template: 'auth/login'
    },
    // form login / post
    'post /login': {
      controller: 'auth',
      action: 'login',
      titleHandler  : 'i18n',
      titleI18n: 'Login',
      template: 'auth/login'
    },

    // api login
    'post /auth/login': {
      controller    : 'auth',
      action        : 'login'
    },

    '/auth/logout': {
      controller    : 'auth',
      action        : 'logout'
    },

    // form to get one time login email
    'get /auth/forgot-password': {
      titleHandler  : 'i18n',
      titleI18n     : 'auth.forgot-password',
      controller    : 'auth',
      action        : 'forgotPassword',
      template      : 'auth/forgot-password'
    },
    // post for get new password link
    'post /auth/forgot-password': {
      titleHandler  : 'i18n',
      titleI18n     : 'auth.forgot-password',
      controller    : 'auth',
      action        : 'forgotPassword',
      template      : 'auth/forgot-password'
    },

    'get /auth/:id([0-9]+)/reset-password/:token': {
      controller: 'auth',
      action: 'consumeForgotPasswordToken'
    },

    'get /api/v1/auth/check-if-can-reset-password': {
      controller: 'auth',
      action: 'checkIfCanResetPassword',
      responseType  : 'json'
    },

    // change password
    'post /auth/change-password': {
      titleHandler  : 'i18n',
      titleI18n     : 'auth.change-password',
      controller    : 'auth',
      action        : 'changePassword',
      template      : 'auth/change-password'
    },
    'get /auth/change-password': {
      titleHandler  : 'i18n',
      titleI18n     : 'auth.change-password',
      controller    : 'auth',
      action        : 'changePassword',
      template      : 'auth/change-password'
    },

    // activate
    'get /user/:id([0-9]+)/activate/:token':{
      controller    : 'auth',
      action        : 'activate'
    },

    'post /auth/auth-token':{
      controller    : 'auth',
      action        : 'authToken'
    },

    // new password
    'get /auth/:id([0-9]+)/new-password': {
      titleHandler  : 'i18n',
      titleI18n     : 'auth.new-password',
      controller    : 'auth',
      action        : 'newPassword',
      template      : 'auth/new-password'
    },
    'post /auth/:id([0-9]+)/new-password': {
      titleHandler  : 'i18n',
      titleI18n     : 'auth.new-password',
      controller    : 'auth',
      action        : 'newPassword',
      template      : 'auth/new-password'
    },

    //
    // -- User routes
    //
    // 'get /user/:username?': {
    //   controller    : 'user',
    //   action        : 'findOneByUsername',
    //   model         : 'user',
    //   permission    : 'find_user'
    // },
    'get /user': {
      controller    : 'user',
      action        : 'find',
      model         : 'user',
      permission    : 'find_user'
    },

    'get /user/:id([0-9]+)': {
      controller    : 'user',
      action        : 'findOne',
      model         : 'user',
      permission    : 'find_user'
    },
    'post /user': {
      controller    : 'user',
      action        : 'create',
      model         : 'user',
      permission    : 'create_user'
    },
    'get /user/:userId([0-9]+)/edit': {
      controller    : 'user',
      action        : 'edit',
      model         : 'user',
      permission    : 'update_user'
    },
    'post /user/:userId([0-9]+)/edit': {
      controller    : 'user',
      action        : 'edit',
      model         : 'user',
      permission    : 'update_user'
    },
    'delete /user/:userId([0-9]+)': {
      controller    : 'user',
      action        : 'destroy',
      model         : 'user',
      permission    : 'delete_user'
    },

    //
    // -- ROLES
    //
    // add user role
    'get /admin/user/:userId([0-9]+)/roles': {
      titleHandler  : 'i18n',
      titleI18n     : 'admin.user.roles',
      controller    : 'role',
      action        : 'updateUserRoles',
      model         : 'user',
      permission    : 'manage_role',
      template      : 'admin/role/updateUserRoles'
    },
    'post /admin/user/:userId([0-9]+)/roles': {
      titleHandler  : 'i18n',
      titleI18n     : 'admin.user.roles',
      controller    : 'role',
      action        : 'updateUserRoles',
      model         : 'user',
      permission    : 'manage_role',
      template      : 'admin/role/updateUserRoles'
    },
    //
    // Widget
    //
    'get /api/v1/widget/:id([0-9]+)/form': {
      controller    : 'widget',
      action        : 'getForm',
      model         : 'widget',
      permission    : 'manage_widget',
      skipWidgets   : true,
    },
    'get /api/v1/widget-types': {
      controller    : 'widget',
      action        : 'getSelectWidgetTypes',
      model         : 'widget',
      permission    : true,// widget type list is public
      responseType  : 'json'
    },
    'get /api/v1/widget-form/:theme/:layout/:type': {
      controller    : 'widget',
      action        : 'getCreateForm',
      model         : 'widget',
      permission    : true,// public
    },
    // sort widget API
    'get /api/v1/widget-sort/:theme/:layout/:regionName': {
      controller    : 'widget',
      action        : 'sortWidgets',
      model         : 'widget',
      permission    : 'manage_widget',
      template      : 'widget/sortWidgets',
      responseType  : 'modal'
    },
    'post /api/v1/widget-sort/:theme/:layout/:regionName': {
      controller    : 'widget',
      action        : 'sortWidgets',
      model         : 'widget',
      permission    : 'manage_widget',
      template      : 'widget/sortWidgets',
      responseType  : 'modal'
    },

    'get /api/v1/widget': {
      controller    : 'widget',
      action        : 'find',
      model         : 'widget',
      skipWidgets   : true,
      permission    : true
    },
    'post /api/v1/widget': {
      controller    : 'widget',
      action        : 'create',
      model         : 'widget',
      skipWidgets   : true,
      permission    : 'manage_widget'
    },
    'get /api/v1/widget/:id([0-9]+)': {
      controller    : 'widget',
      action        : 'findOne',
      model         : 'widget',
      skipWidgets   : true,
      permission    : true
    },
    'post /api/v1/widget/:id([0-9]+)': {
      controller    : 'widget',
      action        : 'update',
      model         : 'widget',
      skipWidgets   : true,
      permission    : 'manage_widget'
    },
    'post /api/v1/widget/:id([0-9]+)/delete': {
      controller    : 'widget',
      action        : 'destroy',
      model         : 'widget',
      permission    : 'manage_widget'
    },
    'get /api/v1/routes': {
      controller: 'main',
      action: 'getRoutes',
      permission    : true,
      responseType: 'json'
    },
    // - admin
    'get /admin': {
      controller    : 'admin',
      action        : 'index',
      permission    : 'access_admin'
    },
    //
    // -- Permissions
    'get /admin/permission': {
      titleHandler  : 'i18n',
      titleI18n     : 'permission_manage',
      name          : 'permission_manage',
      controller    : 'permission',
      action        : 'manage',
      template      : 'admin/permission/index',
      permission    : 'manage_permissions',
    },

    'post /admin/role/:roleName/permissions/:permissionName': {
      controller    : 'role',
      action        : 'addPermissionToRole',
      model         : 'role',
      permission    : 'manage_permissions',
    },
    'delete /admin/role/:roleName/permissions/:permissionName': {
      controller    : 'role',
      action        : 'removePermissionFromRole',
      model         : 'role',
      permission    : 'manage_permissions',
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
      data.we.db.models.user.findById(id).then(function (user) {
        if (!user) return res.notFound();
        res.locals.user = user;
        next();
      });
    })
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
