//@include ../service/util.js
//@include view.js

var BaseView = function() {
    View.call(this);

    this.loadTemplate('BaseView');

    this.mode = null;

    app.on('rout.change', this.onChangeRout = this.onChangeRout.bind(this));
};
extendClass(BaseView, View);

BaseView.prototype.finalize = function() {
    app.off('rout.change', this.onChangeRout)
    this.onChangeRout = null;

    View.prototype.finalize.call(this);
};

BaseView.prototype.onChangeRout = function(rout) {
    this.mode = rout.mode;
};
