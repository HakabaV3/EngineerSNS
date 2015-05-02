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
