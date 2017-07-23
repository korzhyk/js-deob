# Javascript deobfuscator
Deobfuscate code after [js-obfuscator](https://github.com/caiguanhao/js-obfuscator)

### Installing

	`yarn add js-deob`

### CLI

	`deob **/*.js`

### Require
```js
	const { readFileSync } = require('fs')
	const deob = require('js-deob')

	let fileContents = readFileSync('some_script.js')
	fileContents = deob(fileContents, { /* js-beautify options */ })
	console.log(fileContents)
```

(MIT)
