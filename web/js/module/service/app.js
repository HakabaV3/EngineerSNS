//@include ../view/baseview.js
//@include ../model/user.js
//@include ../model/auth.js
//@include apierror.js
//@include util.js

/**
 *  @constructor
 */
var Application = function() {};
extendClass(Application, EventDispatcher);

Application.prototype.init = function() {
    var self = this;

    /**
     *  @NOTE singleton
     */
    if (Application.instance) return Application.instance;
    Application.instance = this;

    EventDispatcher.call(this);

    /**
     *  The result of url routing.
     *  @type {Object}
     */
    this.rout = this.routing();

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

    this.baseView = new BaseView();
    this.baseView.appendTo(document.body);

    window.addEventListener('hashchange', this.onHashChange.bind(this));

    this.updateAuthState(function() {
        self.onHashChange();
    })
};

/**
 *  check authentication state
 */
Application.prototype.updateAuthState = function(callback) {
    var self = this;

    /**
     *  @TODO LocalStorageからtoken取り出す
     */

    User.getMe(function(err, me) {
        if (err) {
            self.setAuthedUser(null);
            callback(err, null);
            return;
        }

        self.setAuthedUser(new User(me));
        callback(null, me);
    });
};

Application.prototype.setAuthedUser = function(user) {
    if (this.authedUser === user) return;

    if (user) {
        this.isAuthed = true;
        this.authedUser = user;
    } else {
        this.isAuthed = false;
        this.authedUser = null;
    }

    this.fire('auth.change',
        this.isAuthed,
        this.authedUser
    );
};

/**
 *  Sign in.
 */
Application.prototype.signIn = function(userName, password, callback) {
    var self = this;

    Auth.signIn(userName, password, function(err, user) {

        if (err) {
            self.setAuthedUser(null);
            return callback(err, null);
        }

        self.setAuthedUser(user);
        callback(null, user);
    });
};

/**
 *  Sign up.
 *  @param {string} userName userName.
 *  @param {string} password password.
 *  @param {Function} callback callback.
 */
Application.prototype.signUp = function(userName, password, callback) {
    var self = this;

    Auth.signUp(userName, password, function(err, user) {

        if (err) {
            self.setAuthedUser(null);
            return callback(err, null);
        }

        self.setAuthedUser(user);
        callback(null, user);
    });
};

/**
 *  Change url asyncrounously.
 *  @param {string} url url.
 */
Application.prototype.setURLAsync = function(url) {
    setTimeout(function() {
        document.location.href = url;
    }, 0);
};

/**
 *  Change url hash asyncrounously.
 *  @param {string} hash hash.
 */
Application.prototype.setHashAsync = function(hash) {
    setTimeout(function() {
        document.location.hash = '#!' + hash;
    }, 0);
};

/** 
 *  check rout
 *  @param {string} [url] URL if elipsis, it is 'document.localtion.href'.
 *  @return {Object} parameters of rout
 */
Application.prototype.routing = function(url) {
    var controller,
        params = null,
        ma;

    url = url || window.location.hash.substr(2);

    if (url === '') {
        if (this.isAuthed) {
            params = {
                mode: 'user',
                userName: this.authedUser.name
            };
        } else {
            params = {
                mode: 'signin'
            };
        }

    } else if (url === '/signup') {
        params = {
            mode: 'signup'
        };

    } else if (url === '/signin') {
        // /signin
        params = {
            mode: 'signin'
        };

    } else if (ma = url.match(/^\/user\/([^\/]+)$/)) {
        // /user/:userName
        params = {
            mode: 'user',
            userName: ma[1]
        };

    } else if (ma = url.match(/^\/user\/([^\/]+)\/project\/([^\/]+)$/)) {
        // /user/:userName/project/:projectName
        params = {
            mode: 'project',
            userName: ma[1],
            projectName: ma[2]
        };

    } else {
        //  no match.
        params = {
            mode: 'error404'
        }
    }

    return params;
};

Application.prototype.onHashChange = function() {
    this.rout = this.routing()
    this.fire('rout.change', this.rout);
};
