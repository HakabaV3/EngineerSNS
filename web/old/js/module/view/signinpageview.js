//@include ../service/service/util.js'
//@include ../model/user.js
//@include ../model/auth.js
//@include view.js

/**
 *  SignInPageView
 *  @constructor
 *  @extend {View}
 */
var SignInPageView = function() {
    View.call(this);

    this.loadTemplate('SignInPageView');

    this.$.form.addEventListener('submit', this.onSubmit = this.onSubmit.bind(this));
    app.on('rout.change', this.onChangeRout, this);
    app.on('auth.change', this.onChangeAuth, this);
};
extendClass(SignInPageView, View);

/**
 *  Finalize.
 */
SignInPageView.prototype.finalize = function() {
    this.$.form.removeEventListener('submit', this.onSubmit);
    this.onSubmit = null;

    app.off('rout.change', this.onChangeRout, this);
    app.off('auth.change', this.onChangeAuth, this);

    View.prototype.finalize.call(this);
};

SignInPageView.prototype.signIn = function() {
    var self = this;
    if (!this.validate()) return;

    this.showErrorMessage(null);
    app.signIn(this.$.userName.value, this.$.password.value, function(err, user) {
        self.showErrorMessage(err);

        if (err) {
            return;
        }

        app.setHashAsync(user.uri);
    });
}

/**
 *  Show error message corresponding to error type.
 *  @param {Object} err error object
 */
SignInPageView.prototype.showErrorMessage = function(err) {
    err = err || APIError.SUCCESS;

    this.$.root.classList.toggle('is-error-invalid_parameter', err.code === APIError.Code.INVALID_PARAMETER);
    this.$.root.classList.toggle('is-error-unknown', err.code === APIError.Code.UNKNOWN);
};

/**
 *  Check if all input forms are validate.
 */
SignInPageView.prototype.validate = function() {
    var userName = this.$.userName.value,
        password = this.$.password.value,
        isValidate = true;

    if (!password) {
        isValidate = false;
        this.$.password.classList.add('is-error');
        this.$.password.focus();
    } else {
        this.$.password.classList.remove('is-error');
    }

    if (!userName) {
        isValidate = false;
        this.$.userName.classList.add('is-error');
        this.$.userName.focus();
    } else {
        this.$.userName.classList.remove('is-error');
    }

    return isValidate;
};

/**
 *  Check authentication state.
 */
SignInPageView.prototype.checkAuthState = function() {
    var self = this;

    if (app.isAuthed) {
        this.$.root.classList.add('is-authed');
        this.childViews.userInlineView.setUser(app.authedUser);
    } else {
        this.$.root.classList.remove('is-authed');
        this.childViews.userInlineView.setUser(null);
    }

};

/**
 *  EventListener: Application#on("rout.change")
 *  @param {Object} rout routing data.
 */
SignInPageView.prototype.onChangeRout = function(rout) {
    var self;

    if (rout.mode !== 'signin') return;

    this.checkAuthState();

    self = this;
    runAsync(function() {
        self.fire('load');
        self.$.userName.focus();
    });

    this.$.userName.value = '';
    this.$.password.value = '';
};

/**
 *  EventListener: Application#on("auth.change")
 *  @param {boolean} isAuthed isAuthed.
 *  @param {User} authedUser authedUser
 */
SignInPageView.prototype.onChangeAuth = function(isAuthed, authedUser) {
    this.checkAuthState();
};

/**
 *  EventListener: HTMLFormElement#on("submit")
 *  @param {Event} ev event object.
 */
SignInPageView.prototype.onSubmit = function(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    this.signIn();
};
