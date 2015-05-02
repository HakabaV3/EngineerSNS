var ViewController = require('./ViewController.js'),
    ToolBarViewController = require('./ToolBarViewController.js'),
    SwitchViewController = require('./SwitchViewController.js'),
    AuthPageViewController = require('./AuthPageViewController.js'),
    ProjectPageViewController = require('./ProjectPageViewController.js'),
    ProjectCreatePageViewController = require('./ProjectCreatePageViewController.js'),
    UserPageViewController = require('./UserPageViewController.js'),
    ConfigPageViewController = require('./ConfigPageViewController.js'),
    util = require('../Service/util.js'),
    Auth = require('../Model/Auth.js'),
    User = require('../Model/User.js');

function AppViewController() {
    var self = this;

    ViewController.apply(this, arguments);

    /**
     *  The result of url routing.
     *  @type {Object}
     */
    this.rout;

    /**
     *  Authentication state.
     *  @type {boolean}
     */
    this.isAuthed = false;

    /**
     *  Authenticated user.
     *  @type {User}
     */
    this.authedUser = null;

    this.updateAuthState();

    window.addEventListener('hashchange', this.onHashChange);
    window.addEventListener('rout.change', this);
    window.app = this;

    this.routing();
}
util.inherits(AppViewController, ViewController);

AppViewController.prototype.setHash = function(hashURI) {
    document.location.hash = '#!' + hashURI;
};

/**
 *  check authentication state
 */
AppViewController.prototype.updateAuthState = function(callback) {
    var self = this;

    /**
     *  @TODO LocalStorageからtoken取り出す
     */

    User.getMe(function(err, me) {
        if (err) {
            self.setAuthedUser(null);
            util.isFunction(callback) && callback(err, null);
            return;
        }

        self.setAuthedUser(new User(me));
        util.isFunction(callback) && callback(null, me);
    });
};

AppViewController.prototype.setAuthedUser = function(user) {
    if (this.authedUser === user) return;

    if (user) {
        this.isAuthed = true;
        this.authedUser = user;
    } else {
        this.isAuthed = false;
        this.authedUser = null;
    }

    window.dispatchEvent(new CustomEvent('auth.change'));
};

/**
 *  Sign up.
 */
AppViewController.prototype.signUp = function(userName, password, callback) {
    var self = this;

    Auth.signUp(userName, password, function(err, user) {

        if (err) {
            self.setAuthedUser(null);
            util.isFunction(callback) && callback(err, null);
            return;
        }

        self.setAuthedUser(user);
        util.isFunction(callback) && callback(null, user);
    });
};

/**
 *  Sign in.
 */
AppViewController.prototype.signIn = function(userName, password, callback) {
    var self = this;

    Auth.signIn(userName, password, function(err, user) {

        if (err) {
            self.setAuthedUser(null);
            util.isFunction(callback) && callback(err, null);
            return;
        }

        self.setAuthedUser(user);
        util.isFunction(callback) && callback(null, user);
    });
};

/**
 *  Sign out.
 */
AppViewController.prototype.signOut = function(callback) {
    var self = this;

    Auth.signOut(function() {
        self.setAuthedUser(null);
        util.isFunction(callback) && callback(null);
    });
};


/**
 *  check rout
 *  @param {string} [url] URL if elipsis, it is 'document.localtion.href'.
 *  @return {Object} parameters of rout
 */
AppViewController.prototype.routing = function(url) {
    var controller,
        rout = null,
        ma;

    url = url || window.location.hash.substr(2);

    if (url === '' || url === '/') {
        if (this.isAuthed) {
            rout = {
                mode: 'user',
                userName: this.authedUser.name
            };
        } else {
            rout = {
                mode: 'signin'
            };
        }

    } else if (url === '/signup') {
        rout = {
            mode: 'signup'
        };

    } else if (url === '/signin') {
        // /signin
        rout = {
            mode: 'signin'
        };

    } else if (ma = url.match(/^\/user\/([^\/]+)\/config$/)) {
        // /user/:userName/config
        rout = {
            mode: 'config',
            userName: ma[1]
        };

    } else if (ma = url.match(/^\/user\/([^\/]+)\/project_create$/)) {
        // /user/:userName/project_create
        rout = {
            mode: 'project_create',
            userName: ma[1]
        };

    } else if (ma = url.match(/^\/user\/([^\/]+)\/project\/([^\/]+)$/)) {
        // /user/:userName/project/:projectName
        rout = {
            mode: 'project',
            userName: ma[1],
            projectName: ma[2]
        };

    } else if (ma = url.match(/^\/user\/([^\/]+)$/)) {
        // /user/:userName
        rout = {
            mode: 'user',
            userName: ma[1]
        };

    } else {
        //  no match.
        rout = {
            mode: 'error404'
        }
    }

    this.rout = rout;

    window.dispatchEvent(new Event('rout.change'));
};

AppViewController.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'rout.change':
            this.onRoutChange(ev);
            break;
    }
};

AppViewController.prototype.onRoutChange = function(ev) {
    var rout = this.rout,
        self = this;

    switch (rout.mode) {
        case 'user':
            this.$.switchView.controller
                .fadeTo(this.$.userPageView);
            this.$.userPageView.controller.setUserName(rout.userName);
            break;

        case 'config':
            this.$.switchView.controller
                .fadeTo(this.$.configPageView);
            this.$.configPageView.controller.setUserName(rout.userName);
            break;

        case 'project_create':
            this.$.switchView.controller
                .fadeTo(this.$.projectCreatePageView);
            break;

        case 'project':
            this.$.switchView.controller
                .fadeTo(this.$.projectPageView);
            this.$.projectPageView.controller.setProjectName(rout.userName, rout.projectName);
            break;

        case 'signin':
            this.$.switchView.controller
                .fadeTo(this.$.authPageView, function() {
                    self.$.authPageView.controller.focus();
                });
            break;

        case 'signup':
            this.$.switchView.controller
                .fadeTo(this.$.authPageView);
            break;

        case 'error404':
            this.$.switchView.controller
                .fadeTo(this.$.authPageView);
            break;
    }
};

AppViewController.prototype.onUserInineViewControllerClick = function(ev) {
    this.authedUser = null;
    this.isAuthed = false;
    window.dispatchEvent(new CustomEvent('auth.change'));

    this.$.switchView.controller
        .hideDown()
        .fadeIn(this.$.authPageView);
};

AppViewController.prototype.onHashChange = function(ev) {
    app.rout = app.routing();
};

AppViewController.registerController('AppViewController');

module.exports = AppViewController;
