var ViewController = require('./ViewController.js'),
    util = require('../Service/util.js'),
    LazyImageViewController = require('./LazyImageViewController.js'),
    User = require('../Model/User.js');

function UserInlineViewController() {
    ViewController.apply(this, arguments);

    this.user = null;
    this.update();

    this.$.link.addEventListener('click', this);
}
util.inherits(UserInlineViewController, ViewController);

UserInlineViewController.prototype.setUser = function(user) {
    this.user = user;
    this.update();
};

UserInlineViewController.prototype.update = function() {
    var user = this.user,
        self = this;

    if (user) {
        this.$.icon.controller.src = user.icon;
        this.$.userName.textContent = user.name;
        this.$.link.href = '#!' + user.uri;

        this.$.root.classList.remove('is-user-nothing');
    } else {
        this.$.root.classList.add('is-user-nothing');
    }
};

UserInlineViewController.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'click':
            this.onClick(ev);
            break;
    }
};

UserInlineViewController.prototype.onClick = function(ev) {
    ev.stopPropagation();

    var event = new CustomEvent('click', {
        cancelable: true
    });
    this.$.root.dispatchEvent(event);

    if (event.defaultPrevented || !this.user) {
        ev.preventDefault();
    }
};

UserInlineViewController.registerController('UserInlineViewController');

module.exports = UserInlineViewController;
