/**
 *	Libs
 */

// no libs !

/**
 *	Main source
 */


var global = this;

/**
 *  extend class.
 *  @param {Function} child child class.
 *  @param {Function} parent super class.
 */
function extendClass(child, parent) {
    /**
     *  copy static members.
     */
    extend(child, parent);

    /**
     *  dummy constructor
     *  @constructor
     */
    var __ = function() {};
    __.prototype = new parent();
    child.prototype = new __();

    /**
     *  set inheritance information.
     */
    parent.prototype.constructor = parent;
    child.prototype.constructor = child;
}

/**
 *  generate GUID
 *  @return {number} GUID
 */
var GUID = (function() {
    var GUID_ = 0;
    return function() {
        return ++GUID_;
    };
})();

/**
 *  extend object property.
 *  @param {Object} target target object.
 *  @param {...Object} optSrces source objects.
 *  @return {Object} extended target.
 */
function extend(target, optSrces) {
    Array.prototype.slice.call(arguments, 1)
        .forEach(function(src) {
            if (!src) return;
            Object.keys(src).forEach(function(key) {
                target[key] = src[key];
            });
        });

    return target;
}

/**
 *  convert object to array.
 *  @param {{
 *    length: String
 *  }} arrayLike arrayLike object.
 *  @return {Array} converted array.
 */
function convertToArray(arrayLike) {
    return Array.prototype.slice.call(arrayLike, 0);
}

/**
 *  check if expression is object.
 *  @param {*} expression expression to check.
 *  @return {boolean} if true, the expression is Object.
 */
function isObject(expression) {
    return !!expression && typeof expression === 'object';
}

/**
 *  check if expression is function.
 *  @param {*} expression expression to check.
 *  @return {boolean} if true, the expression is Function.
 */
function isFunction(expression) {
    return typeof expression === 'function';
}

/**
 *  check if expression is string.
 *  @param {*} expression expression to check.
 *  @return {boolean} if true, the expression is string.
 */
function isString(expression) {
    return typeof expression === 'string';
}

/**
 *  short-hand
 */
var forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);

/**
 *  no operation function
 */
function noop() {
    return undefined;
}

/**
 *  escape for XSS
 *  @param {string} src source text
 *  @return {string} escaped text
 */
function escapeForXSS(src) {
    return text
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}


/** 
 *  run function asynclonously
 *  @param {Function} fn function
 */
function runAsync(fn) {
    if (isFunction(requestAnimationFrame)) {
        requestAnimationFrame(fn);
    } else {
        setTimeout(fn);
    }
}





/**
 *  Event dispatchable object.
 *
 *  @constructor
 */
var EventDispatcher = function EventDispatcher() {
    /**
     *  The list of all event listeners attached on this.
     *
     *  @type {Object<string, Array<Function>>}
     *  @private
     */
    this.eventListeners_ = {};
};

/**
 *  Finalizer.
 */
EventDispatcher.prototype.finalize = function() {
    this.eventListeners_ = null;
};

/**
 *  attach an event listener.
 *
 *  @param {string} type event type.
 *  @param {Function} listener the event listener to attach.
 *  @return {EventDispatcher} this.
 */
EventDispatcher.prototype.on = function(type, listener, context) {
    var listeners = this.eventListeners_[type];
    context = context || this;

    if (!listeners) {
        listeners = this.eventListeners_[type] = [];
    }

    listeners.push({
        listener: listener,
        context: context
    });

    return this;
};

/**
 *  detach the event listener.
 *  if the event listener is detached for more than twice,
 *  this method detach all of them.
 *
 *  @param {string} type event type.
 *  @param {Function} listener the event listener to detach.
 *  @return {EventDispatcher} this.
 */
EventDispatcher.prototype.off = function(type, listener, context) {
    var listeners = this.eventListeners_[type],
        i, max;
    context = context || this;

    if (!listeners) return this;

    for (i = 0, max = listeners.length; i < max; i++) {
        if (listeners[i].listener === listener &&
            listeners[i].context === context) {
            listeners.splice(i, 1);
            i--;
            max--;
        }
    }

    return this;
};

EventDispatcher.prototype.once = function(type, listener, context) {
    var self = this,
        proxy = function() {
            self.off(type, proxy, context);
            listener.apply(this, arguments);
        };

    this.on(type, proxy, context);
};

/**
 *  fire the event.
 *
 *  @param {string} type event type.
 *  @param {...*} optArgs arguments.
 *  @return {EventDispatcher} this.
 */
EventDispatcher.prototype.fire = function(type, optArgs) {
    var listeners = this.eventListeners_[type],
        args = Array.prototype.slice.call(arguments, 1),
        i, max;

    if (!listeners) return this;

    listeners = listeners.slice(0);

    for (i = 0, max = listeners.length; i < max; i++) {
        listeners[i].listener.apply(listeners[i].context, args);
    }

    return this;
};





/**
 *  Template engine.
 *  @namespace
 */
var Template = {};








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

Template.QueryTextPart = function(text) {
    if (!(this instanceof Template.QueryTextPart)) return new Template.QueryTextPart(text);
    Template.QueryPart.call(this);

    /**
     *  @type {string}
     */
    this.text = null;
    this.setText(text);
};
extendClass(Template.QueryTextPart, Template.QueryPart);

Template.QueryTextPart.prototype.setText = function(newText) {
    var oldText = this.text;

    if (oldText === newText) return;

    this.text = newText;

    this.fire('change');
};

Template.QueryTextPart.prototype.getValue = function() {
    return this.text || '';
};










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

/**
 *  オブジェクトの特定のプロパティへのバインドを表すクラス
 *  @constructor
 *  @param {Object} target
 *  @param {[string]} propNames
 *
 *  @extends {EventDispatcher}
 *  @namespace Template
 */
Template.Binding = function(target, propNames) {
    EventDispatcher.call(this);

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
};
extendClass(Template.Binding, EventDispatcher);

Template.Binding.prototype.finalize = function() {
    this.resetObserve(0);
    this.onChangeHandler = null;

    EventDispatcher.prototype.finalize();
};

/**
 *  バインディングをコピーする
 */
Template.Binding.prototype.copy = function(target) {
    return new Template.Binding(target, this.propNames.slice(0));
};

Template.Binding.prototype.getValue = function() {
    var length = this.propNames.length;
    return isObject(this.targets[length - 1]) ?
        this.targets[length - 1][this.propNames[length - 1]] :
        '';
};

/**
 *  指定階層以下の監視を更新する
 */
