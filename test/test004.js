var baseURL = 'http://ioffer.space:2000';
var page    = require('webpage').create();

page.open(baseURL + '/login', function(status) {
	page.evaluate(function() {
		document.querySelector('[name=email]').value = 'mark@fb.com';
		document.querySelector('[name=password]').value = 'mark123';
		document.querySelector('[type=submit]').click();
	});

	setTimeout(afterLogin, 5000);
});

function afterLogin() {
	page.open(baseURL + '/logout', function(status) {
		page.open(baseURL + '/profile', function(status) {
			if (page.url == baseURL + '/profile') {
				console.log('Test Case #004: FAILED');
			} else {
				console.log('Test Case #004: PASSED');
			}
			phantom.exit();
		});
	});
}
