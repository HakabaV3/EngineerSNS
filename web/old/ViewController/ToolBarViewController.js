var ViewController = require('./ViewController.js'),
    UserInlineViewController = require('./UserInlineViewController.js'),
    ContextMenuViewController = require('./ContextMenuViewController.js'),
    util = require('../Service/util.js'),
    User = require('../Model/User.js');

var ToolBarViewController = function() {
    ViewController.apply(this, arguments);

    this.$.userInlineView.addEventListener('click', this);
    this.$.linkConfig.addEventListener('click', this);
    this.$.linkCreateProject.addEventListener('click', this);
    this.$.linkSignOut.addEventListener('click', this);

    window.addEventListener('auth.change', this);
};
util.inherits(ToolBarViewController, ViewController);

ToolBarViewController.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'auth.change':
            this.onAuthChange(ev);
            break;

        case 'click':
            if (ev.target === this.$.userInlineView) {
                this.onUserInlineViewClick(ev);

            } else if (ev.target === this.$.linkCreateProject) {
                if (app.isAuthed) {
                    this.$.contextMenuView.controller.fadeOut();
                    app.setHash(app.authedUser.uri + '/project_create');
                }

            } else if (ev.target === this.$.linkConfig) {
                if (app.isAuthed) {
                    this.$.contextMenuView.controller.fadeOut();
                    app.setHash(app.authedUser.uri + '/config');
                }

            } else if (ev.target === this.$.linkSignOut) {
                this.$.contextMenuView.controller.fadeOut();
                app.signOut(function() {
                    app.setHash('/signin');
                });
            }
            break;
    }
}

ToolBarViewController.prototype.onAuthChange = function() {
    this.$.userInlineView.controller.setUser(app.authedUser);
};

ToolBarViewController.prototype.onUserInlineViewClick = function(ev) {
    this.$.contextMenuView.controller.fadeIn();

    ev.preventDefault();
    ev.stopPropagation();
};

ToolBarViewController.registerController('ToolBarViewController');

module.exports = ToolBarViewController;
