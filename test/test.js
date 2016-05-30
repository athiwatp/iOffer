var server = "http://ioffer.space:2000"
var exec = require('child_process').exec

var scripts = [
	"test001.js",
	"test002.js",
	"test003.js",
	"test004.js",
	"test005.js",
	"test006.js"
]

var step = 0
exec("phantomjs " + scripts[step] + " " + server, showResult)

function showResult(e1, result, e2) {
	console.log(result)
	step++
	if (step < scripts.length) {
		exec("phantomjs " + scripts[step] + " " + server, showResult)
	}
}
