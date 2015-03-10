//@include model.js
//@include ../service/util.js
//@include ../service/api.js

/**
 *  @TODO
 *  API.Userへの依存をなくす
 *  Model#uriを用いて、API_coreだけで対応する。
 */

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
    API.Project.get(
        userName,
        projectName,
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
    API.Project.getAll(
        userName,
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

    API.Project.post(
        app.authedUser.name,
        projectName,
        function(err, res) {
            if (err) {
                return callback(err, null);
            }

            return callback(null, new Project(res));
        });
};

/**
 *  Update user data.
 *  @param {Object} params update datas.
 *  @params {Function} callback callback function.
 */
Project.prototype.update = function(params, callback) {
    if (!app.isAuthed || app.authedUser.name !== this.owner) {
        return callback(APIError.PERMISSION_DENIED, null);
    }

    Project.update(this.owner, this.name, params, callback);
};

/**
 *  Delete user data.
 *  @param {Function} callback callback function.
 */
Project.prototype.delete = function(callback) {
    if (!app.isAuthed || app.authedUser.name !== this.owner) {
        return callback(APIError.PERMISSION_DENIED, null);
    }

    Project.delete(this.owner, this.name, callback);
};
