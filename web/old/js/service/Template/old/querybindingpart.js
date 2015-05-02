var util = require('../util.js'),
    QueryPart = require('./querypart.js'),
    BinDing = require('./binding.js');

function QueryBindingPart(binding) {
    QueryPart.apply(this, arguments);

    this.onChange = this.onChange.bind(this);

    /**
     *	@type {Binding}
     */
    this.binding = null;
    this.setBinding(binding);
}
util.inherits(QueryBindingPart, QueryPart);

QueryBindingPart.prototype.finalize = function() {
    this.setBinding(null);
    this.onChange = null;

    QueryPart.prototype.finalize.apply(this, arguments);
};

QueryBindingPart.prototype.setBinding = function(newBinding) {
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

QueryBindingPart.prototype.onChange = function() {
    this.fire('change');
};

QueryBindingPart.prototype.getValue = function() {
    return this.binding ? this.binding.getValue() : '';
};

module.exports = QueryBindingPart;
