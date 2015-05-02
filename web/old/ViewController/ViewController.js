require('../Service/classList.js');

var util = require('../Service/util.js'),
    Template = require('../Service/Template/Template.js'),
    EventDispatcher = require('../Service/EventDispatcher.js');

function ViewController($) {
    EventDispatcher.apply(this, arguments);

    /**
     * DOM map
     * @type {{
     *       root: Element,
     *       content: Element
     * }}
     */
    this.$ = $ || {};
}
util.inherits(ViewController, EventDispatcher);

/**
 * Registers this view constructor to template engine.
 * @param {string} tagName tag name.
 */
ViewController.registerController = function(tagName) {
    Template.registerController(tagName, this);
    this.tagName = tagName;
};

module.exports = ViewController;
