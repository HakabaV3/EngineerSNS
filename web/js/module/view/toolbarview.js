//@include ../service/util.js
//@include ../model/user.js
//@include view.js

/**
 *	ToolBarView
 *	@constructor
 *	@extend {View}
 */
var ToolBarView = function() {
    View.call(this);

    this.loadTemplate('ToolBarView');

    app.on('auth.change', this.onChangeAuth, this);

    this.checkAuthState();
};

extendClass(ToolBarView, View);

/**
 *	Finalize.
 */
ToolBarView.prototype.finalize = function() {
    app.off('auth.change', this.onChangeAuth, this);

    View.prototype.finalize.call(this);
};

/**
 *	Check authentication state.
 */
ToolBarView.prototype.checkAuthState = function() {
    if (app.isAuthed) {
        this.$.root.classList.add('is-authed');
    } else {
        this.$.root.classList.remove('is-authed');
    }

    this.childViews.userInlineView.setUser(app.authedUser);
};

/**
 *	EventListener: Application#on('auth.change')
 *	@param {boolean} isAuthed isAuthed.
 *	@param {User} authedUser authedUser.
 */
ToolBarView.prototype.onChangeAuth = function(isAuthed, authedUser) {
    this.checkAuthState();
};
