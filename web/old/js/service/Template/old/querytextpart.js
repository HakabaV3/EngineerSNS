var util = require('../util.js'),
	QueryPart = require('./querypart.js');

function QueryTextPart(text) {
	QueryPart.apply(this, arguments);

	/**
	 *  @type {string}
	 */
	this.text = null;
	this.setText(text);
}
util.inherits(QueryTextPart, QueryPart);

QueryTextPart.prototype.setText = function(newText) {
	var oldText = this.text;

	if (oldText === newText) return;

	this.text = newText;

	this.fire('change');
};

QueryTextPart.prototype.getValue = function() {
	return this.text || '';
};

module.exports = QueryTextPart;
