var util = require('../util.js'),
    Map = require('../Map.js'),
    CustomObserver = require('../Observer/CustomObserver.js'),
    Binding = require('./Binding.js');

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
     * element
     * @type {Element}
     */
    this.dom;

    /**
     * binding data
     * @type {[Binding]}
     */
    this.bindings = [];

    /**
     * controller constructor
     * @type {Function}
     */
    this.controller;

    /**
     * Regular expression object for matching className
     * @type {RegExp}
     */
    this.regClassName;
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
Template.controllers_ = new Map();

/**
 * HTML instantiate container
 * @type {HTMLDivElement}
 * @private
 */
Template.container_ = document.createElement('div');

/**
 * Registers controller with name.
 * @param {string} controllerName controller name.
 * @param {Function} constructor constructor.
 */
Template.registerController = function(controllerName, constructor) {
    Template.controllers_.set(controllerName.toUpperCase(), constructor);
};

/**
 * Returns controller of specified name.
 * @param {string} controllerName controller name.
 * @return {Function} constructor.
 * @private
 */
Template.getController_ = function(controllerName) {
    return Template.controllers_.get(controllerName.toUpperCase());
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
 * @private
 */
Template.getTemplate_ = function(tmplName) {
    return Template.templates_.get(tmplName.toUpperCase());
};

/**
 * Registers the template from specified template DOM.
 * If templateDOM doesn't have the 'name' attribute, it's skipped.
 * @param {HTMLTemplateElement} templateDOM template DOM.
 * @private
 */
Template.registerTemplate_ = function(templateDOM) {
    var name = templateDOM.getAttribute('name'),
        template, templateDOM, controllerName;

    if (!name) return;

    template = new Template();
    template.tagName = templateDOM.name;
    Template.container_.innerHTML = templateDOM.innerHTML;
    template.dom = Template.container_.firstElementChild;
    if (controllerName = templateDOM.getAttribute('controller')) {
        template.controller = this.getController_(controllerName);
    }
    template.regClassName = new RegExp(name + '-(\\w+)');


    templateDOM.parentNode.removeChild(templateDOM);

    Template.templates_.set(name.toUpperCase(), template);
};

/**
 * Checks if the template with specified name is exist.
 * @param {string} tmplName template name.
 * @return {boolean} If true, the template with specified name is exist, otherwise false.
 * @private
 */
Template.hasTemplate_ = function(tmplName) {
    return Template.templates_.has(tmplName.toUpperCase());
};

/**
 * Replaces from HTMLUnknownElement to CustomElement if need.
 * @param {Element} element elemnt.
 * @param {Object} $ DOM map. If need, DOM map is updated.
 * @param {boolean} [flagRecursive=false] If true, this method applied for child elements recursivly.
 */
Template.prototype.replaceHTMLUnknownElement = function(element, $, flagRecursive) {
    var children = util.slice(element.children, 0),
        childNodes = util.slice(element.childNodes, 0),
        customElement, root, content, parent, name,
        controller, controllerName, controllerConstructor,
        ma;

    flagRecursive = flagRecursive || false;

    if (element instanceof HTMLUnknownElement && Template.hasTemplate_(element.tagName)) {
        //1. create CustomElement.
        customElement = Template.create(element.tagName);
        root = customElement.root;
        content = customElement.content;

        //2. move children.
        childNodes.forEach(function(childNode) {
            content.appendChild(childNode);
        });

        //3. copy attributes

        //3-1. copy attribute
        Template.copyAttribute(root, element);

        //3-2. If element has [controller], attach controller to the element.
        if ((controllerName = root.getAttribute('controller')) &&
            (controllerConstructor = Template.getController_(controllerName))) {
            controller = new controllerConstructor(customElement);
            root.controller = controller;
        }

        //4. replace from HTMLUnknownElement to custom element.
        parent = element.parentNode;
        parent.insertBefore(root, element);
        parent.removeChild(element);

        //5. If need, replace DOM map.
        if (ma = element.className.match(this.regClassName)) {
            $[ma[1]] = root;
        }
    }

    if (flagRecursive) {
        children.map(function(child) {
            this.replaceHTMLUnknownElement(child, $, true);
        }, this);
    }
};

/**
 * Create DOM from this template.
 * @param {Object} context binded context.
 * @return {Object} DOM map.
 */
Template.prototype.create = function(context) {
    /**
     * 1. Clone node
     */
    var $ = {},
        root = this.dom.cloneNode(true),
        ma,
        regClassName = this.regClassName;

    $.root = root;
    util.forEach(root.querySelectorAll('[class]'), function(node) {
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
    this.replaceHTMLUnknownElement(root, $, true);

    /**
     * 3. Configuration of bindings
     */
    this.bindings.forEach(function(binding) {
        //3-1. copy binding
        //3-2. change binding target null -> context
        //3-3. change binding node templateNode -> realNode
    });

    /**
     * 4. If controller is exist, create.
     */
    if (this.controller) {
        controller = new this.controller($);
        $.root.controller = controller;
        $.controller = controller;
    }

    return $;
};

/**
 * copy element attributes
 * @param {Element} target copy target element.
 * @param {Element} source copy source element.
 */
Template.copyAttribute = function(target, source) {
    util.forEach(source.attributes, function(attr) {
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
 * Bootstrap
 */
util.once(window, 'DOMContentLoaded', function() {
    util.forEach(document.querySelectorAll('template'), function(templateDOM) {
        Template.registerTemplate_(templateDOM);
    });
});

module.exports = Template;
