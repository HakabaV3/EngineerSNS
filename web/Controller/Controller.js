var EventDispatcher = require('../Service/EventDispatcher.js');

/**
 *  @constructor
 *  @extends {EventDispatcher}
 */
function Controller() {
    EventDispatcher.apply(this, arguments);
}
inherits(Controller, EventDispatcher);

module.exports = Controller;
