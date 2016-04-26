'use strict';

var playersAll = require('./data/playersAll.json');
var playersFav = require('./data/playersFav.json');

var restify = require('restify');
restify.CORS.ALLOW_HEADERS.push('authorization');
// Require the cors middleware for restify
var corsMiddleware = require('restify-cors-middleware');

// Require swagger to build an API documentation
var swagger = require('swagger-restify');

// Require node.js' path module
var path = require('path');
var server = restify.createServer();
server.use(restify.bodyParser());
server.use(restify.CORS());
server.use(restify.queryParser());


server.get('/api/players', function(req, res, next){
	var query = req.params.favorites || 'false';

	if(query === 'true'){
		res.send(200, playersFav);
	} else if(query === 'false'){
		res.send(200, playersAll);
	} else {
		res.send(404, JSON.stringify({message: 'FAIL'}));
	}
	res.send(query);
});
server.post('/api/players', function(req, res, next){
	if(req.is('application/json')){
			res.send(200, JSON.stringify({message: 'sucess'}));
	} else {
			res.send(404, JSON.stringify({message: 'FAIL'}));
	}
});

server.listen(13337, function() {
  console.log('%s listening at %s', server.name, server.url);
});
