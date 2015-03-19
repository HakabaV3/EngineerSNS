//@include ../service/service/util.js'
//@include view.js

/**
 *	ProgressBarView
 *	@constructor
 *	@extend {View}
 */
function ProgressBarView() {
    View.call(this);

    this.loadTemplate('ProgressBarView');

    /**
     *	@type {ProgressBarView.State}
     */
    this.state = ProgressBarView.State.INITIAL;

    this.setComplete = this.setComplete.bind(this);
    this.setInitial = this.setInitial.bind(this);
};
extendClass(ProgressBarView, View);

/**
 *	@enum {number}
 */
ProgressBarView.State = {
    INITIAL: 0,
    PROCESSING: 1,
    COMPLETE: 2
};

/**
 *	Animation duration time (ms)
 *	@const {number}
 */
ProgressBarView.ANIMATION_DURATION = 800;

ProgressBarView.prototype.finalize = function() {
    this.setComplete = null;
    this.setInitial = null;

    View.prototype.finalize.call(this);
};

ProgressBarView.prototype.setComplete = function() {
    var inner = this.$.inner;

    if (this.state !== ProgressBarView.State.PROCESSING) return;
    this.state = ProgressBarView.State.COMPLETE;

    setTimeout(this.setInitial, ProgressBarView.ANIMATION_DURATION);

    inner.classList.add('is-complete');
    inner.style.width = '';
};

ProgressBarView.prototype.setInitial = function() {
    var inner = this.$.inner;

    if (this.state !== ProgressBarView.State.COMPLETE) return;
    this.state = ProgressBarView.State.INITIAL;

    inner.classList.remove('is-complete');
    inner.classList.add('is-initial');
};

/**
 *	@param {number} value value.
 */
ProgressBarView.prototype.setValue = function(value) {
    var inner = this.$.inner;

    if (this.state === ProgressBarView.State.COMPLETE) return;
    this.state = ProgressBarView.State.PROCESSING;

    if (value >= 100) {
        value = 100;
        setTimeout(this.setComplete, ProgressBarView.ANIMATION_DURATION);
    }

    inner.classList.remove('is-initial');
    inner.style.width = value + '%';
};
