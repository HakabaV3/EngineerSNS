(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var API = require('../service/api/api.js'),
    User = require('./user.js');

/**
 *  Authentication methods.
 *
 *  This API category DOES NOT have any model (as 'Auth'), methods only.
 *
 *  @namespace
 */
Auth = {};

/**
 *  Sign in.
 *  @param {string} userName userName.
 *  @param {string} password password.
 *  @param {Function} callback callback.
 */
Auth.signIn = function(userName, password, callback) {
    API.post('/auth', null, {
        'userName': userName,
        'password': password
    }, function(err, res) {
        if (err) {
            API.updateToken(null);
            return callback(err, null);
        }

        return callback(null, new User(res));
    });
};

/**
 *  Sign out.
 *  @param {Function} callback callback.
 */
Auth.signOut = function(callback) {
    API.delete('/auth', null, function(err, res) {
        API.updateToken(null);
        return callback(null, null);
    });
};

/**
 *  Sign up.
 *  @param {string} userName userName.
 *  @param {string} password password.
 *  @param {Function} callback callback.
 */
Auth.signUp = function(userName, password, callback) {
    API.post('/user/' + userName, null, {
        'password': password
    }, function(err, res) {
        if (err) {
            API.updateToken(null);
            return callback(err, null);
        }

        return callback(null, new User(res));
    });
};

module.exports = Auth;

},{"../service/api/api.js":8,"./user.js":5}],2:[function(require,module,exports){
var Model = require('./model.js'),
    util = require('../service/util.js'),
    API = require('../service/api/api.js');

/**
 *  Comment Model.
 *  @constructor
 *  @param {Object} data initial data.
 *  @extends {Model}
 */
var Comment = function(data) {
    if (!(this instanceof Comment)) return new Comment(data);

    if (util.isObject(data)) {
        if (Comment.hasInstance(data.id)) {
            return Comment.getInstance(data.id).updateWithData(data);
        }
    }

    Model.call(this, data);
};
util.inherits(Comment, Model);

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

module.exports = Comment;

},{"../service/api/api.js":8,"../service/util.js":18,"./model.js":3}],3:[function(require,module,exports){
var EventDispatcher = require('../service/eventdispatcher.js'),
    util = require('../service/util.js');

/**
 *  Data model base class.
 *
 *  @construcotr
 *  @param {Object} data initial data.
 *  @extends {EventDispatcher}
 */
var Model = function(data) {
    EventDispatcher.call(this);

    this.initForSchema();
    if (util.isObject(data)) {
        this.updateWithData(data);
        this.constructor.addInstance(this);
    }
};
util.inherits(Model, EventDispatcher);

/**
 *  model instances map
 *  @type {Object}
 *  @private
 */
Model.instances_ = {};

/**
 *  model schema.
 *  @type {Object}
 */
Model.prototype.schema = {};

/**
 *  Finalizer.
 */
Model.prototype.finalize = function() {
    EventDispatcher.prototype.finalize.call(this);
};

/**
 *  Check if the instance is exist.
 *  @param {string} id instance id.
 *  @return {boolean} If true, the instance is exist.
 */
Model.hasInstance = function(id) {
    return !!this.instances_[id];
};

/**
 *  add instance.
 *  @param {Model} instance instance
 */
Model.addInstance = function(instance) {
    this.instances_[instance.id] = instance;
};

/**
 *  get instance.
 *  @param {string} id instance id.
 *  @return {Model} the instance.
 */
Model.getInstance = function(id) {
    return this.instances_[id];
};

Model.deleteInstance = function(instance) {
    instance.fire('delete', instance);

    this.instances_[instance.id] = null;
    instance.finalize();
};

/**
 *  Initialize model data for schema.
 *  @return {Model} this.
 */
Model.prototype.initForSchema = function() {
    var self = this,
        schema = this.schema;

    Object.keys(schema).forEach(function(schemaKey) {
        var scheme = schema[schemaKey];

        if (!util.isObject(scheme)) {
            /**
             *  syntax sugar
             */
            scheme = {
                type: schema,
                value: new schema()
            }
        }

        self[schemaKey] = scheme.value;
    });

    return this;
};

/**
 *  Update model data with source object.
 *  @param {Object} data update source object.
 *  @return {Model} this.
 */
Model.prototype.updateWithData = function(data) {
    var self = this,
        schema = this.schema;

    Object.keys(data).forEach(function(key) {
        if (schema.hasOwnProperty(key)) {
            self[key] = data[key];
        }
    });

    this.dispatchUpdate();
    return this;
};

/**
 *  dispatch update event.
 */
Model.prototype.dispatchUpdate = function() {
    this.fire('update', this);
};

module.exports = Model;

},{"../service/eventdispatcher.js":12,"../service/util.js":18}],4:[function(require,module,exports){
var Model = require('./model.js'),
    Comment = require('./comment.js'),
    util = require('../service/util.js'),
    API = require('../service/api/api.js');

/**
 *  Project Model.
 *  @constructor
 *  @param {Object} data initial data.
 *  @extends {Model}
 */
var Project = function(data) {
    if (!(this instanceof Project)) return new Project(data);

    if (util.isObject(data)) {
        if (Project.hasInstance(data.id)) {
            return Project.getInstance(data.id).updateWithData(data);
        }
    }

    Model.call(this, data);
};
util.inherits(Project, Model);

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

module.exports = Project;

},{"../service/api/api.js":8,"../service/util.js":18,"./comment.js":2,"./model.js":3}],5:[function(require,module,exports){
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

},{"../service/api/api.js":8,"../service/util.js":18,"./model.js":3,"./project.js":4}],6:[function(require,module,exports){
var AppView = require('./view/appview/appview.js');

window.addEventListener('DOMContentLoaded', function() {
    var appView = new AppView();
    document.body.appendChild(appView.$.root);
});

},{"./view/appview/appview.js":19}],7:[function(require,module,exports){
var util = require('./util.js');

function Animation() {
    if (!(this instanceof Animation)) {
        var instance = new Animation();
        instance.then.apply(instance, arguments);
        return intstance;
    }

    /**
     * The que of animation data objects.
     * @type {[Object]}
     * @private
     */
    this.que_ = [];

    /**
     * The flag if animation is running
     * @type {Boolean}
     * @private
     */
    this.flagRunning = false;

    /**
     * The flag if animation que is waiting for transitionend event.
     * @type {Boolean}
     * @private
     */
    this.flagWaiting = false;

    /**
     * The element of the transition waiting for transitionend event.
     * @type {Element}
     * @private
     */
    this.waitingElement = null;

    // /**
    //  * The property name of the transition waiting for transitionend event.
    //  * @type {string|null}
    //  * @private
    //  */
    // this.waitingPropertyName = null;
}

Animation.prototype.then = function(element, callback, flagWait) {
    flagWait = flagWait || false;

    this.que_.push({
        element: element,
        callback: callback,
        flagWait: flagWait
    });
    if (!this.flagRunning) {
        this.flagRunning = true;
        this.doAnimation_();
    }

    return this;
};

Animation.prototype.wait = function(element, callback) {
    return this.then(element, callback, true);
};

Animation.prototype.doAnimation_ = function() {
    var que = this.que_,
        self = this,
        item;

    // wait for transitionend event.
    if (this.flagWaiting) return;

    item = que.shift();

    if (!item) {
        // que is empty
        this.flagRunning = false;
        return;
    }

    if (item.flagWait) {
        // wait for next transitionend event.
        item.element.addEventListener('transitionend', this);
        this.flagWaiting = true;
        this.waitingElement = item.element;
    }

    requestAnimationFrame(function() {
        item.callback.call(self, item.element);
        self.doAnimation_();
    });
};

Animation.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'transitionend':
            this.onTransitionEnd(ev);
            break;
    }
};

Animation.prototype.onTransitionEnd = function(ev) {
    if (!this.flagWaiting ||
        this.waitingElement !== ev.target) return;

    ev.target.removeEventListener('transitionend', this);

    this.flagWaiting = false;
    this.waitingElement = null;
    this.doAnimation_();
};

