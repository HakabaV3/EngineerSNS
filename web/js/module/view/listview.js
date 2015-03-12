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
ListView.prototype.setItems = function(items) {
    this.items = items
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
        view,

        itemViewConstructor = this.itemViewConstructor,
        max, i;

    if (!itemViewConstructor) {
        console.warn('ListView#itemViewConstructor must be set.');
        return;
    }

    while (oldIndex < oldItemsCount) {
        if (oldItems[oldIndex] === newItems[newIndex]) {
            newIndex++;

        } else {
            views[newIndex].finalize();
            views.splice(newIndex, 1);
        }

        oldIndex++;
    }

    for (i = newIndex, max = newItemsCount; i < max; i++) {
        view = new itemViewConstructor();
        view.setModel(newItems[i]);

        this.appendChild(view);
        views.push(view);
    }

    this.oldItems_ = this.items.slice(0);
};
