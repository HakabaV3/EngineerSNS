var util = require('../util.js'),
	QueryPart = require('./querypart.js'),
	Binding = require('./binding.js');

function QueryViewPart(view) {
	QueryPart.apply(this, arguments);

	/**
	 *  @type {View}
	 */
	this.view = null;
	this.setView(view);
}
util.inherits(QueryViewPart, QueryPart);

QueryViewPart.prototype.finalize = function() {
	this.setView(null);

	QueryPart.prototype.finalize.apply(this, arguments);
};

QueryViewPart.prototype.setView = function(newView) {
	var oldView = this.view;

	if (oldView === newView) return;

	this.view = newView;

	this.fire('change');
};

QueryViewPart.prototype.getValue = function() {
	return this.view || '';
};

module.exports = QueryViewPart;
