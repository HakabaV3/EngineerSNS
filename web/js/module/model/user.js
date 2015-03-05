//@include model.js
//@include ../service/util.js
//@include ../service/api.js

/**
 *  User Model.
 *  @constructor
 *  @param {Object} data initial data.
 *  @extends {Model}
 */
var User = function(data) {
    if (isObject(data)) {
        if (Model.hasInstance(data.id)) {
            return Model.getInstance(data.id).updateWithData(data);
        }
    }

    Model.call(this, data);
};
extendClass(User, Model);

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
 *  @param {string} userName the user name.
 *  @param {Object} params update datas.
 *  @param {Function} callback callback function.
 */
User.update = function(userName, params, callback) {
    API.User.patch(userName, params, function(err, res) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, new User(res));
    });
};

/**
 *  Update user icon image.
 *  @param {string} userName the user name.
 *  @param {Blob} blob icon image file blob.
 *  @param {Function} callback callback function.
 */
User.updateIcon = function(userName, blob, callback) {
    API.User.patchIcon(userName, blob, function(err, res) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, new User(res));
    });
};

/**
 *  Delete user data.
 *  @param {string} name the user name.
 *  @param {Function} callback callback function.
 */
User.update = function(name, callback) {
    API.User.delete(name, function(err, res) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, res);
    });
};

/**
 *  Update user data.
 *  @param {Object} params update datas.
 *  @params {Function} callback callback function.
 */
User.prototype.update = function(params, callback) {
    User.update(this.name, params, callback);
};

/**
 *  Update user icon image.
 *  @param {Blob} blob icon image file blob.
 *  @param {Function} callback callback function.
 */
User.prototype.updateIcon = function(blob, callback) {
    User.updateIcon(this.name, blob, callback);
};

/**
 *  Delete user data.
 *  @param {Function} callback callback function.
 */
User.prototype.update = function(callback) {
    User.delete(this.name, callback);
};
