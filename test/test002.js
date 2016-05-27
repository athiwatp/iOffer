var baseURL = require('system').args[1];
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
		page.render('test002.png');
		phantom.exit();
	}, 5000);
});
