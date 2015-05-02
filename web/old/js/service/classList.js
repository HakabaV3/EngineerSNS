if (!('classList' in document.createElement('a'))) {
    var DOMTokenList = require('./domtokenlist.js');

    Element.prototype.__defineGetter__('classList', function() {
        return new DOMTokenList(this, 'class');
    });
}
