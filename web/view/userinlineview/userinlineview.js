var View = require('../view/view.js'),
    util = require('../../service/util.js'),
    LazyImageView = require('../lazyimageview/lazyimageview.js'),
    User = require('../../model/user.js');

function UserInlineView() {
    View.apply(this, arguments);

    this.user = null;
    this.update();

    this.$.link.addEventListener('click', this);
}
util.inherits(UserInlineView, View);

UserInlineView.prototype.setUser = function(user) {
    this.user = user;
    this.update();
};

UserInlineView.prototype.update = function() {
    var user = this.user,
        self = this;

    if (user) {
        this.childViews.icon.src = user.icon;
        this.$.userName.textContent = user.name;
        this.$.link.href = '#!' + user.uri;

        this.$.root.classList.remove('is-user-nothing');
    } else {
        this.$.root.classList.add('is-user-nothing');
    }
};

UserInlineView.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'click':
            this.onClick(ev);
            break;
    }
};

UserInlineView.prototype.onClick = function(ev) {
    ev.stopPropagation();

    var event = new CustomEvent('click', {
        cancelable: true
    });
    this.$.root.dispatchEvent(event);

    if (event.defaultPrevented || !this.user) {
        ev.preventDefault();
    }
};

UserInlineView.setViewConstructor('UserInlineView');

module.exports = UserInlineView;
