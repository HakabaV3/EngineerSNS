var ViewController = require('./ViewController.js'),
    util = require('../Service/util.js');

function RippleViewController() {
    ViewController.apply(this, arguments);
}
util.inherits(RippleViewController, ViewController);

RippleViewController.prototype.rippleIn = function(x, y) {
    var main = this.$.main;

    main.style.left = x - 15 + 'px';
    main.style.top = y - 15 + 'px';

    main.classList.remove('is-rippleIn');
    this.$.root.classList.remove('is-rippleOut');
    util.runAsync(function() {
        main.classList.add('is-rippleIn');
    });
};

RippleViewController.prototype.rippleOut = function() {
    var self = this;

    this.$.root.classList.remove('is-rippleOut');
    util.runAsync(function() {
        self.$.root.classList.add('is-rippleOut');
    });
};

RippleViewController.registerController('RippleViewController');

module.exports = RippleViewController;
