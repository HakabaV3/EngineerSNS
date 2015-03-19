//@include ../service/service/util.js'
//@include ../service/apierror.js
//@include view.js

/**
 *  SignUpPageView
 *  @constructor
 *  @extend {View}
 */
var SignUpPageView = function() {
    View.call(this);

    this.loadTemplate('SignUpPageView');

    this.$.form.addEventListener('submit', this.onSubmit = this.onSubmit.bind(this));
    app.on('rout.change', this.onChangeRout, this);
};
extendClass(SignUpPageView, View);

/**
 *  Finalize.
 */
SignUpPageView.prototype.finalize = function() {
    this.$.form.removeEventListener('submit', this.onSubmit);
    this.onSubmit = null;

    app.off('rout.change', this.onChangeRout, this);

    View.prototype.finalize.call(this);
};

/**
 *  Sign up.
 */
SignUpPageView.prototype.signUp = function() {
    var self = this;

    if (!this.validate()) return;

    this.showErrorMessage(null);
    app.signUp(this.$.userName.value, this.$.password.value, function(err, user) {
        self.showErrorMessage(err);

        if (err) {
            return;
        }

        app.setHashAsync(user.uri);
    });
};

/**
 *  Show error message corresponding to error type.
 *  @param {Object} err error object
 */
SignUpPageView.prototype.showErrorMessage = function(err) {
    err = err || APIError.SUCCESS;

    this.$.root.classList.toggle('is-error-used_name', err.code === APIError.Code.USED_NAME);
    this.$.root.classList.toggle('is-error-unknown', err.code === APIError.Code.UNKNOWN);
};

/**
 *  Check if all input forms are validate.
 */
SignUpPageView.prototype.validate = function() {
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
 *  EventListener: Application#on('rout.change')
 *  @param {Object} rout routing data.
 */
SignUpPageView.prototype.onChangeRout = function(rout) {
    var self;

    if (rout.mode !== 'signup') return;

    self = this;
    runAsync(function() {
        self.$.userName.focus();
        self.fire('load');
    });

    this.$.userName.value = '';
    this.$.password.value = '';
};

/**
 *  EventListener: HTMLFormElement#on('submit')
 *  @param {Event} rout routing data.
 */
SignUpPageView.prototype.onSubmit = function(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    this.signUp();
};
