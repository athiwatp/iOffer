var baseURL = require('system').args[1];
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
		page.render('test003.png');
		phantom.exit();
	}, 5000);
});
