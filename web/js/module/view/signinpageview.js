//@include ../service/util.js
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
    app.on('rout.change', this.onChangeRout = this.onChangeRout.bind(this));
    app.on('auth.change', this.onChangeAuth = this.onChangeAuth.bind(this));
};
extendClass(SignInPageView, View);

/**
 *  Finalize.
 */
SignInPageView.prototype.finalize = function() {
    this.$.form.removeEventListener('submit', this.onSubmit);
    this.onSubmit = null;

    app.off('rout.change', this.onChangeRout);
    this.onChangeRout = null;

    app.off('auth.change', this.onChangeAuth);
    this.onChangeAuth = null;

    View.prototype.finalize.call(this);
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
    if (!app.isAuthed) return;

    this.childViews.userInlineView.setUser(app.authedUser);
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
    setTimeout(function() {
        self.$.userName.focus();
    });

    this.userName = '';
    this.password = '';
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

    if (!this.validate()) return;

    app.signIn(this.$.userName.value, this.$.password.value, function(err, user) {
        app.setHashAsync(user.uri);
    });
};
