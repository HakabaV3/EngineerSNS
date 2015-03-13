//@include ../service/util.js
//@include ../model/model.js
//@include view.js

/**
 *  リスト表示用の抽象クラス。
 *  使用する際は、継承先で
 *  - View#loadTemplateを呼び出す。
 *  - List#setItemsを用いてデータを設定する。
 *  - ListView#itemViewConstructorにリストアイテムビューのコンストラクタを設定する。
 *  の2点を行うこと。
 */
var ListView = function() {
    View.call(this);

    /**
     *  @type {Function}
     */
    this.itemViewConstructor = null;

    /**
     *  @type {[Model]}
     */
    this.items = [];

    /**
     *  @type {[View]}
     */
    this.itemViews = [];

    /**
     *  @type {[Model]}
     *  @private
     */
    this.oldItems_ = [];
};
extendClass(ListView, View);

ListView.prototype.finalize = function() {
    this.setItems([]);

    View.prototype.finalize.call(this);
};

/**
 *  @param {[Model]} items items.
 */
ListView.prototype.setItems = function(newItems) {
    var oldItems = this.items,
        self = this;
    newItems = newItems || [];

    if (oldItems) {
        oldItems.forEach(function(item) {
            item.off('delete', self.onDeleteItem, self);
        });
    }

    if (newItems) {
        newItems.forEach(function(item) {
            item.on('delete', self.onDeleteItem, self);
        });
    }

    this.items = newItems;
    this.update();
};

ListView.prototype.update = function() {
    var oldItems = this.oldItems_,
        oldItemsCount = oldItems.length,
        oldIndex = 0,

        newItems = this.items,
        newItemsCount = newItems.length,
        newIndex = 0,

        views = this.itemViews,
        viewCount = this.itemViews.length,
        view,

        itemViewConstructor = this.itemViewConstructor;

    if (!itemViewConstructor) {
        console.warn('ListView#itemViewConstructor must be set.');
        return;
    }

    while (newIndex < newItemsCount) {
        if (oldItems[oldIndex] === newItems[newIndex]) {
            oldIndex++;

        } else {
            view = new itemViewConstructor();
            view.setModel(newItems[newIndex]);

            if (newIndex < viewCount) {
                view.insertBefore(views[newIndex]);
                views.splice(newIndex, 0, view);
            } else {
                view.appendTo(this);
                views.push(view);
            }
            viewCount++;
        }

        newIndex++;
    }

    while (viewCount > newItemsCount) {
        views.pop().finalize();
        viewCount--;
    }

    this.oldItems_ = this.items.slice(0);
};

ListView.prototype.onDeleteItem = function(item) {
    var oldItems = this.items,
        index = oldItems.indexOf(item),
        newItems;

    if (index === -1) return;

    newItems = oldItems.slice(0);
    newItems.splice(index, 1);

    this.setItems(newItems);
};
