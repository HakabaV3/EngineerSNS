var ViewController = require('./ViewController.js'),
    util = require('../Service/util.js');

function LazyImageViewController() {
    ViewController.apply(this, arguments);

    this.$.image.addEventListener('load', this);
    this.$.image.addEventListener('error', this);

    this.state = this.state || LazyImageViewController.State.NOTHING;

    this.src = this.src || '';
}
util.inherits(LazyImageViewController, ViewController);

LazyImageViewController.State = {
    NOTHING: 'nothing',
    LOADING: 'loading',
    LOAD: 'load',
    ERROR: 'error'
};

LazyImageViewController.prototype.getState = function() {
    return this.$.root.getAttribute('state');
};
LazyImageViewController.prototype.__defineGetter__('state', LazyImageViewController.prototype.getState);

LazyImageViewController.prototype.setState = function(newVal) {
    if (this.state === newVal) return;
    this.$.root.setAttribute('state', newVal);
};
LazyImageViewController.prototype.__defineSetter__('state', LazyImageViewController.prototype.setState);

LazyImageViewController.prototype.getSrc = function() {
    return this.$.image.src;
};
LazyImageViewController.prototype.__defineGetter__('src', LazyImageViewController.prototype.getSrc);

LazyImageViewController.prototype.setSrc = function(newVal) {
    if (this.src === newVal) return;
    this.$.image.src = newVal;
    this.load();
};
LazyImageViewController.prototype.__defineSetter__('src', LazyImageViewController.prototype.setSrc);

LazyImageViewController.prototype.load = function() {
    var src = this.src;

    if (!src) {
        this.state = LazyImageViewController.State.NOTHING;
        this.$.image.src = '';
        return;
    }

    this.state = LazyImageViewController.State.LOADING;
    this.$.image.src = this.src;
};

LazyImageViewController.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'load':
            this.onImageLoad(ev);
            break;

        case 'error':
            this.onImageError(ev);
            break;
    }
};

LazyImageViewController.prototype.onImageLoad = function(ev) {
    if (this.state !== LazyImageViewController.State.LOADING) return;
    this.state = LazyImageViewController.State.LOAD;

    this.$.root.dispatchEvent(new Event('load'))
};

LazyImageViewController.prototype.onImageError = function(ev) {
    if (this.state !== LazyImageViewController.State.LOADING) return;
    this.state = LazyImageViewController.State.ERROR;

    this.$.root.dispatchEvent(new Event('error'))
};

LazyImageViewController.registerController('LazyImageViewController');

module.exports = LazyImageViewController;
