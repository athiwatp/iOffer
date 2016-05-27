var exec = require('child_process').exec;

var scripts = [
	"test001.js",
	"test002.js",
	"test003.js"
];

for (var i = 0; i < scripts.length; i++) {
	exec("phantomjs " + scripts[i], (e1, result, e2) => {
		console.log(result);
	});
}
