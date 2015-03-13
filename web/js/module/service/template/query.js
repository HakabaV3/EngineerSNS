//@include querytextpart.js
//@include querybindingpart.js
//@include queryviewpart.js

/**
 *  @namespace Template
 */
Template.Query = function(node, attrName, parts) {
    if (!(this instanceof Template.Query)) return new Template.Query(node, attrName, parts);

    /**
     *  @type {Node}
     */
    this.node = node || null;

    /**
     *  @type {string|null}
     */
    this.attrName = attrName || null;

    /**
     *  @type {[QueryParts]}
     */
    this.parts = null;
    this.setParts(parts);
};

Template.Query.prototype.finalize = function() {
    this.parts.forEach(function(part) {
        part.finalize();
    });
    this.node = null;
};

Template.Query.prototype.setParts = function(newParts) {
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

Template.Query.prototype.update = function() {
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
                if (value instanceof View) {
                    value.appendTo(fragment);
                    flagView = true;
                } else if (isString(value)) {
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
