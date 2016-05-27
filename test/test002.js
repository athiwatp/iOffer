var baseURL = 'http://ioffer.space:2000';
var page    = require('webpage').create();

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
		phantom.exit();
	}, 5000);
});
