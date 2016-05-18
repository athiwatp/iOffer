var crypto  = require('crypto')
var express = require('express')
var app     = express()
var parser  = require('body-parser')
var mongo   = require('mongodb').MongoClient
var ObjectId= require('mongodb').ObjectID
var uuid    = require('node-uuid')
var ejs     = require('ejs')
var multer  = require('multer')
var upload  = multer({dest:'./uploads/'})

app.use(express.static('public'))
app.use(express.static('uploads'))
app.use(parser.urlencoded({extended:false}))
app.use(ExtractToken)

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
app.get ('/new', newPost)
app.post('/new', upload.array('photo', 10), savePost)
app.get ('/detail/:id', showDetail)
app.get ('/offer/:id',  offer)
app.get ('/offer',      saveOffer)
app.listen(2000)

function home(req, res) {
	mongo.connect('mongodb://127.0.0.1/ioffer',
		(e, db) => {
			if (e == null) {
				db.collection('post').find().toArray(
					(e, data) => 
						res.render('index.html', {data: data})
				)
			} else {
				res.render('index.html', {data:[]})
			}
		}
	)
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
		var token = req.token
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
	var token = req.token
	delete tokens[token]
	res.redirect('/')
}

function isLoggedIn(req) {
	var token = req.token
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
		res.redirect('/login')
	}
}

var fs = require('fs')

function savePost(req, res) {
	if (isLoggedIn(req)) {
		var name = req.body.name || ''
		var description = req.body.description || ''
		var phone = req.body.phone || ''
		var time = getTime()
		var id = tokens[req.token]._id
		var photos = []
		for (var i = 0; i < req.files.length; i++) {
			var names = req.files[i].originalname.split('.')
			var newName = req.files[i].filename + '.' +
				names[names.length - 1]
			fs.rename(
				'./uploads/' + req.files[i].filename,
				'./uploads/' + newName, 
				() => {})
			photos.push(newName)
		}
		
		mongo.connect('mongodb://127.0.0.1/ioffer',
			(e, db) => {
				db.collection('post').insert({
					name: name,
					description: description,
					phone: phone,
					time: time,
					user: id,
					photos: photos
				})
			}
		)
		res.redirect('/profile')
	} else {
		res.redirect('/login')
	}
}

// return ISO 8601 time format 2016-05-16T07:57:23+00:00
function getTime() {
	var t = new Date()
	var m = t.getUTCMonth() + 1
	if (m < 10) m = '0' + m
	var h = t.getUTCHours()
	if (h < 10) h = '0' + h
	var n = t.getUTCMinutes()
	if (n < 10) n = '0' + n
	var s = t.getUTCSeconds()
	if (s < 10) s = '0' + s
	return t.getUTCFullYear() + '-' +
		m + '-' +
		t.getUTCDate() + 'T' +
		h + ':' + n + ':' + s + '+00:00'
}

function ExtractToken(req, res, next) {
	var token = ''
	var cookie = req.headers.cookie || ''
	var items = cookie.split(';')
	for (var i = 0; i < items.length; i++) {
		var fields = items[i].split('=')
		if (fields[0] == 'token') {
			token = fields[1]
		}
	}
	req.token = token
	next()
}

function showDetail(req, res) {
	mongo.connect('mongodb://127.0.0.1/ioffer',
		(e, db) => {
			db.collection('post')
			.find({_id: ObjectId(req.params.id)})
			.toArray(
				(e, data) => {
					console.log(data[0])
					res.render('detail.html', 
						{post: data[0]})
				}
			)
		}
	)
}

function offer(req, res) {
	if (isLoggedIn(req)) {
		res.render('offer.html',
			{postId: req.params.id})
	} else {
		res.redirect('/login')
	}
}

function saveOffer(req, res) {
	if (isLoggedIn(req)) {
	
		var post_id = req.query.post_id
		var price   = req.query.price
		var user_id = tokens[req.token]._id
		var time    = getTime()
		var status  = 'offered'
		mongo.connect('mongodb://127.0.0.1/ioffer',
			(e, db) => {
				db.collection('offer').insert(
					{
						post_id: post_id,
						user_id: user_id,
						price:   price,
						time:    time,
						status:  status
					}
				)
			}
		)
		res.redirect('/detail/' + post_id)
	} else {
		res.redirect('/login')
	}
}


//