var util = require('../util.js'),
	EventDispatcher = require('../eventdispatcher.js');

/**
 *	@namespace Template
 */
function QueryPart() {
	EventDispatcher.apply(this, arguments);
}
util.inherits(QueryPart, EventDispatcher);

QueryPart.prototype.getValue = function() {
	console.warn('QueryPart#getValue must be overrided.');
	return '';
};

/**
 *	@enum {string}
 */
QueryPart.Type = {
	TEXT: 'TEXT',
	BINDING: 'BINDING',
	VIEW: 'VIEW'
};

module.exports = QueryPart;
