var express = require('express')
var app     = express()
app.get("/", home)
app.listen(2000)

function home(req, res) {
  res.send("<i>Welcome to iOffer</i>")
}
