var baseURL = require('system').args[1];
var page    = require('webpage').create();

page.open(baseURL, function(status) {
	if (page.title == 'iOffer') {
		console.log('Test Case #001: PASSED');
	} else {
		console.log('Test Case #001: FAILED');
	}
	page.render('test001.png');
	phantom.exit();
});
