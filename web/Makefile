.PHONY: js html

default:
	cat Makefile

jsx:
	jsx -x jsx -w js/module/view/src js/module/view/build

js:
	packjs js/script.js script.js -w

html:
	packjs html/index.html index.html -w

install:
	bower install
	npm install
