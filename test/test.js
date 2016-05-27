var server = "http://ioffer.space:2000"
var exec = require('child_process').exec

var scripts = [
	"test001.js",
	"test002.js",
	"test003.js",
	"test004.js"
]

for (var i = 0; i < scripts.length; i++) {
	exec("phantomjs " + scripts[i] + " " + server,
		(e1, result, e2) => {
			console.log(result)
		}
	)
}