Template.Binding.prototype.resetObserve = function(index) {
    if (index >= this.propNames.length) return;

    var propName = this.propNames[index],
        oldTarget = this.targets[index],
        newTarget;

    //監視の解除
    if (isObject(oldTarget)) {
        Observer.unobserve(oldTarget, propName, this.onChangeHandler);
    }

    if (index !== 0) {
        this.targets[index] = null;
    }

    //監視の再設定
    if (index === 0) {
        newTarget = this.targets[0];
    } else if (isObject(this.targets[index - 1]) &&
        isObject(this.targets[index - 1][this.propNames[index - 1]])) {

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

Template.Binding.prototype.setTarget = function(newTarget) {
    this.resetObserve(0, newTarget);
};

/**
 *  変更に対するイベントハンドラ
 */
Template.Binding.prototype.onChangeHandler = function(change) {
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

Template.QueryBindingPart = function(binding) {
    if (!(this instanceof Template.QueryBindingPart)) return new Template.QueryBindingPart(binding);
    Template.QueryPart.call(this);

    this.onChange = this.onChange.bind(this);

    /**
     *	@type {Template.Binding}
     */
    this.binding = null;
    this.setBinding(binding);
};
extendClass(Template.QueryBindingPart, Template.QueryPart);

Template.QueryBindingPart.prototype.finalize = function() {
    this.setBinding(null);
    this.onChange = null;

    Template.QueryPart.prototype.finalize.call(this);
};

Template.QueryBindingPart.prototype.setBinding = function(newBinding) {
    var oldBinding = this.binding;

    if (oldBinding) {
        oldBinding.off('change', this.onChange);
    }

    this.binding = newBinding;

    if (newBinding) {
        newBinding.on('change', this.onChange);
    }

    this.onChange();
};

Template.QueryBindingPart.prototype.onChange = function() {
    this.fire('change');
};

Template.QueryBindingPart.prototype.getValue = function() {
    return this.binding ? this.binding.getValue() : '';
};








Template.QueryViewPart = function(view) {
    if (!(this instanceof Template.QueryViewPart)) return new Template.QueryViewPart(binding);
    Template.QueryPart.call(this);

    /**
     *  @type {View}
     */
    this.view = null;
    this.setView(view);
};
extendClass(Template.QueryViewPart, Template.QueryPart);

Template.QueryViewPart.prototype.finalize = function() {
    this.setView(null);

    Template.QueryPart.prototype.finalize.call(this);
};

Template.QueryViewPart.prototype.setView = function(newView) {
    var oldView = this.view;

    if (oldView === newView) return;

    this.view = newView;

    this.fire('change');
};

Template.QueryViewPart.prototype.getValue = function() {
    return this.view || '';
};

/**
 *  @namespace Template
 */
Template.Query = function(node, attrName, parts) {
    if (!(this instanceof Template.Query)) return new Template.Query(node, attrName, parts);

    /**
     *  @type {Node}
     */
    this.node = node || null;

    /**
     *  @type {string|null}
     */
    this.attrName = attrName || null;

    /**
     *  @type {[QueryParts]}
     */
    this.parts = null;
    this.setParts(parts);
};

Template.Query.prototype.finalize = function() {
    this.parts.forEach(function(part) {
        part.finalize();
    });
    this.node = null;
};

Template.Query.prototype.setParts = function(newParts) {
    var oldParts = this.parts,
        self = this;

    if (oldParts) {
        oldParts.forEach(function(oldPart) {
            /**
             *  @TODO @NOTE
             *  ここでoldPartのfinalizeは不要なのか？
             */

            oldPart.off('change', self.update, self);
        });
    }

    this.parts = newParts;

    if (newParts) {
        newParts.forEach(function(newPart) {
            newPart.on('change', self.update, self);
        });
    }

    this.update();
};

Template.Query.prototype.update = function() {
    var values,
        parts = this.parts,
        node = this.node,
        attrName = this.attrName,
        flagView = false;

    if (!parts || !node || !attrName) return;

    values = parts.map(function(part) {
        return part.getValue();
    });

    switch (attrName) {
        case 'textContent':
            var fragment = document.createDocumentFragment();
            values.forEach(function(value) {
                if (value instanceof View) {
                    value.appendTo(fragment);
                    flagView = true;
                } else if (isString(value)) {
                    fragment.appendChild(new Text(value));
                }
            });

            if (flagView) {
                if (node.parentNode) {
                    node.parentNode.insertBefore(fragment, node);
                    node.parentNode.removeChild(node);
                }
            } else {
                node[attrName] = values.join('');
            }

            break;

        default:
            node.setAttribute(attrName, values.join(''));
            break;
    }
};



/**
 *  style injection to hide <template> tag.
 *
 *  IE<10 do NOT support <template> tag, and visible this tag,
 *  so must be inject this style.
 */
(function() {
    var style = document.createElement('style');
    style.textContent = 'template{display: none !important;}'
    var head = document.head;
    head.insertBefore(style, head.firstChild);
})();

/**
 *  template caches
 *  @type {Object}
 */
Template.templates = {};

/**
 *  @typedef {
 *      type: Template.QueryPart.Type,
 *      data: *
 *  }
 */
Template.QueryPartData;

/**
 *  @typedef {{
 *      nodePath: [number],                     //ノードへのパス,
 *      attrName: string,                       //属性の名前,
 *      queryPartDatas: [Template.QueryPartData],   //パース結果の配列
 *  }}
 */
Template.QueryData;

/**
 *  template object
 *  @typedef {{
 *      node: Node,                 //DOMのルートノード
 *      queryDatas: [Template.QueryData],  //テンプレートクエリの配列
 *  }}
 */
Template.Template;

/**
 *  Directive keywords.
 *  @enum {string}
 */
Template.Directive = {
    VIEW: 'VIEW'
};

/**
 *  container node for encoding template
 *  @type {Node}
 */
Template.templateEncoder = document.createElement('div');

/**
 *  DOMを生成する
 */
Template.create = function(templateId, bindTarget) {
    var template = Template.getTemplate(templateId),
        rootNode = template.node.cloneNode(true),
        childViews = {},
        queries,
        result;

    queries = template.queryDatas.map(function(queryData) {
        return Template.createQuery(queryData, rootNode, bindTarget, childViews);
    });

    result = {
        queries: queries,
        node: rootNode,
        childViews: childViews
    };

    return result;
};

/**
 *  クエリデータを元にクエリを作成する。
 *  @param {Template.Query} query query
 *  @param {Node} rootNode rootNode
 *  @param {Object} bindTarget bindTarget
 *  @param {Object} [childViews] 子ビューのマップ。
 *      これを渡すと、生成された小ビューの一覧をここに保存する。
 *  @return {Query} クエリ
 */
Template.createQuery = function(queryData, rootNode, bindTarget, childViews) {
    var queryPartDatas = queryData.queryPartDatas,
        QueryPartType = Template.QueryPart.Type,
        node = Template.getNodeFromPath(rootNode, queryData.nodePath),
        v,
        queryParts;

    queryParts = queryPartDatas.map(function(queryPartData) {
        switch (queryPartData.type) {
            case QueryPartType.TEXT:
                return new Template.QueryTextPart(queryPartData.data);
                break;

            case QueryPartType.BINDING:
                return new Template.QueryBindingPart(queryPartData.data.copy(bindTarget));
                break;

            case QueryPartType.VIEW:
                v = new queryPartData.data.viewConstructor();
                if (isObject(childViews)) childViews[queryPartData.data.name] = v;
                return new Template.QueryViewPart(v);
                break;
        }
    });

    return new Template.Query(node, queryData.attrName, queryParts);
};

/**
 *  ノードパスからノードを特定する
 */
Template.getNodeFromPath = function(rootNode, nodePath) {
    var node = rootNode;

    nodePath = nodePath.slice(0);

    while (nodePath.length) {
        node = node.childNodes[nodePath.shift()];
        if (!node) return null;
    }

    return node;
};

/**
 *  Create DOM with template.
 *  @param {string} templateId Template ID.
 *  @return {Template.Template} テンプレート
 */
Template.getTemplate = function(templateId) {
    var template = Template.templates[templateId],
        encoder = Template.templateEncoder,
        srcNode, html;

    if (!template) {

        template = {
            node: null,
            queryDatas: null
        };

        srcNode = document.querySelector('template[name="' + templateId + '"]');
        if (!srcNode) {
            throw new Error('Template "' + templateId + '" is not found.');
        }

        html = srcNode.innerHTML;

        encoder.innerHTML = html;
        template.node = encoder.firstElementChild;

        template.queryDatas = Template.parseTemplateNodeRecursive(template.node);
        Template.templates[templateId] = template;
    }

    return template;
};

/**
 *  ノード内のテンプレートを再帰的にパースする。
 *  @param {Node} rootNode target node.
 *  @param {[Template.QueryData]} [result=[]] 結果を格納する配列。
 *      再帰呼び出しの場合、結果を一つの配列にまとめたい場合に指定する。
 *  @param {[number]} [nodePath=[]] ノードへのパス。
 *  @return {[Template.QueryData]} パース結果
 */
Template.parseTemplateNodeRecursive = function(rootNode, result, nodePath) {
    result = result || [];
    nodePath = nodePath || [];

    result.push.apply(result, Template.parseTemplateNode(rootNode, nodePath));

    forEach(rootNode.childNodes, function(child, i) {
        Template.parseTemplateNodeRecursive(child, result, nodePath.concat([i]))
    });

    return result;
};

/**
 *  ノード内のテンプレートをパースする。
 *  @param {Node} node target node.
 *  @param {[numer]} nodePath ノードへのパス。
 *  @return {[Template.QueryData]} パース結果
 */
Template.parseTemplateNode = function(node, nodePath) {
    var queryDatas = [],
        attrs = node.attributes,
        queryPartDatas;

    /**
     *  属性
     */
    if (node instanceof Element) {
        forEach(attrs, function(attr) {
            queryPartDatas = Template.parseTemplateQueryText(attr.value, nodePath, attr.name);
            if (queryPartDatas.length) {
                queryDatas.push({
                    nodePath: nodePath,
                    attrName: attr.name,
                    queryPartDatas: queryPartDatas
                });
            }
        });
    }

    /**
     * textContent
     */
    if (node instanceof Text) {
        queryPartDatas = Template.parseTemplateQueryText(node.textContent, nodePath, 'textContent');
        if (queryPartDatas.length) {
            queryDatas.push({
                nodePath: nodePath,
                attrName: 'textContent',
                queryPartDatas: queryPartDatas
            });
        }
    }

    return queryDatas;
};

/**
 *  テンプレートクエリ文字列をパースする
 *  @param {string} queryText テンプレートタグを含んだ文字列
 *  @return {[Template.QueryPartData]} パース結果
 */
Template.parseTemplateQueryText = function(queryText) {
    var regTag = /\{\{([^\}]*)\}\}/g,
        datas = [],
        pivot = 0,
        regSplitter = /\s+/g,
        queryTextPart, queryTextPartChunk,
        directives, binding,
        ma;

    while (ma = regTag.exec(queryText)) {
        if (pivot !== ma.index) {
            queryTextPart = queryText.substring(pivot, ma.index).trim();
            if (queryTextPart.length) {
                //string
                datas.push({
                    type: Template.QueryPart.Type.TEXT,
                    data: queryTextPart
                });
            }
        }
        pivot = ma.index + ma[0].length;
        tagText = ma[1].trim();
        tagTextParts = tagText.split(regSplitter);

        switch (tagTextParts[0].toUpperCase()) {
            case Template.Directive.VIEW:
                //view metadata
                datas.push({
                    type: Template.QueryPart.Type.VIEW,
                    data: Template.parseQueryPartsForView(tagTextParts)
                });
                break;

            default:
                //binding
                datas.push({
                    type: Template.QueryPart.Type.BINDING,
                    data: new Template.Binding(null, tagText.split('.'))
                });
                break;
        }
    };
    if (pivot !== queryText.length) {
        queryTextPart = queryText.substring(pivot).trim();
        if (queryTextPart.length) {
            //string
            datas.push({
                type: Template.QueryPart.Type.TEXT,
                data: queryTextPart
            });
        }
    }

    return datas;
};

/**
 *  Viewディレクティブのタグをパースする
 *  @param {[string]} tagTextParts タグの文字列をスペースで区切って配列にしたもの
 *  @return Object<string, string> パース結果
 */
Template.parseQueryPartsForView = function(tagTextParts) {
    tagTextParts = tagTextParts.slice(0);
    tagTextParts.shift(); //最初の１個は'view'ディレクティブなので捨てる。

    var result = {};

    tagTextParts.forEach(function(queryPart) {
        var keyAndVal = queryPart.split('=');
        result[keyAndVal[0]] = keyAndVal[1];
    });

    if (result['class'] && isFunction(global[result['class']])) {
        result.viewConstructor = global[result['class']];
    }

    return result;
};


var View = function() {
    var self = this;

    EventDispatcher.call(this);

    /**
     *  DOM reference map
     *  @type {Object}
     */
    this.$ = {
        root: null,
        container: null,
    };
}
extendClass(View, EventDispatcher);

/**
 * Finalizer.
 */
View.prototype.finalize = function() {
    var self = this,
        key;

    this.queries.forEach(function(query) {
        query.finalize();
    });
    Object.keys(this.childViews).forEach(function(childViewName) {
        self.childViews[childViewName].finalize();
    });

    Observer.unobserveAll(this);
    this.remove();
    this.$ = null;
    EventDispatcher.prototype.finalize.call(this);
};

/**
 *  Create DOM with template.
 *  @param {string} templateId Template ID.
 */
View.prototype.loadTemplate = function(templateId) {
    var created = Template.create(templateId, this),
        self = this;

    this.$.root = created.node;
    this.$.container = this.$.root.querySelector('[container]') || this.$.root;

    forEach(this.$.root.querySelectorAll('[name]'), function(node) {
        self.$[node.getAttribute('name')] = node;
    });

    this.childViews = created.childViews;
    this.queries = created.queries;
};

/**
 *  Append child node to this view.
 *  @param {View|Element} child Child node.
 *  @return this
 */
View.prototype.appendChild = function(child) {
    if (child instanceof View) child = child.$.root;
    this.$.container.appendChild(child);

    return this;
};

/**
 *  Append this view to the node.
 *  @param {View|Element} parent parent node
 *  @return this
 */
View.prototype.appendTo = function(parent) {
    parent.appendChild(this.$.root);

    return this;
};

/**
 *  Append this view before the node
 *  @param {View|Element} ref the reference node
 *  @return this
 */
View.prototype.insertBefore = function(ref) {
    if (ref instanceof View) ref = ref.$.root;
    var parent = ref.parentNode,
        root = this.$.root;

    parent.insertBefore(root, ref);

    return this;
};

/**
 *  Append this view after the node
 *  @param {View|Element} ref the reference node
 *  @return this
 */
View.prototype.insertAfter = function(ref) {
    if (ref instanceof View) ref = ref.$.root;
    var parent = ref.parentNode,
        root = this.$.root;

    parent.insertBefore(root, ref);
    parent.insertBefore(ref, root);

    return this;
};

/**
 *  remove this view
 *  @return this
 */
View.prototype.remove = function() {
    this.$.root.parentNode.removeChild(this.$.root);

    return this;
};

/**
 *  update this view
 */
View.prototype.update = function() {
    console.warn('NIP!');
};

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

    app.on('rout.change', this.onChangeRout, this);
};
extendClass(BaseView, View);

BaseView.prototype.finalize = function() {
    app.off('rout.change', this.onChangeRout, this)

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



/**
 *  @TODO
 *  API.Userへの依存をなくす
 *  Model#uriを用いて、API_coreだけで対応する。
 */



/**
 *  Data model base class.
 *
 *  @construcotr
 *  @param {Object} data initial data.
 *  @extends {EventDispatcher}
 */
var Model = function(data) {
    EventDispatcher.call(this);

    this.initForSchema();
    if (isObject(data)) {
        this.updateWithData(data);
        this.constructor.addInstance(this);
    }
};
extendClass(Model, EventDispatcher);

/**
 *  model instances map
 *  @type {Object}
 *  @private
 */
Model.instances_ = {};

/**
 *  model schema.
 *  @type {Object}
 */
Model.prototype.schema = {};

/**
 *  Finalizer.
 */
Model.prototype.finalize = function() {
    EventDispatcher.prototype.finalize.call(this);
};

/**
 *  Check if the instance is exist.
 *  @param {string} id instance id.
 *  @return {boolean} If true, the instance is exist.
 */
Model.hasInstance = function(id) {
    return !!this.instances_[id];
};

/**
 *  add instance.
 *  @param {Model} instance instance
 */
Model.addInstance = function(instance) {
    this.instances_[instance.id] = instance;
};

/**
 *  get instance.
 *  @param {string} id instance id.
 *  @return {Model} the instance.
 */
Model.getInstance = function(id) {
    return this.instances_[id];
};

Model.deleteInstance = function(instance) {
    instance.fire('delete', instance);

    this.instances_[instance.id] = null;
    instance.finalize();
};

/**
 *  Initialize model data for schema.
 *  @return {Model} this.
 */
Model.prototype.initForSchema = function() {
    var self = this,
        schema = this.schema;

    Object.keys(schema).forEach(function(schemaKey) {
        var scheme = schema[schemaKey];

        if (!isObject(scheme)) {
            /**
             *  syntax sugar
             */
            scheme = {
                type: schema,
                value: new schema()
            }
        }

        self[schemaKey] = scheme.value;
    });

    return this;
};

/**
 *  Update model data with source object.
 *  @param {Object} data update source object.
 *  @return {Model} this.
 */
Model.prototype.updateWithData = function(data) {
    var self = this,
        schema = this.schema;

    Object.keys(data).forEach(function(key) {
        if (schema.hasOwnProperty(key)) {
            self[key] = data[key];
        }
    });

    this.dispatchUpdate();
    return this;
};

/**
 *  dispatch update event.
 */
Model.prototype.dispatchUpdate = function() {
    this.fire('update', this);
};





/**
 *  namespace for definition of API Errors
 *  @namespace
 */
var APIError = {};

APIError.Code = {
    SUCCESS: 0,
    PERMISSION_DENIED: 1,
    PARSE_FAILED: 2,
    CONNECTION_FAILED: 3,
    USED_NAME: 4,
    INVALID_PARAMETER: 5,
    UNKNOWN: 999
};

extend(APIError, {
    SUCCESS: {
        code: APIError.Code.SUCCESS,
        msg: 'success'
    },
    PERMISSION_DENIED: {
        code: APIError.Code.PERMISSION_DENIED,
        msg: 'Permission denied.',
    },
    PARSE_FAILED: {
        code: APIError.Code.PARSE_FAILED,
        msg: 'Failed to parse response.',
    },
    CONNECTION_FAILED: {
        code: APIError.Code.CONNECTION_FAILED,
        msg: 'Failed to connect server.',
    },
    USED_NAME: {
        code: APIError.Code.USED_NAME,
        msg: 'This user name is already used.'
    },
    INVALID_PARAMETER: {
        code: APIError.Code.INVALID_PARAMETER,
        msg: 'Parameters are invalid.'
    },
    UNKNOWN: {
        code: APIError.Code.UNKNOWN,
        msg: 'Unknown error.'
    }
});

/**
 *  Error for failed to parse server response.
 *  @param {XMLHttpRequest} xhr failed xhr object.
 *  @return {Object} error object.
 */
APIError.parseFailed = function(xhr) {
    return extend(APIError.PARSE_FAILED, {
        xhr: xhr
    });
};

/**
 *  Error for failed to connection.
 *  @param {XMLHttpRequest} xhr failed xhr object.
 *  @return {Object} error object.
 */
APIError.connectionFailed = function(xhr) {
    return extend(APIError.CONNECTION_FAILED, {
        xhr: xhr
    });
};

/**
 *  エラーを特定する。
 *  ものすごく地道な実装。
 *  サーバーは頼むからエラーをコードで返してくれ！
 */
APIError.detectError = function(err) {
    if (isObject(err)) {
        switch (err.code) {
            case APIError.Code.PERMISSION_DENIED:
                return APIError.PERMISSION_DENIED;
                break;

            case APIError.Code.PARSE_FAILED:
                return APIError.PARSE_FAILED;
                break;

            case APIError.Code.CONNECTION_FAILED:
                return APIError.CONNECTION_FAILED;
                break;

            default:
                return extend(APIError.UNKNOWN, {
                    original: err
                });
                break;
        }
    }

    if (err === 'ユーザー名は既に使用されています。') {
        return APIError.USED_NAME;
    }

    if (err === 'ユーザー名またはパスワードに誤りがあります。') {
        return APIError.INVALID_PARAMETER;
    }

    return extend(APIError.UNKNOWN, {
        original: err
    });
};

/**
 *  namespace for request API
 *  @namespace
 */
var API = {};

/**
 *  API Entry Point
 *  @const {string}
 */
API.EntryPoint = 'http://localhost:3000/api/v1';

//@TODO: DEBUG ONLY
// API.EntryPoint = './testdata';

/**
 *  Authentication token
 *  @type {string}
 */
API.token = ''

/**
 *  encode Object for URL parameters.
 *  @param {Object} [params] parameters.
 *  @return {string} encoded result.
 */
API.encodeURLParams = function(params) {
    return Object.keys(params)
        .map(function(key) {
            return key + '=' + encodeURIComponent(params[key]);
        })
        .join('&');
};

/**
 *  HTTP::GET method.
 *  @param {string} url url.
 *  @param {Object} [params] request parameters.
 *  @param {Function} callback callback function.
 */
API.get = function(url, params, callback) {
    if (arguments.length === 2) {
        callback = params;
        params = undefined;
    }

    if (isObject(params)) {
        url += '?' + API.encodeURLParams(params);
    }

    API.ajax('GET', url, null, null, callback);
};

/**
 *  HTTP::POST method.
 *  @param {string} url url.
 *  @param {Object} [params] request parameters.
 *  @param {Object} body request body object.
 *  @param {Function} callback callback function.
 */
API.post = function(url, params, body, callback) {
    if (arguments.length === 3) {
        body = params;
        params = undefined;
    }

    if (isObject(params)) {
        url += '?' + API.encodeURLParams(params);
    }

    API.ajax('POST', url, {
        'Content-Type': 'application/json'
    }, JSON.stringify(body), callback);
};

/**
 *  HTTP::POST method for binary data.
 *  @param {string} url url.
 *  @param {Blob} [data] binary data.
 *  @param {Function} callback callback function.
 */
API.postB = function(url, params) {
    cponsole.error('not implemented yet!');
};

/**
 *  HTTP::PUT method.
 *  @param {string} url url.
 *  @param {Object} [params] request parameters.
 *  @param {Object} body request body object.
 *  @param {Function} callback callback function.
 */
API.put = function(url, params, body, callback) {
    if (arguments.length === 3) {
        body = params;
        params = undefined;
    }

    if (isObject(params)) {
        url += '?' + API.encodeURLParams(params);
    }

    API.ajax('PUT', url, {
        'Content-Type': 'application/json'
    }, JSON.stringify(body), callback);
};

/**
 *  HTTP::PUT method for binary data.
 *  @param {string} url url.
 *  @param {Blob} [data] binary data.
 *  @param {Function} callback callback function.
 */
API.putB = function(url, params, callback) {
    cponsole.error('not implemented yet!');
};

/**
 *  HTTP::PATCH method.
 *  @param {string} url url.
 *  @param {Object} [params] request parameters.
 *  @param {Object} body request body object.
 *  @param {Function} callback callback function.
 */
API.patch = function(url, params, body, callback) {
    if (arguments.length === 3) {
        body = params;
        params = undefined;
    }

    if (isObject(params)) {
        url += '?' + API.encodeURLParams(params);
    }

    API.ajax('PATCH', url, {
        'Content-Type': 'application/json'
    }, JSON.stringify(body), callback);
};

/**
 *  HTTP::PATCH method for binary data.
 *  @param {string} url url.
 *  @param {Blob} [data] binary data.
 *  @param {Function} callback callback function.
 */
API.patchB = function(url, params, callback) {
    cponsole.error('not implemented yet!');
};

/**
 *  HTTP::DELETE method.
 *  @param {string} url url.
 *  @param {Object} [params] request parameters.
 *  @param {Function} callback callback function.
 */
API.delete = function(url, params, callback) {
    if (arguments.length === 2) {
        callback = params;
        params = undefined;
    }

    if (isObject(params)) {
        url += '?' + API.encodeURLParams(params);
    }

    API.ajax('DELETE', url, null, JSON.stringify(params), callback);
};

/**
 *  Ajax core function
 */
API.ajax = function(method, url, headers, body, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, API.EntryPoint + url);

    if (API.hasToken()) {
        xhr.setRequestHeader('X-Token', API.getToken());
    }

    if (headers) {
        Object.keys(headers).forEach(function(key) {
            xhr.setRequestHeader(key, headers[key]);
        });
    }

    xhr.onload = function() {
        var result,
            token;

        token = xhr.getResponseHeader('X-Token');
        if (token) {
            API.updateToken(token);
        }

        try {
            result = JSON.parse(xhr.responseText);
        } catch (e) {
            return callback(APIError.parseFailed(xhr), null);
        }

        if (result.success) {
            return callback(null, result.success);
        } else {
            return callback(APIError.detectError(result.error), null);
        }
    };

    xhr.onerror = function() {
        return callback(APIError.connectionFailed(xhr), null);
    };

    xhr.send(body);
};


/**
 *  authentication token.
 *  @type {string|null}
 */
API.token = null;

/**
 *  The key name of authentication token in Local Storage.
 */
API.KEY_TOKEN = 'token';

/** 
 *  Update authentication token.
 *  @param {string|null} token token.
 */
API.updateToken = function(token) {
    API.token = token;
    localStorage.setItem(API.KEY_TOKEN, token || '');
};

/** 
 *  Get authentication token.
 *  @return {string|null} token.
 */
API.getToken = function() {
    if (API.token) return API.token;

    return API.token = localStorage.getItem(API.KEY_TOKEN);
};

/** 
 *  Check if authentication token is exist.
 *  @return {boolean} If true, the token is exist.
 */
API.hasToken = function() {
    return API.getToken() !== '';
};

/**
 *  @TODO
 *  API.Userへの依存をなくす
 *  Model#uriを用いて、API_coreだけで対応する。
 */

/**
 *  User Model.
 *  @constructor
 *  @param {Object} data initial data.
 *  @extends {Model}
 */
var User = function(data) {
    if (!(this instanceof User)) return new User(data);

    if (isObject(data)) {
        if (User.hasInstance(data.name)) {
            return User.getInstance(data.name).updateWithData(data);
        }
    }

    Model.call(this, data);
};
extendClass(User, Model);


/**
 *  model instances map
 *  @type {Object}
 *  @private
 *  @overrides
 */
User.instances_ = {};

/** 
 *  Schema
 *
 *  @type {Object}
 *  @override
 */
User.prototype.schema = {
    "id": {
        type: String,
        value: ''
    },
    "uri": {
        type: String,
        value: ''
    },
    "name": {
        type: String,
        value: 'undefined'
    },
    "description": {
        type: String,
        value: ''
    },
    "postCount": {
        type: Number,
        value: 0
    },
    "followingCount": {
        type: Number,
        value: 0
    },
    "followedCount": {
        type: Number,
        value: 0
    },
    "reviewCount": {
        type: Number,
        value: 0
    },
    "reviewingCount": {
        type: Number,
        value: 0
    },
    "reviewedCount": {
        type: Number,
        value: 0
    },
    "icon": {
        type: String,
        value: ''
    }
};

/**
 *  Check if the instance is exist.
 *  @param {string} name user name.
 *  @return {boolean} If true, the instance is exist.
 *  @override
 */
User.hasInstance = function(name) {
    return !!this.instances_[name];
};

/**
 *  add instance.
 *  @param {User} instance instance
 *  @override
 */
User.addInstance = function(instance) {
    this.instances_[instance.name] = instance;
};

/**
 *  get instance.
 *  @param {string} name user name.
 *  @return {User} the instance.
 *  @override
 */
User.getInstance = function(name) {
    return this.instances_[name];
};

/**
 *  Get User data by user name.
 *  @param {string} userName the user name.
 *  @param {Function} callback callback function.
 */
User.getByName = function(userName, callback) {
    var instance;

    if (this.hasInstance(userName)) {
        instance = this.getInstance(userName);

        runAsync(function() {
            callback(null, instance);
        });

        return;
    }

    API.get('/user/' + userName, function(err, res) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, new User(res));
    });
};

