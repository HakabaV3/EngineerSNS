var AppView = require('./view/appview/appview.js');

window.addEventListener('DOMContentLoaded', function() {
    var appView = new AppView();
    document.body.appendChild(appView.$.root);
});
