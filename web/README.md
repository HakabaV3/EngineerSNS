# web



## フォルダ構成

```
web -+- css -+- style.scss ... cssの統合用ファイル
     |       |
     |       +- stylus ....... 各種module
     |
     |
     |
     +- html -+- index.html ... htmlの統合用ファイル
     |        |
     |        +- template ..... template単位のmodule
     |
     |
     |
     +- js -+- script.js ... jsの統合用フィアル
     |      |
     |      +- module ...... 各種module
     |
     |
     |
     +- testdata ........ APIのテスト用静的データ
     |
     +- index.html ...... アプリ本体
     |
     +- Makefile ........ 各モジュールをまとめるためのやつ
     |
     +- README.md ....... これ
     |
     +- script.js ....... 統合済みjs
     |
     +- style.css ....... 統合済みcss
     |
     +- style.css.map ... 統合済みcssのマップファイル
```



## Makefileの使い方

### `make js`

jsをまとめる

### `make html`

htmlをまとめる