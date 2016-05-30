var baseURL   = require('system').args[1]
var page      = require('webpage').create()

var step      = 'open-login'
page.onLoadFinished = verify
page.open(baseURL + '/login')

function verify(status) {
	if (step == 'open-login') {
		step = 'submit-login'
		page.evaluate(function() {
			var d         = new Date();
			var id        = d.getMonth() + d.getDay() + d.getHours()
			var email     = 'user' + id + '@gmail.com'
			var password  = 'pass' + id
			document.querySelector('[name=email]').value = email
			document.querySelector('[name=password]').value = password
			document.querySelector('[type=submit]').click()
		})
	} else if (step == 'submit-login') {
		if (page.url == baseURL + '/profile') {
			console.log('Test Case #006: PASSED')
		} else {
			console.log('Test Case #006: FAILED')
		}
		page.render('test006.png')
		phantom.exit()
	}
}