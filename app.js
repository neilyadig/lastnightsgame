// Declare Requirements
var express = require("express");
var path = require('path');
var expressHbs = require('express3-handlebars');

//Create the app
var app = express();

//Enable Handlebars
app.engine('handlebars', expressHbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

app.use('/public', express.static('public'));

//ROUTES
app.get("/", function(request, response){
	response.render('index');
});

app.get("/about", function(request, response){
	response.render('about');
});

// Start the server
app.listen(process.env.PORT || 3000);
console.log('Express started on port 3000');
