var express = require('express');
var app = express();
var urlShortener = require('./modules/url-shortener.js');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var server = app.listen(3000, function(){
    console.log("Server has started on port 3000");
});

app.use(express.static('static'));

var router = require('./router/main')(app, urlShortener);