module.exports = Animation;

},{"./util.js":18}],8:[function(require,module,exports){
var util = require('../../service/util.js'),
    APIError = require('./apierror.js');

/**
 *  namespace for request API
 *  @namespace
 */
var API = {};

/**
 *  API Entry Point
 *  @const {string}
 */
API.EntryPoint = 'http://localhost:3000/api/v1';

//@TODO: DEBUG ONLY
// API.EntryPoint = './testdata';

/**
 *  Authentication token
 *  @type {string}
 */
API.token = ''

/**
 *  encode Object for URL parameters.
 *  @param {Object} [params] parameters.
 *  @return {string} encoded result.
 */
API.encodeURLParams = function(params) {
    return Object.keys(params)
        .map(function(key) {
            return key + '=' + encodeURIComponent(params[key]);
        })
        .join('&');
};

/**
 *  HTTP::GET method.
 *  @param {string} url url.
 *  @param {Object} [params] request parameters.
 *  @param {Function} callback callback function.
 */
API.get = function(url, params, callback) {
    if (arguments.length === 2) {
        callback = params;
        params = undefined;
    }

    if (util.isObject(params)) {
        url += '?' + API.encodeURLParams(params);
    }

    API.ajax('GET', url, null, null, callback);
};

/**
 *  HTTP::POST method.
 *  @param {string} url url.
 *  @param {Object} [params] request parameters.
 *  @param {Object} body request body object.
 *  @param {Function} callback callback function.
 */
API.post = function(url, params, body, callback) {
    if (arguments.length === 3) {
        body = params;
        params = undefined;
    }

    if (util.isObject(params)) {
        url += '?' + API.encodeURLParams(params);
    }

    API.ajax('POST', url, {
        'Content-Type': 'application/json'
    }, JSON.stringify(body), callback);
};

/**
 *  HTTP::POST method for binary data.
 *  @param {string} url url.
 *  @param {Blob} [data] binary data.
 *  @param {Function} callback callback function.
 */
API.postB = function(url, params) {
    cponsole.error('not implemented yet!');
};

/**
 *  HTTP::PUT method.
 *  @param {string} url url.
 *  @param {Object} [params] request parameters.
 *  @param {Object} body request body object.
 *  @param {Function} callback callback function.
 */
API.put = function(url, params, body, callback) {
    if (arguments.length === 3) {
        body = params;
        params = undefined;
    }

    if (util.isObject(params)) {
        url += '?' + API.encodeURLParams(params);
    }

    API.ajax('PUT', url, {
        'Content-Type': 'application/json'
    }, JSON.stringify(body), callback);
};

/**
 *  HTTP::PUT method for binary data.
 *  @param {string} url url.
 *  @param {Blob} [data] binary data.
 *  @param {Function} callback callback function.
 */
API.putB = function(url, params, callback) {
    cponsole.error('not implemented yet!');
};

/**
 *  HTTP::PATCH method.
 *  @param {string} url url.
 *  @param {Object} [params] request parameters.
 *  @param {Object} body request body object.
 *  @param {Function} callback callback function.
 */
API.patch = function(url, params, body, callback) {
    if (arguments.length === 3) {
        body = params;
        params = undefined;
    }

    if (util.isObject(params)) {
        url += '?' + API.encodeURLParams(params);
    }

    API.ajax('PATCH', url, {
        'Content-Type': 'application/json'
    }, JSON.stringify(body), callback);
};

/**
 *  HTTP::PATCH method for binary data.
 *  @param {string} url url.
 *  @param {Blob} [data] binary data.
 *  @param {Function} callback callback function.
 */
API.patchB = function(url, params, callback) {
    cponsole.error('not implemented yet!');
};

/**
 *  HTTP::DELETE method.
 *  @param {string} url url.
 *  @param {Object} [params] request parameters.
 *  @param {Function} callback callback function.
 */
API.delete = function(url, params, callback) {
    if (arguments.length === 2) {
        callback = params;
        params = undefined;
    }

    if (util.isObject(params)) {
        url += '?' + API.encodeURLParams(params);
    }

    API.ajax('DELETE', url, null, JSON.stringify(params), callback);
};

/**
 *  Ajax core function
 */
API.ajax = function(method, url, headers, body, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, API.EntryPoint + url);

    if (API.hasToken()) {
        xhr.setRequestHeader('X-Token', API.getToken());
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    if (headers) {
        Object.keys(headers).forEach(function(key) {
            xhr.setRequestHeader(key, headers[key]);
        });
    }

    xhr.onload = function() {
        var result,
            token;

        token = xhr.getResponseHeader('X-Token');
        if (token) {
            API.updateToken(token);
        }

        try {
            result = JSON.parse(xhr.responseText);
        } catch (e) {
            return callback(APIError.parseFailed(xhr), null);
        }

        if (result.success) {
            return callback(null, result.success);
        } else {
            return callback(APIError.detectError(result.error), null);
        }
    };

    xhr.onerror = function() {
        return callback(APIError.connectionFailed(xhr), null);
    };

    xhr.send(body);
};


/**
 *  authentication token.
 *  @type {string|null}
 */
API.token = null;

/**
 *  The key name of authentication token in Local Storage.
 */
API.KEY_TOKEN = 'token';

/**
 *  Update authentication token.
 *  @param {string|null} token token.
 */
API.updateToken = function(token) {
    API.token = token;
    localStorage.setItem(API.KEY_TOKEN, token || '');
};

/**
 *  Get authentication token.
 *  @return {string|null} token.
 */
API.getToken = function() {
    if (API.token) return API.token;

    return API.token = localStorage.getItem(API.KEY_TOKEN);
};

/**
 *  Check if authentication token is exist.
 *  @return {boolean} If true, the token is exist.
 */
API.hasToken = function() {
    return API.getToken() !== '';
};

module.exports = API;

},{"../../service/util.js":18,"./apierror.js":9}],9:[function(require,module,exports){
var util = require('../../service/util.js');

/**
 *  namespace for definition of API Errors
 *  @namespace
 */
var APIError = {};

APIError.Code = {
    SUCCESS: 0,
    PERMISSION_DENIED: 1,
    PARSE_FAILED: 2,
    CONNECTION_FAILED: 3,
    USED_NAME: 4,
    INVALID_PARAMETER: 5,
    UNKNOWN: 999
};

util.extend(APIError, {
    SUCCESS: {
        code: APIError.Code.SUCCESS,
        msg: 'success'
    },
    PERMISSION_DENIED: {
        code: APIError.Code.PERMISSION_DENIED,
        msg: 'Permission denied.',
    },
    PARSE_FAILED: {
        code: APIError.Code.PARSE_FAILED,
        msg: 'Failed to parse response.',
    },
    CONNECTION_FAILED: {
        code: APIError.Code.CONNECTION_FAILED,
        msg: 'Failed to connect server.',
    },
    USED_NAME: {
        code: APIError.Code.USED_NAME,
        msg: 'This user name is already used.'
    },
    INVALID_PARAMETER: {
        code: APIError.Code.INVALID_PARAMETER,
        msg: 'Parameters are invalid.'
    },
    UNKNOWN: {
        code: APIError.Code.UNKNOWN,
        msg: 'Unknown error.'
    }
});

/**
 *  Error for failed to parse server response.
 *  @param {XMLHttpRequest} xhr failed xhr object.
 *  @return {Object} error object.
 */
APIError.parseFailed = function(xhr) {
    return util.extend(APIError.PARSE_FAILED, {
        xhr: xhr
    });
};

/**
 *  Error for failed to connection.
 *  @param {XMLHttpRequest} xhr failed xhr object.
 *  @return {Object} error object.
 */
APIError.connectionFailed = function(xhr) {
    return util.extend(APIError.CONNECTION_FAILED, {
        xhr: xhr
    });
};

/**
 *  エラーを特定する。
 *  ものすごく地道な実装。
 *  サーバーは頼むからエラーをコードで返してくれ！
 */
APIError.detectError = function(err) {
    if (util.isObject(err)) {
        switch (err.code) {
            case APIError.Code.PERMISSION_DENIED:
                return APIError.PERMISSION_DENIED;
                break;

            case APIError.Code.PARSE_FAILED:
                return APIError.PARSE_FAILED;
                break;

            case APIError.Code.CONNECTION_FAILED:
                return APIError.CONNECTION_FAILED;
                break;

            default:
                return util.extend(APIError.UNKNOWN, {
                    original: err
                });
                break;
        }
    }

    if (err === 'ユーザー名は既に使用されています。') {
        return APIError.USED_NAME;
    }

    if (err === 'ユーザー名またはパスワードに誤りがあります。') {
        return APIError.INVALID_PARAMETER;
    }

    return util.extend(APIError.UNKNOWN, {
        original: err
    });
};

module.exports = APIError;

},{"../../service/util.js":18}],10:[function(require,module,exports){
if (!('classList' in document.createElement('a'))) {
    var DOMTokenList = require('./domtokenlist.js');

    Element.prototype.__defineGetter__('classList', function() {
        return new DOMTokenList(this, 'class');
    });
}

},{"./domtokenlist.js":11}],11:[function(require,module,exports){
var DOMTokenList = window.DOMTokenList;

/**
 *	DOMTokenList Polyfill
 */
if (!DOMTokenList) {

    DOMTokenList = function DOMTokenList(element, attrName) {
        /**
         * @type {Element}
         * @private
         */
        this.element_ = element;

        /**
         * @type {string}
         * @private
         */
        this.attrName_ = attrName;
    }

    /**
     * delimiter
     * @const {String}
     * @private
     */
    DOMTokenList.DELIMITER_ = ' ';

    /**
     * length
     * @type {number}
     */
    DOMTokenList.prototype.__defineGetter__('length', function() {
        return this.getItems_().length;
    });

    /**
     * Returns original attribute value.
     * @return {string} original attribute value.
     * @private
     */
    DOMTokenList.prototype.getOriginal_ = function() {
        return this.element_.getAttribute(this.attrName_);
    };

    /**
     * Sets original attribute value.
     * @param {string} newValue attribute value.
     * @private
     */
    DOMTokenList.prototype.setOriginal_ = function(newValue) {
        this.element_.setAttribute(this.attrName_, newValue);
    };

    /**
     * Returns original attribute value as array.
     * @return {[string]} original attribute value.
     * @private
     */
    DOMTokenList.prototype.getItems_ = function() {
        return this.getOriginal_().split(DOMTokenList.DELIMITER_);
    };

    /**
     * Sets original attribute value with array.
     * @param {[string]} items attribute value.
     * @private
     */
    DOMTokenList.prototype.setItems_ = function(items) {
        this.setOriginal_(items.join(DOMTokenList.DELIMITER_));
    };

    /**
     * Returns item for specified index.
     * @param  {number} index specified index
     * @return {string} the item for specified index.
     */
    DOMTokenList.prototype.item = function(index) {
        return this.getItems_()[index];
    };

    /**
     * Checks if this list contains specified token.
     * @param  {string} token token.
     * @return {boolean} If contains, return true, otherwise false.
     */
    DOMTokenList.prototype.contains = function(token) {
        return this.getItems_().indexOf(token) !== -1;
    };

    /**
     * Adds token. If it's exist already, do nothing.
     * @param {string} token token.
     */
    DOMTokenList.prototype.add = function(token) {
        var items = this.getItems_(),
            i, max;

        for (i = 0, max = arguments.length; i < max; i++) {
            token = arguments[i];
            if (items.indexOf(token) !== -1) continue;
            items.push(token);
        }

        this.setItems_(items);
    };

    /**
     * Removes token. If it's not exist, do nothing.
     * @param {string} token token.
     */
    DOMTokenList.prototype.remove = function(token) {
        var items = this.getItems_(),
            i, max, index;

        for (i = 0, max = arguments.length; i < max; i++) {
            token = arguments[i];
            index = items.indexOf(token);
            if (index === -1) continue;
            items.splice(index, 1);
        }

        this.setItems_(items);
    };

    /**
     * Toggles token.
     * @param {string} token token.
     */
    DOMTokenList.prototype.toggle = function(token) {
        return this.contains(token) ?
            this.remove(token) :
            this.add(token);
    };
}

module.exports = DOMTokenList;

},{}],12:[function(require,module,exports){
/**
 *  Event dispatchable object.
 *
 *  @constructor
 */
var EventDispatcher = function EventDispatcher() {
    /**
     *  The list of all event listeners attached on this.
     *
     *  @type {Object<string, Array<Function>>}
     *  @private
     */
    this.eventListeners_ = {};
};

/**
 *  Finalizer.
 */
EventDispatcher.prototype.finalize = function() {
    this.eventListeners_ = null;
};

/**
 *  attach an event listener.
 *
 *  @param {string} type event type.
 *  @param {Function} listener the event listener to attach.
 *  @return {EventDispatcher} this.
 */
EventDispatcher.prototype.on = function(type, listener, context) {
    var listeners = this.eventListeners_[type];
    context = context || this;

    if (!listeners) {
        listeners = this.eventListeners_[type] = [];
    }

    listeners.push({
        listener: listener,
        context: context
    });

    return this;
};

/**
 *  detach the event listener.
 *  if the event listener is detached for more than twice,
 *  this method detach all of them.
 *
 *  @param {string} type event type.
 *  @param {Function} listener the event listener to detach.
 *  @return {EventDispatcher} this.
 */
EventDispatcher.prototype.off = function(type, listener, context) {
    var listeners = this.eventListeners_[type],
        i, max;
    context = context || this;

    if (!listeners) return this;

    for (i = 0, max = listeners.length; i < max; i++) {
        if (listeners[i].listener === listener &&
            listeners[i].context === context) {
            listeners.splice(i, 1);
            i--;
            max--;
        }
    }

    return this;
};

EventDispatcher.prototype.once = function(type, listener, context) {
    var self = this,
        proxy = function() {
            self.off(type, proxy, context);
            listener.apply(this, arguments);
        };

    this.on(type, proxy, context);
};

/**
 *  fire the event.
 *
 *  @param {string} type event type.
 *  @param {...*} optArgs arguments.
 *  @return {EventDispatcher} this.
 */
EventDispatcher.prototype.fire = function(type, optArgs) {
    var listeners = this.eventListeners_[type],
        args = Array.prototype.slice.call(arguments, 1),
        i, max;

    if (!listeners) return this;

    listeners = listeners.slice(0);

    for (i = 0, max = listeners.length; i < max; i++) {
        listeners[i].listener.apply(listeners[i].context, args);
    }

    return this;
};

module.exports = EventDispatcher;

},{}],13:[function(require,module,exports){
var Map = window.Map;

if (typeof Map !== 'function') {
    Map = function Map() {
        /**
         * It's 0, constant.
         * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Map
         * @type {number}
         */
        this.length = 0;

        /**
         * keys
         * @type {Number}
         * @private
         */
        this.keys_ = [];

        /**
         * number
         * @type {Number}
         * @private
         */
        this.values_ = [];
    }

    /**
     *  Returns the number of key/value pairs in the Map object.
     *  @type {number}
     */
    Map.prototype.__defineGetter__('size', function() {
        return this.keys_.length;
    });

    /**
     *  Removes all key/value pairs from the Map object.
     */
    Map.prototype.clear = function() {
        this.keys_ = [];
        this.values_ = [];
    };

    /**
     * Removes any value associated to the key and
     * returns the value that Map.prototype.has(value) would have previously returned.
     * Map.prototype.has(key) will return false afterwards.
     *
     * @param {string} key key
     * @return {boolean} if true, map has contianed the key.
     */
    Map.prototype.delete = function(key) {
        if (!this.has(key)) {
            return false;
        }

        var index = this.keys_.indexOf(key);
        this.keys_.splice(index, 1);
        this.values_.splice(index, 1);

        return true;
    };

    Map.prototype.entries = function() {
        throw new Error('Map.prototype.entries: NIY.');
    };

    /**
     * Executes a provided function once per each key/value pair
     * in the Map object, in insertion order.
     *
     * @param {Function} callback callback,
     * @param {*} [thisArg] callback context.
     *                      If it's not provided, the context is global object (maybe, it is window).
     *                      (In original definition, the context is undefined.);
     */
    Map.prototype.forEach = function(callback, thisArg) {
        this.values_.forEach(callback, thisArg);
    }

    /**
     * Returns a specified element from a Map object.
     * @param {string} key the key.
     * @return If the specified key is exists, the value is returned, otherwise undefined.
     */
    Map.prototype.get = function(key) {
        var index = this.keys_.indexOf(key);

        return index === -1 ? undefined : this.values_[index];
    };

    /**
     * Returns a boolean indicating whether an element with the specified key exists or not.
     * @param {string} key the key.
     * @return {boolean} true if an element with the specified key exists in the Map object, otherwise false.
     */
    Map.prototype.has = function(key) {
        return this.keys_.indexOf(key) !== -1;
    };

    Map.prototype.keys = function(key) {
        throw new Error('Map.prototype.keys: NIY.');
    };

    /**
     * Adds a new element with a specified key and value to a Map object.
     * @param {*} key the key.
     * @param {*} value the value.
     * @return {Map} this map object.
     */
    Map.prototype.set = function(key, value) {
        var index = this.keys_.indexOf(key);

        if (index === -1) {
            this.keys_.push(key);
            this.values_.push(value);
        } else {
            this.values_[index] = value;
        }

        return this;
    };
}

module.exports = Map;

},{}],14:[function(require,module,exports){
var util = require('../util.js'),
    Map = require('../map.js'),
    ObjectObserver = require('./objectobserver.js');

/**
 *  @constructor
 *  @param {Object} target
 *  @param {string} propName
 */
function CustomObserver(target, propName) {
    this.onChangeHandler_ = this.onChangeHandler_.bind(this);

    /**
     *  target
     *  @type {Object}
     *  @private
     */
    this.targets_ = [target];

    /**
     *  @type {string}
     *  @private
     */
    this.propName_ = propName;

    /**
     *  @type {[string]}
     *  @private
     */
    this.propNameTokens_ = propName.split('.');

    /**
     *  callbacks
     *  @type {[Function]}
     *  @private
     */
    this.callbacks_ = [];

    /**
     * @type {*}
     * @private
     */
    this.oldValue_ = null;

    this.resetObserve_(0);
    this.oldValue_ = this.getValue();
}

/**
 * instance map
 */
CustomObserver.instances_ = new Map();


/**
 * returns instance
 * @param  {Object}   object   object
 * @param  {string}   propName string
 * @return {CustomObserver} if exists, instance, otherwise null.
 * @private
 */
CustomObserver.getInstance_ = function(object, propName) {
    var subMap = this.instances_.get(object);

    if (!subMap) return;

    return subMap.get(propName) || null;
};

/**
 * add instance
 * @param  {Object}   object   object
 * @param  {string}   propName string
 * @return {CustomObserver} instance.
 * @private
 */
CustomObserver.addInstance_ = function(object, propName) {
    var subMap = this.instances_.get(object),
        instance = new CustomObserver(object, propName);

    if (!subMap) {
        subMap = new Map();
        this.instances_.set(object, subMap);
    }

    subMap.set(propName, instance);

    return instance;
};

/**
 * remove instance
 * @param {CustomObserver} instance instance
 * @private
 */
CustomObserver.removeInstance_ = function(instance) {
    var object = isntance.targets_[0],
        instances_ = this.instances_,
        subMap = instances_.get(instance.targets_[0]);

    instance.targets_[0] = null;
    instance.resetObserve_(0);
    instance.onChangeHandler_ = null;

    if (!subMap) return;

    subMap.delete(instance.propName_);

    if (subMap.size !== 0) return;

    instances_.delete(object);
};

/**
 * observe
 * @param  {Object}   object   object
 * @param  {string}   propName string
 * @param  {Function} callback callback
 */
CustomObserver.observe = function(object, propName, callback) {
    var instance = this.getInstance_(object, propName);

    if (!instance) {
        instance = this.addInstance_(object, propName);
    }

    instance.addCallback_(callback);
};

/**
 * unobserve
 * @param  {Object}   object   object
 * @param  {string}   propName string
 * @param  {Function} callback callback
 */
CustomObserver.unobserve = function(object, propName, callback) {
    var instance = this.getInstance(object, propName);

    if (!instance) return;

    instance.removeCallback_(callback);
};

CustomObserver.prototype.addCallback_ = function(callback) {
    var callbacks = this.callbacks_,
        index = callbacks.indexOf(callback);

    if (index !== -1) return;

    callbacks.push(callback);
};

CustomObserver.prototype.removeCallback_ = function(callback) {
    var callbacks = this.callbacks_,
        index = callbacks.indexOf(callback);

    if (index === -1) return;

    callbacks.splice(index, 1);

    if (callbacks.length === 0) {
        CustomObserver.removeInstance_(this);
    }
};

/**
 * get value
 */
CustomObserver.prototype.getValue = function() {
    var length = this.propNameTokens_.length;

    return util.isObject(this.targets_[length - 1]) ?
        this.targets_[length - 1][this.propNameTokens_[length - 1]] :
        null;
};

/**
 * reset observe
 * @param {number} index reset observe depth
 * @private
 */
CustomObserver.prototype.resetObserve_ = function(index) {
    if (index >= this.propNameTokens_.length) return;

    var targets = this.targets_,
        propName = this.propNameTokens_[index],
        oldTarget = targets[index],
        newTarget;

    //unobserve
    if (util.isObject(oldTarget)) {
        Object.unobserve(oldTarget, this.onChangeHandler_);
    }

    if (index !== 0) {
        targets[index] = null;
    }

    //observe
    if (index === 0) {
        newTarget = targets[0];
    } else if (util.isObject(targets[index - 1]) &&
        util.isObject(targets[index - 1][this.propNameTokens_[index - 1]])) {

        newTarget = targets[index - 1][this.propNameTokens_[index - 1]];
    } else {
        newTarget = null;
    }

    if (newTarget) {
        Object.observe(newTarget, this.onChangeHandler_);
    }
    targets[index] = newTarget;

    this.resetObserve_(index + 1);
};

/**
 * observe callback
 * @param {[Object]} changes changes
 * @private
 */
CustomObserver.prototype.onChangeHandler_ = function(changes) {
    var newValue = this.getValue(),
        oldValue = this.oldValue_,
        targets = this.targets_;

    if (newValue !== oldValue) {
        changes = [{
            type: 'update',
            name: this.propName_,
            object: this.targets_[0],
            oldValue: oldValue,
            newValue: newValue
        }];

        this.callbacks_.forEach(function(callback) {
            if (util.isFunction(callback)) {
                callback(changes);
            } else if (util.isObject(callback) && util.isFunction(callback.handleEvent)) {
                callback.handleEvent(changes);
            }
        }, this);

        this.oldValue_ = newValue;
    }

    changes.forEach(function(change) {
        var index = targets.indexOf(change.object);

        if (index !== -1) {
            this.resetObserve_(index);
        }
    }, this);
};

module.exports = CustomObserver;

},{"../map.js":13,"../util.js":18,"./objectobserver.js":15}],15:[function(require,module,exports){
var Map = require('../map.js');

if (typeof Object.observe !== 'function') {

    /**
     * ObjectObserver
     *
     * @constructor
     */
    function ObjectObserver(object) {
        /**
         * observe target
         * @type {Object}
         * @private
         */
        this.object_ = object;

        /**
         * listeners
         * @type {[Function]}
         * @private
         */
        this.listeners_ = [];

        /**
         * last copy of the target.
         * @type {Object}
         * @private;
         */
        this.last_ = {};
        this.compare_();

        ObjectObserver.addInstance_(this);
    }

    /**
     * Main loop timer
     * @type {number|null}
     * @private
     */
    ObjectObserver.timerID_ = null;

    /**
     * Main loop interval (ms)
     * @const {number}
     * @private
     */
    ObjectObserver.LOOP_INTERVAL_ = 60;

    /**
     * ObjectObserver instance map.
     * @type {Map}
     * @private
     */
    ObjectObserver.instances_ = new Map();

    /**
     *	cahnge type
     *	@enum {string}
     */
    ObjectObserver.ChangeType = {
        ADD: 'add',
        UPDATE: 'update',
        DELETE: 'delete'
    };

    /**
     * Add ObjectObserver isntance.
     * @param {ObjectObserver} observer observer instance.
     * @private
     */
    ObjectObserver.addInstance_ = function(observer) {
        this.instances_.set(observer.object_, observer);

        if (this.timerID_ === null) {
            this.timerID_ = setInterval(this.mainLoop, ObjectObserver.LOOP_INTERVAL_);
        }
    };

    /**
     * Get ObjectObserver isntance.
     * @param {Object} object observe target object.
     * @return {ObjectObserver} observer instance.
     * @private
     */
    ObjectObserver.getInstance_ = function(object) {
        return this.instances_.get(object);
    };

    /**
     * remove ObjectObserver isntance.
     * @param {ObjectObserver} observer observer instance.
     * @private
     */
    ObjectObserver.removeInstance_ = function(observer) {
        this.instances_.delete(observer.object_);

        if (this.instances_.size === 0) {
            clearInterval(this.timerID_);
            this.timerID_ = null;
        }
    };

    /**
     * Add change callback.
     * If the callback is added already, do nothing.
     *
     * @param {Function} callback [description]
     * @private
     */
    ObjectObserver.prototype.addListener_ = function(callback) {
        var listeners = this.listeners_,
            index = listeners.indexOf(callback);

        if (index !== -1) return;

        listeners.push(callback);
    };

    ObjectObserver.mainLoop = function() {
        this.instances_.forEach(function(instance) {
            instance.compare_();
        });
    };
    ObjectObserver.mainLoop = ObjectObserver.mainLoop.bind(ObjectObserver);

    /**
     * compare change diffs.
     * @private
     * @TODO tuneup
     */
    ObjectObserver.prototype.compare_ = function() {
        var oldObj = this.last_,
            newObj = this.object_,
            changes = [],
            newKeys = Object.getOwnPropertyNames(newObj),
            oldKeys = Object.getOwnPropertyNames(oldObj),
            i, max, key;

        for (i = 0, max = newKeys.length; i < max; i++) {
            key = newKeys[i];
            if (oldObj.hasOwnProperty(key)) {
                if (oldObj[key] !== newObj[key]) {
                    changes.push({
                        type: ObjectObserver.ChangeType.UPDATE,
                        object: newObj,
                        oldValue: oldObj[key],
                        name: key
                    });
                    oldObj[key] = newObj[key];
                }
            } else {
                changes.push({
                    type: ObjectObserver.ChangeType.ADD,
                    object: newObj,
                    name: key
                });
                oldObj[key] = newObj[key];
            }
        }

        for (i = 0, max = oldKeys.length; i < max; i++) {
            key = oldKeys[i];
            if (newKeys.indexOf(key) === -1) {
                changes.push({
                    type: ObjectObserver.ChangeType.DELETE,
                    object: newObj,
                    name: key,
                    oldValue: oldObj[key]
                });

                delete oldObj[key];
            }
        }

        if (changes.length === 0) return;
        this.publishChanges(changes);
    };

    /**
     * publish change event.
     * @param {Array} changes changes.
     */
    ObjectObserver.prototype.publishChanges = function(changes) {
        this.listeners_.forEach(function(listener) {
            listener(changes);
        });
    };

    /**
     * Remove change callback.
     * After removing, if callbacks is nothing no more,
     * this ObjectObserver instance is deleted.
     *
     * @param {Function} callback [description]
     */
    ObjectObserver.prototype.removeListener_ = function(callback) {
        var listeners = this.listeners_,
            index = listeners.indexOf(callback);

        if (index === -1) return;

        listeners.splice(index, 1);

        if (listeners.length === 0) {
            ObjectObserver.removeInstance_(observer);
        }
    };

    /**
     *	Observe object.
     *	@param {Object} object observe target object.
     *	@param {Function} callback callback.
     */
    Object.observe = function(object, callback) {
        var observer = ObjectObserver.getInstance_(object);

        if (!observer) {
            observer = new ObjectObserver(object);
        }

        observer.addListener_(callback);
    };

    /**
     *	Unobserve object.
     *	@param {Object} object observe target object.
     *	@param {Function} callback callback.
     */
    Object.unobserve = function(object, callback) {
        var observer = ObjectObserver.getInstance_(object);

        if (!observer) return;

        observer.removeListener_(callback);
    };

    module.exports = ObjectObserver;
}

},{"../map.js":13}],16:[function(require,module,exports){
function Binding() {

};

module.exports = Binding;

},{}],17:[function(require,module,exports){
var util = require('../util.js'),
    Map = require('../map.js'),
    CustomObserver = require('../observer/customobserver.js'),
    Binding = require('./binding.js');

/**
 * @constructor
 */
function Template() {
    /**
     * element
     * @type {Element}
     */
    this.dom;

    /**
     * binding data
     * @type {[Binding]}
     */
    this.bindings = [];
};

/**
 * The type of the result of 'Template.create()'
 * @typedef {{
 *
 * }}
 */
Template.CreateResult;

/**
 * Template map
 * @type {Map}
 * @private
 */
Template.templates_ = new Map();

/**
 * View constructor map
 * @type {Map}
 * @private
 */
Template.viewConstructors_ = new Map();

/**
 * HTML instantiate container
 * @type {HTMLDivElement}
 * @private
 */
Template.container_ = document.createElement('div');

/**
 * Registers view constructor with name.
 * @param {string} tagName tag name.
 * @param {Function} constructor constructor.
 */
Template.setViewConstructor = function(tagName, constructor) {
    Template.viewConstructors_.set(tagName.toUpperCase(), constructor);
};

/**
 * Returns view constructor of specified name.
 * @param {string} tagName tag name.
 * @return {Function} constructor.
 */
Template.getViewConstructor = function(tagName) {
    return Template.viewConstructors_.get(tagName.toUpperCase());
};

/**
 * Create DOM from template for specified name.
 * @param {string} tmplName template name.
 * @param {Object} context binded context.
 * @return {Template.CreateResult} result.
 */
Template.create = function(tmplName, context) {
    var template = Template.getTemplate_(tmplName);

    if (!template) {
        throw new Error('Template "' + tmplName + '" is not found.');
    }

    return template.create(context);
};

/**
 * Returns the template for specified name.
 * @param {string} tmplName template name.
 * @return {Template} template.
 */
Template.getTemplate_ = function(tmplName) {
    var template = Template.templates_.get(tmplName),
        tmplDOM;
    if (template) return template;

    tmplDOM = document.querySelector('template[name="' + tmplName + '"]');
    if (!tmplDOM) return null;

    template = new Template();
    Template.container_.innerHTML = tmplDOM.innerHTML;
    template.dom = Template.container_.firstElementChild;
    tmplDOM.parentNode.removeChild(tmplDOM);

    Template.templates_.set(tmplName, template);
    return template;
};

/**
 * Replaces from HTMLUnknownElement to custom view element if need.
 * @param {Element} element elemnt.
 * @param {Template.CreateResult} result create result object. If need, DOM map (result.$) is changed.
 * @param {boolean} [flagRecursive=false] If true, this method applied for child elements recursivly.
 */
Template.replaceHTMLUnknownElement = function(element, result, flagRecursive) {
    var children = util.slice(element.children, 0),
        childNodes = util.slice(element.childNodes, 0),
        viewConstructor, view, viewRoot, parent, name;

    flagRecursive = flagRecursive || false;

    if (element instanceof HTMLUnknownElement) {
        //1. create custom view.
        viewConstructor = Template.getViewConstructor(element.tagName);
        if (viewConstructor) {
            view = new viewConstructor();
            viewRoot = view.$.root;

            //2. move children.
            childNodes.forEach(function(childNode) {
                view.appendChild(childNode);
            });

            //3. copy attributes
            util.forEach(element.attributes, function(attr) {
                switch (attr.name) {
                    case 'class':
                        viewRoot.classList.add.apply(viewRoot.classList, attr.value.split(' '));
                        break;

                    default:
                        viewRoot.setAttribute(attr.name, attr.value);
                        break;
                }
            });

            //4. replace from HTMLUnknownElement to custom view.
            parent = element.parentNode;
            parent.insertBefore(view.$.root, element);
            parent.removeChild(element);

            //5. If element has [name] attribute, replace DOM map.
            if (element.hasAttribute('name')) {
                name = element.getAttribute('name');
                result.$[name] = viewRoot;
                result.childViews[name] = view;
            }
        }
    }

    if (flagRecursive) {
        children.map(function(child) {
            Template.replaceHTMLUnknownElement(child, result, true);
        });
    }
};

/**
 * Create DOM from this template.
 * @param {Object} context binded context.
 * @return {Template.CreateResult} result.
 */
Template.prototype.create = function(context) {
    /**
     * 1. Clone node
     */
    var $ = {},
        root = this.dom.cloneNode(true),
        childViews = {},
        result = {
            $: $,
            childViews: childViews
        };

    $.root = root;
    util.forEach(root.querySelectorAll('[name]'), function(node) {
        $[node.getAttribute('name')] = node;
    });
    $.content = root.querySelector('content, [content]') || root;

    /**
     * 2. Convert HTMLUnknownElement -> CustomView
     *
     * @TODO
     * On current version, if root element is the instance of HTMLUnknownElement,
     * it won't work.
     *
     * example:
     * ExampleView's root element is <CustomView> (HTMLUnknownElement), and
     * this view can't work.
     *
     * <template name="ExampleView">
     *   <CustomView>
     *     <span>ExampleView won't work.</span>
     *   </CustomView>
     * </template>
     */
    Template.replaceHTMLUnknownElement(root, result, true);

    /**
     * 3. Configuration of bindings
     */
    this.bindings.forEach(function(binding) {
        //3-1. copy binding
        //3-2. change binding target null -> context
        //3-3. change binding node templateNode -> realNode
    });

    return result;
};

module.exports = Template;

},{"../map.js":13,"../observer/customobserver.js":14,"../util.js":18,"./binding.js":16}],18:[function(require,module,exports){
var util = {};

util.inherits = function(child, parent) {
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
    child.prototype.super = parent.prototype;
    util.extend(child, parent);
};

util.mixin = function(target, src) {
    util.extend(target.prototype, src.prototype, {
        construcotr: target.prototype.constructor,
        super: target.prototype.super,
    });
    util.extend(child, parent);
};

util.extend = function(target, srces) {
    util.slice(arguments, 1)
        .forEach(function(src) {
            Object.keys(src).forEach(function(keyName) {
                target[keyName] = src[keyName];
            });
        });

    return target;
};

util.isObject = function(exp) {
    return !!exp && typeof exp === 'object';
};

util.isString = function(exp) {
    return typeof exp === 'string';
};

util.isFunction = function(exp) {
    return typeof exp === 'function';
};

util.runAsync = function(fn) {
    return util.isFunction(window.requestAnimationFrame) ?
        requestAnimationFrame(fn) :
        setTimeout(fn);
};

util.once = function(node, type, callback) {
    var proxy = function() {
        node.removeEventListener(type, proxy);

        if (util.isFunction(callback)) {
            callback.apply(this, arguments);
        } else if (util.isFunction(callback.handleEvent)) {
            callback.handleEvent.apply(callback, arguments);
        }
    };

    node.addEventListener(type, proxy);
};

var ap = Array.prototype

util.forEach = ap.forEach.call.bind(ap.forEach);
util.map = ap.forEach.call.bind(ap.map);
util.slice = ap.forEach.call.bind(ap.slice);

module.exports = util;

},{}],19:[function(require,module,exports){
var View = require('../view/view.js'),
    ToolBarView = require('../toolbarview/toolbarview.js'),
    SwitchView = require('../switchview/switchview.js'),
    AuthPageView = require('../authpageview/authpageview.js'),
    ProjectPageView = require('../projectpageview/projectpageview.js'),
    ProjectCreatePageView = require('../projectcreatepageview/projectcreatepageview.js'),
    UserPageView = require('../userpageview/userpageview.js'),
    ConfigPageVIew = require('../configpageview/configpageview.js'),
    util = require('../../service/util.js'),
    Auth = require('../../model/auth.js'),
    User = require('../../model/user.js');

function AppView() {
    var self = this;

    View.apply(this, arguments);

    /**
     *  The result of url routing.
     *  @type {Object}
     */
    this.rout;

    /**
     *  Authentication state.
     *  @type {boolean}
     */
    this.isAuthed = false;

    /**
     *  Authenticated user.
     *  @type {User}
     */
    this.authedUser = null;

    this.updateAuthState();

    window.addEventListener('hashchange', this.onHashChange);
    window.addEventListener('rout.change', this);
    window.app = this;

    this.routing();
}
util.inherits(AppView, View);

AppView.prototype.setHash = function(hashURI) {
    document.location.hash = '#!' + hashURI;
};

/**
 *  check authentication state
 */
AppView.prototype.updateAuthState = function(callback) {
    var self = this;

    /**
     *  @TODO LocalStorageからtoken取り出す
     */

    User.getMe(function(err, me) {
        if (err) {
            self.setAuthedUser(null);
            util.isFunction(callback) && callback(err, null);
            return;
        }

        self.setAuthedUser(new User(me));
        util.isFunction(callback) && callback(null, me);
    });
};

AppView.prototype.setAuthedUser = function(user) {
    if (this.authedUser === user) return;

    if (user) {
        this.isAuthed = true;
        this.authedUser = user;
    } else {
        this.isAuthed = false;
        this.authedUser = null;
    }

    window.dispatchEvent(new CustomEvent('auth.change'));
};

/**
 *  Sign up.
 */
AppView.prototype.signUp = function(userName, password, callback) {
    var self = this;

    Auth.signUp(userName, password, function(err, user) {

        if (err) {
            self.setAuthedUser(null);
            util.isFunction(callback) && callback(err, null);
            return;
        }

        self.setAuthedUser(user);
        util.isFunction(callback) && callback(null, user);
    });
};

/**
 *  Sign in.
 */
AppView.prototype.signIn = function(userName, password, callback) {
    var self = this;

    Auth.signIn(userName, password, function(err, user) {

        if (err) {
            self.setAuthedUser(null);
            util.isFunction(callback) && callback(err, null);
            return;
        }

        self.setAuthedUser(user);
        util.isFunction(callback) && callback(null, user);
    });
};

/**
 *  Sign out.
 */
AppView.prototype.signOut = function(callback) {
    var self = this;

    Auth.signOut(function() {
        self.setAuthedUser(null);
        util.isFunction(callback) && callback(null);
    });
};


/**
 *  check rout
 *  @param {string} [url] URL if elipsis, it is 'document.localtion.href'.
 *  @return {Object} parameters of rout
 */
AppView.prototype.routing = function(url) {
    var controller,
        rout = null,
        ma;

    url = url || window.location.hash.substr(2);

    if (url === '' || url === '/') {
        if (this.isAuthed) {
            rout = {
                mode: 'user',
                userName: this.authedUser.name
            };
        } else {
            rout = {
                mode: 'signin'
            };
        }

    } else if (url === '/signup') {
        rout = {
            mode: 'signup'
        };

    } else if (url === '/signin') {
        // /signin
        rout = {
            mode: 'signin'
        };

    } else if (ma = url.match(/^\/user\/([^\/]+)\/config$/)) {
        // /user/:userName/config
        rout = {
            mode: 'config',
            userName: ma[1]
        };

    } else if (ma = url.match(/^\/user\/([^\/]+)\/project_create$/)) {
        // /user/:userName/project_create
        rout = {
            mode: 'project_create',
            userName: ma[1]
        };

    } else if (ma = url.match(/^\/user\/([^\/]+)\/project\/([^\/]+)$/)) {
        // /user/:userName/project/:projectName
        rout = {
            mode: 'project',
            userName: ma[1],
            projectName: ma[2]
        };

    } else if (ma = url.match(/^\/user\/([^\/]+)$/)) {
        // /user/:userName
        rout = {
            mode: 'user',
            userName: ma[1]
        };

    } else {
        //  no match.
        rout = {
            mode: 'error404'
        }
    }

    this.rout = rout;

    window.dispatchEvent(new Event('rout.change'));
};

AppView.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'rout.change':
            this.onRoutChange(ev);
            break;
    }
};

