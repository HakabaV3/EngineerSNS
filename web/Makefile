.PHONY: js html

default:
	cat Makefile

#React jsxファイルのコンパイル
jsx:
	jsx -x jsx -w js/module/view/src js/module/view/build

#jsモジュールの結合
js:
	packjs js/script.js script.js -w

#htmlモジュールの結合
html:
	packjs html/index.html index.html -w

#パッケージ類のインストール
install:
	bower install
	npm install
	cd ../server
	bundle install
	cd ../web

#データベースの初期化
initdb:
	cd ../server
	mysqld start
	rake db:seed
	rake db:reset
	cd ../web

#サーバー・データベースの起動
start:
	cd ../server
	mysqld start
	rails s
	cd ../web

#サーバー・データベースの停止
stop:
	mysqld stop

