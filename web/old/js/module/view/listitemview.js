//@include ../service/service/util.js'
//@include ../model/model.js
//@include view.js

/**
 *  リストのアイテム用の抽象クラス。
 *  使用する際は、継承先で
 *  - ListItemView#setModelをオーバーライドする。
 *  を行うこと。
 */
var ListItemView = function() {
    View.call(this);
};
extendClass(ListItemView, View);

/**
 *  @param {Model} model model.
 */
ListItemView.prototype.setModel = function(model) {
    console.warn('ListItemView#setModel must be overrided.');
};
