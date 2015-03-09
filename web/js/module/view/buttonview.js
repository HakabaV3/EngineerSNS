//@include ../service/util.js
//@include view.js

var ButtonView = function() {
    View.call(this);

    this.loadTemplate('ButtonView');
};
extendClass(ButtonView, View);