AppView.prototype.onRoutChange = function(ev) {
    var rout = this.rout,
        self = this;

    switch (rout.mode) {
        case 'user':
            this.childViews.switchView
                .fadeTo(this.$.userPageView);
            this.childViews.userPageView.setUserName(rout.userName);
            break;

        case 'config':
            this.childViews.switchView
                .fadeTo(this.$.configPageView);
            this.childViews.configPageView.setUserName(rout.userName);
            break;

        case 'project_create':
            this.childViews.switchView
                .fadeTo(this.$.projectCreatePageView);
            break;

        case 'project':
            this.childViews.switchView
                .fadeTo(this.$.projectPageView);
            this.childViews.projectPageView.setProjectName(rout.userName, rout.projectName);
            break;

        case 'signin':
            this.childViews.switchView
                .fadeTo(this.$.authPageView, function() {
                    self.childViews.authPageView.focus();
                });
            break;

        case 'signup':
            this.childViews.switchView
                .fadeTo(this.$.authPageView);
            break;

        case 'error404':
            this.childViews.switchView
                .fadeTo(this.$.authPageView);
            break;
    }
};

AppView.prototype.onUserInineViewClick = function(ev) {
    this.authedUser = null;
    this.isAuthed = false;
    window.dispatchEvent(new CustomEvent('auth.change'));

    this.childViews.switchView
        .hideDown()
        .fadeIn(this.$.authPageView);
};

