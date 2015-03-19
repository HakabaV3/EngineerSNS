var View = require('../view/view.js'),
    ToolBarView = require('../toolbarview/toolbarview.js'),
    SwitchView = require('../switchview/switchview.js'),
    AuthPageView = require('../authpageview/authpageview.js'),
    ProjectPageView = require('../projectpageview/projectpageview.js'),
    ProjectCreatePageView = require('../projectcreatepageview/projectcreatepageview.js'),
    UserPageView = require('../userpageview/userpageview.js'),
    ConfigPageVIew = require('../configpageview/configpageview.js'),
    util = require('../../service/util.js'),
    Auth = require('../../model/auth.js'),
    User = require('../../model/user.js');

function AppView() {
    var self = this;

    View.apply(this, arguments);

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
util.inherits(AppView, View);

AppView.prototype.setHash = function(hashURI) {
    document.location.hash = '#!' + hashURI;
};

/**
 *  check authentication state
 */
AppView.prototype.updateAuthState = function(callback) {
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

AppView.prototype.setAuthedUser = function(user) {
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
AppView.prototype.signUp = function(userName, password, callback) {
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
AppView.prototype.signIn = function(userName, password, callback) {
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
AppView.prototype.signOut = function(callback) {
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
AppView.prototype.routing = function(url) {
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

AppView.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'rout.change':
            this.onRoutChange(ev);
            break;
    }
};

AppView.prototype.onRoutChange = function(ev) {
    var rout = this.rout,
        self = this;

    switch (rout.mode) {
        case 'user':
            this.childViews.switchView
                .fadeTo(this.$.userPageView);
            this.childViews.userPageView.setUserName(rout.userName);
            break;

        case 'config':
            this.childViews.switchView
                .fadeTo(this.$.configPageView);
            this.childViews.configPageView.setUserName(rout.userName);
            break;

        case 'project_create':
            this.childViews.switchView
                .fadeTo(this.$.projectCreatePageView);
            break;

        case 'project':
            this.childViews.switchView
                .fadeTo(this.$.projectPageView);
            this.childViews.projectPageView.setProjectName(rout.userName, rout.projectName);
            break;

        case 'signin':
            this.childViews.switchView
                .fadeTo(this.$.authPageView, function() {
                    self.childViews.authPageView.focus();
                });
            break;

        case 'signup':
            this.childViews.switchView
                .fadeTo(this.$.authPageView);
            break;

        case 'error404':
            this.childViews.switchView
                .fadeTo(this.$.authPageView);
            break;
    }
};

AppView.prototype.onUserInineViewClick = function(ev) {
    this.authedUser = null;
    this.isAuthed = false;
    window.dispatchEvent(new CustomEvent('auth.change'));

    this.childViews.switchView
        .hideDown()
        .fadeIn(this.$.authPageView);
};

AppView.prototype.onHashChange = function(ev) {
    app.rout = app.routing();
};

AppView.setViewConstructor('AppView');

module.exports = AppView;
