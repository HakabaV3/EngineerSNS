//@include ../util.js

/**
 *  Template engine.
 *  @namespace
 */
var Template = {};

//@include ./query.js
//@include ./binding.js

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
