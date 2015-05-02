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