AppView.prototype.onHashChange = function(ev) {
    app.rout = app.routing();
};

AppView.setViewConstructor('AppView');

module.exports = AppView;

},{"../../model/auth.js":1,"../../model/user.js":5,"../../service/util.js":18,"../authpageview/authpageview.js":20,"../configpageview/configpageview.js":24,"../projectcreatepageview/projectcreatepageview.js":27,"../projectpageview/projectpageview.js":29,"../switchview/switchview.js":31,"../toolbarview/toolbarview.js":32,"../userpageview/userpageview.js":34,"../view/view.js":35}],20:[function(require,module,exports){
var View = require('../view/view.js'),
    CardView = require('../cardview/cardview.js'),
    AuthView = require('../authview/authview.js'),
    util = require('../../service/util.js');

function AuthPageView() {
    View.apply(this, arguments);
}
util.inherits(AuthPageView, View);

AuthPageView.prototype.focus = function() {
    this.childViews.authView.focus();
}

AuthPageView.prototype.handleEvent = function(ev) {
    switch (ev.type) {

    }
}
AuthPageView.setViewConstructor('AuthPageView');

module.exports = AuthPageView;

},{"../../service/util.js":18,"../authview/authview.js":21,"../cardview/cardview.js":23,"../view/view.js":35}],21:[function(require,module,exports){
var View = require('../view/view.js'),
    ButtonView = require('../buttonview/buttonview.js'),
    util = require('../../service/util.js'),
    Auth = require('../../model/auth.js');

function AuthView() {
    View.apply(this, arguments);

    this.$.submit.addEventListener('click', this);
}
util.inherits(AuthView, View);

AuthView.prototype.focus = function() {
    var userName = this.$.userName,
        value = userName.value;

    userName.focus();

    if (value.length > 0) {
        userName.selectionStart = 0;
        userName.selectionEnd = value.length;
    }
};

AuthView.prototype.signIn = function() {
    var userName = this.$.userName.value,
        password = this.$.password.value,
        self = this;

    if (!this.validate()) return;

    this.disabled = true;

    app.signIn(userName, password, function(err, user) {
        self.disabled = false;

        if (err) {
            self.$.root.classList.add('is-error-invalid');
            self.focus();
        } else {
            self.$.userName.value = '';
            self.$.password.value = '';
            app.setHash(user.uri);
        }
    });
};

AuthView.prototype.validate = function() {
    var userName = this.$.userName.value,
        password = this.$.password.value,
        isValid = true,
        classList = this.$.root.classList;

    classList.remove('is-error-invalid');

    if (!password) {
        isValid = false;
        classList.add('is-error-password');
        this.$.password.focus();
    } else {
        classList.remove('is-error-password');
    }

    if (!userName) {
        isValid = false;
        classList.add('is-error-userName');
        this.$.userName.focus();
    } else {
        classList.remove('is-error-userName');
    }

    return isValid;
};

AuthView.prototype.setDisabled = function(disabled) {
    this.$.userName.disabled =
        this.$.password.disabled =
        this.$.submit.disabled = disabled;
};
AuthView.prototype.__defineSetter__('disabled', AuthView.prototype.setDisabled);

AuthView.prototype.getDisabled = function() {
    return this.$.userName.disabled;
};
AuthView.prototype.__defineGetter__('disabled', AuthView.prototype.getDisabled);

AuthView.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'click':
            this.onSubmitClick(ev);
            break;
    }
};

