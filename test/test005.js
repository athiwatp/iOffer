var baseURL   = require('system').args[1]
var page      = require('webpage').create()

var step      = 'open-register'

page.onLoadFinished = verify
page.open(baseURL + '/register')

function verify(status) {
	var data = {}
	
	if (step == 'open-register') {
		step = 'fill-in-data'
		
		data = page.evaluate(function() {
			var d         = new Date();
			var firstName = 'Mr'   + d.getMonth() + d.getDay()
			var lastName  = 'Family'
			var email     = 'user' + d.getMonth() + d.getDay() + '@gmail.com'
			var password  = 'pass' + d.getMonth() + d.getDay()
			
			document.querySelector('[name=first-name]').value = firstName
			document.querySelector('[name=last-name]').value  = lastName
			document.querySelector('[name=email]').value      = email
			document.querySelector('[name=password]').value   = password
			document.querySelector('button').click()
		})
	} else if (step == 'fill-in-data') {
		page.render('click.png')
		step = 'open-login'
		page.open(baseURL + '/login')
	} else if (step == 'open-login') {
		console.log(data.email)
		page.render('login.png')
		phantom.exit()
	}
}
