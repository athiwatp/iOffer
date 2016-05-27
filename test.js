var baseURL = 'http://ioffer.space:2000';
var page    = require('webpage').create();

page.open(baseURL + '/login', function() {
	page.evaluate(function() {
		document.querySelector('[name=email]').value = 'mark@fb.com';
	});

	page.render('login1.png');
	phantom.exit();
});
