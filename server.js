const whois = require('whois-info');
const express = require('express');
var helmet = require('helmet');
const app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

app.use(helmet());

// set the home page route
app.get('/', function(req, res) {

	// ejs render automatically looks in the views folder
	res.render('index');
});

app.get('/domainfinder/domain/:domainURLs', (req, res) => {
  const domainURLs = req.params.domainURLs;

  //fix CORS issues
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'text/plain'
  })

  let tests = domainURLs.split(',');

  Promise
      .all(tests.map(domain => whois.lookup(domain)))
      .then(results => res.send(results))
      .catch(e => next(e))
});

app.listen(port, function() {
	console.log('Our app is running on http://localhost:' + port);
});