AuthView.prototype.onSubmitClick = function(ev) {
    if (this.disabled) return;

    ev.stopPropagation();
    ev.preventDefault();

    this.signIn();
};

AuthView.setViewConstructor('AuthView');

module.exports = AuthView;

},{"../../model/auth.js":1,"../../service/util.js":18,"../buttonview/buttonview.js":22,"../view/view.js":35}],22:[function(require,module,exports){
var View = require('../view/view.js'),
    RippleView = require('../rippleview/rippleview.js');
util = require('../../service/util.js');

function ButtonView() {
    View.apply(this, arguments);

    this.$.root.addEventListener('click', this);
    this.$.root.addEventListener('mousedown', this);
    this.$.root.addEventListener('mouseup', this);
    this.$.root.addEventListener('keydown', this);

    this.$.root.setAttribute('tabindex', 0);
}
util.inherits(ButtonView, View);

ButtonView.prototype.setDisabled = function(disabled) {
    if (disabled === this.disabled) return;

    if (disabled) {
        this.$.root.setAttribute('disabled', 'disabled');
    } else {
        this.$.root.removeAttribute('disabled');
    }
};
ButtonView.prototype.__defineSetter__('disabled', ButtonView.prototype.setDisabled);

ButtonView.prototype.getDisabled = function() {
    return this.$.root.hasAttribute('disabled');
};
ButtonView.prototype.__defineGetter__('disabled', ButtonView.prototype.getDisabled);

ButtonView.prototype.handleEvent = function(ev) {
    var KEYCODE_ENTER = 13;

    switch (ev.type) {
        case 'click':
            if (this.disabled) {
                ev.stopPropagation();
                ev.preventDefault();
            }
            break;

        case 'mousedown':
            if (this.disabled) {
                return;
            }
            this.onMouseDown(ev);
            break;

        case 'mouseup':
            if (this.disabled) {
                return;
            }
            this.onMouseUp(ev);
            break;

        case 'keydown':
            if (ev.keyCode !== KEYCODE_ENTER || this.disabled) {
                return;
            }
            this.onPressEnter(ev);
            break;
    }
};

ButtonView.prototype.onMouseDown = function(ev) {
    var gcr = this.$.root.getBoundingClientRect(),
        x = ev.clientX - gcr.left,
        y = ev.clientY - gcr.top;

    this.childViews.ripple.rippleIn(x, y);
};

ButtonView.prototype.onMouseUp = function(ev) {
    this.childViews.ripple.rippleOut();
};

ButtonView.prototype.onPressEnter = function(ev) {
    var gcr = this.$.root.getBoundingClientRect();

    this.childViews.ripple.rippleIn(gcr.width / 2, gcr.height / 2);
    this.childViews.ripple.rippleOut();
    this.$.root.click();
};

ButtonView.setViewConstructor('ButtonView');

module.exports = ButtonView;

},{"../../service/util.js":18,"../rippleview/rippleview.js":30,"../view/view.js":35}],23:[function(require,module,exports){
var View = require('../view/view.js'),
    util = require('../../service/util.js');

function CardView() {
    View.apply(this, arguments);
}
util.inherits(CardView, View);

CardView.setViewConstructor('CardView');

module.exports = CardView;

},{"../../service/util.js":18,"../view/view.js":35}],24:[function(require,module,exports){
var View = require('../view/view.js'),
    UserInlineView = require('../userinlineview/userinlineview.js'),
    CardView = require('../cardview/cardview.js'),
    util = require('../../service/util.js'),
    User = require('../../model/user.js');

function ConfigPageView() {
    View.apply(this, arguments);

    this.user;
    this.setUser(null);

    window.addEventListener('auth.change', this);
}
util.inherits(ConfigPageView, View);

ConfigPageView.prototype.setUser = function(user) {
    this.user = user;
    this.childViews.userInlineView.setUser(user);
};

ConfigPageView.prototype.setUserName = function(userName) {
    var self = this;
    User.getByName(userName, function(err, user) {
        if (err) {
            return;
        }

        self.setUser(user);
    });
};

ConfigPageView.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'auth.change':
            this.onAuthChange(ev);
            break;

        case 'click':
            app.signOut(function() {
                app.setHash('/signin');
            });
    }
};

