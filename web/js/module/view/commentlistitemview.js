//@include ../service/util.js
//@include ../model/comment.js
//@include ../model/user.js
//@include listitemview.js

var CommentListItemView = function() {
    ListItemView.call(this);

    this.loadTemplate('CommentListItemView');

    this.comment = null;
};
extendClass(CommentListItemView, ListItemView);

CommentListItemView.prototype.setModel = function(comment) {
    var self = this;

    this.comment = comment;

    if (comment) {
        User.getByName(comment.owner, function(err, user) {
            self.childViews.userInlineView.setUser(user);
        });
    }
};
