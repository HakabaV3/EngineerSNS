//@include ../service/util.js
//@include ../model/comment.js
//@include ../model/project.js
//@include listview.js
//@include commentlistitemview.js

var CommentListView = function() {
    ListView.call(this);

    this.loadTemplate('CommentListView');

    /**
     * 表示対象のオブジェクト
     * @type {(Project|Item)}
     */
    this.target = null;

    this.itemViewConstructor = CommentListItemView;

    this.$.form.addEventListener('submit', this.onSubmit = this.onSubmit.bind(this));
};
extendClass(CommentListView, ListView);

CommentListView.prototype.finalize = function() {
    this.$.form.removeEventListener('submit', this.onSubmit);
    this.onSubmit = null;

    ListView.prototype.finalize.call(this);
};

CommentListView.prototype.loadComments = function() {
    var target = this.target,
        self = this;

    if (!target) return;

    target.getComments(function(err, comments) {
        if (err) {
            self.setItems([]);
        } else {
            self.setItems(comments);
        }
    });
};

CommentListView.prototype.setTarget = function(target) {
    if (this.target === target) return;

    this.target = target;
    this.loadComments();
};

CommentListView.prototype.submit = function() {
    var self;

    if (!this.validate()) return;

    self = this;

    this.target.postComment(this.$.text.value, function(err, res) {
        if (err) {
            console.log(err);
            return
        }

        self.loadComments();
    })
};

CommentListView.prototype.validate = function() {
    var text = this.$.text.value,
        isValidate = true;

    //@TODO: debug only
    // if (!app.isAuthed) {
    //     isValidate = false;
    // }

    if (!text) {
        isValidate = false;
    }

    return isValidate;
};

CommentListView.prototype.onSubmit = function(ev) {
    ev.stopPropagation();
    ev.preventDefault();

    this.submit();
};
