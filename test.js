/*
[sudo] npm install -g phantomjs
phantomjs test.js
*/

var baseURL = 'http://ioffer.space:2000';
var page    = require('webpage').create();

var scripts = [
function() {
	page.open(baseURL, function(status) {
		page.evaluate(function() {
			if (page.title == 'iOffer') {
				console.log('Test Case #1: PASSED');
			} else {
				console.log('Test Case #1: FAILED');
			}
		});
	});
	phantom.exit();
},
function() {
	page.open(baseURL + '/login', function(status) {
		page.evaluate(function() {
			document.querySelector('[name=email]').value = 'mark@fb.com';
			document.querySelector('[name=password]').value = 'mark123';
			document.querySelector('[type=submit]').click();
		});

		setTimeout(function() {
			if (page.url == baseURL + '/profile') {
				console.log('Test Case #002: PASSED');
			} else {
				console.log('Test Case #002: FAILED');
			}
		}, 5000);
	});
}

];

var i = 0;

setInterval(function() {
	scripts[i]();
	i++;
	if (i == scripts.length) {
		phantom.exit();
	}
}, i * 10000);
