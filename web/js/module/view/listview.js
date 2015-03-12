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
     *  @type {[Model]}
     */
    this.items = [];

    /**
     *  @type {Function}
     */
    this.itemViewConstructor = null;

    /**
     *  @type {[View]}
     */
    this.itemViews = [];
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
    var itemViewConstructor = this.itemViewConstructor,
        self = this;

    this.itemViews.forEach(function(itemView) {
        itemView.finalize();
    });

    if (!itemViewConstructor) {
        console.warn('ListView#itemViewConstructor must be set.');
        return
    }

    this.itemViews = this.items.map(function(item) {
        var itemView = new itemViewConstructor();
        itemView.setModel(item);

        self.appendChild(itemView);

        return itemView;
    });
};
