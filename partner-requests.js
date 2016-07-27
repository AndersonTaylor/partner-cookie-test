var request = require('request');
var Requests = module.exports = {};

var config = {
	apiHostname: 'https://partners-ids3.dev.caster.tv',
	clientSlug: 'discord-dev',
	clientId: 'clientId',          // TODO Fill in!
	clientSecret: 'clientSecret',  // TODO Fill in!
}

var redirectUrl = 'https://ids3.dev.caster.tv/stream-embed/starcitizen/app/web/fullframe'

Requests.createUser = function(username, cb){
	var url = config.apiHostname + '/api/v1/' + config.clientSlug + '/users';
	request({
		method: 'POST',
		url: url,
		json: {
			username: username
		},
		timeout: 1000,
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
		timeout: 1000,
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