/**
 *  Get authenticated user data.
 *  @param {Function} callback callback function.
 */
User.getMe = function(callback) {
    API.get('/auth/me', function(err, res) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, new User(res));
    });
};

/**
 *  Get all projects.
 *  @param {Function} callback callback function.
 */
User.prototype.getAllProjects = function(callback) {
    API.get(this.uri + '/project', function(err, res) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, res.map(Project));
    });
};

/**
 *  Create new user.
 *  @param {string} userName the user name.
 *  @param {string} password the password.
 *  @param {Function} callback callback function.
 */
User.create = function(userName, password, callback) {
    API.post('/user/' + userName, {
        password: password
    }, function(err, res) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, new User(res));
    });
};

/**
 *  Update user data.
 *  @param {Object} params update datas.
 *  @param {Function} callback callback function.
 */
User.prototype.update = function(params, callback) {
    if (!app.isAuthed || this !== app.authedUser) {
        return callback(APIError.PERMISSION_DENIED, null);
    };

    API.patch(this.uri, {
        name: this.name,
        description: this.description
    }, function(err, res) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, new User(res));
    });
};

/**
 *  Update user icon image.
 *  @param {Blob} blob icon image file blob.
 *  @param {Function} callback callback function.
 */
User.prototype.updateIcon = function(blob, callback) {
    console.warn('User#updateIcon: NIY.');

    if (!app.isAuthed || this !== app.authedUser) {
        return callback(APIError.PERMISSION_DENIED, null);
    };

    API.patchB(this.uri + '/icon', blob, function(err, res) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, new User(res));
    });
};

