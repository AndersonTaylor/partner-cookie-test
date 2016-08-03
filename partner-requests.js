var request = require('request');
var Requests = module.exports = {};

var config = {
	apiHostname: 'https://partners.stream.me',
	clientSlug: 'clientSlug',  // TODO Fill in!
	clientId: 'clientId',   // TODO Fill in!
	clientSecret: 'clientSecret',  // TODO Fill in!
}

var redirectUrl = 'https://stream.me/YourChannelOrEmbed' // TODO Fill in!

Requests.createUser = function(username, cb){
	var url = config.apiHostname + '/api/v1/' + config.clientSlug + '/users';
	request({
		method: 'POST',
		url: url,
		json: {
			username: username
		},
		timeout: 5000,
		auth: {
			user: config.clientId,
			pass: config.clientSecret
		}
	}, function (err, resp, body) {
		if (err) {
			console.log('create-user-failed', err);
			return cb(err);
		}
		// 409 status means user already created
		if (resp.statusCode >= 400 && resp.statusCode != 409) {
			console.log('create-user-failed:statusCode', resp.statusCode);
			return cb();
		}
		return cb(null, body);
	});
}


Requests.authCookieUrl = function (username, cb){
	request({
		method: 'POST',
		url: config.apiHostname + '/api/v1/' + config.clientSlug + '/users/' + username + '/login-token',
		json: {
			redirectUrl: redirectUrl
		},
		timeout: 5000,
		auth: {
			user: config.clientId,
			pass: config.clientSecret
		}
	}, function (err, resp, body) {
		if (err) {
			console.log('auth-cookie-failed', err);
			return cb(err);
		}
		if (resp.statusCode >= 400) {
			console.log('auth-cookie-failed:statusCode', resp.statusCode);
			return cb();
		}
		return cb(null, body.redirectUrl);
	});
}

Requests.createUserAuthAndGetCookieUrl = function(username, cb){
	Requests.createUser(username, function(err, result){
		if(err) return cb(err);
		Requests.authCookieUrl(username, cb);
	});
}
