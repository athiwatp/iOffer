var baseURL   = require('system').args[1]
var page      = require('webpage').create()

var step      = 'open-login'
page.onLoadFinished = verify
page.open(baseURL + '/loging')

function verify(status) {
	
}