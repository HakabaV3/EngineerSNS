//@include ../view/build/baseview.js
//@include ../model/user.js
//@include util.js

/**
 *  @constructor
 */
var Application = function() {
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

    this.updateAuthState();

    /**
     *  @NOTE
     *  appが存在しないと、イベントリスニングができないので、
     *  viewは非同期で生成する
     */
    setTimeout(function() {
        React.render(React.createElement(BaseView, null), document.body);
    }, 0);

    window.addEventListener('hashchange', this.onHashChange.bind(this));
};
extendClass(Application, EventDispatcher);

/**
 *  Event names
 *  @enum {string}
 */
Application.Event = {
    CHANGE_AUTH_STATE: 'CHANGE_AUTH_STATE',
    CHANGE_ROUT: 'CHANGE_ROUT'
};

/**
 *  check authentication state
 */
Application.prototype.updateAuthState = function() {
    var self = this;

    /**
     *  @TODO LocalStorageからtoken取り出す
     */

    API.User.me(function(err, me) {
        if (err) {
            self.isAuthed = false;
            self.authedUser = null;
        } else {
            self.isAuthed = true;
            self.authedUser = me;
        }

        self.fire(
            Application.Event.CHANGE_AUTH_STATE,
            self.isAuthed,
            self.authedUser
        );
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

    if (url === '/signup') {
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
            mode: 'error'
        }
    }

    return params;
};

Application.prototype.onHashChange = function() {
    this.rout = this.routing()
    this.fire(Application.Event.CHANGE_ROUT, this.rout);
};
