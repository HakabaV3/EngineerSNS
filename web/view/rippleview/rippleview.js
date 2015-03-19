var View = require('../view/view.js'),
    util = require('../../service/util.js');

function RippleView() {
    View.apply(this, arguments);
}
util.inherits(RippleView, View);

RippleView.prototype.rippleIn = function(x, y) {
    var main = this.$.main;

    main.style.left = x - 15 + 'px';
    main.style.top = y - 15 + 'px';

    main.classList.remove('is-rippleIn');
    this.$.root.classList.remove('is-rippleOut');
    util.runAsync(function() {
        main.classList.add('is-rippleIn');
    });
};

RippleView.prototype.rippleOut = function() {
    var self = this;

    this.$.root.classList.remove('is-rippleOut');
    util.runAsync(function() {
        self.$.root.classList.add('is-rippleOut');
    });
};

RippleView.setViewConstructor('RippleView');

module.exports = RippleView;