/**
 *  Delete user data.
 *  @param {Function} callback callback function.
 */
User.prototype.delete = function(callback) {
    if (!app.isAuthed || this !== app.authedUser) {
        return callback(APIError.PERMISSION_DENIED, null);
    };

    API.delete(this.uri, function(err, res) {
        if (err) {
            return callback(err, null);
        }

        //@TODO: インスタンスを消す
        return callback(null, res);
    });
};

/**
 *  Get user's comments.
 *  @param {Function} callback callback function.
 */
User.prototype.getComments = function(callback) {
    API.get(this.uri + '/comment', function(err, res) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, res.map(Comment));
    });
};


/**
 *  Authentication methods.
 *
 *  This API category DOES NOT have any model (as 'Auth'), methods only.
 *
 *  @namespace
 */
Auth = {};

/**
 *  Sign in.
 *  @param {string} userName userName.
 *  @param {string} password password.
 *  @param {Function} callback callback.
 */
Auth.signIn = function(userName, password, callback) {
    API.post('/auth', null, {
        'userName': userName,
        'password': password
    }, function(err, res) {
        if (err) {
            API.updateToken(null);
            return callback(err, null);
        }

        return callback(null, new User(res));
    });
};

/**
 *  Sign up.
 *  @param {string} userName userName.
 *  @param {string} password password.
 *  @param {Function} callback callback.
 */
