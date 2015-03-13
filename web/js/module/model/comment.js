//@include model.js
//@include ../service/util.js
//@include ../service/api.js

/**
 *  @TODO
 *  API.Userへの依存をなくす
 *  Model#uriを用いて、API_coreだけで対応する。
 */

/**
 *  Comment Model.
 *  @constructor
 *  @param {Object} data initial data.
 *  @extends {Model}
 */
var Comment = function(data) {
    if (!(this instanceof Comment)) return new Comment(data);

    if (isObject(data)) {
        if (Comment.hasInstance(data.id)) {
            return Comment.getInstance(data.id).updateWithData(data);
        }
    }

    Model.call(this, data);
};
extendClass(Comment, Model);

Comment.prototype.hoge = function(name, key) {};

/**
 *  model instances map
 *  @type {Object}
 *  @private
 *  @overrides
 */
Comment.instances_ = {};

/** 
 *  Schema
 *
 *  @type {Object}
 *  @override
 */
Comment.prototype.schema = {
    "id": {
        type: String,
        value: ''
    },
    "uri": {
        type: String,
        value: ''
    },
    "owner": {
        type: String,
        value: ''
    },
    "text": {
        type: String,
        value: ''
    },
    "html": {
        type: String,
        value: ''
    },
    "created": {
        type: Date,
        value: null
    },
    "target": {
        type: String,
        value: null
    },
    "range": {
        type: Object,
        value: null
    }
};

/**
 *  @override
 */
Comment.prototype.updateWithData = function(data) {
    Model.prototype.updateWithData.call(this, data);

    this.html = this.text
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    this.created = new Date(data.created);
    return this;
};

/**
 *  Get Comment data by comment ID
 *  @param {string} commentId the comment id.
 *  @param {Function} callback callback function.
 */
Comment.getById = function(commentId, callback) {
    API.get('/comment/' + commentId,
        function(err, res) {
            if (err) {
                return callback(err, null);
            }

            return callback(null, new Comment(res));
        });
};

/**
 *  Update comment data.
 *  @params {Function} callback callback function.
 */
Comment.prototype.update = function(callback) {
    if (!app.isAuthed || app.authedUser.name !== this.owner) {
        return callback(APIError.PERMISSION_DENIED, null);
    }

    API.patch(this.uri, {
            text: this.text
        },

        function(err, res) {
            if (err) {
                return callback(err, null);
            }

            return callback(null, new Comment(res));
        });
};

/**
 *  Delete comment data.
 *  @param {Function} callback callback function.
 */
Comment.prototype.delete = function(callback) {
    var self = this;

    if (!app.isAuthed || app.authedUser.name !== this.owner) {
        return callback(APIError.PERMISSION_DENIED, null);
    }

    API.delete(this.uri,

        function(err, res) {
            if (err) {
                return callback(err, null);
            }

            Comment.deleteInstance(self);

            return callback(null, res);
        });
};
