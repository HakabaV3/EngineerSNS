function ViewAnimation() {

}

module.exports = ViewAnimation;

ViewAnimation.animate = function() {
    return this;
};

ViewAnimation.onTransitionEnd = function(callback) {
    var que = this.transitionendCallbackQue_;

    if (!que) {
        que = this.transitionendCallbackQue_ = [];
    }

    que.push(callback);
};
