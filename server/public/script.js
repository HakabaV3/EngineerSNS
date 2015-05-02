(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var EventDispatcher = require('../Service/EventDispatcher.js');

/**
 *  @constructor
 *  @extends {EventDispatcher}
 */
function Controller() {
    EventDispatcher.apply(this, arguments);
}
inherits(Controller, EventDispatcher);

module.exports = Controller;

},{"../Service/EventDispatcher.js":25}],2:[function(require,module,exports){
var Controller = require('./Controller.js'),
    Template = require('../Service/Template.js'),
    ESSignInCardController = require('./ESSignInCardController.js'),
    User = require('../Model/User.js');

/**
 *  @constructor
 *  @param {Element} [element] base element.
 *  @extends {Controller}
 */
function ESAppController(element) {
    Controller.apply(this, arguments);

    this.element = element || Template.createElement('es-app');

    /**
     *  @type {ESSignInCardController}
     */
    this.signInCardController = new ESSignInCardController(this.element.$.signInCard);

    this.initEventHandler();
}
inherits(ESAppController, Controller);

/**
 *  Initialize eventhandlers.
 */
ESAppController.prototype.initEventHandler = function() {
    this.signInCardController.on('signin', this.onSignIn, this);
};

/**
 *  callback of ESSignInCardController#signin.
 *  @param {User} user authorized user.
 */
ESAppController.prototype.onSignIn = function(user) {
    console.log(user);
    this.element.authedUser = user;
    this.element.$.switcher.switch(1);
    this.element.$.userPage.user = user;
};

module.exports = ESAppController;

},{"../Model/User.js":18,"../Service/Template.js":29,"./Controller.js":1,"./ESSignInCardController.js":3}],3:[function(require,module,exports){
var Controller = require('./Controller.js'),
    Template = require('../Service/Template.js'),
    Auth = require('../Model/Auth.js');

/**
 *  @constructor
 *  @param {Element} [element] base element.
 *  @extends {Controller}
 */
function ESSignInCardController(element) {
    Controller.apply(this, arguments);

    this.element = element || Template.createElement('es-signInCard');

    this.element.addEventListener('submit', this.onSubmit = this.onSubmit.bind(this));
}
inherits(ESSignInCardController, Controller);

/**
 *  sign in.
 */
ESSignInCardController.prototype.signIn = function(callback) {
    var self = this,
        userName = this.element.userName,
        password = this.element.password;

    this.element.disabled = true;
    this.element.isError = false;

    Auth.signIn(userName, password, function(err, user) {
        self.element.disabled = false;
        if (err) {
            self.element.isError = true;
            self.element.$.userName.focus();
        } else {
            self.fire('signin', user);
            self.element.clear();
        }
    });
};

/**
 *  callback of element#submit
 */
ESSignInCardController.prototype.onSubmit = function(ev) {
    this.signIn();
};

module.exports = ESSignInCardController;

},{"../Model/Auth.js":14,"../Service/Template.js":29,"./Controller.js":1}],4:[function(require,module,exports){
var Template = require('../../Service/Template.js');

/**
 *  CustomElement base class
 */
function CustomElement($) {
    /**
     *  DOM element map.
     *  @type {Object}
     */
    this.$ = $;
};

//content's method bridge
forEach([
    'appendChild',
    'removeChild'
], function(methodName) {
    CustomElement.prototype[methodName] = function() {
        if (this.$ && this.$.content && this !== this.$.content) {
            return this.$.content[methodName].apply(this.$.content, arguments);
        } else {
            return Object.getPrototypeOf(this)[methodName].apply(this, arguments);
        }
    }
});

//content's getter bridge
// forEach([
//     'innerHTML',
//     'outerHTML',
//     'innerText',
//     'textContent',
// ], function(getterName) {
//     CustomElement.prototype.__defineGetter__(getterName, function() {
//         return this.$.content[getterName];
//     });
// });

//content's setter bridge
// forEach([
//     'innerHTML',
//     'outerHTML',
//     'innerText',
//     'textContent',
// ], function(setterName) {
//     CustomElement.prototype.__defineSetter__(setterName, function(newVal) {
//         return this.$.content[setterName] = newVal;
//     });
// });

/**
 * Registers the custom element constructor.
 * @param {Function} constructor.
 * @param {string} [name] constructor name.
 *  If this parameter isn't passed, constructor's function's name is used.
 */
CustomElement.registerConstructor = function(constructor, name) {
    Template.registerConstructor(constructor, name);
};

module.exports = CustomElement;

},{"../../Service/Template.js":29}],5:[function(require,module,exports){
require('./SAToolBarElement.js');
require('./ESSignInCardElement.js');
require('./SASwitcherElement.js');

},{"./ESSignInCardElement.js":6,"./SASwitcherElement.js":12,"./SAToolBarElement.js":13}],6:[function(require,module,exports){
require('./SAInputElement.js');
require('./SAButtonElement.js');

var CustomElement = require('./CustomElement.js');

/**
 *  @constructor
 *  @extends {CustomElement}
 */
function ESSignInCardElement() {
    CustomElement.apply(this, arguments);

    this.$.form.addEventListener('submit', this.onFormSubmit = this.onFormSubmit.bind(this));
}
inherits(ESSignInCardElement, CustomElement);

/**
 *  clear all value
 */
ESSignInCardElement.prototype.clear = function() {
    this.userName = '';
    this.password = '';
    this.blur();
};

/**
 *  callback of $.form#submit
 *  @param {Event} ev event object.
 */
ESSignInCardElement.prototype.onFormSubmit = function(ev) {
    var isInValid = false,
        userName = this.userName,
        password = this.password;

    if (!password) {
        isInValid = true;
        this.$.password.isError = true;
        this.$.password.focus();
    } else {
        this.$.password.isError = false;
    }

    if (!userName) {
        isInValid = true;
        this.$.userName.isError = true;
        this.$.userName.focus();
    } else {
        this.$.userName.isError = false;
    }

    if (isInValid) {
        ev.stopImmediatePropagation();
    }

    ev.preventDefault();
    return false;
};

CustomElement.registerConstructor(ESSignInCardElement);

module.exports = ESSignInCardElement;

},{"./CustomElement.js":4,"./SAButtonElement.js":8,"./SAInputElement.js":9}],7:[function(require,module,exports){
var SALazyImageElement = require('./SALazyImageElement.js');

},{"./SALazyImageElement.js":10}],8:[function(require,module,exports){
var CustomElement = require('./CustomElement'),
    SARippleElement = require('./SARippleElement.js');

/**
 *  Enter key's keycode.
 *  @const {number}
 */
var KEYCODE_ENTER = 13;

/**
 *  @constructor
 *  @extends {CustomElement}
 */
function SAButtonElement($) {
    CustomElement.apply(this, arguments);

    this.$.ripple.addEventListener('mousedown', this.onMouseDown = this.onMouseDown.bind(this));
    this.$.ripple.addEventListener('mouseup', this.onMouseUp = this.onMouseUp.bind(this));
    this.addEventListener('keypress', this.onKeyPress = this.onKeyPress.bind(this));
    this.originalClick = HTMLButtonElement.prototype.click;
}
inherits(SAButtonElement, CustomElement);

/**
 *  show ripple-start effect with center position is (x, y);
 *  @param {number} [x=0] center position x.
 *  @param {number} [y=0] center position y.
 */
SAButtonElement.prototype.pushDown = function(x, y) {
    if (this.disabled) return;

    this.$.ripple.rippleStart(x || 0, y || 0);
};

/**
 *  show ripple-end effect.
 */
SAButtonElement.prototype.pushUp = function() {
    this.$.ripple.rippleEnd();
};

/**
 *  click this element
 *  @override
 */
SAButtonElement.prototype.click = function() {
    if (this.disabled) return;

    var gcr = this.getBoundingClientRect();
    this.pushDown(gcr.width / 2, gcr.height / 2);
    this.originalClick.apply(this, arguments);
    this.pushUp();
};

/**
 *  callback of this#mousedown
 *  @param {Event} ev event object
 */
SAButtonElement.prototype.onMouseDown = function(ev) {
    var gcr = this.getBoundingClientRect();
    this.pushDown(ev.x - gcr.left, ev.y - gcr.top);
};

/**
 *  callback of this#mouseup
 *  @param {Event} ev event object
 */
SAButtonElement.prototype.onMouseUp = function(ev) {
    this.pushUp();
};

/**
 *  callback of this#keypress
 *  @param {Event} ev event object
 */
SAButtonElement.prototype.onKeyPress = function(ev) {
    if (ev.keyCode === KEYCODE_ENTER) {
        this.click();
        ev.stopPropagation();
        ev.preventDefault();
    }
};

CustomElement.registerConstructor(SAButtonElement);

module.exports = SAButtonElement

},{"./CustomElement":4,"./SARippleElement.js":11}],9:[function(require,module,exports){
var CustomElement = require('./CustomElement.js');

/**
 *  @constructor
 *  @extends {CustomElement}
 */
function SAInputElement($) {
    CustomElement.apply(this, arguments);

    $.input.addEventListener('focus', this.onInputFocus = this.onInputFocus.bind(this));
    $.input.addEventListener('blur', this.onInputBlur = this.onInputBlur.bind(this));
    $.input.addEventListener('input', this.onInputInput = this.onInputInput.bind(this));
}
inherits(SAInputElement, CustomElement);

/**
 *  updateValueAttr_
 *  @private
 */
SAInputElement.prototype.__defineSetter__('value', function(newVal) {
    this.$.input.value = newVal;
});

/**
 *  set focus
 *  @override
 */
SAInputElement.prototype.focus = function() {
    return this.$.input.focus();
};

/**
 *  updateValueAttr_
 *  @private
 */
SAInputElement.prototype.updateValueAttr_ = function() {
    this.$.input.setAttribute('value', this.$.input.value);
};

/**
 *  callback of $.input#focus
 *  @param {Event} ev event object
 */
SAInputElement.prototype.onInputFocus = function(ev) {
    this.setAttribute('focus', '');
};

/**
 *  callback of $.input#blur
 *  @param {Event} ev event object
 */
SAInputElement.prototype.onInputBlur = function(ev) {
    this.removeAttribute('focus');
};

/**
 *  callback of $.input#blur
 *  @param {Event} ev event object
 */
SAInputElement.prototype.onInputInput = function(ev) {
    this.updateValueAttr_();
};

CustomElement.registerConstructor(SAInputElement);

module.exports = SAInputElement;

},{"./CustomElement.js":4}],10:[function(require,module,exports){
var CustomElement = require('./CustomElement.js');

/**
 *  @constructor
 *  @extends {CustomElement}
 */
function SALazyImageElement($) {
    CustomElement.apply(this, arguments);

    this.addEventListener('load', this.onLoad = this.onLoad.bind(this));
    this.addEventListener('error', this.onError = this.onError.bind(this));
}
inherits(SALazyImageElement, CustomElement);

/**
 *  image source url
 *  @type {string}
 */
SALazyImageElement.prototype.__defineSetter__('src', function(newVal) {
    this.setAttribute('src', newVal);
    this.setAttribute('state', 'loading');

    if (this.complete) this.onLoad();
});

/**
 *  callback of this#load
 *  @param {Event} ev event object
 */
SALazyImageElement.prototype.onLoad = function(ev) {
    this.setAttribute('state', 'loaded');
};

/**
 *  callback of this#error
 *  @param {Event} ev event object
 */
SALazyImageElement.prototype.onError = function(ev) {
    this.setAttribute('state', 'error');
};

CustomElement.registerConstructor(SALazyImageElement);

module.exports = SALazyImageElement;

},{"./CustomElement.js":4}],11:[function(require,module,exports){
var CustomElement = require('./CustomElement.js');

/**
 *  @constructor
 *  @extends {CustomElement}
 */
function SARippleElement($) {
    CustomElement.apply(this, arguments);
}
inherits(SARippleElement, CustomElement);

/**
 *  show ripple-start effect with center position is (x, y);
 *  @param {number} [x=0] center position x.
 *  @param {number} [y=0] center position y.
 */
SARippleElement.prototype.rippleStart = function(x, y) {
    var self = this,
        style = this.$.inner.style,
        computed = getComputedStyle(this);

    style.left = x + 'px';
    style.top = y + 'px';
    style.backgroundColor = computed.color;

    this.removeAttribute('ripple-end');
    this.removeAttribute('ripple-start');

    requestAnimationFrame(function() {
        requestAnimationFrame(function() {
            self.setAttribute('ripple-start', '');
        });
    });
};

/**
 *  show ripple-end effect
 */
SARippleElement.prototype.rippleEnd = function() {
    this.setAttribute('ripple-end', '');
};

CustomElement.registerConstructor(SARippleElement);

module.exports = SARippleElement;

},{"./CustomElement.js":4}],12:[function(require,module,exports){
var CustomElement = require('./CustomElement.js');

/**
 *  @constructor
 *  @extends {CustomElement}
 */
function SASwitcherElement($) {
    CustomElement.apply(this, arguments);
}
inherits(SASwitcherElement, CustomElement);

/**
 *  show ripple-start effect with center position is (x, y);
 *  @param {number} [x=0] center position x.
 *  @param {number} [y=0] center position y.
 */
SASwitcherElement.prototype.switch = function(index) {

    var children = this.children,
        nextPage = this.children[index],
        i, max, currentPage;

    for (i = 0, max = children.length; i < max; i++) {
        if (children[i].hasAttribute('visible')) {
            currentPage = children[i];
            break;
        }
    }

    if (currentPage) {
        currentPage.removeAttribute('visible');
    }

    if (nextPage) {
        nextPage.setAttribute('visible', '');
    }
};

CustomElement.registerConstructor(SASwitcherElement);

module.exports = SASwitcherElement;

},{"./CustomElement.js":4}],13:[function(require,module,exports){
var CustomElement = require('./CustomElement.js'),
    ESUserInlineElement = require('./ESUserInlineElement.js');

/**
 *  @constructor
 *  @extends {CustomElement}
 */
function SAToolBarElement($) {
    CustomElement.apply(this, arguments);
}
inherits(SAToolBarElement, CustomElement);

CustomElement.registerConstructor(SAToolBarElement);

module.exports = SAToolBarElement;

},{"./CustomElement.js":4,"./ESUserInlineElement.js":7}],14:[function(require,module,exports){
var API = require('../Service/API/API.js'),
    User = require('./User.js');

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

},{"../Service/API/API.js":19,"./User.js":18}],15:[function(require,module,exports){
var Model = require('./Model.js'),
    API = require('../Service/API/API.js');

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
inherits(Comment, Model);

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

},{"../Service/API/API.js":19,"./Model.js":16}],16:[function(require,module,exports){
var EventDispatcher = require('../Service/EventDispatcher.js');

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
        this.constructor.addInstance(this);
    }
};
inherits(Model, EventDispatcher);

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

},{"../Service/EventDispatcher.js":25}],17:[function(require,module,exports){
var Model = require('./Model.js'),
    Comment = require('./Comment.js'),
    API = require('../Service/API/API.js');

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
inherits(Project, Model);

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

},{"../Service/API/API.js":19,"./Comment.js":15,"./Model.js":16}],18:[function(require,module,exports){
var Model = require('./Model.js'),
    Project = require('./Project.js'),
    API = require('../Service/API/API.js');

/**
 *  User Model.
 *  @constructor
 *  @param {Object} data initial data.
 *  @extends {Model}
 */
var User = function(data) {
    if (!(this instanceof User)) return new User(data);

    if (isObject(data)) {
        if (User.hasInstance(data.name)) {
            return User.getInstance(data.name).updateWithData(data);
        }
    }

    Model.call(this, data);
};
inherits(User, Model);

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

},{"../Service/API/API.js":19,"./Model.js":16,"./Project.js":17}],19:[function(require,module,exports){
var APIError = require('./APIError.js');

/**
 *  namespace for request API
 *  @namespace
 */
var API = {};

/**
 *  API Entry Point
 *  @const {string}
 */
API.EntryPoint = '/api/v1';

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

    if (isObject(params)) {
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

    if (isObject(params)) {
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

    if (isObject(params)) {
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

    if (isObject(params)) {
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

    if (isObject(params)) {
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

},{"./APIError.js":20}],20:[function(require,module,exports){
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

extend(APIError, {
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
    return extend(APIError.PARSE_FAILED, {
        xhr: xhr
    });
};

/**
 *  Error for failed to connection.
 *  @param {XMLHttpRequest} xhr failed xhr object.
 *  @return {Object} error object.
 */
APIError.connectionFailed = function(xhr) {
    return extend(APIError.CONNECTION_FAILED, {
        xhr: xhr
    });
};

/**
 *  エラーを特定する。
 *  ものすごく地道な実装。
 *  サーバーは頼むからエラーをコードで返してくれ！
 */
APIError.detectError = function(err) {
    if (isObject(err)) {
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
                return extend(APIError.UNKNOWN, {
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

    return extend(APIError.UNKNOWN, {
        original: err
    });
};

module.exports = APIError;

},{}],21:[function(require,module,exports){
var Observing = require('./Observing.js'),
    Map = require('../Map.js');

/**
 *  AttributeObserving
 *
 *  This class presents an observing state for node's attribute.
 *
 *  @constructor
 *  @param {Element} target target element.
 *  @param {string} key target attribute name.
 *  @extends {Observing}
 */
function AttributeObserving(target, key) {
    Observing.apply(this, arguments);
}
inherits(AttributeObserving, Observing);

/**
 *  callback for MutationObserver.
 *  @param {Array<Object>} mutations mutations
 */
AttributeObserving.onChange = function(mutations) {
    forEach(mutations, function(mutation) {
        var listeners = this.listenersMap_.get(mutation.target);
        forEach(listeners, function(listener) {
            if (listener.key !== mutation.attributeName) return;

            listener.fire('change', listener, mutation.oldValue, listener.getValue());
        });
    }, AttributeObserving);
};

/**
 *  @type {MutationObserver}
 */
AttributeObserving.centralObserver_ = new MutationObserver(AttributeObserving.onChange);

/**
 *  @type {Map}
 */
AttributeObserving.listenersMap_ = new Map();

AttributeObserving.prototype.finalize = function() {
    //@TODO

    Observing.prototype.finalize.apply(this, arguments);
};

AttributeObserving.prototype.setup = function() {
    var target = this.target,
        key = this.key,
        listeners = AttributeObserving.listenersMap_.get(target);

    if (!listeners) {
        listeners = [];
        AttributeObserving.listenersMap_.set(target, listeners);

        AttributeObserving.centralObserver_.observe(target, {
            childList: false,
            attributes: true,
            characterData: false,
            subtree: false,
            attributeOldValue: true,
            characterDataOldValue: false
        });

        //@TODO
        // tune up with attributeFilter option.
    }

    listeners.push(this);
};

AttributeObserving.prototype.getValue = function() {
    var value = this.target.getAttribute(this.key);

    return value || '';
};

AttributeObserving.prototype.setValue = function(newValue) {
    var key, listeners;

    if (isObject(newValue)) {
        key = this.key;
        listeners = AttributeObserving.listenersMap_.get(this.target);
        forEach(listeners, function(listener) {
            if (listener === this ||
                listener.key !== key) return;
            listener.fire('change', listener, listener.getValue(), newValue);
        }, this);
    } else {
        if (!newValue && newValue !== 0) {
            this.target.removeAttribute(this.key);
        } else {
            this.target.setAttribute(this.key, newValue);
        }
    }
};

module.exports = AttributeObserving;

},{"../Map.js":26,"./Observing.js":23}],22:[function(require,module,exports){
var AttributeObserving = require('./AttributeObserving.js'),
    PropertyObserving = require('./PropertyObserving.js');

/**
 *  @NOTE
 *  <template name="Tag1" huga={{hoge}}>
 *      {{hoge}}
 *  <template>
 *
 *  --> Tag1.hoge === Tag1@huga === Tag1.textContent
 *
 *  <template name="Tag2" huga={{hoge}}>
 *      {{hoge}}
 *  <template>
 *
 *  --> Tag2.hoge === Tag2@huga === Tag2.textContent
 *
 */

/**
 *  @NOTE
 *  <template name="Tag1" huga={{value1}}>
 *      {{value1}}
 *  <template>
 *
 *  --> Tag1.value1 === Tag1.textContent === Tag1@huga
 *
 *  <template name="Tag2" hoge={{value2}}>
 *      {{value2}}
 *  <template>
 *
 *  --> Tag2.value2 === Tag2.textContent === Tag2@hoge
 *
 *  <template name="Tag3" value="{{value3}}">
 *      <Tag1 huga="{{value3}}"></Tag1>
 *      <Tag2 huga="{{value3}}"></Tag2>
 *  <template>
 *
 *  --> Tag3@value === Tag3.value3 === Tag1@huge === Tag2@huga
 *
 */

function Binding() {
    /**
     *  observings
     *  @type {Array<Observing>}
     */
    this.observings = [];

    /**
     *  @type {*}
     *  @private
     */
    this.oldValue_;
};

/**
 *  Add element attribute value into binding target
 *  @param {Element} element element
 *  @param {string} attributeName attribute name
 */
Binding.prototype.addAttributeTarget = function(element, attributeName) {
    var observing = new AttributeObserving(element, attributeName);
    observing.on('change', this.onChange, this);
    this.observings.push(observing);
};

/**
 *  Remove element attribute value from binding target
 */
Binding.prototype.removeAttributeTarget = function() {
    throw new Error('Binding#removeAttributeTarget: Not Implemented Yet.');
};

/**
 *  Add object property value into binding target
 *  @param {Object} object object
 *  @param {string} propertyPath property path
 */
Binding.prototype.addPropertyTarget = function(object, propertyPath) {
    var observing = new PropertyObserving(object, propertyPath);
    observing.on('change', this.onChange, this);
    this.observings.push(observing);
};

/**
 *  Remove object property value from binding target
 */
Binding.prototype.removePropertyTarget = function(object, property) {
    throw new Error('Binding#removePropertyTarget: Not Implemented Yet.');
};

/**
 *  callback of Observing#change.
 *  @param {Observing} sourceObserving source observing.
 *  @param {*} oldValue old value.
 *  @param {*} newValue new value.
 */
Binding.prototype.onChange = function(sourceObserving, oldValue, newValue) {
    oldValue = this.oldValue_;

    if (oldValue === newValue) {
        return;
    }

    forEach(this.observings, function(observing) {
        if (observing === sourceObserving) return;
        observing.setValue(newValue);
    });
    this.oldValue_ = newValue;
};


module.exports = Binding;

},{"./AttributeObserving.js":21,"./PropertyObserving.js":24}],23:[function(require,module,exports){
var EventDispatcher = require('../EventDispatcher.js');

/**
 *  Observing
 *
 *  This class presents an obsrving state for many situations like below.
 *  - Object property.
 *  - Node attribute.
 *
 *  This is abstract class, so please use extended class like below.
 *  - PropertyObserving <--- for object property.
 *  - AttributeObserving <--- for node attribute.
 *
 *  @constructor
 *  @param {Object} target target object.
 *  @param {string} key target key
 *  @extends {EventDispatcher}
 */
function Observing(target, key) {
    EventDispatcher.apply(this, arguments);

    if (!isObject(target)) {
        throw new Error('Observing target must be object.');
    }

    if (!isString(key) || key === '') {
        throw new Error('\'' + key + '\' is invalid for Observing key.');
    }

    /**
     *  @type {Object}
     */
    this.target = target;

    /**
     *  @type {string}
     */
    this.key = key;

    this.setup();
}
inherits(Observing, EventDispatcher);

Observing.prototype.finalize = function() {
    EventDispatcher.prototype.finalize.apply(this, arguments);
};

Observing.prototype.setup = function() {
    throw new Error('Observing#setup must be overrided.');
};

Observing.prototype.setValue = function(newValue) {
    throw new Error('Observing#setValue must be overrided.');
};

module.exports = Observing;

},{"../EventDispatcher.js":25}],24:[function(require,module,exports){
var Observing = require('./Observing.js'),
    CustomObserver = require('../Observer/CustomObserver.js');

/**
 *  PropertyObserving
 *
 *  This class presents an observing state for object's property.
 *
 *  @constructor
 *  @param {Object} target target object.
 *  @param {string} key target property path like 'deep.property.name'
 *  @extends {Observing}
 */
function PropertyObserving(target, key) {
    Observing.apply(this, arguments);
}
inherits(PropertyObserving, Observing);

PropertyObserving.prototype.finalize = function() {
    CustomObserver.unobserve(target, key, this.onChange, this);

    Observing.prototype.finalize.apply(this, arguments);
};

PropertyObserving.prototype.setup = function() {
    var target = this.target,
        key = this.key;

    CustomObserver.observe(target, key, this.onChange, this);
};

PropertyObserving.prototype.getValue = function(newValue) {
    var deep = getObjectForPath(this.target, this.key);

    return deep ? deep.object[deep.key] : null;
};

PropertyObserving.prototype.setValue = function(newValue) {
    var deep = getObjectForPath(this.target, this.key),
        oldValue,
        object,
        key;

    if (!isObject(deep)) return;

    object = deep.object;
    key = deep.key;
    listenerName = 'on' + key.charAt(0).toUpperCase() + key.substr(1);
    oldValue = object[key];

    object[key] = newValue;

    if (isFunction(object[listenerName])) {
        object[listenerName](oldValue, newValue);
    }
};

/**
 *  オブジェクトのプロパティをたどって、最下層のオブジェクトを返す
 *
 *  @example
 *      path='foo.bar.buz.piyo'の場合、
 *      {
 *          object: object.foo.bar.buz,
 *          key: 'piyo'
 *      }
 *      を返す。
 *
 *  @param {Object} object object
 *  @param {string} path path
 *  @return {{
 *      object: Object,
 *      key: string
 *  }} result object.
 */
function getObjectForPath(object, path) {
    var parts = path.split('.'),
        part;

    if (!isObject(object)) return null;

    while (parts.length > 1) {
        part = parts.shift();
        object = object[part];
        if (!isObject(object)) return null;
    }

    return {
        object: object,
        key: parts[0]
    };
}

PropertyObserving.prototype.onChange = function(changes) {
    forEach(changes, function(change) {
        var newVal = change.newValue,
            oldVal = change.oldValue;

        this.fire('change', this, oldVal, newVal);
    }, this);
};

module.exports = PropertyObserving;

},{"../Observer/CustomObserver.js":27,"./Observing.js":23}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
(function (global){
var Map = global.Map;

if (typeof Map !== 'function') {

    /**
     * Map
     *
     * @constructor
     * @param {Array<Array<*>>} [iterable] iterable object.
     */
    Map = function(iterable) {
        var i, max, iterable;

        /**
         * It's 0, constant.
         * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Map
         * @type {number}
         */
        this.length = 0;

        /**
         * keys
         * @type {Array}
         * @private
         */
        this.keys_ = [];

        /**
         * number
         * @type {Array}
         * @private
         */
        this.values_ = [];

        if (iterable) {
            for (i = 0, max = iterable.length; i < max; i++) {
                item = iterable[i];
                this.keys_.push(item[0]);
                this.values_.push(item[0]);
            }
        }
    }

    /**
     *  Returns the number of key/value pairs in the Map object.
     *  @type {number}
     */
    Map.prototype.size;
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],27:[function(require,module,exports){
(function (global){
var Map = require('../Map.js'),
    ObjectObserver = require('./ObjectObserver.js');

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
CustomObserver.observe = function(object, propName, callback, context) {
    var instance = this.getInstance_(object, propName);

    if (!instance) {
        instance = this.addInstance_(object, propName);
    }

    instance.addCallback_(callback, context);
};

/**
 * unobserve
 * @param  {Object}   object   object
 * @param  {string}   propName string
 * @param  {Function} callback callback
 */
CustomObserver.unobserve = function(object, propName, callback, context) {
    var instance = this.getInstance(object, propName);

    if (!instance) return;

    instance.removeCallback_(callback, context);
};

CustomObserver.prototype.addCallback_ = function(callback, context) {
    var callbacks = this.callbacks_,
        i, max;

    context = context || global;

    for (i = 0, max = callbacks.length; i < max; i++) {
        if (callbacks[i].callback === callback &&
            callbacks[i].context === context) {
            return;
        }
    }

    callbacks.push({
        callback: callback,
        context: context
    });
};

CustomObserver.prototype.removeCallback_ = function(callback, context) {
    var callbacks = this.callbacks_,
        i, max;

    context = context || global;

    for (i = 0, max = callbacks.length; i < max; i++) {
        if (callbacks[i].callback === callback &&
            callbacks[i].context === context) {
            callbacks.splice(i, 1);
            i--;
            max--;
        }
    }

    if (max === 0) {
        CustomObserver.removeInstance_(this);
    }
};

/**
 * get value
 */
CustomObserver.prototype.getValue = function() {
    var length = this.propNameTokens_.length;

    return isObject(this.targets_[length - 1]) ?
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
    if (isObject(oldTarget) && index !== 0) {
        Object.unobserve(oldTarget, this.onChangeHandler_);
    }

    if (index !== 0) {
        targets[index] = null;
    }

    //observe
    if (index === 0) {
        newTarget = targets[0];
    } else if (isObject(targets[index - 1]) &&
        isObject(targets[index - 1][this.propNameTokens_[index - 1]])) {

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
    var newValue,
        oldValue = this.oldValue_,
        targets = this.targets_;

    changes.forEach(function(change) {
        var index = targets.indexOf(change.object);

        if (index !== -1) {
            this.resetObserve_(index);
        }
    }, this);

    newValue = this.getValue();

    if (newValue !== oldValue) {
        changes = [{
            type: 'update',
            name: this.propName_,
            object: this.targets_[0],
            oldValue: oldValue,
            newValue: newValue
        }];

        this.callbacks_.forEach(function(callback) {
            callback.callback.call(callback.context, changes);
        }, this);

        this.oldValue_ = newValue;
    }
};

module.exports = CustomObserver;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../Map.js":26,"./ObjectObserver.js":28}],28:[function(require,module,exports){
var Map = require('../Map.js');

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

},{"../Map.js":26}],29:[function(require,module,exports){
var Map = require('./Map.js'),
    Binding = require('./Binding/Binding.js');

/**
 * @constructor
 */
function Template() {
    /**
     * custom element's name
     * @type {string}
     */
    this.tagName;

    /**
     * DOM Map
     * @type {object}
     */
    this.$;

    /**
     * Regular expression object for matching className
     * @type {RegExp}
     */
    this.regClassName;

    /**
     *  custom element's constructor
     *  @type {Function}
     */
    this.elementConstructor;
};

/**
 * Template map
 * @type {Map}
 * @private
 */
Template.templates_ = new Map();

/**
 * Custom Element constructors
 * @type {Map}
 * @private
 */
Template.constructors_ = new Map();

/**
 * Create DOM from template for specified name.
 * @param {string} templateName template name.
 * @param {NamedNodeMap} [attributes] attribute map
 * @return {Object} result.
 */
Template.createElement = function(templateName, attributes) {
    var template = Template.getTemplate_(templateName);

    if (!template) {
        throw new Error('Template "' + templateName + '" is not found.');
    }

    return template.createElement(attributes);
};

/**
 * Returns the custom element constructor for specified name.
 * @param {string} constructorName constructor name.
 * @return {Function} constructor.
 * @private
 */
Template.getConstructor_ = function(constructorName) {
    return Template.constructors_.get(constructorName.toUpperCase());
};

/**
 * Registers the custom element constructor.
 * @param {Function} constructor.
 * @param {string} [name] constructor name.
 *  If this parameter isn't passed, constructor's function's name is used.
 */
Template.registerConstructor = function(constructor, name) {
    name = name || constructor.name;
    Template.constructors_.set(name.toUpperCase(), constructor);
};

/**
 * Checks if  the custom element constructor for specified name is exist.
 * @param {string} constructorName constructor name.
 * @return {boolean} If true, the constructor with specified name is exist, otherwise false.
 * @private
 */
Template.hasConstructor_ = function(constructorName) {
    return Template.constructors_.has(constructorName.toUpperCase());
};

/**
 * Returns the template for specified name.
 * @param {string} templateName template name.
 * @return {Template} template.
 * @private
 */
Template.getTemplate_ = function(templateName) {
    return Template.templates_.get(templateName.toUpperCase());
};

/**
 * Registers the template from specified template DOM.
 * If templateDOM doesn't have the 'name' attribute, it's skipped.
 * @param {Element} templateDOM template DOM.
 * @private
 */
Template.registerTemplate_ = function(templateDOM) {
    var name = templateDOM.getAttribute('name'),
        template, $, constructorName,
        extendTagName;

    if (!name) return;

    template = new Template();

    /**
     * 1. set tagName
     */
    template.tagName = name;

    /**
     * 2. set className regular expression template
     *
     * @NOTE
     * If we scan dom mapping on this time(not on template#create),
     * It may be not need to save RegExp instance for cache.
     *
     * ->
     * we should scan dom mapping on template#create, because
     * we should scane CLONED dom tree.
     *
     */
    template.regClassName = new RegExp(name + '-(\\w+)');

    /**
     *  3.create root DOM instance, and clone dom tree
     */
    template.$ = $ = {};
    extendTagName = templateDOM.getAttribute('extend') || template.tagName;
    if (Template.hasTemplate_(extendTagName)) {
        $.root = Template.createElement(extendTagName);
    } else {
        $.root = document.createElement(extendTagName);
    }
    $.root.innerHTML = templateDOM.innerHTML;

    /**
     *  4. copy template attribute to cloned root DOM
     */
    Template.copyAttribute($.root, templateDOM);
    ['extend', 'name', 'constructor'].forEach(function(directiveAttributeName) {
        $.root.removeAttribute(directiveAttributeName);
    });

    /**
     * 5. attach element constructor
     */
    constructorName = templateDOM.getAttribute('constructor') || template.tagName;
    if (Template.hasConstructor_(constructorName)) {
        template.elementConstructor = Template.getConstructor_(constructorName);
    } else {
        template.elementConstructor = noop;
    }

    Template.templates_.set(name.toUpperCase(), template);
};

/**
 * Checks if the template with specified name is exist.
 * @param {string} templateName template name.
 * @return {boolean} If true, the template with specified name is exist, otherwise false.
 * @private
 */
Template.hasTemplate_ = function(templateName) {
    return Template.templates_.has(templateName.toUpperCase());
};

/**
 * Replaces from HTMLUnknownElement to CustomElement if need.
 * @param {Element} element elemnt.
 * @param {Object} $ DOM map. If need, DOM map is updated.
 * @param {boolean} [flagRecursive=false] If true, this method applied for child elements recursivly.
 */
Template.prototype.replaceHTMLUnknownElement = function(element, $, flagRecursive) {
    var children = slice(element.children, 0),
        childNodes = slice(element.childNodes, 0),
        customElement, parent, ma, attributes;

    flagRecursive = flagRecursive || false;

    if (Template.hasTemplate_(element.tagName)) {

        //1. create CustomElement.
        customElement = Template.createElement(element.tagName, element.attributes);

        //2. move chilNodes.
        childNodes.forEach(function(childNode) {
            customElement.appendChild(childNode);
        });

        //3. replace from HTMLUnknownElement to custom element.
        parent = element.parentNode;
        parent.insertBefore(customElement, element);
        parent.removeChild(element);

        //4. If need, replace DOM map.
        if (ma = element.className.match(this.regClassName)) {
            $[ma[1]] = customElement;
        }
    }

    if (flagRecursive) {
        forEach(children, function(child) {
            this.replaceHTMLUnknownElement(child, $, true);
        }, this);
    }
};

/**
 * Create DOM from this template.
 * @param {NamedNodeMap} [attributes] attribute map
 * @return {Object} DOM map.
 */
Template.prototype.createElement = function(attributes) {
    /**
     * 1. Clone node
     */
    var $ = {},
        root = this.$.root.cloneNode(true),
        ma,
        regClassName = this.regClassName;

    $.root = root;
    root.$ = $;
    forEach(root.querySelectorAll('[class]'), function(node) {
        if (ma = node.className.match(regClassName)) {
            $[ma[1]] = node;
        }
    });
    $.content = root.querySelector('content, [content]') || root;

    /**
     * 2. Convert HTMLUnknownElement -> CustomElement
     *
     * @TODO
     * On current version, if root element is the instance of HTMLUnknownElement,
     * it won't work.
     *
     * example:
     * ExampleView's root element is <CustomElement> (HTMLUnknownElement), and
     * this view can't work.
     *
     * <template name="ExampleView">
     *   <CustomElement>
     *     <span>ExampleView won't work.</span>
     *   </CustomElement>
     * </template>
     */
    forEach(root.children, function(child) {
        this.replaceHTMLUnknownElement(child, $, true);
    }, this);

    /**
     * 3. setup data binding
     */
    this.parseBindingQuery_(root);

    /**
     * 4. Copy attributes
     */
    if (attributes) {
        Template.copyAttribute(root, attributes);
    }

    /**
     * 5. mixin custom class properties and run constructor.
     */
    this.injectCustomClassPrototype($);
    this.elementConstructor.call(root, $);

    return root;
};

Template.prototype.injectCustomClassPrototype = function($) {
    var root = $.root,
        source = this.elementConstructor.prototype,
        key, descriptor;

    while (source) {
        Object.keys(source).forEach(function(key) {
            descriptor = Object.getOwnPropertyDescriptor(source, key);
            Object.defineProperty(root, key, descriptor);
        });

        source = Object.getPrototypeOf(source);
    }
};

/**
 * copy element attributes
 * @param {Element} target copy target element.
 * @param {Element|NamedNodeMap} source copy source element, or attribute map.
 */
Template.copyAttribute = function(target, source) {
    if (source instanceof Element) {
        source = source.attributes;
    }

    forEach(source, function(attr) {
        switch (attr.name) {
            case 'class':
                target.classList.add.apply(target.classList, attr.value.split(' '));
                break;

            default:
                target.setAttribute(attr.name, attr.value);
                break;
        }
    });
};

/**
 *  parse template binding query
 *  @private
 */
Template.prototype.parseBindingQuery_ = function(root) {
    Template.parseBindingQuery_(root, root);
};

/**
 *  parse template bindin query
 *  @param {Node} node node
 */
Template.parseBindingQuery_ = function(node, context) {
    var regBinding = /\{\{([^\}]+)\}\}/,
        map = context.__bindingMap__ || (context.__bindingMap__ = new Map());

    if (node instanceof Element) {
        forEach(slice(node.attributes, 0), function(attr) {
            var ma = attr.value.match(regBinding),
                key, binding;

            if (!ma) return;

            key = ma[1].trim();
            binding = map.get(key);

            if (!binding) {
                binding = new Binding();
                map.set(key, binding);
                binding.addPropertyTarget(context, key);
                context.key = '';
            }

            binding.addAttributeTarget(node, attr.name);

            //@TODO ただ消すだけではダメ！
            node.removeAttribute(attr.name);
        });
    } else if (node instanceof Text) {
        var ma = node.textContent.match(regBinding),
            key, binding;
        if (!ma) return;

        key = ma[1].trim();
        binding = map.get(key);

        if (!binding) {
            binding = new Binding();
            map.set(key, binding);
            binding.addPropertyTarget(context, key);
            context.key = '';
        }

        binding.addPropertyTarget(node, 'textContent');

        //@TODO ただ消すだけではダメ！
        node.textContent = '';
    }

    forEach(node.childNodes, function(child) {
        Template.parseBindingQuery_(child, context);
    });
};

/**
 *  bootstrap
 */
window.addEventListener('DOMContentLoaded', function() {
    forEach(document.querySelectorAll('template[name]'), function(templateDOM) {
        Template.registerTemplate_(templateDOM);
        templateDOM.parentNode.removeChild(templateDOM);
    }, Template);
});

module.exports = Template;

},{"./Binding/Binding.js":22,"./Map.js":26}],30:[function(require,module,exports){
var Template = require('./Service/Template.js'),
    ESAppController = require('./Controller/ESAppController.js');

window.onload = function() {
    var app = new ESAppController();

    document.body.appendChild(app.element);
    document.body.removeAttribute('unresolved');
};

module.exports = noop;

},{"./Controller/ESAppController.js":2,"./Service/Template.js":29}],31:[function(require,module,exports){
require('./util.js');

require('./Element/js/ESAppElement.js');

require('./bootstrap.js');

},{"./Element/js/ESAppElement.js":5,"./bootstrap.js":30,"./util.js":32}],32:[function(require,module,exports){
(function (global){
/**
 * extended from Array.slice
 * @type {Function<Array, number>:Array}
 */
global.slice = Array.prototype.slice.call.bind(Array.prototype.slice);

/**
 * extended from Array.forEach
 * @type {Function<Array, Function, Object|null>}
 */
global.forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);

/**
 * If an expression is string, return true, otherwise false.
 * @param {*} exp expression
 * @return {boolean} If true, the expression is a string.
 */
global.isString = function(exp) {
    return typeof exp === 'string';
};

/**
 * If an expression is object, return true, otherwise false.
 * When expression is undefined, 'typeof undeifned' returns 'object',
 * but this method return false.
 *
 * @param {*} exp expression
 * @return {boolean} If true, the expression is a object.
 */
global.isObject = function(exp) {
    return exp && typeof exp === 'object';
};

/**
 * If an expression is function, return true, otherwise false.
 * @param {*} exp expression
 * @return {boolean} If true, the expression is a function.
 */
global.isFunction = function(exp) {
    return typeof exp === 'function';
};

/**
 * no-operation
 */
global.noop = function() {};

/**
 * inherit class
 * @param {Function} child child class
 * @param {Function} parent parent class.
 */
global.inherits = function(child, parent) {
    /**
     * dummy constructor
     *	@constructor
     */
    var __ = function() {};
    __.prototype = parent.prototype;
    child.prototype = new __();
    child.prototype.constructor = child;
};

/**
 * extend object
 * @param {Object} target target will be extended.
 * @param {...Object} [sources] source object.
 * @return {Object} extended target.
 */
global.extend = function(target, sources) {
    slice(arguments, 1)
        .forEach(function(source) {
            if (!isObject(source)) return target;
            Object.keys(source).forEach(function(key) {
                target[key] = source[key];
            });
        });

    return target;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[31]);
