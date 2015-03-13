//@include ../service/util.js
//@include ../model/comment.js
//@include ../model/user.js
//@include listitemview.js

var CommentListItemView = function() {
    ListItemView.call(this);

    this.loadTemplate('CommentListItemView');

    this.comment = null;

    this.$.deleteLink.addEventListener('click', this.onDeleteLinkClick = this.onDeleteLinkClick.bind(this));
    app.on('auth.change', this.onChangeAuth, this);
};
extendClass(CommentListItemView, ListItemView);

CommentListItemView.prototype.finalize = function() {
    this.$.deleteLink.removeEventListener('click', this.onDeleteLinkClick);
    this.onDeleteLinkClick = null;

    app.off('auth.change', this.onChangeAuth, this);

    ListItemView.prototype.finalize.call(this);
};

CommentListItemView.prototype.setModel = function(comment) {
    var self = this;

    this.comment = comment;
    this.checkOwner();

    if (comment) {
        User.getByName(comment.owner, function(err, user) {
            self.childViews.userInlineView.setUser(user);
        });
    }
};

CommentListItemView.prototype.checkOwner = function() {
    var isOwner = (
        this.comment &&
        app.isAuthed &&
        app.authedUser.name === this.comment.owner
    );

    this.$.root.classList.toggle('is-owner', isOwner);
};

CommentListItemView.prototype.deleteComment = function() {
    var comment = this.comment,
        self;

    if (!comment) return;

    self = this;

    comment.delete(function(err, res) {
        if (err) {
            console.log(err);
            return;
        }
    });
};

CommentListItemView.prototype.onChangeAuth = function() {
    this.checkOwner();
};

CommentListItemView.prototype.onDeleteLinkClick = function(ev) {
    ev.stopPropagation();
    ev.preventDefault();

    this.deleteComment();
};
