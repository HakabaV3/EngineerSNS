var Observer = {};

/**
 *	監視対象のマップ
 *	@type {Object<number, Object<string, Observer.ObserveData>>}
 */
Observer.observeMap = {};

/**
 *	監視に係る情報
 *	@typedef {{
 *		callbacks: [Function],
 *		target: Object,
 *		key: string,
 *		old: Object
 *	}}
 */
Observer.ObserveData;

/**
 *	ネイティブ実装されているか
 *	@type {boolean}
 */
Observer.NATIVE_SUPPORT = (typeof Object.observe === 'function');

/**
 *	ポリフィル実装が初期化されているか
 *	@type {boolean}
 */
Observer.isInitializedPolyfillObserver = false;

/**
 *	ポリフィル実装用のタイマーID
 *	@type {number|null}
 */
Observer.polyfillObserverID = null;

/**
 *	オブジェクトの特定のキーを監視する
 */
Observer.observe = function(object, key, fn) {
    var id = Observer.getID(object),
        data = Observer.observeMap[id];

    if (data) {
        if (data[key]) {
            data[key].callbacks.push(fn);
            return;
        }
    } else {
        data = Observer.observeMap[id] = {};
    }

    data[key] = {
        callbacks: [fn],
        target: object,
        key: key,
        old: object[key]
    };

    if (Observer.NATIVE_SUPPORT) {
        Object.observe(object, Observer.observeCallback);
    } else if (!Observer.isInitializedPolyfillObserver) {
        Observer.initPolyfillObserver();
    }
};

/**
 *	ポリフィル実装の初期化
 */
Observer.initPolyfillObserver = function() {
    if (Observer.isInitializedPolyfillObserver) return;
    Observer.polyfillObserverID = setInterval(Observer.runPolyfillObserve, 60);

    Observer.isInitializedPolyfillObserver = true;
};

/**
 *	ポリフィル実装の終了
 */
Observer.killPolyfillObserver = function() {
    if (!Observer.isInitializedPolyfillObserver) return;
    clearInterval(Observer.polyfillObserverID);
    Observer.polyfillObserverID = null;

    Observer.isInitializedPolyfillObserver = false;
};

/**
 *	ポリフィル実装本体
 */
Observer.runPolyfillObserve = function() {
    Object.keys(Observer.observeMap)
        .forEach(function(id) {
            var data = Observer.observeMap[id];
            if (!data) return;

            Object.keys(data)
                .forEach(function(key) {
                    var data2 = data[key],
                        newVal = data2.target[key],
                        oldVal = data2.old;

                    if (newVal !== oldVal) {
                        Observer.observeCallback([{
                            name: key,
                            object: data2.target,
                            oldValue: oldVal,
                            type: 'update' //@TODO それぞれに対応
                        }]);
                    }

                    data2.old = newVal;
                })
        });
};

/**
 *	オブジェクトの特定のキーの監視を解除する
 */
Observer.unobserve = function(object, key, fn) {
    var id = Observer.getID(object),
        data = Observer.observeMap[id],
        i, max, callbacks;

    if (!data || !data[key]) return;

    callbacks = data[key].callbacks;
    for (i = 0, max = callbacks.length; i < max; i++) {
        if (callbacks[i] === fn) {
            callbacks.splice(i, 1);
            i--;
            max--;
        }
    }

    if (max === 0) {
        delete data[key];
        if (Object.keys(data).length === 0) {
            Observer.unobserveAll(object);
        }
    }
};

/**
 *	オブジェクトのすべての監視を解除する
 */
Observer.unobserveAll = function(object) {
    var id = Observer.getID(object);

    delete Observer.observeMap[id];

    if (Observer.NATIVE_SUPPORT) {
        Object.unobserve(object, Observer.observeCallback);
    } else {
        if (Object.keys(Observer.observeMap).length === 0) {
            Observer.killPolyfillObserver();
        }
    }
};

/**
 *	オブジェクトの特定のプロパティに対応するIDを取得する
 */
Observer.getID = function(object, key) {
    return object.observerGUID_ || (object.observerGUID_ = GUID());
};

/**
 *	Object.observerのコールバック
 */
Observer.observeCallback = function(changes) {
    changes.forEach(function(change) {
        var object = change.object,
            key = change.name,
            id = Observer.getID(object),
            data = Observer.observeMap[id];

        if (!data || !data[key]) return;

        data[key].callbacks.forEach(function(callback) {
            callback.call(Observer, change);
        });
    });
};
