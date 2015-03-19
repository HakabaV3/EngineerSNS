default:
	fswatch-run ./*.js "make build"

build:
	browserify ./objectobserver.js -o ./test/objectobserver.js
	browserify ./arrayobserver.js -o ./test/arrayobserver.js
	browserify ./customobserver.js -o ./test/customobserver.js
