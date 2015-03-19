var util = require('../../service/util.js'),
    View = require('../view/view.js'),
    Animation = require('../../service/animation.js');

function ContextMenuView() {
    View.apply(this, arguments);

    this.$.root.addEventListener('blur', this);
}
util.inherits(ContextMenuView, View);

ContextMenuView.setViewConstructor('ContextMenuView');

ContextMenuView.prototype.getIsVisible = function() {
    return this.$.root.hasAttribute('visible');
};
ContextMenuView.prototype.__defineGetter__('isVisible', ContextMenuView.prototype.getIsVisible);

ContextMenuView.prototype.setIsVisible = function(value) {
    if (value) {
        this.$.root.setAttribute('visible', '');
    } else {
        this.$.root.removeAttribute('visible');
    }
};
ContextMenuView.prototype.__defineSetter__('isVisible', ContextMenuView.prototype.setIsVisible);

ContextMenuView.prototype.fadeIn = function(callback) {
    var animation = new Animation(),
        root = this.$.root,
        self = this;

    if (this.isVisible) {
        util.isFunction(callback) && calback();
        return;
    }

    animation.then(root, function(node) {
            self.isVisible = true;
            node.style.transition = '0.3s ease';
            node.style.transform = 'translateY(-10px)';
            node.style.opacity = 0;
        })
        .wait(root, function(node) {
            node.style.transform = 'translateY(0px)'
            node.style.opacity = 1;
        })
        .then(root, function(node) {
            node.style.transition = '';
            node.style.transform = ''
            node.style.opacity = '';
        })
        .then(root, function(node) {
            node.focus();
            util.isFunction(callback) && calback();
        });
};

ContextMenuView.prototype.fadeOut = function(callback) {
    var animation = new Animation(),
        root = this.$.root,
        self = this;

    if (!this.isVisible) {
        util.isFunction(callback) && calback();
        return;
    }

    animation.then(root, function(node) {
            node.style.transition = '0.3s ease';
            node.style.opacity = 1;
        })
        .wait(root, function(node) {
            node.style.opacity = 0;
        })
        .then(root, function(node) {
            node.style.transition = '';
            node.style.opacity = '';
            self.isVisible = false;
        })
        .then(root, function(node) {
            util.isFunction(callback) && calback();
        });
};

ContextMenuView.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'blur':
            this.onBlur(ev);
            break;
    }
};

ContextMenuView.prototype.onBlur = function(ev) {
    this.fadeOut();
};

module.exports = ContextMenuView;
