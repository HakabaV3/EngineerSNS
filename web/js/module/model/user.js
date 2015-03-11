//@include model.js
//@include ../service/util.js
//@include ../service/api.js

/**
 *  @TODO
 *  API.Userへの依存をなくす
 *  Model#uriを用いて、API_coreだけで対応する。
 */

/**
 *  User Model.
 *  @constructor
 *  @param {Object} data initial data.
 *  @extends {Model}
 */
var User = function(data) {
    if (!(this instanceof User)) return new User(data);

    if (isObject(data)) {
        if (User.hasInstance(data.id)) {
            return User.getInstance(data.id).updateWithData(data);
        }
    }

    Model.call(this, data);
};
extendClass(User, Model);


/**
 *  model instances map
 *  @type {Object}
 *  @private
 *  @overrides
 */
User.instances_ = {};

/** 
 *  Schema
 *
 *  @type {Object}
 *  @override
 */
User.prototype.schema = {
    "id": {
        type: String,
        value: ''
    },
    "uri": {
        type: String,
        value: ''
    },
    "name": {
        type: String,
        value: 'undefined'
    },
    "description": {
        type: String,
        value: ''
    },
    "postCount": {
        type: Number,
        value: 0
    },
    "followingCount": {
        type: Number,
        value: 0
    },
    "followedCount": {
        type: Number,
        value: 0
    },
    "reviewCount": {
        type: Number,
        value: 0
    },
    "reviewingCount": {
        type: Number,
        value: 0
    },
    "reviewedCount": {
        type: Number,
        value: 0
    },
    "icon": {
        type: String,
        value: ''
    }
};

/**
 *  Get User data by user name.
 *  @param {string} userName the user name.
 *  @param {Function} callback callback function.
 */
User.getByName = function(userName, callback) {
    API.User.get(userName, function(err, res) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, new User(res));
    });
};

/**
 *  Get authenticated user data.
 *  @param {Function} callback callback function.
 */
User.getMe = function(callback) {
    API.User.me(function(err, res) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, new User(res));
    });
};

/**
 *  Get all projects.
 *  @param {Function} callback callback function.
 */
User.prototype.getAllProjects = function(callback) {
    API.get(this.uri + '/project', function(err, res) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, res.map(Project));
    });
};

/**
 *  Create new user.
 *  @param {string} userName the user name.
 *  @param {string} password the password.
 *  @param {Function} callback callback function.
 */
User.create = function(userName, password, callback) {
    API.User.post(userName, password, function(err, res) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, new User(res));
    });
};

/**
 *  Update user data.
 *  @param {Object} params update datas.
 *  @param {Function} callback callback function.
 */
User.prototype.update = function(params, callback) {
    if (!app.isAuthed || this !== app.authedUser) {
        return callback(APIError.PERMISSION_DENIED, null);
    };

    API.User.patch(this.name, params, function(err, res) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, new User(res));
    });
};

/**
 *  Update user icon image.
 *  @param {Blob} blob icon image file blob.
 *  @param {Function} callback callback function.
 */
User.prototype.updateIcon = function(blob, callback) {
    if (!app.isAuthed || this !== app.authedUser) {
        return callback(APIError.PERMISSION_DENIED, null);
    };

    API.User.patchIcon(this.name, blob, function(err, res) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, new User(res));
    });
};

/**
 *  Delete user data.
 *  @param {Function} callback callback function.
 */
User.prototype.delete = function(callback) {
    if (!app.isAuthed || this !== app.authedUser) {
        return callback(APIError.PERMISSION_DENIED, null);
    };

    API.User.delete(this.name, function(err, res) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, res);
    });
};
