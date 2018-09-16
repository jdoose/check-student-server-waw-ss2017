'use strict';
const _ = require('underscore');

var avatars = require('./data/avatar.json');
var students = require('./data/students.json');
var competences = require('./data/competences.json');
var illustrations = require('./data/illustrations.json');
var educationalPlans = require('./data/educationalPlans.json');
var chapters = require('./data/chapters.json');
var educationalPlanHasStudent = require('./data/edicationalPlanHasStudent.json');
var passwords = require('./data/password.json');

const webtoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSmVucyBEb29zZSJ9.uSVgj_vIPkX8PGQvAY_v2AfFAzntdT6uhOiuhveFrbw';

var restify = require('restify');
const baseUrlOld = '/api/V1/';
const baseUrlNew = '/student-api/V1/';

function createServer(port) {
    function createRoutes(server, baseUrl) {
        server.put(baseUrl + 'login', (req, res) => {
            if (req.body && req.body.username) {
                var username = req.body.username;
                var user = _.find(passwords, (userObj) => {
                    if (userObj.username === username)
                        return userObj;
                });

                res.json(200, {
                    token: user.token,
                    sessionToken: user.token // emulating new version
                });
            } else {
                console.log('401');
                res.json(401, {message: "Unauthorized"});
            }
        });

        function checkToken (authHeader) {
            return _.find(passwords, (userObj) => {
                if (userObj.token === authHeader)
                    return userObj;
            });
        }

        server.put(baseUrl + 'requestPasswordRecovery', (req, res) => {
            var isCorrectToken = checkToken(req.headers.authorization);
            if (!isCorrectToken) {
                console.log('no or wrong token!');
                res.json(401, {message: 'Keine Berechtigung - fehlender/ falscher Token'});
            } else {
                res.json(200, {message: "Passwort erfolgreich geändert", token: req.headers.authorization});
            }
        });

        server.put(baseUrl + 'requestPasswordRecovery/reset', (req, res) => {
            var isCorrectToken = checkToken(req.headers.authorization);
            if (!isCorrectToken) {
                console.log('no or wrong token!');
                res.json(401, {message: 'Keine Berechtigung - fehlender/ falscher Token'});
            } else {
                res.json(200, {message: "Passwort erfolgreich zurückgesetzt", token: webtoken});
            }
        });

        server.del(baseUrl + 'student', (req, res) => {
            var isCorrectToken = checkToken(req.headers.authorization);
            if (!isCorrectToken) {
                console.log('no or wrong token!');
                res.json(401, {message: 'Keine Berechtigung - fehlender/ falscher Token'});
            } else {
                res.json(200, {message: "Student wurde erfolgreich gelöscht"});
            }
        });

        server.get(baseUrl + 'student', (req, res) => {
            var isCorrectToken = checkToken(req.headers.authorization);
            if (!isCorrectToken) {
                console.log('no or wrong token!');
                res.json(401, {message: 'Keine Berechtigung - fehlender/ falscher Token'});
            } else {
                var studentId = isCorrectToken.studentId;
                var student = _.find(students, (studentObj) => {
                    if (studentObj._id === studentId)
                        return studentObj;
                });

                res.json(200, student);
            }
        });

        server.get(baseUrl + 'avatar/:avatarId', (req, res) => {
            var aId = parseInt(req.params.avatarId) || 1;

            var isCorrectToken = checkToken(req.headers.authorization);
            if (!isCorrectToken) {
                console.log('no or wrong token!');
                res.json(401, {message: 'Keine Berechtigung - fehlender/ falscher Token'});
            } else {
                var avatar = _.find(avatars, (avatarObj) => {
                    if (avatarObj._id === aId)
                        return avatarObj;
                });
                res.json(200, avatar);
            }
        });

        server.put(baseUrl + 'avatar/:avatarId', (req, res) => {
            var isCorrectToken = checkToken(req.headers.authorization);
            if (!isCorrectToken) {
                console.log('no or wrong token!');
                res.json(401, {message: 'Keine Berechtigung - fehlender/ falscher Token'});
            } else {
                res.json(200, {"message": "Avatar wurde erfolgreich geändert"});
            }
        });

        server.put(baseUrl + 'student/avatar/:avatarId', (req, res) => {
            var isCorrectToken = checkToken(req.headers.authorization);
            if (!isCorrectToken) {
                console.log('no or wrong token!');
                res.json(401, {message: 'Keine Berechtigung - fehlender/ falscher Token'});
            } else {
                res.json(200, {"message": "Avatar wurde erfolgreich geändert"});
            }
        });

        server.get(baseUrl + 'avatar', (req, res) => {
            var isCorrectToken = checkToken(req.headers.authorization);
            if (!isCorrectToken) {
                console.log('no or wrong token!');
                res.json(401, {message: 'Keine Berechtigung - fehlender/ falscher Token'});
            } else {
                res.json(200, avatars);
            }
        });

        server.get(baseUrl + 'chapterillustrations/:chapterid', (req, res) => {
            var isCorrectToken = checkToken(req.headers.authorization);
            if (!isCorrectToken) {
                console.log('no or wrong token!');
                res.json(401, {message: 'Keine Berechtigung - fehlender/ falscher Token'});
            } else {
                res.json(200, illustrations);
            }
        });

        server.get(baseUrl + 'chapter/:chapterId', (req, res) => {
            var cId = parseInt(req.params.chapterId) || 1;
            var isCorrectToken = checkToken(req.headers.authorization);
            if (!isCorrectToken) {
                console.log('no or wrong token!');
                res.json(401, {message: 'Keine Berechtigung - fehlender/ falscher Token'});
            } else {
                var chapter = _.find(chapters, (chapterObj) => {
                    if (chapterObj._id === cId)
                        return chapterObj;
                });
                res.json(200, chapter);
            }
        });

        server.get(baseUrl + 'chapter', (req, res) => {
            var isCorrectToken = checkToken(req.headers.authorization);
            if (!isCorrectToken) {
                console.log('no or wrong token!');
                res.json(401, {message: 'Keine Berechtigung - fehlender/ falscher Token'});
            } else {
                res.json(200, chapters);
            }
        });

        server.get(baseUrl + 'studentcompetence', (req, res) => {
            var checked = req.params.checked === 'true' ? true : false;
            var chapterId = parseInt(req.params.chapterId) || 0;

            var filteredCompetences = [];

            var isCorrectToken = checkToken(req.headers.authorization);
            if (!isCorrectToken) {
                console.log('no or wrong token!');
                res.json(401, {message: 'Keine Berechtigung - fehlender/ falscher Token'});
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

        server.get(baseUrl + 'student/studentcompetence', (req, res) => {
            var checked = req.params.checked === 'true' ? true : false;
            var chapterId = parseInt(req.params.chapterId) || 0;

            var filteredCompetences = [];

            var isCorrectToken = checkToken(req.headers.authorization);
            if (!isCorrectToken) {
                console.log('no or wrong token!');
                res.json(401, {message: 'Keine Berechtigung - fehlender/ falscher Token'});
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
            var educationplanId = parseInt(req.params.educationplanId) || 1;
            var filteredCompetences = [];

            var isCorrectToken = checkToken(req.headers.authorization);
            if (!isCorrectToken) {
                console.log('no or wrong token!');
                res.json(401, {message: 'Keine Berechtigung - fehlender/ falscher Token'});
            } else {
                filteredCompetences = educationalPlanHasStudent.filter((educationalPlan) => {
                    return educationalPlan.educationalPlanId === educationplanId;
                });
                res.json(200, filteredCompetences);
            }
        });

        server.get(baseUrl + 'student/educationalPlan/:educationplanId', (req, res) => {
            var educationplanId = parseInt(req.params.educationplanId) || 1;
            var filteredCompetences = [];

            var isCorrectToken = checkToken(req.headers.authorization);
            if (!isCorrectToken) {
                console.log('no or wrong token!');
                res.json(401, {message: 'Keine Berechtigung - fehlender/ falscher Token'});
            } else {
                filteredCompetences = educationalPlanHasStudent.filter((educationalPlan) => {
                    return educationalPlan.educationalPlanId === educationplanId;
            });
                res.json(200, filteredCompetences);
            }
        });

        server.get(baseUrl + 'educationalPlan', (req, res) => {
            var isCorrectToken = checkToken(req.headers.authorization);
            if (!isCorrectToken) {
                console.log('no or wrong token!');
                res.json(401, {message: 'Keine Berechtigung - fehlender/ falscher Token'});
            } else {

                res.json(200, educationalPlans);
            }
        });

        server.get(baseUrl + 'student/educationalPlan', (req, res) => {
            var isCorrectToken = checkToken(req.headers.authorization);
            if (!isCorrectToken) {
                console.log('no or wrong token!');
                res.json(401, {message: 'Keine Berechtigung - fehlender/ falscher Token'});
            } else {

                res.json(200, educationalPlans);
            }
        });
    }

    var server = restify.createServer({
        name: 'WAWWS16' + port
    });
    server.use(restify.bodyParser());
    server.use(restify.CORS());
    server.use(restify.fullResponse());
    restify.CORS.ALLOW_HEADERS.push('authorization');
    server.use(restify.queryParser());

    createRoutes(server, baseUrlOld);
    createRoutes(server, baseUrlNew);

    server.listen(port, () => {
        console.log(`${server.name} is listening at ${server.url} with baseUrls ${baseUrlOld} and ${baseUrlNew}`);
    });

    return server;
}


var server3000 = createServer(3000);
var server1337 = createServer(1337);
