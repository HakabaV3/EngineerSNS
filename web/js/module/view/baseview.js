//@include ../service/util.js
//@include view.js

var BaseView = function() {
    View.call(this);

    this.loadTemplate('BaseView');

    /**
     *  @type {string}
     */
    this.mode = null;

    /**
     *  @type {View}
     */
    this.currentPageView = null;

    app.on('rout.change', this.onChangeRout = this.onChangeRout.bind(this));
};
extendClass(BaseView, View);

BaseView.prototype.finalize = function() {
    app.off('rout.change', this.onChangeRout)
    this.onChangeRout = null;

    View.prototype.finalize.call(this);
};

BaseView.prototype.onChangeRout = function(rout) {
    var self = this,
        pageView = ({
            'user': this.childViews.userPageView,
            'project': this.childViews.projectPageView,
            'signin': this.childViews.signInPageView,
            'signup': this.childViews.signUpPageView,
            'error404': this.childViews.error404PageView
        })[rout.mode];

    if (pageView) {
        pageView
            .once('load', function() {
                self.showPageView(pageView);
                self.childViews.progressBarView.setValue(100);
            });
    }

    this.childViews.progressBarView.setValue(99);
    this.mode = rout.mode;
};

BaseView.prototype.showPageView = function(newPageView) {
    var oldPageView = this.currentPageView;

    if (oldPageView === newPageView) return;

    if (oldPageView) {
        oldPageView.$.root.classList.remove('is-visible');
    }

    if (newPageView) {
        newPageView.$.root.classList.add('is-visible');
    }

    this.currentPageView = newPageView;
}
