default:
	cat Makefile

#---------------------------------------------------------
# 監視

#一括
watch:
	$(MAKE) watch-stop
	$(MAKE) watch-js&
	$(MAKE) watch-html&
	$(MAKE) watch-css

#監視の終了
watch-stop:
	pgrep fswatch-run | xargs -I$$ kill $$

#js
watch-js:
	fswatch-run -r -e \.tmp$$ ./js "make compile-js"

#html
watch-html:
	fswatch-run -r -e \.tmp$$ ./html "make compile-html"

#css
watch-css:
	fswatch-run -r -e \.tmp$$ ./css "make compile-css"

#---------------------------------------------------------
# コンパイル

#一括
compile:
	$(MAKE) compile-js
	$(MAKE) compile-html
	$(MAKE) compile-css

#js
compile-js:
	packjs js/script.js ../server/public/script.js

#html
compile-html:
	packjs html/index.html ../server/public/index.html

#css
compile-css:
	sass --no-cache ./css/style.scss ../server/public/style.css

#---------------------------------------------------------
# サーバー

#一括
server:
	$(MAKE) server-install
	$(MAKE) server-init
	$(MAKE) server-copy
	$(MAKE) server-start

#gemのインストール
server-install:
	(cd ../server && bundle install)

#DBの初期化(MAMP用)
server-init:
	(cd ../server && rake db:reset RAILS_ENV=mamp)

#静的ファイルの移動
server-copy:
	cp -rf ./img ../server/public

#起動
server-start:
	(cd ../server && rails server -e mamp)
