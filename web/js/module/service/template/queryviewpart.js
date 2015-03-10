//@include ../util.js
//@include querypart.js
//@include binding.js

Template.QueryViewPart = function(view) {
    if (!(this instanceof Template.QueryViewPart)) return new Template.QueryViewPart(binding);
    Template.QueryPart.call(this);

    /**
     *  @type {View}
     */
    this.view = null;
    this.setView(view);
};
extendClass(Template.QueryViewPart, Template.QueryPart);

Template.QueryViewPart.prototype.finalize = function() {
    this.setView(null);

    Template.QueryPart.prototype.finalize.call(this);
};

Template.QueryViewPart.prototype.setView = function(newView) {
    var oldView = this.view;

    if (oldView === newView) return;

    this.view = newView;

    this.fire('change');
};

Template.QueryViewPart.prototype.getValue = function() {
    return this.view || '';
};
