.PHONY: all build clean deploy lint server

all: deploy server

build: node_modules/
	npx webpack --mode development

clean:
	-rm -f package-lock.json
	-rm -r ./node_modules
	-npm cache verify

deploy: build lint

lint: node_modules/
	npx eslint --fix src/

server: build
	npx webpack-dev-server --open

node_modules/: package.json
	npm install
	touch node_modules/
