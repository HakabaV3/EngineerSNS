var util = require('../util.js'),
	EventDispatcher = require('../eventdispatcher.js'),
	Observer = require('./observer.js');

/**
 *  オブジェクトの特定のプロパティへのバインドを表すクラス
 *  @constructor
 *  @param {Object} target
 *  @param {[string]} propNames
 *
 *  @extends {EventDispatcher}
 *  @namespace Template
 */
function Binding(target, propNames) {
	EventDispatcher.apply(this, arguments);

	this.onChangeHandler = this.onChangeHandler.bind(this);

	/**
	 *  バインド対象
	 *  @type {Object}
	 */
	this.targets = [target];

	/**
	 *  バインド対象のプロパティ名
	 *  @type {[string]}
	 */
	this.propNames = propNames;

	this.resetObserve(0);
}
util.inherits(Binding, EventDispatcher);

Binding.prototype.finalize = function() {
	this.resetObserve(0);
	this.onChangeHandler = null;

	EventDispatcher.prototype.finalize();
};

/**
 *  バインディングをコピーする
 */
Binding.prototype.copy = function(target) {
	return new Binding(target, this.propNames.slice(0));
};

Binding.prototype.getValue = function() {
	var length = this.propNames.length;
	return util.isObject(this.targets[length - 1]) ?
		this.targets[length - 1][this.propNames[length - 1]] :
		'';
};

/**
 *  指定階層以下の監視を更新する
 */
Binding.prototype.resetObserve = function(index) {
	if (index >= this.propNames.length) return;

	var propName = this.propNames[index],
		oldTarget = this.targets[index],
		newTarget;

	//監視の解除
	if (util.isObject(oldTarget)) {
		Observer.unobserve(oldTarget, propName, this.onChangeHandler);
	}

	if (index !== 0) {
		this.targets[index] = null;
	}

	//監視の再設定
	if (index === 0) {
		newTarget = this.targets[0];
	} else if (util.isObject(this.targets[index - 1]) &&
		util.isObject(this.targets[index - 1][this.propNames[index - 1]])) {

		newTarget = this.targets[index - 1][this.propNames[index - 1]];
	} else {
		newTarget = null;
	}

	if (newTarget) {
		Observer.observe(newTarget, propName, this.onChangeHandler);
		this.targets[index] = newTarget;
	}

	this.resetObserve(index + 1);
};

Binding.prototype.setTarget = function(newTarget) {
	this.resetObserve(0, newTarget);
};

/**
 *  変更に対するイベントハンドラ
 */
Binding.prototype.onChangeHandler = function(change) {
	var index = this.targets.indexOf(change.object),
		length = this.propNames.length;

	if (index === -1) {
		throw new Error('(´・ω・｀)');
	}

	if (index !== length - 1) {
		this.resetObserve(index + 1);
	}

	this.fire('change', this.getValue());
};

module.exports = Binding;
