var baseURL = 'http://ioffer.space:2000';
var page    = require('webpage').create();

page.open(baseURL + '/login', function() {
	page.evaluate(function() {
		document.querySelector('[name=email]').value = 'mark@fb.com';
		document.querySelector('[name=password]').value = 'mark';
		document.querySelector('[type=submit]').click();
	});

	setTimeout(function() {
		if (page.url == baseURL + '/profile') {
			console.log('Test Case #003: FAILED');
		} else {
			console.log('Test Case #003: PASSED');
		}
		phantom.exit();
	}, 5000);
});
