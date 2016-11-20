'use strict';

var playersAll = require('./data/playersAll.json');
var playersFav = require('./data/playersFav.json');

var restify = require('restify');

var server = restify.createServer({
	name: 'WAWSS16'
});
server.use(restify.bodyParser());
server.use(restify.CORS());
server.use(restify.queryParser());


server.get('/api/players', (req, res) => {
	var query = req.params.favorites || 'false';

		console.log(req.params);
		if (query === 'true') {
		res.json(200, playersFav);
	} else if (query === 'false') {
		res.json(200, playersAll);
	} else {
		res.json(404, { message: 'FAIL' });
	}
});
server.post('/api/players', (req, res) => {
	if (req.body) {
		return res.json(200, { message: 'success' });
	}

	res.json(404, { message: 'Empty body is not allowed.' });
});

server.listen(1337, () => {
 console.log(`${server.name} is listening at ${server.url}`);
});
