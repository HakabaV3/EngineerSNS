var View = require('../view/view.js'),
    util = require('../../service/util.js'),
    Animation = require('../../service/animation.js')

function SwitchView() {
    View.apply(this, arguments);
}
util.inherits(SwitchView, View);

SwitchView.prototype.getCurrentPageNode = function() {
    var children = this.$.content.children,
        i, max;
    for (i = 0, max = children.length; i < max; i++) {
        if (children[i].hasAttribute('visible')) {
            return children[i];
        }
    }

    return null;
};
SwitchView.prototype.__defineGetter__('currentPageNode', SwitchView.prototype.getCurrentPageNode);

SwitchView.prototype.fadeTo = function(nextNode, callback) {
    var currentNode = this.currentPageNode,
        animation;

    if (currentNode === nextNode) return;

    animation = new Animation();

    if (currentNode) {
        animation
            .then(currentNode, function(node) {
                node.style.transition = '0.3s ease-out';
                node.style.transform = 'translateY(0px)';
                node.style.opacity = 1;
            })
            .wait(currentNode, function(node) {
                node.style.transform = 'translateY(50px)';
                node.style.opacity = 0;
            })
            .then(currentNode, function(node) {
                node.removeAttribute('visible');
                node.style.transition = '';
                node.style.transform = '';
                node.style.opacity = '';
            });
    }

    animation
        .then(nextNode, function(node) {
            node.setAttribute('visible', '');
            node.style.transition = '0.3s ease-in';
            node.style.transform = 'translateY(50px)';
            node.style.opacity = 0;
        })
        .wait(nextNode, function(node) {
            node.style.transform = 'translateY(0px)';
            node.style.opacity = 1;
        })
        .then(nextNode, function(node) {
            node.style.transition = '';
            node.style.transform = '';
            node.style.opacity = '';
        })
        .then(nextNode, function(node) {
            util.isFunction(callback) && callback();
        });

    return this;
};

SwitchView.setViewConstructor('SwitchView');

module.exports = SwitchView;
