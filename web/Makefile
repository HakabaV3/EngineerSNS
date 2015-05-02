default:
	cat Makefile

#---------------------------------------------------------
# 監視

#一括
watch:
	$(MAKE) watch-stop
	$(MAKE) compile
	$(MAKE) watch-html&
	$(MAKE) watch-js&
	$(MAKE) watch-css

#監視の終了
watch-stop:
	pgrep fswatch-run | xargs -I$$ kill $$

#html
watch-html:
	fswatch-run -r index.html "make compile-html"

#js
watch-js:
	fswatch-run -r *.js ./ "make compile-js"

#css
watch-css:
	fswatch-run -r *.scss ./ "make compile-css"

#---------------------------------------------------------
# コンパイル

#一括
compile:
	$(MAKE) compile-html
	$(MAKE) compile-js
	$(MAKE) compile-css

#html
compile-html:
	cp index.html ../server/public/index.html

#js
compile-js:
	browserify ./script.js -o ../server/public/script.js

#css
compile-css:
	sass --no-cache --sourcemap=none style.scss ../server/public/style.css
	autoprefixer ../server/public/style.css

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
