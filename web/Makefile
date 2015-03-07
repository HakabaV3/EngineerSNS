.PHONY: js html

default:
	cat Makefile

#全部まとめてコンパイルする
compile:
	$(MAKE) jsx
	$(MAKE) js
	$(MAKE) html

#React jsxファイルのコンパイル
jsx:
	jsx -x jsx -w js/module/view/src js/module/view/build

#jsモジュールの結合
js:
	packjs js/script.js script.js
	packjs js/script.js script.js -w

#htmlモジュールの結合
html:
	packjs html/index.html index.html
	packjs html/index.html index.html -w

#pullしてからすることリスト
run:
	$(MAKE) install
	$(MAKE) init
	$(MAKE) start

#パッケージ類のインストール
install:
	bower install
	npm install
	(cd ../server && bundle install)

#データベースの初期化(MAMP用)
init:
	(cd ../server && rake db:reset RAILS_ENV=mamp)

#サーバーの起動
start:
	(cd ../server && rails server -e mamp)
