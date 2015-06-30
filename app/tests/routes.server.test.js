'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Part = mongoose.model('Part'),
    Guitar = mongoose.model('Guitar'),
    agent = request.agent(app);

/**
 * Globals
 */
var credentials1, credentials2, user1, guitar1, head, neck, body;

/**
 * Guitar Creator Routes (API) tests
 */
describe('Guitar Creator Routes (API) tests:', function () {
    beforeEach(function (done) {
        // Create user credentials
        credentials1 = {
            username: 'username',
            password: 'password'
        };

        credentials2 = {
            username: 'Benutzername',
            password: 'Kennwort'
        };

        // Create a new user
        user1 = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'DisplayName',
            email: 'test@test.com',
            username: credentials1.username,
            password: credentials1.password,
            provider: 'local'
        });

        // Create one of each type of part
        head = new Part({
            brand: 'Head Brand',
            range: 'Head Range',
            type: 'head'
        });
        neck = new Part({
            brand: 'Neck Brand',
            range: 'Neck Range',
            type: 'neck'
        });
        body = new Part({
            brand: 'Head Brand',
            range: 'Head Range',
            type: 'body'
        });

        // Create a new guitar
        guitar1 = new Guitar({
            name: 'Guitar 1'
        });

        // Save items to database and store their references in the new guitar
        head.save(function () {
            guitar1.head = head._id;
        });
        neck.save(function () {
            guitar1._id.neck = neck._id;
        });
        body.save(function () {
            guitar1.body = body._id;
        });

        // Save a user to the test db and store it's reference in the new guitar
        user1.save(function () {
            guitar1.creator = user1._id;
            done();
        });
    });

    describe('Guitar routes:', function () {
        var user2, guitar2, guitar3, guitar4;
        beforeEach(function (done) {
            // Create new guitars to test the Guitar routes with
            guitar1.save();

            guitar2 = new Guitar({
                name: 'Guitar 2',
                head: head._id,
                neck: neck._id,
                body: body._id,
                creator: user1._id
            });

            guitar2.save();

            user2 = new User({
                firstName: 'Firstname',
                lastName: 'Surname',
                displayName: 'UserName',
                email: 'foo@bar.com',
                username: credentials2.username,
                password: credentials2.password,
                provider: 'local'
            });

            guitar3 = new Guitar({
                name: 'Guitar 3',
                head: head._id,
                neck: neck._id,
                body: body._id
            });

            user2.save(function () {
                guitar3.creator = user2._id;
                guitar3.save(done);
            });

            guitar4 = {
                name: 'Guitar 4',
                head: head._id,
                neck: neck._id,
                body: body._id,
                creator: user1._id
            };
        });

        it('should get all the guitars', function (done) {
            agent.get('/guitars')
                .send()
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        (res.body.length).should.be.exactly(3);
                        (res.body[0].name).should.be.exactly('Guitar 1');
                        (res.body[0]._id).should.be.exactly(guitar1._id.toString());
                        done();
                    }
                });
        });

        it('should save a guitar without errors when logged in', function (done) {
            agent.post('/auth/signin')
                .send(credentials1)
                .expect(200)
                .end(function (err) {
                    if (err) {
                        done(err);
                    } else {
                        agent.post('/guitars')
                            .send(guitar4)
                            .expect(200)
                            .end(function (err, res) {
                                if (err) {
                                    done(err);
                                } else {
                                    (res.body.name).should.be.exactly('Guitar 4');
                                    (res.body.head).should.be.exactly(head._id.toString());
                                    (res.body.neck).should.be.exactly(neck._id.toString());
                                    (res.body.body).should.be.exactly(body._id.toString());
                                    (res.body.creator).should.be.exactly(user1._id.toString());
                                    done();
                                }
                            });
                    }
                });
        });

        it('should throw an error when trying to save an existing guitar', function (done) {
            agent.post('/auth/signin')
                .send(credentials1)
                .expect(200)
                .end(function (err) {
                    if (err) {
                        done(err);
                    }

                    agent.post('/guitars')
                        .send(guitar3)
                        .expect(400)
                        .end(function (err, res) {
                            if (err) {
                                done(err);
                            } else {
                                (res.body.message).should.match(/(already exists)/i);
                                done();
                            }
                        });
                });
        });

        it('should throw an error when trying to save a guitar without being logged in',
            function (done) {
                agent.post('/guitars')
                    .send(guitar4)
                    .expect(401)
                    .end(function (err) {
                        done(err);
                    });
            });

        it('should get a specific guitar', function (done) {
            agent.get('/guitars/' + guitar2._id)
                .send()
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        (res.body._id).should.be.exactly(guitar2._id.toString());
                        (res.body.name).should.be.exactly('Guitar 2');
                        done();
                    }
                });
        });

        it('should update a specific guitar without problems', function (done) {
            agent.post('/auth/signin')
                .send(credentials1)
                .expect(200)
                .end(function (err) {
                    if (err) {
                        done(err);
                    } else {
                        agent.put('/guitars/' + guitar2._id)
                            .send(guitar2)
                            .expect(200)
                            .end(function (err, res) {
                                if (err) {
                                    done(err);
                                } else {
                                    (res.body._id).should.be.exactly(guitar2._id.toString());
                                    (res.body.name).should.be.exactly('Guitar 2');
                                    done();
                                }
                            });
                    }
                });
        });

        it('should throw an error when trying to update a guitar without being logged in',
            function (done) {
                agent.put('/guitars/' + guitar2._id)
                    .send(guitar2)
                    .expect(401)
                    .end(function (err) {
                        done(err);
                    });
            });

        it('should get all guitars from a specific creator', function (done) {
            agent.post('/auth/signin')
                .send(credentials1)
                .expect(200)
                .end(function (err) {
                    if (err) {
                        done(err);
                    } else {
                        agent.get('/guitars/creator/' + user1._id)
                            .send()
                            .expect(200)
                            .end(function (err, res) {
                                if (err) {
                                    done(err);
                                } else {
                                    (res.body.length).should.be.exactly(2);
                                    (res.body[0].name).should.be.exactly('Guitar 1');
                                    (res.body[0]._id).should.be.exactly(guitar1._id.toString());
                                    done();
                                }
                            });
                    }
                });
        });
    });

    afterEach(function (done) {
        User.remove().exec();
        Part.remove().exec();
        Guitar.remove().exec();
        done();
    });
});
