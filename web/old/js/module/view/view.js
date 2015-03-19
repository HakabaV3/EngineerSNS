//@include ../service/service/util.js'
//@include ../service/eventdispatcher.js
//@include ../service/template.js

var View = function() {
    var self = this;

    EventDispatcher.call(this);

    /**
     *  DOM reference map
     *  @type {Object}
     */
    this.$ = {
        root: null,
        container: null,
    };
}
extendClass(View, EventDispatcher);

/**
 * Finalizer.
 */
View.prototype.finalize = function() {
    var self = this,
        key;

    this.queries.forEach(function(query) {
        query.finalize();
    });
    Object.keys(this.childViews).forEach(function(childViewName) {
        self.childViews[childViewName].finalize();
    });

    Observer.unobserveAll(this);
    this.remove();
    this.$ = null;
    EventDispatcher.prototype.finalize.call(this);
};

/**
 *  Create DOM with template.
 *  @param {string} templateId Template ID.
 */
View.prototype.loadTemplate = function(templateId) {
    var created = Template.create(templateId, this),
        self = this;

    this.$.root = created.node;
    this.$.container = this.$.root.querySelector('[container]') || this.$.root;

    forEach(this.$.root.querySelectorAll('[name]'), function(node) {
        self.$[node.getAttribute('name')] = node;
    });

    this.childViews = created.childViews;
    this.queries = created.queries;
};

/**
 *  Append child node to this view.
 *  @param {View|Element} child Child node.
 *  @return this
 */
View.prototype.appendChild = function(child) {
    if (child instanceof View) child = child.$.root;
    this.$.container.appendChild(child);

    return this;
};

/**
 *  Append this view to the node.
 *  @param {View|Element} parent parent node
 *  @return this
 */
View.prototype.appendTo = function(parent) {
    parent.appendChild(this.$.root);

    return this;
};

/**
 *  Append this view before the node
 *  @param {View|Element} ref the reference node
 *  @return this
 */
View.prototype.insertBefore = function(ref) {
    if (ref instanceof View) ref = ref.$.root;
    var parent = ref.parentNode,
        root = this.$.root;

    parent.insertBefore(root, ref);

    return this;
};

/**
 *  Append this view after the node
 *  @param {View|Element} ref the reference node
 *  @return this
 */
View.prototype.insertAfter = function(ref) {
    if (ref instanceof View) ref = ref.$.root;
    var parent = ref.parentNode,
        root = this.$.root;

    parent.insertBefore(root, ref);
    parent.insertBefore(ref, root);

    return this;
};

/**
 *  remove this view
 *  @return this
 */
View.prototype.remove = function() {
    this.$.root.parentNode.removeChild(this.$.root);

    return this;
};

/**
 *  update this view
 */
View.prototype.update = function() {
    console.warn('NIP!');
};
