var View = require('../view/view.js'),
    ButtonView = require('../buttonview/buttonview.js'),
    util = require('../../service/util.js'),
    Auth = require('../../model/auth.js');

function AuthView() {
    View.apply(this, arguments);

    this.$.submit.addEventListener('click', this);
}
util.inherits(AuthView, View);

AuthView.prototype.focus = function() {
    var userName = this.$.userName,
        value = userName.value;

    userName.focus();

    if (value.length > 0) {
        userName.selectionStart = 0;
        userName.selectionEnd = value.length;
    }
};

AuthView.prototype.signIn = function() {
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

AuthView.prototype.validate = function() {
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

AuthView.prototype.setDisabled = function(disabled) {
    this.$.userName.disabled =
        this.$.password.disabled =
        this.$.submit.disabled = disabled;
};
AuthView.prototype.__defineSetter__('disabled', AuthView.prototype.setDisabled);

AuthView.prototype.getDisabled = function() {
    return this.$.userName.disabled;
};
AuthView.prototype.__defineGetter__('disabled', AuthView.prototype.getDisabled);

AuthView.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'click':
            this.onSubmitClick(ev);
            break;
    }
};

AuthView.prototype.onSubmitClick = function(ev) {
    if (this.disabled) return;

    ev.stopPropagation();
    ev.preventDefault();

    this.signIn();
};

AuthView.setViewConstructor('AuthView');

module.exports = AuthView;
