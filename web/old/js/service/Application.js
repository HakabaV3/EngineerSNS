var Template = require('./Template/Template.js');

/**
 * The class as Application entry point.
 */

var instance;

function Application() {
    if (instance) {
        instance = this;
    }

    return instance;
};

/**
 *	Starts application.
 *	@param {string} baseElement the name of the customElement which is base of the app.
 */
Application.prototype.run = function(baseElementName) {
    window.addEventListener('DOMContentLoaded', function() {
        document.body.appendChild(Template.create(baseElementName).root);
    });
};

/**
 * bootstrap
 */
window.addEventListener('load', function() {
    document.body.removeAttribute('unresolved');
});

module.exports = Application;
