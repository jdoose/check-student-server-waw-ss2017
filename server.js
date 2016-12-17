'use strict';
const _ = require('underscore');

var avatars = require('./data/avatar.json');
var students = require('./data/students.json');
var competences = require('./data/competences.json');
var illustrations = require('./data/illustrations.json');

const webtoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSmVucyBEb29zZSJ9.uSVgj_vIPkX8PGQvAY_v2AfFAzntdT6uhOiuhveFrbw';

var restify = require('restify');
const baseUrl = '/api/V1/';

var server = restify.createServer({
    name: 'WAWWS16'
});
server.use(restify.bodyParser());
server.use(restify.CORS());
server.use(restify.fullResponse());
restify.CORS.ALLOW_HEADERS.push('authorization');
server.use(restify.queryParser());

server.put(baseUrl + 'login', (req, res) => {
    res.json(200, {token: webtoken});
});

server.put(baseUrl + 'passwordRecovery', (req, res) => {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        res.json(401, {message: 'Keine Berechtigung - fehlender Token'});
    } else {
        res.json(200, {message: "Passwort erfolgreich geaendert", token: webtoken});
    }
});

server.del(baseUrl + 'student', (req, res) => {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        res.json(401, {message: 'Keine Berechtigung - fehlender Token'});
    } else {
        res.json(200, {message: "Student wurde erfolgreich geloescht"});
    }
});

server.get(baseUrl + 'student', (req, res) => {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        res.json(401, {message: 'Keine Berechtigung - fehlender Token'});
    } else {
        res.json(200, students[0]);
    }
});

server.get(baseUrl + 'avatar/:avatarId', (req, res) => {
    var aId = req.params.avatarId || 1;

    var authHeader = req.headers.authorization;
    if (!authHeader) {
        res.json(401, {message: 'Keine Berechtigung - fehlender Token'});
    } else {
        var avatar = _.find(avatars, (avatarObj) => {
            if (avatar._id === aId)
                return avatarObj;
        });
        res.json(200, avatar);
    }
});

server.get(baseUrl + 'avatar', (req, res) => {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        res.json(401, {message: 'Keine Berechtigung - fehlender Token'});
    } else {
        res.json(200, avatars);
    }
});

server.get(baseUrl + 'chapterillustrations/:chapterid', (req, res) => {
    var authHeader = req.headers.authorization;

    if (!authHeader) {
        res.json(401, {message: 'Keine Berechtigung - fehlender Token'});
    } else {
        res.json(200, illustrations);
    }
});

server.get(baseUrl + 'studentcompetence', (req, res) => {
    var authHeader = req.headers.authorization;
    var checked = req.params.checked === 'true' ? true : false;
    var chapterId = parseInt(req.params.chapterId) || 1;

    var filteredCompetences = [];

    if (!authHeader) {
        res.json(401, {message: 'Keine Berechtigung - fehlender Token'});
    } else {
        filteredCompetences = competences.filter((competence) => {
            return competence.chapterId === chapterId;
        });

        if (checked) {
            var filteredCompetencesChecked = filteredCompetences.filter((competence) => {
                return competence.checked === true;
            });

            res.json(200, filteredCompetencesChecked);
        } else {
            res.json(200, filteredCompetences);
        }


    }
});


server.get(baseUrl + 'educationalPlan/:educationplanId', (req, res) => {
    var authHeader = req.headers.authorization;
    var educationplanId = parseInt(req.params.educationplanId) || 1;
    var filteredCompetences = [];

    if (!authHeader) {
        res.json(401, {message: 'Keine Berechtigung - fehlender Token'});
    } else {
        filteredCompetences = competences.filter((competence) => {
            return competence.educationplanId === educationplanId;
        });
        res.json(200, filteredCompetences);
    }
});

server.listen(1337, () => {
    console.log(`${server.name} is listening at ${server.url}`);
});
