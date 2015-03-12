//@include model.js
//@include comment.js
//@include ../service/util.js
//@include ../service/api.js

/**
 *  Project Model.
 *  @constructor
 *  @param {Object} data initial data.
 *  @extends {Model}
 */
var Project = function(data) {
    if (!(this instanceof Project)) return new Project(data);

    if (isObject(data)) {
        if (Project.hasInstance(data.id)) {
            return Project.getInstance(data.id).updateWithData(data);
        }
    }

    Model.call(this, data);
};
extendClass(Project, Model);

/**
 *  model instances map
 *  @type {Object}
 *  @private
 *  @overrides
 */
Project.instances_ = {};

/** 
 *  Schema
 *
 *  @type {Object}
 *  @override
 */
Project.prototype.schema = {
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
    "owner": {
        type: String,
        value: ''
    },
    "root": {
        type: null,
        value: null
    }
};

/**
 *  Get Project data by project name.
 *  @param {string} userName the owner name.
 *  @param {string} projectName the project name.
 *  @param {Function} callback callback function.
 */
Project.getByName = function(userName, projectName, callback) {
    API.get('/user/' + userName + '/project/' + projectName,
        function(err, res) {
            if (err) {
                return callback(err, null);
            }

            return callback(null, new Project(res));
        });
};

/**
 *  Get all Project data by owner name.
 *  @param {string} userName the owner name.
 *  @param {Function} callback callback function.
 */
Project.getAll = function(userName, callback) {
    API.get('/user/' + userName + '/project',
        function(err, res) {
            if (err) {
                return callback(err, null);
            }

            return callback(null, res.map(Project));
        });
};

/**
 *  Create new project.
 *  @param {string} projectName the proejct name.
 *  @param {Function} callback callback function.
 */
Project.create = function(projectName, callback) {
    if (!app.isAuthed) {
        return callback(APIError.PERMISSION_DENIED, null);
    }

    API.post('/user/' + app.authedUser.name + '/project',
        function(err, res) {
            if (err) {
                return callback(err, null);
            }

            return callback(null, new Project(res));
        });
};

/**
 *  Update project data.
 *  @param {Object} params update datas.
 *  @params {Function} callback callback function.
 */
Project.prototype.update = function(callback) {
    if (!app.isAuthed || app.authedUser.name !== this.owner) {
        return callback(APIError.PERMISSION_DENIED, null);
    }

    API.patch(this.uri, {
        name: this.name
    }, function(err, res) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, new Project(res));
    });
};

/**
 *  Delete project data.
 *  @param {Function} callback callback function.
 */
Project.prototype.delete = function(callback) {
    if (!app.isAuthed || app.authedUser.name !== this.owner) {
        return callback(APIError.PERMISSION_DENIED, null);
    }

    API.delete(this.uri, function(err, res) {
        if (err) {
            return callback(err, null);
        }

        //@TODO: インスタンスを消す
        return callback(null, new Project(res));
    });
};

/**
 *  Get project comments.
 *  @param {Function} callback callback function.
 */
Project.prototype.getComments = function(callback) {
    API.get(this.uri + '/comment', function(err, res) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, res.map(Comment));
    });
};

Project.prototype.postComment = function(text, callback) {
    API.post(this.uri + '/comment', null, {
        text: text
    }, function(err, res) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, Comment(res));
    });
};
