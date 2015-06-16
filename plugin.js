/**
 * We.js plugin config
 */

module.exports = function loadPlugin(projectPath, Plugin) {
  var plugin = new Plugin(__dirname);

  // set plugin configs
  plugin.setConfigs({
    // default app permissions
    permissions: require('./lib/acl/corePermissions.json'),
    // default group permissions
    groupPermissions: {
      public: require('./lib/acl/group/publicPermissions.json'),
      private: require('./lib/acl/group/privatePermissions.json'),
      hidden: require('./lib/acl/group/hiddenPermissions.json')
    },
    groupRoles: ['manager', 'moderator', 'member'],

    port: process.env.PORT || '3000',
    hostname: 'http://localhost:' + ( process.env.PORT || '3000' ),
    // default favicon, change in your project config/local.js
    favicon: __dirname + '/files/public/core-favicon.ico',

    appName: 'We.js app',
    appLogo: '/public/plugin/we-core/files/images/logo-small.png',

    defaultUserAvatar: projectPath + '/node_modules/we-core/files/public/images/avatars/user-avatar.png',

    defaultCommentLimit: 3,

    log: {
      level: 'debug'
    },

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
    auth : {
      requireAccountActivation: true,
      allowUserSignup: true
    },
    acl : {
      disabled: true
    },
    passport: {
      accessTokenTime: 300000000,
      cookieDomain: 'localhost:' + ( process.env.PORT || '3000' ),
      cookieName: 'weoauth',
      cookieSecure: false,

      strategies: {
        bearer: true,
        // session
        local: {
          usernameField: 'email',
          passwordField: 'password'
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

    // node-i18n configs
    i18n: {
      // setup some locales - other locales default to en silently
      locales:['en-us', 'pt-br'],
      // you may alter a site wide default locale
      defaultLocale: 'pt-br',
      // sets a custom cookie name to parse locale settings from  - defaults to NULL
      cookie: 'weLocale',
      // where to store json files - defaults to './locales' relative to modules directory
      directory: projectPath + '/config/locales',
      // whether to write new locale information to disk - defaults to true
      updateFiles: true,
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
      log: {

      },
      // publivars
      publicVars: {}
    },
    metadata: {},

    flag: {
      available: {
        like: {}
      }
    },

    database: {
      resetAllData: false
    }
  });
  // set plugin routes
  plugin.setRoutes({
    // homepage | default home page
    'get /': {
      controller: 'main',
      action: 'index'
    },

    //
    // -- config routes
    //
    'get /api/v1/configs.json': {
      controller: 'main',
      action: 'getConfigsJS',
      responseType  : 'json'
    },

    'get /api/v1/translations.js': {
      controller: 'main',
      action: 'getTranslations',
      responseType  : 'json',
      permission    : true
    },

    // ember.js models generated from sails.js models
    'get /api/v1/models/emberjs': {
      controller: 'main',
      action: 'getAllModelsAsEmberModel',
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
      action: 'signupPage'
    },

    'post /signup': {
      controller: 'auth',
      action: 'signup'
      //view: 'users/signup'
    },

    'post /api/v1/signup': {
      controller: 'auth',
      action: 'signup'
      //view: 'users/signup'
    },

    // form login
    'get /login': {
      controller: 'auth',
      action: 'loginPage'
    },
    // form login / post
    'post /login': {
      controller: 'auth',
      action: 'login'
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
      controller    : 'auth',
      action        : 'forgotPasswordPage'
    },

    // post for get new password link
    'post /auth/forgot-password': {
      controller    : 'auth',
      action        : 'forgotPassword'
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
    'post /change-password':{
      controller    : 'auth',
      action        : 'changePassword'
    },
    'get /change-password':{
      controller    : 'auth',
      action        : 'changePasswordPage'
    },

    // activate

    // 'get /api/v1/auth/callback/:access_token?':{
    //   controller    : 'auth',
    //   action        : 'oauth2Callback'
    // },

    'get /user/:id([0-9]+)/activate/:token':{
      controller    : 'auth',
      action        : 'activate'
    },

    'post /auth/auth-token':{
      controller    : 'auth',
      action        : 'authToken'
    },

    // new password
    'post /auth/new-password':{
      controller    : 'auth',
      action        : 'newPassword'
    },
    'get /auth/:id([0-9]+)/new-password':{
      controller    : 'auth',
      action        : 'newPasswordPage'
    },

    //
    // -- User routes
    //
    'get /user/:username?': {
      controller    : 'user',
      action        : 'findOneByUsername',
      model         : 'user',
      permission    : 'find_user'
    },
    'get /user': {
      controller    : 'user',
      action        : 'find',
      model         : 'user',
      permission    : 'find_user'
    },
    // get logged in user avatar
    'get /avatar/:id([0-9]+)': {
      controller    : 'avatar',
      action        : 'getAvatar',
      permission    : 'find_user'
    },
    'get /user/:userId([0-9]+)/membership': {
      controller    : 'group',
      action        : 'findUserGroups',
      model         : 'membership'
    },
    // find groups to user
    'get /user/:userId([0-9]+)/find-new-groups': {
      controller    : 'group',
      action        : 'findNewGroupsToUser',
      model         : 'group'
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
    'put /user/:id([0-9]+)': {
      controller    : 'user',
      action        : 'update',
      model         : 'user',
      permission    : 'update_user'
    },
    'delete /user/:id([0-9]+)': {
      controller    : 'user',
      action        : 'destroy',
      model         : 'user',
      permission    : 'delete_user'
    },
    'post /api/v1/user/:id([0-9]+)/avatar': {
      controller    : 'avatar',
      action        : 'changeAvatar',
      model         : 'user',
      loadRecord    :  true,
      permission    : 'update_user'
    },

    //
    // -- ROLES
    //

    'get /role/:id([0-9]+)': {
      controller    : 'role',
      action        : 'findOne',
      model         : 'role'
    },
    'get /role': {
      controller    : 'role',
      action        : 'find',
      model         : 'role'
    },
    'post /role': {
      controller    : 'role',
      action        : 'create',
      model         : 'role',
      permission    : 'manage_role'
    },
    'put /role/:id([0-9]+)': {
      controller    : 'role',
      action        : 'update',
      model         : 'role',
      permission    : 'manage_role'
    },
    'delete /role/:id([0-9]+)': {
      controller    : 'role',
      action        : 'destroy',
      model         : 'role',
      permission    : 'manage_role'
    },
    // add user role
    'post /user/:id([0-9]+)/role': {
      controller    : 'role',
      action        : 'addRoleToUser',
      model         : 'user',
      permission    : 'manage_role'
    },
    // remove role in user
    'delete /user/:id([0-9]+)/role': {
      controller    : 'role',
      action        : 'removeRoleFromUser',
      model         : 'user',
      permission    : 'manage_role'
    },

    //
    // -- Permissions

    'get /permission': {
      controller    : 'permission',
      action        : 'find',
      responseType  : 'json'
    },

    'post /role/:roleName/permissions/:permissionName': {
      controller    : 'role',
      action        : 'addPermissionToRole',
      model         : 'role',
      permission    : 'manage_permissions',
    },

    // -- FOLLOW
    // get
    // example: /api/v1/follow/post/1/2?flagType=follow
    'get /api/v1/follow/:model/:modelId([0-9]+)?': {
      controller    : 'follow',
      action        : 'isFollowing',
      responseType  : 'json',
      permission    : 'use_follow'
    },

    // create
    // example: /api/v1/follow/post/1/2?flagType=follow
    'post /api/v1/follow/:model/:modelId([0-9]+)': {
      controller    : 'follow',
      action        : 'follow',
      responseType  : 'json',
      permission    : 'use_follow'
    },

    // delete
    // example: /api/v1/follow/post/1/2?flagType=follow
    'delete /api/v1/follow/:model/:modelId([0-9]+)': {
      controller    : 'follow',
      action        : 'unFollow',
      responseType  : 'json',
      permission    : 'use_follow'
    },

    // -- FLAG

    // get
    // example: /api/v1/flag/post/1/2?flagType=follow
    'get /api/v1/flag/:model/:modelId?/:userId?': {
      controller    : 'flag',
      action        : 'getModelFlags',
      responseType  : 'json',
      permission    : 'use_flag'
    },
    // create
    // example: /api/v1/flag/post/1/2?flagType=follow
    'post /api/v1/flag/:model/:modelId': {
      controller    : 'flag',
      action        : 'flag',
      responseType  : 'json',
      permission    : 'use_flag'
    },

    // delete
    // example: /api/v1/flag/post/1/2?flagType=follow
    'delete /api/v1/flag/:model/:modelId': {
      controller    : 'flag',
      action        : 'unFlag',
      responseType  : 'json',
      permission    : 'use_flag'
    },

    // GROUPS
    //

    'post /api/v1/group/:groupId([0-9]+)/addContent/:contentModelName/:contentId': {
      controller    : 'group',
      action        : 'addContent',
      model         : 'group',
      responseType  : 'json',
      groupPermission : 'add_content'
    },

    'delete /api/v1/group/:groupId([0-9]+)/addContent/:contentModelName/:contentId': {
      controller    : 'group',
      action        : 'removeContent',
      model         : 'group',
      responseType  : 'json',
      groupPermission : 'remove_content'
    },

    'get /api/v1/group/:groupId([0-9]+)/content': {
      controller    : 'group',
      action        : 'findAllContent',
      model         : 'group',
      responseType  : 'json',
      groupPermission : 'find_content'
    },

    'get /api/v1/group/:groupId([0-9]+)/content/:contentModelName': {
      controller    : 'group',
      action        : 'findContentByType',
      model         : 'group',
      responseType  : 'json',
      groupPermission : 'find_content'
    },

    'post /api/v1/group/:groupId([0-9]+)/join': {
      controller    : 'group',
      action        : 'join',
      model         : 'group',
      responseType  : 'json'
    },
    'post /api/v1/group/:groupId([0-9]+)/leave': {
      controller    : 'group',
      action        : 'leave',
      model         : 'group',
      responseType  : 'json'
    },
    'get /group/:groupId([0-9]+)/member': {
      controller    : 'group',
      action        : 'findMembers',
      model         : 'membership',
      responseType  : 'json',
      groupPermission : 'find_members'
    },
    'post /group/:groupId([0-9]+)/member': {
      controller    : 'group',
      action        : 'inviteMember',
      model         : 'membership',
      responseType  : 'json',
      groupPermission : 'manage_members'
    },
    'post /group/:groupId([0-9]+)/accept-invite/': {
      controller    : 'group',
      action        : 'acceptInvite',
      model         : 'membership',
      responseType  : 'json'
    },
    'get /group/:groupId([0-9]+)/role': {
      controller    : 'group',
      action        : 'findRoles',
      responseType  : 'json',
      groupPermission : 'find_members'
    },
    'get /group/:id([0-9]+)': {
      controller    : 'group',
      action        : 'findOne',
      model         : 'group',
      permission    : 'find_group'
    },
    'get /group': {
      controller    : 'group',
      action        : 'find',
      model         : 'group',
      permission    : 'find_group'
    },
    'post /group': {
      controller    : 'group',
      action        : 'create',
      model         : 'group',
      permission    : 'create_group'
    },
    'put /group/:id([0-9]+)': {
      controller    : 'group',
      action        : 'update',
      model         : 'group',
      permission    : 'update_group'
    },
    'delete /group/:id([0-9]+)': {
      controller    : 'group',
      action        : 'destroy',
      model         : 'group',
      permission    : 'delete_group'
    },
    'get /group/:groupId([0-9]+)/members/invites': {
      controller    : 'membershipinvite',
      action        : 'find',
      model         : 'membershipinvite',
      groupPermission    : 'manage_members'
    },

    // Activity
    'get /group/:groupId([0-9]+)/activity': {
      controller    : 'activity',
      action        : 'findGroupActivity',
      model         : 'activity',
      responseType  : 'json',
      permission    : 'find_activity'
    },
    'get /activity/:id([0-9]+)': {
      controller    : 'activity',
      action        : 'findOne',
      model         : 'activity',
      permission    : 'find_activity'
    },
    'get /activity': {
      controller    : 'activity',
      action        : 'find',
      model         : 'activity',
      permission    : 'find_activity'
    },

    // Page
    'get /page/:id([0-9]+)': {
      controller    : 'page',
      action        : 'findOne',
      model         : 'page',
      permission    : 'find_page'
    },
    'get /page': {
      controller    : 'page',
      action        : 'find',
      model         : 'page',
      permission    : 'find_page'
    },
    'post /page': {
      controller    : 'page',
      action        : 'create',
      model         : 'page',
      permission    : 'create_page'
    },
    'put /page/:id([0-9]+)': {
      controller    : 'page',
      action        : 'update',
      model         : 'page',
      permission    : 'update_page'
    },
    'delete /page/:id([0-9]+)': {
      controller    : 'page',
      action        : 'destroy',
      model         : 'page',
      permission    : 'delete_page'
    },

    // Comment
    'get /comment/:id([0-9]+)': {
      controller    : 'comment',
      action        : 'findOne',
      model         : 'comment',
      permission    : 'find_comment'
    },
    'get /comment': {
      controller    : 'comment',
      action        : 'find',
      model         : 'comment',
      permission    : 'find_comment'
    },
    'post /comment': {
      controller    : 'comment',
      action        : 'create',
      model         : 'comment',
      permission    : 'create_comment'
    },
    'put /comment/:id([0-9]+)': {
      controller    : 'comment',
      action        : 'update',
      model         : 'comment',
      permission    : 'update_comment'
    },
    'delete /comment/:id([0-9]+)': {
      controller    : 'comment',
      action        : 'destroy',
      model         : 'comment',
      permission    : 'delete_comment'
    },

    // Term
    'get /api/v1/term-texts': {
      controller    : 'term',
      action        : 'findTermTexts',
      model         : 'term',
      responseType  : 'json'
    },
    'get /term/:id([0-9]+)': {
      controller    : 'term',
      action        : 'findOne',
      model         : 'term',
      permission    : 'find_term'
    },
    'get /term': {
      controller    : 'term',
      action        : 'find',
      model         : 'term',
      permission    : 'find_term'
    },
    'post /term': {
      controller    : 'term',
      action        : 'create',
      model         : 'term',
      permission    : 'create_term'
    },
    'put /term/:id([0-9]+)': {
      controller    : 'term',
      action        : 'update',
      model         : 'term',
      permission    : 'update_term'
    },
    'delete /term/:id([0-9]+)': {
      controller    : 'term',
      action        : 'destroy',
      model         : 'term',
      permission    : 'delete_term'
    },

    // vocabulary
    'get /vocabulary/:id([0-9]+)': {
      controller    : 'vocabulary',
      action        : 'findOne',
      model         : 'vocabulary',
      permission    : 'find_vocabulary'
    },

    'get /vocabulary': {
      controller    : 'vocabulary',
      action        : 'find',
      model         : 'vocabulary',
      permission    : 'find_vocabulary'
    },
    'post /vocabulary': {
      controller    : 'vocabulary',
      action        : 'create',
      model         : 'vocabulary',
      permission    : 'create_vocabulary'
    },
    'put /vocabulary/:id([0-9]+)': {
      controller    : 'vocabulary',
      action        : 'update',
      model         : 'vocabulary',
      permission    : 'update_vocabulary'
    },
    'delete /vocabulary/:id([0-9]+)': {
      controller    : 'vocabulary',
      action        : 'destroy',
      model         : 'vocabulary',
      permission    : 'delete_vocabulary'
    },

    //
    // POST
    //
    'get /post/:id([0-9]+)': {
      controller    : 'post',
      action        : 'findOne',
      model         : 'post',
      permission    : 'find_post'
    },
    'get /post': {
      controller    : 'post',
      action        : 'find',
      model         : 'post',
      permission    : 'find_post'
    },
    'post /post': {
      controller    : 'post',
      action        : 'create',
      model         : 'post',
      permission    : 'create_post'
    },
    'put /post/:id([0-9]+)': {
      controller    : 'post',
      action        : 'update',
      model         : 'post',
      permission    : 'update_post'
    },
    'delete /post/:id([0-9]+)': {
      controller    : 'post',
      action        : 'destroy',
      model         : 'post',
      permission    : 'delete_post'
    },

    //
    // Widget
    //
    'get /api/v1/widget/:id([0-9]+)': {
      controller    : 'widget',
      action        : 'findOne',
      model         : 'widget',
      permission    : true
    },
    'get /api/v1/widget/:id([0-9]+)/form': {
      controller    : 'widget',
      action        : 'getForm',
      model         : 'widget',
      permission    : 'update_widget'
    },
    'get /api/v1/widget-form/:theme/:layout/:type': {
      controller    : 'widget',
      action        : 'getCreateForm',
      model         : 'widget',
      permission    : 'create_widget'
    },
    'get /api/v1/widget': {
      controller    : 'widget',
      action        : 'find',
      model         : 'widget',
      permission    : true
    },
    'post /api/v1/widget-sort': {
      controller    : 'widget',
      action        : 'sortWidgets',
      model         : 'widget',
      permission    : 'update_widget'
    },
    'post /api/v1/widget': {
      controller    : 'widget',
      action        : 'create',
      model         : 'widget',
      permission    : 'create_widget'
    },
    'put /api/v1/widget/:id([0-9]+)': {
      controller    : 'widget',
      action        : 'update',
      model         : 'widget',
      permission    : 'update_widget'
    },
    'delete /api/v1/widget/:id([0-9]+)': {
      controller    : 'widget',
      action        : 'destroy',
      model         : 'widget',
      permission    : 'delete_widget'
    },
    'get /admin/structure/theme/:name/layout/:layout': {
      controller    : 'widget',
      action        : 'updateThemeLayout',
      permission    : 'update_theme'
    },

    // - admin
    'get /admin': {
      controller    : 'admin',
      action        : 'index',
      permission    : 'access_admin'
    }
  });

  plugin.setHelpers({
    'render-metadata-tags': __dirname + '/lib/view/template-helpers/render-metadata-tags.js',
    'render-stylesheet-tags': __dirname + '/lib/view/template-helpers/render-stylesheet-tags.js',
    'render-javascript-tags': __dirname + '/lib/view/template-helpers/render-javascript-tags.js',
    'render-bootstrap-config': __dirname + '/lib/view/template-helpers/render-bootstrap-config.js',
    'render-import-polymer-app': __dirname + '/lib/view/template-helpers/render-import-polymer-app.js',
    't':  __dirname + '/lib/view/template-helpers/t.js',
    'form':  __dirname + '/lib/view/template-helpers/form.js',
    'widget-wrapper': __dirname + '/lib/view/template-helpers/widget-wrapper.js',
    'layout': __dirname + '/lib/view/template-helpers/layout.js',
    'region': __dirname + '/lib/view/template-helpers/region.js',
    'link-to': __dirname + '/lib/view/template-helpers/link-to.js',
  });

  plugin.setLayouts({
    default: __dirname + '/server/templates/default-layout.hbs'
  });

  plugin.setTemplates({
    'region': __dirname + '/server/templates/region.hbs',
    '400': __dirname + '/server/templates/400.hbs',
    '403': __dirname + '/server/templates/403.hbs',
    '404': __dirname + '/server/templates/404.hbs',
    '500': __dirname + '/server/templates/500.hbs'
  });

  plugin.setWidgets({
    html: __dirname + '/server/widgets/html'
  });

  plugin.events.on('we:express:set:params', function(data) {
    // group pre-loader
    data.express.param('groupId', function (req, res, next, id) {
      if (!/^\d+$/.exec(String(id))) return res.notFound();
      data.we.db.models.group.findById(id).then(function(group) {
        if (!group) return res.notFound();
        res.locals.group = group;

        if (!req.user) return next();

        data.we.db.models.membership.find({
          where: {
            memberId: req.user.id
          }
        }).then(function(membership) {
          res.locals.membership = membership;
          req.membership = membership;

          next();
        }).catch(next);
      });
    });
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

  return plugin;
};
