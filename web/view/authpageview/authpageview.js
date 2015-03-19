var View = require('../view/view.js'),
    CardView = require('../cardview/cardview.js'),
    AuthView = require('../authview/authview.js'),
    util = require('../../service/util.js');

function AuthPageView() {
    View.apply(this, arguments);
}
util.inherits(AuthPageView, View);

AuthPageView.prototype.focus = function() {
    this.childViews.authView.focus();
}

AuthPageView.prototype.handleEvent = function(ev) {
    switch (ev.type) {

    }
}
AuthPageView.setViewConstructor('AuthPageView');

module.exports = AuthPageView;