ConfigPageView.prototype.onAuthChange = function() {
    this.childViews.userInlineView.setUser(app.authedUser);
};

ConfigPageView.setViewConstructor('ConfigPageView');

module.exports = ConfigPageView;

},{"../../model/user.js":5,"../../service/util.js":18,"../cardview/cardview.js":23,"../userinlineview/userinlineview.js":33,"../view/view.js":35}],25:[function(require,module,exports){
var util = require('../../service/util.js'),
    View = require('../view/view.js'),
    Animation = require('../../service/animation.js');

function ContextMenuView() {
    View.apply(this, arguments);

    this.$.root.addEventListener('blur', this);
}
util.inherits(ContextMenuView, View);

ContextMenuView.setViewConstructor('ContextMenuView');

ContextMenuView.prototype.getIsVisible = function() {
    return this.$.root.hasAttribute('visible');
};
ContextMenuView.prototype.__defineGetter__('isVisible', ContextMenuView.prototype.getIsVisible);

ContextMenuView.prototype.setIsVisible = function(value) {
    if (value) {
        this.$.root.setAttribute('visible', '');
    } else {
        this.$.root.removeAttribute('visible');
    }
};
ContextMenuView.prototype.__defineSetter__('isVisible', ContextMenuView.prototype.setIsVisible);

ContextMenuView.prototype.fadeIn = function(callback) {
    var animation = new Animation(),
        root = this.$.root,
        self = this;

    if (this.isVisible) {
        util.isFunction(callback) && calback();
        return;
    }

    animation.then(root, function(node) {
            self.isVisible = true;
            node.style.transition = '0.3s ease';
            node.style.transform = 'translateY(-10px)';
            node.style.opacity = 0;
        })
        .wait(root, function(node) {
            node.style.transform = 'translateY(0px)'
            node.style.opacity = 1;
        })
        .then(root, function(node) {
            node.style.transition = '';
            node.style.transform = ''
            node.style.opacity = '';
        })
        .then(root, function(node) {
            node.focus();
            util.isFunction(callback) && calback();
        });
};

ContextMenuView.prototype.fadeOut = function(callback) {
    var animation = new Animation(),
        root = this.$.root,
        self = this;

    if (!this.isVisible) {
        util.isFunction(callback) && calback();
        return;
    }

    animation.then(root, function(node) {
            node.style.transition = '0.3s ease';
            node.style.opacity = 1;
        })
        .wait(root, function(node) {
            node.style.opacity = 0;
        })
        .then(root, function(node) {
            node.style.transition = '';
            node.style.opacity = '';
            self.isVisible = false;
        })
        .then(root, function(node) {
            util.isFunction(callback) && calback();
        });
};

ContextMenuView.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'blur':
            this.onBlur(ev);
            break;
    }
};