Auth.signUp = function(userName, password, callback) {
    API.post('/user/' + userName, null, {
        'password': password
    }, function(err, res) {
        if (err) {
            API.updateToken(null);
            return callback(err, null);
        }

        return callback(null, new User(res));
    });
};





/**
 *  @constructor
 */
var Application = function() {};
extendClass(Application, EventDispatcher);

Application.prototype.init = function() {
    var self = this;

    /**
     *  @NOTE singleton
     */
    if (Application.instance) return Application.instance;
    Application.instance = this;

    EventDispatcher.call(this);

    /**
     *  The result of url routing.
     *  @type {Object}
     */
    this.rout = this.routing();

    /**
     *  Authentication state.
     *  @type {boolean}
     */
    this.isAuthed = false;

    /**
     *  Authenticated user.
     *  @type {User}
     */
    this.authedUser = null;

    this.baseView = new BaseView();
    this.baseView.appendTo(document.body);

    window.addEventListener('hashchange', this.onHashChange.bind(this));

    this.updateAuthState(function() {
        self.onHashChange();
    })
};

/**
 *  check authentication state
 */
Application.prototype.updateAuthState = function(callback) {
    var self = this;

    /**
     *  @TODO LocalStorageからtoken取り出す
     */

    User.getMe(function(err, me) {
        if (err) {
            self.setAuthedUser(null);
            callback(err, null);
            return;
        }

        self.setAuthedUser(new User(me));
        callback(null, me);
    });
};

Application.prototype.setAuthedUser = function(user) {
    if (this.authedUser === user) return;

    if (user) {
        this.isAuthed = true;
        this.authedUser = user;
    } else {
        this.isAuthed = false;
        this.authedUser = null;
    }

    this.fire('auth.change',
        this.isAuthed,
        this.authedUser
    );
};

/**
 *  Sign in.
 */
Application.prototype.signIn = function(userName, password, callback) {
    var self = this;

    Auth.signIn(userName, password, function(err, user) {

        if (err) {
            self.setAuthedUser(null);
            return callback(err, null);
        }

        self.setAuthedUser(user);
        callback(null, user);
    });
};

/**
 *  Sign up.
 *  @param {string} userName userName.
 *  @param {string} password password.
 *  @param {Function} callback callback.
 */
Application.prototype.signUp = function(userName, password, callback) {
    var self = this;

    Auth.signUp(userName, password, function(err, user) {

        if (err) {
            self.setAuthedUser(null);
            return callback(err, null);
        }

        self.setAuthedUser(user);
        callback(null, user);
    });
};

/**
 *  Change url asyncrounously.
 *  @param {string} url url.
 */
Application.prototype.setURLAsync = function(url) {
    setTimeout(function() {
        document.location.href = url;
    }, 0);
};

/**
 *  Change url hash asyncrounously.
 *  @param {string} hash hash.
 */
