var View = require('../view/view.js'),
    util = require('../../service/util.js');

function LazyImageView() {
    View.apply(this, arguments);

    this.$.image.addEventListener('load', this);
    this.$.image.addEventListener('error', this);

    this.state = this.state || LazyImageView.State.NOTHING;

    this.src = this.src || '';
}
util.inherits(LazyImageView, View);

LazyImageView.State = {
    NOTHING: 'nothing',
    LOADING: 'loading',
    LOAD: 'load',
    ERROR: 'error'
};

LazyImageView.prototype.getState = function() {
    return this.$.root.getAttribute('state');
};
LazyImageView.prototype.__defineGetter__('state', LazyImageView.prototype.getState);

LazyImageView.prototype.setState = function(newVal) {
    if (this.state === newVal) return;
    this.$.root.setAttribute('state', newVal);
};
LazyImageView.prototype.__defineSetter__('state', LazyImageView.prototype.setState);

LazyImageView.prototype.getSrc = function() {
    return this.$.image.src;
};
LazyImageView.prototype.__defineGetter__('src', LazyImageView.prototype.getSrc);

LazyImageView.prototype.setSrc = function(newVal) {
    if (this.src === newVal) return;
    this.$.image.src = newVal;
    this.load();
};
LazyImageView.prototype.__defineSetter__('src', LazyImageView.prototype.setSrc);

LazyImageView.prototype.load = function() {
    var src = this.src;

    if (!src) {
        this.state = LazyImageView.State.NOTHING;
        this.$.image.src = '';
        return;
    }

    this.state = LazyImageView.State.LOADING;
    this.$.image.src = this.src;
};

LazyImageView.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'load':
            this.onImageLoad(ev);
            break;

        case 'error':
            this.onImageError(ev);
            break;
    }
};

LazyImageView.prototype.onImageLoad = function(ev) {
    if (this.state !== LazyImageView.State.LOADING) return;
    this.state = LazyImageView.State.LOAD;

    this.$.root.dispatchEvent(new Event('load'))
};

LazyImageView.prototype.onImageError = function(ev) {
    if (this.state !== LazyImageView.State.LOADING) return;
    this.state = LazyImageView.State.ERROR;

    this.$.root.dispatchEvent(new Event('error'))
};

LazyImageView.setViewConstructor('LazyImageView');

module.exports = LazyImageView;
