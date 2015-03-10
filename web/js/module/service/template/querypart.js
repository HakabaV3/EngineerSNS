//@include ../util.js
//@include ../eventdispatcher.js

/**
 *	@namespace Template
 */
Template.QueryPart = function() {
    EventDispatcher.call(this);
};
extendClass(Template.QueryPart, EventDispatcher);

Template.QueryPart.prototype.getValue = function() {
    console.warn('Template.QueryPart#getValue must be overrided.');
    return '';
};

/**
 *	@enum {string}
 */
Template.QueryPart.Type = {
    TEXT: 'TEXT',
    BINDING: 'BINDING',
    VIEW: 'VIEW'
};