Application.prototype.setHashAsync = function(hash) {
    setTimeout(function() {
        document.location.hash = '#!' + hash;
    }, 0);
};

/** 
 *  check rout
 *  @param {string} [url] URL if elipsis, it is 'document.localtion.href'.
 *  @return {Object} parameters of rout
 */
Application.prototype.routing = function(url) {
    var controller,
        params = null,
        ma;

    url = url || window.location.hash.substr(2);

    if (url === '') {
        if (this.isAuthed) {
            params = {
                mode: 'user',
                userName: this.authedUser.name
            };
        } else {
            params = {
                mode: 'signin'
            };
        }

    } else if (url === '/signup') {
        params = {
            mode: 'signup'
        };

    } else if (url === '/signin') {
        // /signin
        params = {
            mode: 'signin'
        };

    } else if (ma = url.match(/^\/user\/([^\/]+)$/)) {
        // /user/:userName
        params = {
            mode: 'user',
            userName: ma[1]
        };

    } else if (ma = url.match(/^\/user\/([^\/]+)\/project\/([^\/]+)$/)) {
        // /user/:userName/project/:projectName
        params = {
            mode: 'project',
            userName: ma[1],
            projectName: ma[2]
        };

    } else {
        //  no match.
        params = {
            mode: 'error404'
        }
    }

    return params;
};

Application.prototype.onHashChange = function() {
    this.rout = this.routing()
    this.fire('rout.change', this.rout);
};








/**
 *	ProgressBarView
 *	@constructor
 *	@extend {View}
 */
function ProgressBarView() {
    View.call(this);

    this.loadTemplate('ProgressBarView');

    /**
     *	@type {ProgressBarView.State}
     */
    this.state = ProgressBarView.State.INITIAL;

    this.setComplete = this.setComplete.bind(this);
    this.setInitial = this.setInitial.bind(this);
};
extendClass(ProgressBarView, View);

/**
 *	@enum {number}
 */
ProgressBarView.State = {
    INITIAL: 0,
    PROCESSING: 1,
    COMPLETE: 2
};

/**
 *	Animation duration time (ms)
 *	@const {number}
 */
ProgressBarView.ANIMATION_DURATION = 800;

ProgressBarView.prototype.finalize = function() {
    this.setComplete = null;
    this.setInitial = null;

    View.prototype.finalize.call(this);
};

ProgressBarView.prototype.setComplete = function() {
    var inner = this.$.inner;

    if (this.state !== ProgressBarView.State.PROCESSING) return;
    this.state = ProgressBarView.State.COMPLETE;

    setTimeout(this.setInitial, ProgressBarView.ANIMATION_DURATION);

    inner.classList.add('is-complete');
    inner.style.width = '';
};

ProgressBarView.prototype.setInitial = function() {
    var inner = this.$.inner;

    if (this.state !== ProgressBarView.State.COMPLETE) return;
    this.state = ProgressBarView.State.INITIAL;

    inner.classList.remove('is-complete');
    inner.classList.add('is-initial');
};

/**
 *	@param {number} value value.
 */
ProgressBarView.prototype.setValue = function(value) {
    var inner = this.$.inner;

    if (this.state === ProgressBarView.State.COMPLETE) return;
    this.state = ProgressBarView.State.PROCESSING;

    if (value >= 100) {
        value = 100;
        setTimeout(this.setComplete, ProgressBarView.ANIMATION_DURATION);
    }

    inner.classList.remove('is-initial');
    inner.style.width = value + '%';
};








/**
 *	ToolBarView
 *	@constructor
 *	@extend {View}
 */
var ToolBarView = function() {
    View.call(this);

    this.loadTemplate('ToolBarView');

    app.on('auth.change', this.onChangeAuth, this);

    this.checkAuthState();
};

extendClass(ToolBarView, View);

/**
 *	Finalize.
 */
ToolBarView.prototype.finalize = function() {
    app.off('auth.change', this.onChangeAuth, this);

    View.prototype.finalize.call(this);
};

/**
 *	Check authentication state.
 */
ToolBarView.prototype.checkAuthState = function() {
    if (app.isAuthed) {
        this.$.root.classList.add('is-authed');
    } else {
        this.$.root.classList.remove('is-authed');
    }

    this.childViews.userInlineView.setUser(app.authedUser);
};

/**
 *	EventListener: Application#on('auth.change')
 *	@param {boolean} isAuthed isAuthed.
 *	@param {User} authedUser authedUser.
 */
ToolBarView.prototype.onChangeAuth = function(isAuthed, authedUser) {
    this.checkAuthState();
};










/**
 *  SignInPageView
 *  @constructor
 *  @extend {View}
 */
var SignInPageView = function() {
    View.call(this);

    this.loadTemplate('SignInPageView');

    this.$.form.addEventListener('submit', this.onSubmit = this.onSubmit.bind(this));
    app.on('rout.change', this.onChangeRout, this);
    app.on('auth.change', this.onChangeAuth, this);
};
extendClass(SignInPageView, View);

/**
 *  Finalize.
 */
SignInPageView.prototype.finalize = function() {
    this.$.form.removeEventListener('submit', this.onSubmit);
    this.onSubmit = null;

    app.off('rout.change', this.onChangeRout, this);
    app.off('auth.change', this.onChangeAuth, this);

    View.prototype.finalize.call(this);
};

SignInPageView.prototype.signIn = function() {
    var self = this;
    if (!this.validate()) return;

    this.showErrorMessage(null);
    app.signIn(this.$.userName.value, this.$.password.value, function(err, user) {
        self.showErrorMessage(err);

        if (err) {
            return;
        }

        app.setHashAsync(user.uri);
    });
}

/**
 *  Show error message corresponding to error type.
 *  @param {Object} err error object
 */
SignInPageView.prototype.showErrorMessage = function(err) {
    err = err || APIError.SUCCESS;

    this.$.root.classList.toggle('is-error-invalid_parameter', err.code === APIError.Code.INVALID_PARAMETER);
    this.$.root.classList.toggle('is-error-unknown', err.code === APIError.Code.UNKNOWN);
};

/**
 *  Check if all input forms are validate.
 */
SignInPageView.prototype.validate = function() {
    var userName = this.$.userName.value,
        password = this.$.password.value,
        isValidate = true;

    if (!password) {
        isValidate = false;
        this.$.password.classList.add('is-error');
        this.$.password.focus();
    } else {
        this.$.password.classList.remove('is-error');
    }

    if (!userName) {
        isValidate = false;
        this.$.userName.classList.add('is-error');
        this.$.userName.focus();
    } else {
        this.$.userName.classList.remove('is-error');
    }

    return isValidate;
};

/**
 *  Check authentication state.
 */
SignInPageView.prototype.checkAuthState = function() {
    var self = this;

    if (app.isAuthed) {
        this.$.root.classList.add('is-authed');
        this.childViews.userInlineView.setUser(app.authedUser);
    } else {
        this.$.root.classList.remove('is-authed');
        this.childViews.userInlineView.setUser(null);
    }

};

/**
 *  EventListener: Application#on("rout.change")
 *  @param {Object} rout routing data.
 */
SignInPageView.prototype.onChangeRout = function(rout) {
    var self;

    if (rout.mode !== 'signin') return;

    this.checkAuthState();

    self = this;
    runAsync(function() {
        self.fire('load');
        self.$.userName.focus();
    });

    this.$.userName.value = '';
    this.$.password.value = '';
};

/**
 *  EventListener: Application#on("auth.change")
 *  @param {boolean} isAuthed isAuthed.
 *  @param {User} authedUser authedUser
 */
SignInPageView.prototype.onChangeAuth = function(isAuthed, authedUser) {
    this.checkAuthState();
};

/**
 *  EventListener: HTMLFormElement#on("submit")
 *  @param {Event} ev event object.
 */
SignInPageView.prototype.onSubmit = function(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    this.signIn();
};








/**
 *  SignUpPageView
 *  @constructor
 *  @extend {View}
 */
var SignUpPageView = function() {
    View.call(this);

    this.loadTemplate('SignUpPageView');

    this.$.form.addEventListener('submit', this.onSubmit = this.onSubmit.bind(this));
    app.on('rout.change', this.onChangeRout, this);
};
extendClass(SignUpPageView, View);

/**
 *  Finalize.
 */
