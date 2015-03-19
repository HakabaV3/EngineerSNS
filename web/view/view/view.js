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
