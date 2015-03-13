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

    /**
     *  @type {boolean}
     */
    this.isLoading;
    this.setLoadingState(true);

    this.itemViewConstructor = CommentListItemView;

    this.$.text.addEventListener('keydown', this.onKeyDown = this.onKeyDown.bind(this));
    this.$.form.addEventListener('submit', this.onSubmit = this.onSubmit.bind(this));
};
extendClass(CommentListView, ListView);

CommentListView.prototype.finalize = function() {
    this.$.text.addEventListener('keydown', this.onKeyDown)
    this.onKeyDown = null;

    this.$.form.removeEventListener('submit', this.onSubmit);
    this.onSubmit = null;

    ListView.prototype.finalize.call(this);
};

CommentListView.prototype.setItems = function(items) {
    items = items.slice(0).sort(function(a, b) {
        return a.created > b.created ? -1 :
            a.created < b.created ? 1 : 0;
    });

    return ListView.prototype.setItems.call(this, items);
};

CommentListView.prototype.loadComments = function() {
    var target = this.target,
        self = this;

    if (!target) return;

    target.getComments(function(err, comments) {
        if (err) {
            self.setItems([]);
            self.setLoadingState(false);
            return;
        }

        self.setItems(comments);
        self.setLoadingState(false);
    });
};

CommentListView.prototype.setLoadingState = function(state) {
    if (state === this.isLoading) return;

    if (state) {
        this.$.root.classList.add('is-loading');

    } else {
        this.$.root.classList.remove('is-loading');
    }
}
CommentListView.prototype.setTarget = function(target) {
    if (this.target === target) return;

    this.target = target;
    this.setItems([]);
    this.loadComments();
};

CommentListView.prototype.submit = function() {
    var self;

    if (!this.validate()) return;

    self = this;

    this.target.postComment(this.$.text.value.trim(), function(err, res) {
        if (err) {
            console.log(err);
            return
        }

        self.$.text.value = '';
        self.$.text.focus();
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

CommentListView.prototype.onKeyDown = function(ev) {
    var KeyCode = {
        ENTER: 13
    };

    switch (ev.keyCode) {
        case KeyCode.ENTER:
            if (ev.metaKey) {
                this.$.submit.click();
                ev.preventDefault();
                ev.stopPropagation();
            }
            break;

        default:
            break;
    }
};

CommentListView.prototype.onSubmit = function(ev) {
    ev.stopPropagation();
    ev.preventDefault();

    this.submit();
};
