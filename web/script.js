

/**
 *	namespace for definition of API Errors
 *	@namespace
 */
var APIError = {};

/**
 *	Error for failed to parse server response.
 *	@param {XMLHttpRequest} xhr failed xhr object.
 *	@return {Object} error object.
 */
APIError.parseFailed = function(xhr) {
    return {
        error: {
            name: 'PARSE_FAILED',
            msg: 'Failed to parse response.',
            xhr: xhr
        }
    };
};

/**
 *	Error for failed to connection.
 *	@param {XMLHttpRequest} xhr failed xhr object.
 *	@return {Object} error object.
 */
APIError.connectionFailed = function(xhr) {
    return {
        error: {
            name: 'CONNECTION_FAILED',
            msg: 'Failed to connect server.',
            xhr: xhr
        }
    };
};

/**
 *	namespace for request API
 *	@namespace
 */
var API = {};

/**
 *	API Entry Point
 *	@const {string}
 */
API.EntryPoint = 'http://localhost:8080/';

/**
 *	encode Object for URL parameters.
 *	@param {Object} [params] parameters.
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
 *	HTTP::GET method.
 *	@param {string} url url.
 *	@param {Object} [params] request parameters.
 *  @param {Function} callback callback function.
 */
API.get = function(url, params, callback) {
    if (arguments.length === 2) {
        callback = params;
        params = undefined;
    }

    if (isObject(params)) {
        url += '?' + API.encodeURLParams(params);
    }

    API.ajax('GET', url, null, null, callback);
};

/**
 *	HTTP::POST method.
 *	@param {string} url url.
 *	@param {Object} [params] request parameters.
 *	@param {Object} body request body object.
 *  @param {Function} callback callback function.
 */
API.post = function(url, params, body, callback) {
    if (arguments.length === 3) {
        body = params;
        params = undefined;
    }

    if (isObject(params)) {
        url += '?' + API.encodeURLParams(params);
    }

    API.ajax('POST', url, {
        'Content-Type': 'application/json'
    }, JSON.stringify(body), callback);
};

/**
 *	HTTP::POST method for binary data.
 *	@param {string} url url.
 *	@param {Blob} [data] binary data.
 *  @param {Function} callback callback function.
 */
API.postB = function(url, params) {
    cponsole.error('not implemented yet!');
};

/**
 *	HTTP::PUT method.
 *	@param {string} url url.
 *	@param {Object} [params] request parameters.
 *	@param {Object} body request body object.
 *  @param {Function} callback callback function.
 */
API.put = function(url, params, body, callback) {
    if (arguments.length === 3) {
        body = params;
        params = undefined;
    }

    if (isObject(params)) {
        url += '?' + API.encodeURLParams(params);
    }

    API.ajax('PUT', url, {
        'Content-Type': 'application/json'
    }, JSON.stringify(body), callback);
};

/**
 *	HTTP::PUT method for binary data.
 *	@param {string} url url.
 *	@param {Blob} [data] binary data.
 *  @param {Function} callback callback function.
 */
API.putB = function(url, params, callback) {
    cponsole.error('not implemented yet!');
};

/**
 *	HTTP::PATCH method.
 *	@param {string} url url.
 *	@param {Object} [params] request parameters.
 *	@param {Object} body request body object.
 *  @param {Function} callback callback function.
 */
API.patch = function(url, params, body, callback) {
    if (arguments.length === 3) {
        body = params;
        params = undefined;
    }

    if (isObject(params)) {
        url += '?' + API.encodeURLParams(params);
    }

    API.ajax('PATCH', url, {
        'Content-Type': 'application/json'
    }, JSON.stringify(body), callback);
};

/**
 *	HTTP::PATCH method for binary data.
 *	@param {string} url url.
 *	@param {Blob} [data] binary data.
 *  @param {Function} callback callback function.
 */
API.patchB = function(url, params, callback) {
    cponsole.error('not implemented yet!');
};

/**
 *	HTTP::DELETE method.
 *	@param {string} url url.
 *	@param {Object} [params] request parameters.
 *  @param {Function} callback callback function.
 */
API.delete = function(url, params, callback) {
    if (arguments.length === 2) {
        callback = params;
        params = undefined;
    }

    if (isObject(params)) {
        url += '?' + API.encodeURLParams(params);
    }

    API.ajax('DELETE', url, null, JSON.stringify(params), callback);
};

/**
 *	Ajax core function
 */
API.ajax = function(method, url, headers, body, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, API.EntryPoint + url);

    if (headers) {
        Object.keys(headers).forEach(function(key) {
            xhr.setHeader(key, headers[key]);
        });
    }

    xhr.onload = function() {
        var result;

        try {
            result = JSON.parse(xhr.responseText);
        } catch (e) {
            return callback(APIError.parseFailed(xhr), null);
        }

        if (result.success) {
            return callback(null, result);
        } else {
            return callback(result, null);
        }
    };

    xhr.onerror = function() {
        return callback(APIError.connectionFailed(xhr), null);
    };

    xhr.send(body);
};

