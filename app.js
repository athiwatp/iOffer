var crypto  = require('crypto')
var express = require('express')
var app     = express()
var parser  = require('body-parser')
var mongo   = require('mongodb').MongoClient
var uuid    = require('node-uuid')
var ejs     = require('ejs')

app.use(express.static('public'))
app.use(parser.urlencoded({extended:false}))

// app.set('view engine', 'ejs')
app.engine('html', ejs.renderFile)
app.get ('/', home)
app.get ('/register', register)
app.post('/register', registerMember)
app.get ('/login', login)
app.post('/login', loginMember)
app.get ('/logout', logout)
app.get ('/list-user', listUser)
app.get ('/show-user', showUser)
app.get ('/profile', profile)
app.get('/new', newPost)
app.listen(2000)

function home(req, res) {
	res.render("index.html")
}

function register(req, res) {
	res.render("register.html")
}

function registerMember(req, res) {
	var user = {}
	user.first_name = req.body['first-name']
	user.last_name  = req.body['last-name']
	user.email      = req.body.email
	user.password   = encrypt(req.body.password)
	
	mongo.connect("mongodb://127.0.0.1/ioffer",
		(e, db) => {
			db.collection("user").find({email: user.email})
			.toArray( (e, data) => {
				if (data.length > 0) {
					console.log("Duplicated Email")
				} else {
					db.collection("user").insert(user)
				}
			})
		})
	
	res.redirect('/')
}

function encrypt(s) {
	return crypto.createHash('sha512').update(s).digest('hex')
}

function listUser(req, res) {
	if (req.query.code == '7736518F427') {
		mongo.connect("mongodb://127.0.0.1/ioffer",
			(e, db) => {
				db.collection("user").find().toArray(
					(e, data) => {
						res.send(data)
					}
				)
			}
		)
	} else {
		res.send( [] )
	}
}

function showUser(req, res) {
	if (req.query.code == '7736518F427') {
		mongo.connect('mongodb://127.0.0.1/ioffer',
			(e, db) => {
				db.collection("user").find().toArray(
					(e, data) => {
						res.render('show-user.html', {user: data})
					}
				)
			}	
		)
	} else {
		res.render('show-user.html', {user: [] })
	}
}

var tokens = [ ]

function profile(req, res) {
	if (isLoggedIn(req)) {
		var token = ''
		var cookie = req.headers['cookie']
		var items = cookie.split(';')
		for (var i = 0; i < items.length; i++) {
			var fields = items[i].split('=')
			if (fields[0] == 'token') {
				token = fields[1]
			}
		}		
		res.render('profile.html', {user:tokens[token]})
	} else {
		res.redirect('/login')
	}
}

function login(req, res) {
	res.render('login.html')
}

function loginMember(req, res) {
	var email = req.body.email
	var password = encrypt(req.body.password)
	mongo.connect("mongodb://127.0.0.1/ioffer",
		(e, db) => {
			db.collection("user")
			.find({email:email, password:password}).toArray(
				(e, data) => {
					if (data.length == 1) {
						var token = uuid.v4()
						tokens[token] = data[0]
						res.set('Set-Cookie', 'token=' + token)
						res.redirect('/profile')
					} else {
						res.redirect('/login?error=Invalid Email or Password')
					}
				}
			)
		}
	)
}

function logout(req, res) {
	var token = ''
	var cookie = req.headers['cookie']
	var items = cookie.split(';')
	for (var i = 0; i < items.length; i++) {
		var fields = items[i].split('=')
		if (fields[0] == 'token') {
			token = fields[1]
		}
	}
	delete tokens[token]
	res.redirect('/')
}

function isLoggedIn(req) {
	var token = ''
	var cookie = req.headers.cookie || ''
	var items = cookie.split(';')
	for (var i = 0; i < items.length; i++) {
		var fields = items[i].split('=')
		if (fields[0] == 'token') {
			token = fields[1]
		}
	}
	if (tokens[token] == null) {
		return false
	} else {
		return true
	}
}

function newPost(req, res) {
	if (isLoggedIn(req)) {
		res.render('new.html')
	} else {
		res.redirect("/login")
	}
}
