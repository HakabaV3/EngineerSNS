//@include ../service/util.js
//@include view.js

var ToolBarView = function() {
    View.call(this);

    this.state = {
        loginState: false
    }

    this.loadTemplate('ToolBarView');
};

extendClass(ToolBarView, View);
