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
