//@include ../service/service/util.js'
//@include ../model/user.js
//@include view.js

var UserView = function() {
    View.call(this);

    this.loadTemplate('UserView');

    this.user = null;
};
extendClass(UserView, View);

UserView.prototype.finalize = function() {
    View.prototype.finalize.call(this);
};

UserView.prototype.setUser = function(user) {
    this.user = user;
};
