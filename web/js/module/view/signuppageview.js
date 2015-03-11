//@include ../service/util.js
//@include view.js

var SignUpPageView = function() {
    View.call(this);

    this.loadTemplate('SignUpPageView');

    this.userName = '';
    this.password = '';

    this.$.form.addEventListener('submit', this.onSubmit = this.onSubmit.bind(this));
    app.on('rout.change', this.onChangeRout = this.onChangeRout.bind(this));
};
extendClass(SignUpPageView, View);

SignUpPageView.prototype.finalize = function() {
    this.$.form.removeEventListener('submit', this.onSubmit);
    this.onSubmit = null;

    app.off('rout.change', this.onChangeRout);
    this.onChangeRout = null;

    View.prototype.finalize.call(this);
};

SignUpPageView.prototype.signUp = function() {
    var userName, password;

    if (!this.validate()) return;

    userName = this.$.userName.value;
    password = this.$.password.value;

    //@TODO
    console.log('サインアップ処理(NIY)');
};

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

SignUpPageView.prototype.onChangeRout = function(rout) {
    var self;

    if (rout.mode !== 'signup') return;

    self = this;
    setTimeout(function() {
        self.$.userName.focus();
    });

    this.userName = '';
    this.password = '';
};

SignUpPageView.prototype.onSubmit = function(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    this.signUp();
};
