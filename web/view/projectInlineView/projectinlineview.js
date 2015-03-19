var View = require('../view/view.js'),
    util = require('../../service/util.js'),
    LazyImageView = require('../lazyimageview/lazyimageview.js'),
    Project = require('../../model/project.js');

function ProjectInlineView() {
    View.apply(this, arguments);

    this.project = null;
    this.update();

    this.$.link.addEventListener('click', this);
}
util.inherits(ProjectInlineView, View);

ProjectInlineView.prototype.setProject = function(project) {
    this.project = project;
    this.update();
};

ProjectInlineView.prototype.update = function() {
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

ProjectInlineView.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'click':
            this.onClick(ev);
            break;
    }
};

ProjectInlineView.prototype.onClick = function(ev) {
    ev.stopPropagation();

    var event = new Event('click');
    this.$.root.dispatchEvent(event);

    if (event.defaultPrevented || !this.project) {
        ev.preventDefault();
    }
};

ProjectInlineView.setViewConstructor('ProjectInlineView');

module.exports = ProjectInlineView;
