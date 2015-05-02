# Template

テンプレートからViewを生成するクラス群

## 概要

- `{{ tagText }}`のように、波カッコでタグを埋め込める。
- `TextNode#textContent` や 各種`Node#attribute`などに埋め込める

```html
<template name="example", controller="ExampleView">
	<h1>Hello, {{ userName }} !</h1>
	<content></content>
</template>

<example>
	<span>hogehoge</span>
</example>

<script type="javascript">
function ExampleView(){
	this.userName = 'Kikurage';
}

Template.registerElement('ExampleView', ExampleView);
</script>
```

これがこうなる

```html
<h1>Hello, Kikurage</h1>
<span>hogehoge</span>
```

## 実装

1. DOMContentLoaded時に

	1-1. 全templateタグの解析

2. registerComponent時に

	2-1. 可能なコンポーネントの実体化
