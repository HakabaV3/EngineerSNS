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
