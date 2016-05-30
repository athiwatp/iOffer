var baseURL   = require('system').args[1]
var page      = require('webpage').create()

var step      = 'open-register-page'
page.onLoadFinished = verify
page.open(baseURL + '/register')

function verify(status) {
	if (step == 'open-register-page') {
		step = 'fill-in-data'
		data = page.evaluate(function() {
			var d         = new Date();
			var id        = d.getMonth() + d.getDay() + d.getHours()
			var firstName = 'Mr'   + id
			var lastName  = 'Family'
			var email     = 'user' + id + '@gmail.com'
			var password  = 'pass' + id
			
			document.querySelector('[name=first-name]').value = firstName
			document.querySelector('[name=last-name]').value  = lastName
			document.querySelector('[name=email]').value      = email
			document.querySelector('[name=password]').value   = password
			document.querySelector('[type=submit]').click()
		})
	} else if (step == 'fill-in-data') {
		if (page.url == baseURL ||
			page.url == baseURL + '/') {
			console.log('Test Case #005: PASSED');
		} else {
			console.log('Test Case #005: FAILED');
		}
		page.render('test005.png')
		phantom.exit()
	}
}