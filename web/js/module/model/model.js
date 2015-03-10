/**
 *  @TODO
 *  API.Userへの依存をなくす
 *  Model#uriを用いて、API_coreだけで対応する。
 */

//@include ../service/util.js
//@include ../service/eventdispatcher.js

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
 *  Finalizer.
 */
Model.prototype.finalize = function() {
    EventDispatcher.finalize.call(this);
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
