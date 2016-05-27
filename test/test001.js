var baseURL = 'http://ioffer.space:2000';
var page    = require('webpage').create();

page.open(baseURL, function(status) {
	console.log(page.url);
	if (page.title == 'iOffer') {
		console.log('Test Case #001: PASSED');
	} else {
		console.log('Test Case #001: FAILED');
	}
	phantom.exit();
});
