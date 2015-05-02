var ViewController = require('./ViewController.js'),
    ButtonViewController = require('./ButtonViewController.js'),
    util = require('../Service/util.js'),
    Auth = require('../Model/Auth.js');

function AuthViewController() {
    ViewController.apply(this, arguments);

    this.$.submit.addEventListener('click', this);
}
util.inherits(AuthViewController, ViewController);

AuthViewController.prototype.focus = function() {
    var userName = this.$.userName,
        value = userName.value;

    userName.focus();

    if (value.length > 0) {
        userName.selectionStart = 0;
        userName.selectionEnd = value.length;
    }
};

AuthViewController.prototype.signIn = function() {
    var userName = this.$.userName.value,
        password = this.$.password.value,
        self = this;

    if (!this.validate()) return;

    this.disabled = true;

    app.signIn(userName, password, function(err, user) {
        self.disabled = false;

        if (err) {
            self.$.root.classList.add('is-error-invalid');
            self.focus();
        } else {
            self.$.userName.value = '';
            self.$.password.value = '';
            app.setHash(user.uri);
        }
    });
};

AuthViewController.prototype.validate = function() {
    var userName = this.$.userName.value,
        password = this.$.password.value,
        isValid = true,
        classList = this.$.root.classList;

    classList.remove('is-error-invalid');

    if (!password) {
        isValid = false;
        classList.add('is-error-password');
        this.$.password.focus();
    } else {
        classList.remove('is-error-password');
    }

    if (!userName) {
        isValid = false;
        classList.add('is-error-userName');
        this.$.userName.focus();
    } else {
        classList.remove('is-error-userName');
    }

    return isValid;
};

AuthViewController.prototype.setDisabled = function(disabled) {
    this.$.userName.disabled =
        this.$.password.disabled =
        this.$.submit.disabled = disabled;
};
AuthViewController.prototype.__defineSetter__('disabled', AuthViewController.prototype.setDisabled);

AuthViewController.prototype.getDisabled = function() {
    return this.$.userName.disabled;
};
AuthViewController.prototype.__defineGetter__('disabled', AuthViewController.prototype.getDisabled);

AuthViewController.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'click':
            this.onSubmitClick(ev);
            break;
    }
};

AuthViewController.prototype.onSubmitClick = function(ev) {
    if (this.disabled) return;

    ev.stopPropagation();
    ev.preventDefault();

    this.signIn();
};

AuthViewController.registerController('AuthViewController');

module.exports = AuthViewController;
