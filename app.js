var fs      = require('fs')
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
app.get ('/register',   register)
app.post('/register',   registerMember)
app.get ('/login',      login)
app.post('/login',      loginMember)
app.get ('/logout',     logout)
app.get ('/profile',    profile)
app.get ('/new',        newPost)
app.post('/new',        upload.array('photo', 10), 
                        savePost)
app.get ('/detail/:id', showDetail)
app.get ('/offer/:id',  offer)
app.get ('/offer',      saveOffer)
app.get ('/list',       list)
app.get ('/offer-history/:id', showOfferHistory)
app.get ('/decline/:offer_id', decline)
app.get ('/accept/:offer_id',  accept)
app.get ('/delete/:post_id',   deletePost)
app.post('/save-profile-picture',   upload.single('photo'),
									saveProfilePicture)
app.get ('/show',      show)									
app.listen(2000)

function home(req, res) {
	mongo.connect('mongodb://127.0.0.1/ioffer',
		(e, db) => {
			db.collection('post').find().toArray(
				(e, data) => 
					res.render('index.html', 
						{ data: data, user: tokens[req.token] })
			)
		}
	)
}

function register(req, res) {
	res.render("register.html", { user: null })
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
				}
			)
		}
	)
	
	res.redirect('/')
}

function encrypt(s) {
	return crypto.createHash('sha512').update(s).digest('hex')
}

var tokens = [ ]

function profile(req, res) {
	if (isLoggedIn(req)) {
		var token = req.token
		res.render('profile.html', { user: tokens[token] } )
	} else {
		res.redirect('/login')
	}
}

function login(req, res) {
	res.render('login.html', { user: null })
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
		res.render('new.html', { user: tokens[req.token] })
	} else {
		res.redirect('/login')
	}
}

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
					res.render('detail.html', { 
							post: data[0], 
							user: tokens[req.token]
						}
					)
				}
			)
		}
	)
}

function offer(req, res) {
	if (isLoggedIn(req)) {
		res.render('offer.html', {
				postId: req.params.id,
				user: tokens[req.token]
			}
		)
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

function list(req, res) {
	if (isLoggedIn(req)) {
		var user = tokens[req.token]._id
		mongo.connect('mongodb://127.0.0.1/ioffer',
			(e, db) => {
				db.collection('post')
				.find({user: user})
				.toArray(
					(e, data) => {
						res.render('list.html', {
								data: data,
								user: tokens[req.token]
							}
						)
					}
				)
			}
		)
	} else {
		res.redirect('/login')
	}
}

function showOfferHistory(req, res) {
	if (isLoggedIn(req)) {
		var post = req.params.id
		var user = tokens[req.token]._id
		mongo.connect('mongodb://127.0.0.1/ioffer',
			(e, db) => {
				db.collection('post')
				.findOne({_id: ObjectId(post), user: ObjectId(user)})
				.then(data => {
						if (data == null) {
							res.redirect('/list')
						} else {
							db.collection('offer')
							.find({post_id: post})
							.toArray(
								(e, data) => {
									res.render('offer-history.html', {
											data: data,
											user: tokens[req.token]
										}
									)
								}
							)
						}
					}
				)
			}
		)
	} else {
		res.redirect('/login')
	}
	
}


function decline(req, res) {
	var offer_id = req.params.offer_id
	mongo.connect('mongodb://127.0.0.1/ioffer',
		(e, db) => {
			db.collection('offer').findOne(
				{
					_id: ObjectId(offer_id)
				}
			).then(offer => {
					if (offer == null) {
						res.redirect('/profile')
					} else {
						db.collection('post').findOne(
							{
								_id: ObjectId(offer.post_id)
							}
						).then(post => {
								var owner = '' + post.user
								var current_user = '' + tokens[req.token]._id
								if (owner == current_user) {
									var offer0 = {}
									offer0._id = offer._id
									offer.status = 'declined'
									
									db.collection('offer')
									.update(offer0, offer,
									(e, r) => res.redirect(
										'/offer-history/' + post._id)
									)
								} else {
									res.redirect(
										'/offer-history/' + post._id)
								}
							}
						)
					}
				}
			)
		}
	)
}

function accept(req, res) {
	var offer_id = req.params.offer_id
	mongo.connect('mongodb://127.0.0.1/ioffer',
		(e, db) => {
			db.collection('offer').findOne(
				{
					_id: ObjectId(offer_id)
				}
			).then(offer => {
					if (offer == null) {
						res.redirect('/profile')
					} else {
						db.collection('post').findOne(
							{
								_id: ObjectId(offer.post_id)
							}
						).then(post => {
								var owner = '' + post.user
								var current_user = '' + tokens[req.token]._id
								if (owner == current_user) {
									var offer0 = {}
									offer0._id = offer._id
									offer.status = 'accepted'
									
									db.collection('offer')
									.update(offer0, offer,
									(e, r) => res.redirect(
										'/offer-history/' + post._id)
									)
								} else {
									res.redirect(
										'/offer-history/' + post._id)
								}							}
						)
					}
				}
			)
		}
	)
}

function deletePost(req, res) {
	if (isLoggedIn(req)) {
		var post_id = req.params.post_id
		var user_id = tokens[req.token]._id
		mongo.connect('mongodb://127.0.0.1/ioffer',
			(e, db) => {
				if (e == null) {
					db.collection('post')
					.remove({
						_id:  ObjectId(post_id),
						user: user_id
						},
						(e, r) => res.redirect('/list')
					)
				} else {
					res.redirect('/list')
				}
			}
		)
	} else {
		res.redirect('/login')
	}
	
}

function saveProfilePicture(req, res) {
	if (isLoggedIn(req)) {
		var items = req.file.originalname.split('.')
		var ext   = items[items.length - 1]
		var name  = req.file.filename + '.' + ext
		
		fs.rename(
			'./uploads/' + req.file.filename, 
			'./uploads/' + name, 
			(e, r) => {
				tokens[req.token].photo = name
				mongo.connect('mongodb://127.0.0.1/ioffer',
					(e, db) => {
						var u = {}
						u._id = tokens[req.token]._id
						db.collection('user').update(
							u, tokens[req.token],
							(e, r) => res.redirect('/profile')
						)
					}
				)
			}
		)
		
	} else {
		res.redirect('/login')
	}
}

function show(req, res) {
	res.render('show.html', {user: tokens[req.toke]})
}