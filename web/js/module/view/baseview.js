//@include ../service/util.js
//@include view.js

var BaseView = function() {
    View.call(this);

    this.loadTemplate('BaseView');
};
extendClass(BaseView, View);
