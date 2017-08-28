SERVE = serve

JS := $(shell find src -name '*.js' -print)

PORT = 3000

build: $(JS) node_modules
	 webpack --config webpack.config.js

clean:
	rm -rf dist node_modules

node_modules: package.json
	@npm install

watch: node_modules
	webpack-dev-server --devtool sourcemap --config webpack.config.js --content-base dist/  
	

