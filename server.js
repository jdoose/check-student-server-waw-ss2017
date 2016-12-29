'use strict';
const _ = require('underscore');

var avatars = require('./data/avatar.json');
var students = require('./data/students.json');
var competences = require('./data/competences.json');
var illustrations = require('./data/illustrations.json');
var educationalPlans = require('./data/educationalPlans.json');
var chapters = require('./data/chapters.json');
var educationalPlanHasStudent = require('./data/edicationalPlanHasStudent.json');

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

server.put(baseUrl + 'requestPasswordRecovery', (req, res) => {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        res.json(401, {message: 'Keine Berechtigung - fehlender Token'});
    } else {
        res.json(200, {message: "Passwort erfolgreich geändert", token: webtoken});
    }
});

server.put(baseUrl + 'requestPasswordRecovery/reset', (req, res) => {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        res.json(401, {message: 'Keine Berechtigung - fehlender Token'});
    } else {
        res.json(200, {message: "Passwort erfolgreich zurückgesetzt", token: webtoken});
    }
});

server.del(baseUrl + 'student', (req, res) => {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        res.json(401, {message: 'Keine Berechtigung - fehlender Token'});
    } else {
        res.json(200, {message: "Student wurde erfolgreich gelöscht"});
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
    var aId = parseInt(req.params.avatarId) || 1;

    var authHeader = req.headers.authorization;
    if (!authHeader) {
        res.json(401, {message: 'Keine Berechtigung - fehlender Token'});
    } else {
        var avatar = _.find(avatars, (avatarObj) => {
            if (avatarObj._id === aId)
                return avatarObj;
        });
        res.json(200, avatar);
    }
});

server.put(baseUrl + 'avatar/:avatarId', (req, res) => {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        res.json(401, {message: 'Keine Berechtigung - fehlender Token'});
    } else {
        res.json(200, {"message": "Avatar wurde erfolgreich geändert"});
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

server.get(baseUrl + 'chapter/:chapterId', (req, res) => {
    var authHeader = req.headers.authorization;
    var cId = parseInt(req.params.chapterId) || 1;

    if (!authHeader) {
        res.json(401, {message: 'Keine Berechtigung - fehlender Token'});
    } else {
        var chapter = _.find(chapters, (chapterObj) => {
            if (chapterObj._id === cId)
                return chapterObj;
        });
        res.json(200, chapter);
    }
});

server.get(baseUrl + 'chapter', (req, res) => {
    var authHeader = req.headers.authorization;

    if (!authHeader) {
        res.json(401, {message: 'Keine Berechtigung - fehlender Token'});
    } else {
        res.json(200, chapters);
    }
});

server.get(baseUrl + 'studentcompetence', (req, res) => {
    var authHeader = req.headers.authorization;
    var checked = req.params.checked === 'true' ? true : false;
    var chapterId = parseInt(req.params.chapterId) || 0;

    var filteredCompetences = [];

    if (!authHeader) {
        res.json(401, {message: 'Keine Berechtigung - fehlender Token'});
    } else {
        if (chapterId !== 0) {
          filteredCompetences = competences.filter((competence) => {
              return competence.chapterId === chapterId;
          });
        } else {
          filteredCompetences = competences;
        }
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
        filteredCompetences = educationalPlanHasStudent.filter((educationalPlan) => {
            return educationalPlan.educationalPlanId === educationplanId;
        });
        res.json(200, filteredCompetences);
    }
});

server.get(baseUrl + 'educationalPlan', (req, res) => {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        res.json(401, {message: 'Keine Berechtigung - fehlender Token'});
    } else {

        res.json(200, educationalPlans);
    }
});

server.listen(1337, () => {
    console.log(`${server.name} is listening at ${server.url}`);
});
