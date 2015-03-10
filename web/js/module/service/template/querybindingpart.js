//@include ../util.js
//@include querypart.js
//@include binding.js

Template.QueryBindingPart = function(binding) {
    if (!(this instanceof Template.QueryBindingPart)) return new Template.QueryBindingPart(binding);
    Template.QueryPart.call(this);

    this.onChange = this.onChange.bind(this);

    /**
     *	@type {Template.Binding}
     */
    this.binding = null;
    this.setBinding(binding);
};
extendClass(Template.QueryBindingPart, Template.QueryPart);

Template.QueryBindingPart.prototype.finalize = function() {
    this.setBinding(null);
    this.onChange = null;

    Template.QueryPart.prototype.finalize.call(this);
};

Template.QueryBindingPart.prototype.setBinding = function(newBinding) {
    var oldBinding = this.binding;

    if (oldBinding) {
        oldBinding.off('change', this.onChange);
    }

    this.binding = newBinding;

    if (newBinding) {
        newBinding.on('change', this.onChange);
    }

    this.onChange();
};

Template.QueryBindingPart.prototype.onChange = function() {
    this.fire('change');
};

Template.QueryBindingPart.prototype.getValue = function() {
    return this.binding ? this.binding.getValue() : '';
};