ContextMenuView.prototype.onBlur = function(ev) {
    this.fadeOut();
};

module.exports = ContextMenuView;

},{"../../service/animation.js":7,"../../service/util.js":18,"../view/view.js":35}],26:[function(require,module,exports){
var View = require('../view/view.js'),
    util = require('../../service/util.js');

function LazyImageView() {
    View.apply(this, arguments);

    this.$.image.addEventListener('load', this);
    this.$.image.addEventListener('error', this);

    this.state = this.state || LazyImageView.State.NOTHING;

    this.src = this.src || '';
}
util.inherits(LazyImageView, View);

LazyImageView.State = {
    NOTHING: 'nothing',
    LOADING: 'loading',
    LOAD: 'load',
    ERROR: 'error'
};

LazyImageView.prototype.getState = function() {
    return this.$.root.getAttribute('state');
};
LazyImageView.prototype.__defineGetter__('state', LazyImageView.prototype.getState);

LazyImageView.prototype.setState = function(newVal) {
    if (this.state === newVal) return;
    this.$.root.setAttribute('state', newVal);
};
LazyImageView.prototype.__defineSetter__('state', LazyImageView.prototype.setState);

LazyImageView.prototype.getSrc = function() {
    return this.$.image.src;
};
LazyImageView.prototype.__defineGetter__('src', LazyImageView.prototype.getSrc);

LazyImageView.prototype.setSrc = function(newVal) {
    if (this.src === newVal) return;
    this.$.image.src = newVal;
    this.load();
};
LazyImageView.prototype.__defineSetter__('src', LazyImageView.prototype.setSrc);

LazyImageView.prototype.load = function() {
    var src = this.src;

    if (!src) {
        this.state = LazyImageView.State.NOTHING;
        this.$.image.src = '';
        return;
    }

    this.state = LazyImageView.State.LOADING;
    this.$.image.src = this.src;
};

LazyImageView.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'load':
            this.onImageLoad(ev);
            break;

        case 'error':
            this.onImageError(ev);
            break;
    }
};

LazyImageView.prototype.onImageLoad = function(ev) {
    if (this.state !== LazyImageView.State.LOADING) return;
    this.state = LazyImageView.State.LOAD;

    this.$.root.dispatchEvent(new Event('load'))
};

LazyImageView.prototype.onImageError = function(ev) {
    if (this.state !== LazyImageView.State.LOADING) return;
    this.state = LazyImageView.State.ERROR;

    this.$.root.dispatchEvent(new Event('error'))
};

LazyImageView.setViewConstructor('LazyImageView');

module.exports = LazyImageView;

},{"../../service/util.js":18,"../view/view.js":35}],27:[function(require,module,exports){
var View = require('../view/view.js'),
    UserInlineView = require('../userinlineview/userinlineview.js'),
    CardView = require('../cardview/cardview.js'),
    util = require('../../service/util.js'),
    User = require('../../model/user.js'),
    Project = require('../../model/project.js');

function ProjectCreatePageView() {
    View.apply(this, arguments);

    this.user;
    this.setUser(null);

    window.addEventListener('auth.change', this);
}
util.inherits(ProjectCreatePageView, View);

ProjectCreatePageView.prototype.setUser = function(user) {
    this.user = user;
    this.childViews.userInlineView.setUser(user);
};

ProjectCreatePageView.prototype.setUserName = function(userName) {
    var self = this;
    User.getByName(userName, function(err, user) {
        if (err) {
            return;
        }

        self.setUser(user);
    });
};

ProjectCreatePageView.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'auth.change':
            this.onAuthChange(ev);
            break;

        case 'click':
            app.signOut(function() {
                app.setHash('/signin');
            });
    }
};

ProjectCreatePageView.prototype.onAuthChange = function() {
    this.childViews.userInlineView.setUser(app.authedUser);
};

ProjectCreatePageView.setViewConstructor('ProjectCreatePageView');

module.exports = ProjectCreatePageView;

},{"../../model/project.js":4,"../../model/user.js":5,"../../service/util.js":18,"../cardview/cardview.js":23,"../userinlineview/userinlineview.js":33,"../view/view.js":35}],28:[function(require,module,exports){
var View = require('../view/view.js'),
    util = require('../../service/util.js'),
    LazyImageView = require('../lazyimageview/lazyimageview.js'),
    Project = require('../../model/project.js');

function ProjectInlineView() {
    View.apply(this, arguments);

    this.project = null;
    this.update();

    this.$.link.addEventListener('click', this);
}
util.inherits(ProjectInlineView, View);

ProjectInlineView.prototype.setProject = function(project) {
    this.project = project;
    this.update();
};

ProjectInlineView.prototype.update = function() {
    var project = this.project,
        self = this;

    if (project) {
        this.$.projectName.textContent = project.name;
        this.$.link.href = '#!' + project.uri;

        this.$.root.classList.remove('is-project-nothing');
    } else {
        this.$.root.classList.add('is-project-nothing');
    }
};

ProjectInlineView.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'click':
            this.onClick(ev);
            break;
    }
};

ProjectInlineView.prototype.onClick = function(ev) {
    ev.stopPropagation();

    var event = new Event('click');
    this.$.root.dispatchEvent(event);

    if (event.defaultPrevented || !this.project) {
        ev.preventDefault();
    }
};

ProjectInlineView.setViewConstructor('ProjectInlineView');

module.exports = ProjectInlineView;

},{"../../model/project.js":4,"../../service/util.js":18,"../lazyimageview/lazyimageview.js":26,"../view/view.js":35}],29:[function(require,module,exports){
var View = require('../view/view.js'),
    UserInlineView = require('../userinlineview/userinlineview.js'),
    ProjectInlineView = require('../projectinlineview/projectinlineview.js'),
    CardView = require('../cardview/cardview.js'),
    util = require('../../service/util.js'),
    User = require('../../model/user.js'),
    Project = require('../../model/project.js');

function ProjectPageView() {
    View.apply(this, arguments);

    this.user;
    this.setUser(null);

    this.project;
    this.setProject(null);

    window.addEventListener('auth.change', this);
}
util.inherits(ProjectPageView, View);

ProjectPageView.prototype.setProject = function(project) {
    this.project = project;
    this.childViews.projectInlineView.setProject(project);

    if (project) {
        this.setUserName(project.owner);
    } else {
        this.setUser(null);
    }
};

ProjectPageView.prototype.setProjectName = function(userName, projectName) {
    var self = this;
    Project.getByName(userName, projectName, function(err, project) {
        if (err) {
            return;
        }

        self.setProject(project);
    });
};


ProjectPageView.prototype.setUser = function(user) {
    this.user = user;
    this.childViews.userInlineView.setUser(user);
};

ProjectPageView.prototype.setUserName = function(userName) {
    var self = this;
    User.getByName(userName, function(err, user) {
        if (err) {
            return;
        }

        self.setUser(user);
    });
};

ProjectPageView.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'auth.change':
            this.onAuthChange(ev);
            break;

        case 'click':
            app.signOut(function() {
                app.setHash('/signin');
            });
    }
};

ProjectPageView.prototype.onAuthChange = function() {
    this.childViews.userInlineView.setUser(app.authedUser);
};

ProjectPageView.setViewConstructor('ProjectPageView');

