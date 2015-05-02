var Template = require('./Service/Template.js'),
    ESAppController = require('./Controller/ESAppController.js');

window.onload = function() {
    var app = new ESAppController();

    document.body.appendChild(app.element);
    document.body.removeAttribute('unresolved');
};

module.exports = noop;
