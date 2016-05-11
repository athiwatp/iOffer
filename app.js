var express = require('express')
var app     = express()
var parser  = require('body-parser')

app.use(express.static('public'))
app.use(parser.urlencoded())

app.set('view engine', 'ejs')
app.get("/", home)
app.get ("/register", register)
app.post("/register", registerMember)
app.get('/list', list)
app.listen(2000)

function home(req, res) {
	res.render("index")
}

function register(req, res) {
	res.render("register")
}

function registerMember(req, res) {
	console.log(req.body)
	res.render("index")
}

function list(req, res) {
	res.send(coffees)
}

var coffees = [
  {name:'Latte',      price:80},
  {name:'Americano',  price:70},
  {name:'Cappuccino', price:90},
  {name:'Espresso',   price:60}
]
