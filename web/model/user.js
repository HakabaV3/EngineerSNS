var Model = require('./model.js'),
    Project = require('./project.js'),
    util = require('../service/util.js'),
    API = require('../service/api/api.js');

/**
 *  User Model.
 *  @constructor
 *  @param {Object} data initial data.
 *  @extends {Model}
 */
var User = function(data) {
    if (!(this instanceof User)) return new User(data);

    if (util.isObject(data)) {
        if (User.hasInstance(data.name)) {
            return User.getInstance(data.name).updateWithData(data);
        }
    }

    Model.call(this, data);
};
util.inherits(User, Model);

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
 *  Check if the instance is exist.
 *  @param {string} name user name.
 *  @return {boolean} If true, the instance is exist.
 *  @override
 */
User.hasInstance = function(name) {
    return !!this.instances_[name];
};

/**
 *  add instance.
 *  @param {User} instance instance
 *  @override
 */
User.addInstance = function(instance) {
    this.instances_[instance.name] = instance;
};

/**
 *  get instance.
 *  @param {string} name user name.
 *  @return {User} the instance.
 *  @override
 */
User.getInstance = function(name) {
    return this.instances_[name];
};

/**
 *  Update model data with source object.
 *  @param {Object} data update source object.
 *  @return {User} this.
 *  @override
 */
User.prototype.updateWithData = function(data) {
    Model.prototype.updateWithData.call(this, data);

    this.projects = [];
    this.projectsUpdated = new Date();

    return this;
};

/**
 *  Get User data by user name.
 *  @param {string} userName the user name.
 *  @param {Function} callback callback function.
 */
User.getByName = function(userName, callback) {
    var instance;

    if (this.hasInstance(userName)) {
        instance = this.getInstance(userName);

        callback(null, instance);

        return;
    }

    API.get('/user/' + userName, function(err, res) {
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
    API.get('/auth/me', function(err, res) {
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
    API.post('/user/' + userName, {
        password: password
    }, function(err, res) {
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

    API.patch(this.uri, {
        name: this.name,
        description: this.description
    }, function(err, res) {
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
    console.warn('User#updateIcon: NIY.');

    if (!app.isAuthed || this !== app.authedUser) {
        return callback(APIError.PERMISSION_DENIED, null);
    };

    API.patchB(this.uri + '/icon', blob, function(err, res) {
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

    API.delete(this.uri, function(err, res) {
        if (err) {
            return callback(err, null);
        }

        //@TODO: インスタンスを消す
        return callback(null, res);
    });
};

/**
 *  Get user's comments.
 *  @param {Function} callback callback function.
 */
User.prototype.getComments = function(callback) {
    API.get(this.uri + '/comment', function(err, res) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, res.map(Comment));
    });
};

module.exports = User;
