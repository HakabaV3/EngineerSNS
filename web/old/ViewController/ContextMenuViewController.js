var util = require('../Service/util.js'),
    ViewController = require('./ViewController.js'),
    Animation = require('../Service/Animation.js');

function ContextMenuViewController() {
    ViewController.apply(this, arguments);

    this.$.root.addEventListener('blur', this);
}
util.inherits(ContextMenuViewController, ViewController);

ContextMenuViewController.prototype.getIsVisible = function() {
    return this.$.root.hasAttribute('visible');
};
ContextMenuViewController.prototype.__defineGetter__('isVisible', ContextMenuViewController.prototype.getIsVisible);

ContextMenuViewController.prototype.setIsVisible = function(value) {
    if (value) {
        this.$.root.setAttribute('visible', '');
    } else {
        this.$.root.removeAttribute('visible');
    }
};
ContextMenuViewController.prototype.__defineSetter__('isVisible', ContextMenuViewController.prototype.setIsVisible);

ContextMenuViewController.prototype.fadeIn = function(callback) {
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

ContextMenuViewController.prototype.fadeOut = function(callback) {
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

ContextMenuViewController.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'blur':
            this.onBlur(ev);
            break;
    }
};

ContextMenuViewController.prototype.onBlur = function(ev) {
    this.fadeOut();
};

ContextMenuViewController.registerController('ContextMenuViewController');

module.exports = ContextMenuViewController;
