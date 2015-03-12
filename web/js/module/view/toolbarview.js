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

    /**
     *	Authed user.
     *	@type {User}
     */
    this.authedUser = null;

    this.loadTemplate('ToolBarView');

    app.on('auth.change', this.onChangeAuth = this.onChangeAuth.bind(this));
};

extendClass(ToolBarView, View);

/**
 *	Finalize.
 */
ToolBarView.prototype.finalize = function() {
    app.off('auth.change', this.onChangeAuth);
    this.onChangeAuth = null;

    View.prototype.finalize.call(this);
};

/**
 *	EventListener: Application#on('auth.change')
 *	@param {boolean} isAuthed isAuthed.
 *	@param {User} authedUser authedUser.
 */
ToolBarView.prototype.onChangeAuth = function(isAuthed, authedUser) {
    this.authedUser = authedUser;
};
