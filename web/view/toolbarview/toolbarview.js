var View = require('../view/view.js'),
    UserInlineView = require('../userinlineview/userinlineview.js'),
    ContextMenuView = require('../contextmenuview/contextmenuview.js'),
    util = require('../../service/util.js'),
    User = require('../../model/user.js');

/**
 *	ToolBarView
 *	@constructor
 *	@extend {View}
 */
var ToolBarView = function() {
    View.apply(this, arguments);

    this.$.userInlineView.addEventListener('click', this);
    this.$.linkConfig.addEventListener('click', this);
    this.$.linkCreateProject.addEventListener('click', this);
    this.$.linkSignOut.addEventListener('click', this);

    window.addEventListener('auth.change', this);
};
util.inherits(ToolBarView, View);

ToolBarView.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'auth.change':
            this.onAuthChange(ev);
            break;

        case 'click':
            if (ev.target === this.$.userInlineView) {
                this.onUserInlineViewClick(ev);

            } else if (ev.target === this.$.linkCreateProject) {
                if (app.isAuthed) {
                    this.childViews.contextMenuView.fadeOut();
                    app.setHash(app.authedUser.uri + '/project_create');
                }

            } else if (ev.target === this.$.linkConfig) {
                if (app.isAuthed) {
                    this.childViews.contextMenuView.fadeOut();
                    app.setHash(app.authedUser.uri + '/config');
                }

            } else if (ev.target === this.$.linkSignOut) {
                this.childViews.contextMenuView.fadeOut();
                app.signOut(function() {
                    app.setHash('/signin');
                });
            }
            break;
    }
}

ToolBarView.prototype.onAuthChange = function() {
    this.childViews.userInlineView.setUser(app.authedUser);
};

ToolBarView.prototype.onUserInlineViewClick = function(ev) {
    this.childViews.contextMenuView.fadeIn();

    ev.preventDefault();
    ev.stopPropagation();
};

ToolBarView.setViewConstructor('ToolBarView');

module.exports = ToolBarView;
