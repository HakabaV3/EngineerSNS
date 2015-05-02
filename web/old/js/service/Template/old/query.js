var util = require('../util.js'),
	QueryPart = require('./querypart.js');

function Query(node, attrName, parts) {
	/**
	 *  @type {Node}
	 */
	this.node = node || null;

	/**
	 *  @type {string|null}
	 */
	this.attrName = attrName || null;

	/**
	 *  @type {[QueryPart]}
	 */
	this.parts = null;
	this.setParts(parts);
}

Query.prototype.finalize = function() {
	this.parts.forEach(function(part) {
		part.finalize();
	});
	this.node = null;
};

Query.prototype.setParts = function(newParts) {
	var oldParts = this.parts,
		self = this;

	if (oldParts) {
		oldParts.forEach(function(oldPart) {
			/**
			 *  @TODO @NOTE
			 *  ここでoldPartのfinalizeは不要なのか？
			 */

			oldPart.off('change', self.update, self);
		});
	}

	this.parts = newParts;

	if (newParts) {
		newParts.forEach(function(newPart) {
			newPart.on('change', self.update, self);
		});
	}

	this.update();
};

Query.prototype.update = function() {
	var values,
		parts = this.parts,
		node = this.node,
		attrName = this.attrName,
		flagView = false;

	if (!parts || !node || !attrName) return;

	values = parts.map(function(part) {
		return part.getValue();
	});

	switch (attrName) {
		case 'textContent':
			var fragment = document.createDocumentFragment();
			values.forEach(function(value) {

				/**
				 *  @TODO hackなのであとで直す
				 */
				if (util.isObject(value)) {
					value.appendTo(fragment);
					flagView = true;
				} else if (util.isString(value)) {
					fragment.appendChild(new Text(value));
				}
			});

			if (flagView) {
				if (node.parentNode) {
					node.parentNode.insertBefore(fragment, node);
					node.parentNode.removeChild(node);
				}
			} else {
				node[attrName] = values.join('');
			}

			break;

		default:
			node.setAttribute(attrName, values.join(''));
			break;
	}
};

module.exports = Query;
