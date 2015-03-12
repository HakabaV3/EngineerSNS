//@include ../service/util.js
//@include ../model/user.js
//@include view.js

var UserInlineView = function() {
    View.call(this);

    this.loadTemplate('UserInlineView');

    this.user = null;
};
extendClass(UserInlineView, View);

UserInlineView.prototype.finalize = function() {
    View.prototype.finalize.call(this);
};

UserInlineView.prototype.setUser = function(user) {
    this.user = user;
};
