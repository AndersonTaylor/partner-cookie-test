var express = require('express');
var bodyParser = require('body-parser');
var partners = require('./partner-requests');

var app = express();
app.use(bodyParser());

app.get('/', function(req, res){
  var html = '<form action="/" method="post">' +
				'<br>' +
				'<br>' +
				'Enter username to login: ' +
				'<input type="text" name="userName" />' +
				'<br>' +
				'<button type="submit">Submit</button>' +
			'</form>';
               
  res.send(html);
});

// This route receives the posted form.
// Will populate cookie on requester's client, and redirect to embedded stream.
app.post('/', function(req, res){
	var userName = req.body.userName;
	partners.createUserAuthAndGetCookieUrl(userName, function(err, redirectUrl){
		if(err || !redirectUrl) return res.status(500).send();
		res.redirect(redirectUrl);
	});
});


app.listen(3000);