API.User = {
    get: function(userName, callback) {
        return API.get('/user/' + userName, callback);
    },
    me: function(callback) {
        return API.get('/user/me', callback);
    },
    post: function(userName, password, callback) {
        return API.post('/user/' + userName, {
            'password': password
        }, callback);
    },
    patch: function(userName, params, callback) {
        return API.patch('/user/' + userName, params, callback);
    },
    patchIcon: function(userName, blob, callback) {
        return API.patchB('/user/' + userName + '/icon', blob, callback);
    },
    delete: function(userName, callback) {
        return API.delete('/user/' + userName, callback);
    }
};




/**
 *  extend class.
 *  @param {Function} child child class.
 *  @param {Function} parent super class.
 */
function extendClass(child, parent) {
    /**
     *  copy static members.
     */
    extend(child, parent);

    /**
     *  dummy constructor
     *  @constructor
     */
    var __ = function() {};
    __.prototype = new parent();
    child.prototype = new __();

    /**
     *  set inheritance information.
     */
    parent.prototype.constructor = parent;
    child.prototype.constructor = child;
}

/**
 *  extend object property.
 *  @param {Object} target target object.
 *  @param {...Object} optSrces source objects.
 *  @return {Object} extended target.
 */
function extend(target, optSrces) {
    Array.prototype.slice.call(arguments, 1)
        .forEach(function(src) {
            if (!src) return;
            Object.keys(src).forEach(function(key) {
                target[key] = src[key];
            });
        });

    return target;
}

/**
 *  convert object to array.
 *  @param {{
 *    length: String
 *  }} arrayLike arrayLike object.
 *  @return {Array} converted array.
 */
function convertToArray(arrayLike) {
    return Array.prototype.slice.call(arrayLike, 0);
}

/**
 *  check if expression is object.
 *  @param {*} expression expression to check.
 *  @return {boolean} if true, the expression is Object.
 */
function isObject(expression) {
    return typeof expression === 'object';
}

/**
 *  no operation function
 */
function noop() {
    return undefined;
}


/**
 *	Event dispatchable object.
 *
 *	@constructor
 */
var EventDispatcher = function EventDispatcher() {
    /**
     *	The list of all event listeners attached on this.
     *
     * 	@type {Object<string, Array<Function>>}
     *	@private
     */
    this.eventListeners_ = {};
};

/**
 *  finalize
 */
EventDispatcher.prototype.finalize = function() {
    this.eventListeners_ = null;
};

/**
 *	attach an event listener.
 *
 *	@param {string} type event type.
 *	@param {Function} listener the event listener to attach.
 *	@return {EventDispatcher} this.
 */
EventDispatcher.prototype.on = function(type, listener) {
    var listeners = this.eventListeners_[type];

    if (!listeners) {
        listeners = this.eventListeners_[type] = [];
    }

    listeners.push(listener);

    return this;
};

/**
 *	detach the event listener.
 *	if the event listener is detached for more than twice,
 *	this method detach all of them.
 *
 *	@param {string} type event type.
 *	@param {Function} listener the event listener to detach.
 *	@return {EventDispatcher} this.
 */
EventDispatcher.prototype.off = function(type, listener) {
    var listeners = this.eventListeners_[type],
        i, max;

    if (!listeners) return this;

    for (i = 0, max = listeners.length; i < max; i++) {
        if (listeners[i] == listener) {
            listeners.splice(i, 1);
            i--;
            max--;
        }
    }

    return this;
};

/**
 *	fire the event.
 *
 *	@param {string} type event type.
 *	@param {...*} optArgs arguments.
 *	@return {EventDispatcher} this.
 */
EventDispatcher.prototype.fire = function(type, optArgs) {
    var listeners = this.eventListeners_[type],
        args = Array.prototype.slice.call(arguments, 1),
        i, max;

    if (!listeners) return this;

    for (i = 0, max = listeners.length; i < max; i++) {
        listeners[i].apply(this, args);
    }

    return this;
};

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
    if (isObject(data)) {
        this.updateWithData(data);
        Model.addInstance(this);
    }
};
extendClass(Model, EventDispatcher);

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
 *  Check if the instance is exist.
 *  @param {string} id instance id.
 *  @return {boolean} If true, the instance is exist.
 */
Model.hasInstance = function(id) {
    return !!Model.instances_[id];
};

/**
 *  add instance.
 *  @param {Model} instance instance
 */
Model.addInstance = function(instance) {
    Model.instances_[instance.id] = instance;
};

/**
 *  get instance.
 *  @param {string} id instance id.
 *  @return {Model} the instance.
 */
Model.getInstance = function(id) {
    return Model.instances_[id];
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

        if (!isObject(scheme)) {
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

    self.fire('update');
    return this;
};



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