module.exports = ProjectPageView;

},{"../../model/project.js":4,"../../model/user.js":5,"../../service/util.js":18,"../cardview/cardview.js":23,"../projectinlineview/projectinlineview.js":28,"../userinlineview/userinlineview.js":33,"../view/view.js":35}],30:[function(require,module,exports){
var View = require('../view/view.js'),
    util = require('../../service/util.js');

function RippleView() {
    View.apply(this, arguments);
}
util.inherits(RippleView, View);

RippleView.prototype.rippleIn = function(x, y) {
    var main = this.$.main;

    main.style.left = x - 15 + 'px';
    main.style.top = y - 15 + 'px';

    main.classList.remove('is-rippleIn');
    this.$.root.classList.remove('is-rippleOut');
    util.runAsync(function() {
        main.classList.add('is-rippleIn');
    });
};

RippleView.prototype.rippleOut = function() {
    var self = this;

    this.$.root.classList.remove('is-rippleOut');
    util.runAsync(function() {
        self.$.root.classList.add('is-rippleOut');
    });
};

RippleView.setViewConstructor('RippleView');

module.exports = RippleView;

},{"../../service/util.js":18,"../view/view.js":35}],31:[function(require,module,exports){
var View = require('../view/view.js'),
    util = require('../../service/util.js'),
    Animation = require('../../service/animation.js')

function SwitchView() {
    View.apply(this, arguments);
}
util.inherits(SwitchView, View);

SwitchView.prototype.getCurrentPageNode = function() {
    var children = this.$.content.children,
        i, max;
    for (i = 0, max = children.length; i < max; i++) {
        if (children[i].hasAttribute('visible')) {
            return children[i];
        }
    }

    return null;
};
SwitchView.prototype.__defineGetter__('currentPageNode', SwitchView.prototype.getCurrentPageNode);

SwitchView.prototype.fadeTo = function(nextNode, callback) {
    var currentNode = this.currentPageNode,
        animation;

    if (currentNode === nextNode) return;

    animation = new Animation();

    if (currentNode) {
        animation
            .then(currentNode, function(node) {
                node.style.transition = '0.3s ease-out';
                node.style.transform = 'translateY(0px)';
                node.style.opacity = 1;
            })
            .wait(currentNode, function(node) {
                node.style.transform = 'translateY(50px)';
                node.style.opacity = 0;
            })
            .then(currentNode, function(node) {
                node.removeAttribute('visible');
                node.style.transition = '';
                node.style.transform = '';
                node.style.opacity = '';
            });
    }

    animation
        .then(nextNode, function(node) {
            node.setAttribute('visible', '');
            node.style.transition = '0.3s ease-in';
            node.style.transform = 'translateY(50px)';
            node.style.opacity = 0;
        })
        .wait(nextNode, function(node) {
            node.style.transform = 'translateY(0px)';
            node.style.opacity = 1;
        })
        .then(nextNode, function(node) {
            node.style.transition = '';
            node.style.transform = '';
            node.style.opacity = '';
        })
        .then(nextNode, function(node) {
            util.isFunction(callback) && callback();
        });

    return this;
};

SwitchView.setViewConstructor('SwitchView');

module.exports = SwitchView;

},{"../../service/animation.js":7,"../../service/util.js":18,"../view/view.js":35}],32:[function(require,module,exports){
var View = require('../view/view.js'),
    UserInlineView = require('../userinlineview/userinlineview.js'),
    ContextMenuView = require('../contextmenuview/contextmenuview.js'),
    util = require('../../service/util.js'),
    User = require('../../model/user.js');

/**
 *	ToolBarView
 *	@constructor
 *	@extend {View}
 */
var ToolBarView = function() {
    View.apply(this, arguments);

    this.$.userInlineView.addEventListener('click', this);
    this.$.linkConfig.addEventListener('click', this);
    this.$.linkCreateProject.addEventListener('click', this);
    this.$.linkSignOut.addEventListener('click', this);

    window.addEventListener('auth.change', this);
};
util.inherits(ToolBarView, View);

ToolBarView.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'auth.change':
            this.onAuthChange(ev);
            break;

        case 'click':
            if (ev.target === this.$.userInlineView) {
                this.onUserInlineViewClick(ev);

            } else if (ev.target === this.$.linkCreateProject) {
                if (app.isAuthed) {
                    this.childViews.contextMenuView.fadeOut();
                    app.setHash(app.authedUser.uri + '/project_create');
                }

            } else if (ev.target === this.$.linkConfig) {
                if (app.isAuthed) {
                    this.childViews.contextMenuView.fadeOut();
                    app.setHash(app.authedUser.uri + '/config');
                }

            } else if (ev.target === this.$.linkSignOut) {
                this.childViews.contextMenuView.fadeOut();
                app.signOut(function() {
                    app.setHash('/signin');
                });
            }
            break;
    }
}

ToolBarView.prototype.onAuthChange = function() {
    this.childViews.userInlineView.setUser(app.authedUser);
};

ToolBarView.prototype.onUserInlineViewClick = function(ev) {
    this.childViews.contextMenuView.fadeIn();

    ev.preventDefault();
    ev.stopPropagation();
};

ToolBarView.setViewConstructor('ToolBarView');

module.exports = ToolBarView;

},{"../../model/user.js":5,"../../service/util.js":18,"../contextmenuview/contextmenuview.js":25,"../userinlineview/userinlineview.js":33,"../view/view.js":35}],33:[function(require,module,exports){
var View = require('../view/view.js'),
    util = require('../../service/util.js'),
    LazyImageView = require('../lazyimageview/lazyimageview.js'),
    User = require('../../model/user.js');

function UserInlineView() {
    View.apply(this, arguments);

    this.user = null;
    this.update();

    this.$.link.addEventListener('click', this);
}
util.inherits(UserInlineView, View);

UserInlineView.prototype.setUser = function(user) {
    this.user = user;
    this.update();
};

UserInlineView.prototype.update = function() {
    var user = this.user,
        self = this;

    if (user) {
        this.childViews.icon.src = user.icon;
        this.$.userName.textContent = user.name;
        this.$.link.href = '#!' + user.uri;

        this.$.root.classList.remove('is-user-nothing');
    } else {
        this.$.root.classList.add('is-user-nothing');
    }
};

UserInlineView.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'click':
            this.onClick(ev);
            break;
    }
};

UserInlineView.prototype.onClick = function(ev) {
    ev.stopPropagation();

    var event = new CustomEvent('click', {
        cancelable: true
    });
    this.$.root.dispatchEvent(event);

    if (event.defaultPrevented || !this.user) {
        ev.preventDefault();
    }
};

UserInlineView.setViewConstructor('UserInlineView');

module.exports = UserInlineView;

},{"../../model/user.js":5,"../../service/util.js":18,"../lazyimageview/lazyimageview.js":26,"../view/view.js":35}],34:[function(require,module,exports){
var View = require('../view/view.js'),
    UserInlineView = require('../userinlineview/userinlineview.js'),
    ProjectInlineView = require('../projectinlineview/projectinlineview.js'),
    CardView = require('../cardview/cardview.js'),
    util = require('../../service/util.js'),
    User = require('../../model/user.js');

function UserPageView() {
    View.apply(this, arguments);

    this.user;
    this.setUser(null);

    window.addEventListener('auth.change', this);
}
util.inherits(UserPageView, View);

UserPageView.prototype.setUser = function(user) {
    this.user = user;
    this.childViews.userInlineView.setUser(user);
    this.loadUserProjects();
};

UserPageView.prototype.setUserName = function(userName) {
    var self = this;
    User.getByName(userName, function(err, user) {
        if (err) {
            return;
        }

        self.setUser(user);
    });
};

UserPageView.prototype.loadUserProjects = function() {
    var user = this.user,
        self = this;
    if (!user) return;

    user.getAllProjects(function(err, projects) {
        if (err) {
            return;
        }

        self.setProjects(projects);
    });
};

UserPageView.prototype.setProjects = function(projects) {
    var container = this.childViews.projectContainer;

    container.$.content.innerHTML = '';

    projects.forEach(function(project) {
        var view = new ProjectInlineView();
        view.setProject(project);
        container.appendChild(view);
    });
}

UserPageView.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'auth.change':
            this.onAuthChange(ev);
            break;

        case 'click':
            app.signOut(function() {
                app.setHash('/signin');
            });
    }
};

UserPageView.prototype.onAuthChange = function() {
    this.childViews.userInlineView.setUser(app.authedUser);
};

UserPageView.setViewConstructor('UserPageView');

module.exports = UserPageView;

},{"../../model/user.js":5,"../../service/util.js":18,"../cardview/cardview.js":23,"../projectinlineview/projectinlineview.js":28,"../userinlineview/userinlineview.js":33,"../view/view.js":35}],35:[function(require,module,exports){
require('../../service/classlist.js');

var util = require('../../service/util.js'),
    map = require('../../service/map.js'),
    Template = require('../../service/template/template.js');

function View() {
    /**
     * DOM map
     * @type {{
     *       root: Element,
     *       content: Element
     * }}
     */
    this.$;

    /**
     * parent view.
     * @param {View}
     */
    this.parentView = null;

    /**
     * child views.
     * @param {Object}
     */
    this.childViews = [];

    this.loadTemplate(this.constructor.tagName);
}

View.prototype.finalize = function() {};

View.prototype.loadTemplate = function(tagName) {
    var result = Template.create(tagName, this);
    this.$ = result.$;
    this.childViews = result.childViews;
};

/**
 * Registers this view constructor to template engine.
 * @param {string} tagName tag name.
 */
View.setViewConstructor = function(tagName) {
    Template.setViewConstructor(tagName, this);
    this.tagName = tagName;
};

/**
 * append child view/node
 * @param {Node|View} child child.
 */
View.prototype.appendChild = function(child) {
    var name;

    if (child instanceof View) {
        if (child.parentView) {
            child.parentView.removeChild(child);
        }

        child.parentView = this;
        if (name = child.$.root.getAttribute('name')) {
            this.childViews[name] = child;
        }

        child = child.$.root;
    }

    this.$.content.appendChild(child);
};

/**
 * remove child view/node
 * @param {Node|View} child child.
 */
View.prototype.removeChild = function(child) {
    var name;

    if (child instanceof View) {
        child.parentView = null;
        if (name = child.$.root.getAttribute('name')) {
            delete this.childViews[name];
        }

        child = child.$.root;
    }

    this.$.content.removeChild(child);
};

View.setViewConstructor('View');

module.exports = View;

},{"../../service/classlist.js":10,"../../service/map.js":13,"../../service/template/template.js":17,"../../service/util.js":18}]},{},[6]);
