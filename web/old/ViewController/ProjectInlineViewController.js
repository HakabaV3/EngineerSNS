var ViewController = require('./ViewController.js'),
    util = require('../Service/util.js'),
    Project = require('../Model/Project.js');

function ProjectInlineViewController() {
    ViewController.apply(this, arguments);

    this.project = null;
    this.update();

    this.$.link.addEventListener('click', this);
}
util.inherits(ProjectInlineViewController, ViewController);

ProjectInlineViewController.prototype.setProject = function(project) {
    this.project = project;
    this.update();
};

ProjectInlineViewController.prototype.update = function() {
    var project = this.project,
        self = this;

    if (project) {
        this.$.projectName.textContent = project.name;
        this.$.link.href = '#!' + project.uri;

        this.$.root.classList.remove('is-project-nothing');
    } else {
        this.$.root.classList.add('is-project-nothing');
    }
};

ProjectInlineViewController.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'click':
            this.onClick(ev);
            break;
    }
};

ProjectInlineViewController.prototype.onClick = function(ev) {
    ev.stopPropagation();

    var event = new Event('click');
    this.$.root.dispatchEvent(event);

    if (event.defaultPrevented || !this.project) {
        ev.preventDefault();
    }
};

ProjectInlineViewController.registerController('ProjectInlineViewController');

module.exports = ProjectInlineViewController;
