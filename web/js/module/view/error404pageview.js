//@include ../service/util.js
//@include view.js

var Error404PageView = function() {
    View.call(this);

    this.loadTemplate('Error404PageView');
};
extendClass(Error404PageView, View);
