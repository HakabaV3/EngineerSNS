.PHONY: js html

default:
	cat Makefile

#全部まとめてコンパイルする
compile:
	$(MAKE) compile-stop
	$(MAKE) js&
	$(MAKE) html&

#全部まとめてコンパイルの停止。
compile-stop:
	which packjs | xargs -I$$ pgrep -f $$ | xargs -I$$ kill $$

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