SignUpPageView.prototype.finalize = function() {
    this.$.form.removeEventListener('submit', this.onSubmit);
    this.onSubmit = null;

    app.off('rout.change', this.onChangeRout, this);

    View.prototype.finalize.call(this);
};

/**
 *  Sign up.
 */
SignUpPageView.prototype.signUp = function() {
    var self = this;

    if (!this.validate()) return;

    this.showErrorMessage(null);
    app.signUp(this.$.userName.value, this.$.password.value, function(err, user) {
        self.showErrorMessage(err);

        if (err) {
            return;
        }

        app.setHashAsync(user.uri);
    });
};

/**
 *  Show error message corresponding to error type.
 *  @param {Object} err error object
 */
SignUpPageView.prototype.showErrorMessage = function(err) {
    err = err || APIError.SUCCESS;

    this.$.root.classList.toggle('is-error-used_name', err.code === APIError.Code.USED_NAME);
    this.$.root.classList.toggle('is-error-unknown', err.code === APIError.Code.UNKNOWN);
};

/**
 *  Check if all input forms are validate.
 */
SignUpPageView.prototype.validate = function() {
    var userName = this.$.userName.value,
        password = this.$.password.value,
        isValidate = true;

    if (!password) {
        isValidate = false;
        this.$.password.classList.add('is-error');
        this.$.password.focus();
    } else {
        this.$.password.classList.remove('is-error');
    }

    if (!userName) {
        isValidate = false;
        this.$.userName.classList.add('is-error');
        this.$.userName.focus();
    } else {
        this.$.userName.classList.remove('is-error');
    }

    return isValidate;
};

/**
 *  EventListener: Application#on('rout.change')
 *  @param {Object} rout routing data.
 */
SignUpPageView.prototype.onChangeRout = function(rout) {
    var self;

    if (rout.mode !== 'signup') return;

    self = this;
    runAsync(function() {
        self.$.userName.focus();
        self.fire('load');
    });

    this.$.userName.value = '';
    this.$.password.value = '';
};

/**
 *  EventListener: HTMLFormElement#on('submit')
 *  @param {Event} rout routing data.
 */
SignUpPageView.prototype.onSubmit = function(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    this.signUp();
};
















/**
 *  @TODO
 *  API.Userへの依存をなくす
 *  Model#uriを用いて、API_coreだけで対応する。
 */

/**
 *  Comment Model.
 *  @constructor
 *  @param {Object} data initial data.
 *  @extends {Model}
 */
var Comment = function(data) {
    if (!(this instanceof Comment)) return new Comment(data);

    if (isObject(data)) {
        if (Comment.hasInstance(data.id)) {
            return Comment.getInstance(data.id).updateWithData(data);
        }
    }

    Model.call(this, data);
};
extendClass(Comment, Model);

Comment.prototype.hoge = function(name, key) {};

/**
 *  model instances map
 *  @type {Object}
 *  @private
 *  @overrides
 */
Comment.instances_ = {};

/** 
 *  Schema
 *
 *  @type {Object}
 *  @override
 */
Comment.prototype.schema = {
    "id": {
        type: String,
        value: ''
    },
    "uri": {
        type: String,
        value: ''
    },
    "owner": {
        type: String,
        value: ''
    },
    "text": {
        type: String,
        value: ''
    },
    "html": {
        type: String,
        value: ''
    },
    "created": {
        type: Date,
        value: null
    },
    "target": {
        type: String,
        value: null
    },
    "range": {
        type: Object,
        value: null
    }
};

/**
 *  @override
 */
Comment.prototype.updateWithData = function(data) {
    Model.prototype.updateWithData.call(this, data);

    this.html = this.text
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    this.created = new Date(data.created);
    return this;
};

/**
 *  Get Comment data by comment ID
 *  @param {string} commentId the comment id.
 *  @param {Function} callback callback function.
 */
Comment.getById = function(commentId, callback) {
    API.get('/comment/' + commentId,
        function(err, res) {
            if (err) {
                return callback(err, null);
            }

            return callback(null, new Comment(res));
        });
};

/**
 *  Update comment data.
 *  @params {Function} callback callback function.
 */
Comment.prototype.update = function(callback) {
    if (!app.isAuthed || app.authedUser.name !== this.owner) {
        return callback(APIError.PERMISSION_DENIED, null);
    }

    API.patch(this.uri, {
            text: this.text
        },

        function(err, res) {
            if (err) {
                return callback(err, null);
            }

            return callback(null, new Comment(res));
        });
};

/**
 *  Delete comment data.
 *  @param {Function} callback callback function.
 */
Comment.prototype.delete = function(callback) {
    var self = this;

    if (!app.isAuthed || app.authedUser.name !== this.owner) {
        return callback(APIError.PERMISSION_DENIED, null);
    }

    API.delete(this.uri,

        function(err, res) {
            if (err) {
                return callback(err, null);
            }

            Comment.deleteInstance(self);

            return callback(null, res);
        });
};





/**
 *  Project Model.
 *  @constructor
 *  @param {Object} data initial data.
 *  @extends {Model}
 */
var Project = function(data) {
    if (!(this instanceof Project)) return new Project(data);

    if (isObject(data)) {
        if (Project.hasInstance(data.id)) {
            return Project.getInstance(data.id).updateWithData(data);
        }
    }

    Model.call(this, data);
};
extendClass(Project, Model);

/**
 *  model instances map
 *  @type {Object}
 *  @private
 *  @overrides
 */
Project.instances_ = {};

/** 
 *  Schema
 *
 *  @type {Object}
 *  @override
 */
Project.prototype.schema = {
    "id": {
        type: String,
        value: ''
    },
    "uri": {
        type: String,
        value: ''
    },
    "name": {
        type: String,
        value: 'undefined'
    },
    "owner": {
        type: String,
        value: ''
    },
    "root": {
        type: null,
        value: null
    }
};

/**
 *  Get Project data by project name.
 *  @param {string} userName the owner name.
 *  @param {string} projectName the project name.
 *  @param {Function} callback callback function.
 */
Project.getByName = function(userName, projectName, callback) {
    API.get('/user/' + userName + '/project/' + projectName,
        function(err, res) {
            if (err) {
                return callback(err, null);
            }

            return callback(null, new Project(res));
        });
};

/**
 *  Get all Project data by owner name.
 *  @param {string} userName the owner name.
 *  @param {Function} callback callback function.
 */
Project.getAll = function(userName, callback) {
    API.get('/user/' + userName + '/project',
        function(err, res) {
            if (err) {
                return callback(err, null);
            }

            return callback(null, res.map(Project));
        });
};

/**
 *  Create new project.
 *  @param {string} projectName the proejct name.
 *  @param {Function} callback callback function.
 */
Project.create = function(projectName, callback) {
    if (!app.isAuthed) {
        return callback(APIError.PERMISSION_DENIED, null);
    }

    API.post('/user/' + app.authedUser.name + '/project',
        function(err, res) {
            if (err) {
                return callback(err, null);
            }

            return callback(null, new Project(res));
        });
};

/**
 *  Update project data.
 *  @param {Object} params update datas.
 *  @params {Function} callback callback function.
 */
Project.prototype.update = function(callback) {
    if (!app.isAuthed || app.authedUser.name !== this.owner) {
        return callback(APIError.PERMISSION_DENIED, null);
    }

    API.patch(this.uri, {
        name: this.name
    }, function(err, res) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, new Project(res));
    });
};

/**
 *  Delete project data.
 *  @param {Function} callback callback function.
 */
Project.prototype.delete = function(callback) {
    if (!app.isAuthed || app.authedUser.name !== this.owner) {
        return callback(APIError.PERMISSION_DENIED, null);
    }

    API.delete(this.uri, function(err, res) {
        if (err) {
            return callback(err, null);
        }

        //@TODO: インスタンスを消す
        return callback(null, new Project(res));
    });
};

/**
 *  Get project comments.
 *  @param {Function} callback callback function.
 */
Project.prototype.getComments = function(callback) {
    API.get(this.uri + '/comment', function(err, res) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, res.map(Comment));
    });
};

Project.prototype.postComment = function(text, callback) {
    API.post(this.uri + '/comment', null, {
        text: text
    }, function(err, res) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, Comment(res));
    });
};



