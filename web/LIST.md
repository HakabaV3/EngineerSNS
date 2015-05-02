# 開発しながら思ったこと

## コントローラーとビューが混在している。

ButtonViewとかは、リップル処理しかしてないし、View

## templateにいちいちclassとnameと両方降るのがめんどくさい

### 要求

```html
<template name="Example">
    <div class="Example">
        <div class="Example-container">  -> $.container
            <ul class="Example-menu"> -> $.menu
                <li class="Example-menuItem"> -> $.menuItem[0]
                    Item 1
                </li>
                <li class="Example-menuItem"> -> $.menuItem[1]
                    Item 2
                </li>
                <li class="Example-menuItem"> -> $.menuItem[2]
                    Item 3
                </li>
            </ul>
        </div>
    </div>
</template>
```

## handleEventでの分岐には限界がある

### 問題点

- 同じイベント名を分岐させたいときにだるい

```javascript
function Example(){
    button1.addEventListener('click', this);
    button2.addEventListener('click', this);
}

Example.prototype.handleEvent = function(ev){
    switch (ev.type) {
        case 'click':
            //どっち！？
            break;
    }
};
```

### 要求

- thisは今までどおりControllerにバインド
- 通常の文法を用いたい
    ```javascript
    button1.addEventListener('click', this.onButton1Click);
    ```
- handleEventは禁止
- Viewとかの基底クラスでどうにかならないか。

## View - Controllerの一対一対応はつらい

### 問題点

- ファイルが膨大になる
- 再利用性に欠ける(DRY:Don't Repeat Yourself の原則に反する)
- ControllerからView, ChildControllerの両方を操作するため非常に煩雑

### 要求

- View = DOM
- Controller = (jsのクラス)

- Viewはあくまで、DOMの構築に用いる。
- ただし、必要に応じてControllerを付与できる

```html
<!--
Animalというクラスが存在する必要はない
-->
<template name="Animal">
    <div class="Animal">
        <div class="Animal-type"></div>
    </div>
</template>



<template name="App">
    <div class="App">
        <Animal controller="HumanController"></Animal>
        <Animal controller="DogController"></Animal>
        <Animal controller="CatController"></Animal>
    </div>
</template>
```

↓

```html
    <div class="App">
        <div class="Animal">
            <div class="Animal-type">Human!</div>
        </div>
        <div class="Animal">
            <div class="Animal-type">Dog!</div>
        </div>
        <div class="Animal">
            <div class="Animal-type">Cat!</div>
        </div>
    </div>
```
