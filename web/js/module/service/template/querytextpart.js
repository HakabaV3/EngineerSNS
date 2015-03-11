//@include ../util.js
//@include querypart.js

Template.QueryTextPart = function(text) {
    if (!(this instanceof Template.QueryTextPart)) return new Template.QueryTextPart(text);
    Template.QueryPart.call(this);

    /**
     *  @type {string}
     */
    this.text = null;
    this.setText(text);
};
extendClass(Template.QueryTextPart, Template.QueryPart);

Template.QueryTextPart.prototype.setText = function(newText) {
    var oldText = this.text;

    if (oldText === newText) return;

    this.text = newText;

    this.fire('change');
};

Template.QueryTextPart.prototype.getValue = function() {
    return this.text || '';
};