var UserPageView = function() {
    View.call(this);

    this.loadTemplate('UserPageView');

    this.user = null;

    /**
     *  @type {boolean}
     */
    this.isProjectsLoaded = false;

    app.on('rout.change', this.onChangeRout, this);
};
extendClass(UserPageView, View);

UserPageView.prototype.finalize = function() {
    app.off('rout.change', this.onChangeRout, this);

    View.prototype.finalize.call(this);
};

UserPageView.prototype.loadUserWithRout = function(rout) {
    if (rout.mode !== 'user') return;

    var self = this;

    User.getByName(rout.userName, function(err, user) {
        self.setUser(user);
        self.fire('load');
    });
};

UserPageView.prototype.loadUserProjects = function() {
    var user = this.user,
        self = this;

    if (!user) {
        return;
    }

    user.getAllProjects(function(err, projects) {
        if (err) {
            self.childViews.projectListView.setItems([]);
            return;
        }

        self.childViews.projectListView.setItems(projects);
    });
};

UserPageView.prototype.setUser = function(user) {
    if (this.user === user) return;

    this.user = user;
    this.childViews.userView.setUser(user);
    this.loadUserProjects();
};

UserPageView.prototype.onChangeRout = function(rout) {
    this.loadUserWithRout(rout);
};








var UserView = function() {
    View.call(this);

    this.loadTemplate('UserView');

    this.user = null;
};
extendClass(UserView, View);

UserView.prototype.finalize = function() {
    View.prototype.finalize.call(this);
};

UserView.prototype.setUser = function(user) {
    this.user = user;
};








var UserInlineView = function() {
    View.call(this);

    this.loadTemplate('UserInlineView');

    this.user = null;
};
extendClass(UserInlineView, View);

UserInlineView.prototype.finalize = function() {
    View.prototype.finalize.call(this);
};

UserInlineView.prototype.setUser = function(user) {
    this.user = user;
};








var ProjectPageView = function() {
    View.call(this);

    /**
     *  @type {Project}
     */
    this.project = null;

    this.loadTemplate('ProjectPageView');

    app.on('rout.change', this.onChangeRout, this);
};
extendClass(ProjectPageView, View);

ProjectPageView.prototype.finalize = function() {
    app.off('rout.change', this.onChangeRout, this);

    View.prototype.finalize.call(this);
};

ProjectPageView.prototype.loadProjectWithRout = function(rout) {
    if (rout.mode !== 'project') return;

    var self = this;

    Project.getByName(rout.userName, rout.projectName, function(err, project) {
        self.setProject(project);
        self.fire('load');
    });

    User.getByName(rout.userName, function(err, user) {
        self.childViews.userInlineView.setUser(user);
    });
};

ProjectPageView.prototype.onChangeRout = function(rout) {
    this.loadProjectWithRout(rout);
};

ProjectPageView.prototype.setProject = function(project) {
    if (this.project === project) return;

    this.project = project;
    this.childViews.commentListView.setTarget(project);
};













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

var ProjectListItemView = function() {
    ListItemView.call(this);

    this.loadTemplate('ProjectListItemView');

    this.project = null;
};
extendClass(ProjectListItemView, ListItemView);

ProjectListItemView.prototype.setModel = function(project) {
    this.project = project;
};

var ProjectListView = function() {
    ListView.call(this);

    this.loadTemplate('ProjectListView');
    this.itemViewConstructor = ProjectListItemView;

    this.projects = [];
    this.listItems = [];
};
extendClass(ProjectListView, ListView);





















var CommentListItemView = function() {
    ListItemView.call(this);

    this.loadTemplate('CommentListItemView');

    this.comment = null;

    this.$.deleteLink.addEventListener('click', this.onDeleteLinkClick = this.onDeleteLinkClick.bind(this));
    app.on('auth.change', this.onChangeAuth, this);
};
extendClass(CommentListItemView, ListItemView);

CommentListItemView.prototype.finalize = function() {
    this.$.deleteLink.removeEventListener('click', this.onDeleteLinkClick);
    this.onDeleteLinkClick = null;

    app.off('auth.change', this.onChangeAuth, this);

    ListItemView.prototype.finalize.call(this);
};

CommentListItemView.prototype.setModel = function(comment) {
    var self = this;

    this.comment = comment;
    this.checkOwner();

    if (comment) {
        User.getByName(comment.owner, function(err, user) {
            self.childViews.userInlineView.setUser(user);
        });
    }
};

CommentListItemView.prototype.checkOwner = function() {
    var isOwner = (
        this.comment &&
        app.isAuthed &&
        app.authedUser.name === this.comment.owner
    );

    this.$.root.classList.toggle('is-owner', isOwner);
};

CommentListItemView.prototype.deleteComment = function() {
    var comment = this.comment,
        self;

    if (!comment) return;

    self = this;

    comment.delete(function(err, res) {
        if (err) {
            console.log(err);
            return;
        }
    });
};

CommentListItemView.prototype.onChangeAuth = function() {
    this.checkOwner();
};

CommentListItemView.prototype.onDeleteLinkClick = function(ev) {
    ev.stopPropagation();
    ev.preventDefault();

    this.deleteComment();
};

var CommentListView = function() {
    ListView.call(this);

    this.loadTemplate('CommentListView');

    /**
     * 表示対象のオブジェクト
     * @type {(Project|Item)}
     */
    this.target = null;

    /**
     *  @type {boolean}
     */
    this.isLoading;
    this.setLoadingState(true);

    this.itemViewConstructor = CommentListItemView;

    this.$.text.addEventListener('keydown', this.onKeyDown = this.onKeyDown.bind(this));
    this.$.form.addEventListener('submit', this.onSubmit = this.onSubmit.bind(this));
};
extendClass(CommentListView, ListView);

CommentListView.prototype.finalize = function() {
    this.$.text.addEventListener('keydown', this.onKeyDown)
    this.onKeyDown = null;

    this.$.form.removeEventListener('submit', this.onSubmit);
    this.onSubmit = null;

    ListView.prototype.finalize.call(this);
};

CommentListView.prototype.setItems = function(items) {
    items = items.slice(0).sort(function(a, b) {
        return a.created > b.created ? -1 :
            a.created < b.created ? 1 : 0;
    });

    return ListView.prototype.setItems.call(this, items);
};

CommentListView.prototype.loadComments = function() {
    var target = this.target,
        self = this;

    if (!target) return;

    target.getComments(function(err, comments) {
        if (err) {
            self.setItems([]);
            self.setLoadingState(false);
            return;
        }

        self.setItems(comments);
        self.setLoadingState(false);
    });
};

CommentListView.prototype.setLoadingState = function(state) {
    if (state === this.isLoading) return;

    if (state) {
        this.$.root.classList.add('is-loading');

    } else {
        this.$.root.classList.remove('is-loading');
    }
}
CommentListView.prototype.setTarget = function(target) {
    if (this.target === target) return;

    this.target = target;
    this.setItems([]);
    this.loadComments();
};

CommentListView.prototype.submit = function() {
    var self;

    if (!this.validate()) return;

    self = this;

    this.target.postComment(this.$.text.value.trim(), function(err, res) {
        if (err) {
            console.log(err);
            return
        }

        self.$.text.value = '';
        self.$.text.focus();
        self.loadComments();
    })
};

CommentListView.prototype.validate = function() {
    var text = this.$.text.value,
        isValidate = true;

    //@TODO: debug only
    // if (!app.isAuthed) {
    //     isValidate = false;
    // }

    if (!text) {
        isValidate = false;
    }

    return isValidate;
};

CommentListView.prototype.onKeyDown = function(ev) {
    var KeyCode = {
        ENTER: 13
    };

    switch (ev.keyCode) {
        case KeyCode.ENTER:
            if (ev.metaKey) {
                this.$.submit.click();
                ev.preventDefault();
                ev.stopPropagation();
            }
            break;

        default:
            break;
    }
};

CommentListView.prototype.onSubmit = function(ev) {
    ev.stopPropagation();
    ev.preventDefault();

    this.submit();
};








var Error404PageView = function() {
    View.call(this);

    this.loadTemplate('Error404PageView');
};
extendClass(Error404PageView, View);

/**
 *	bootstrap
 */
app = new Application();

window.onload = function() {
    app.init();
};
