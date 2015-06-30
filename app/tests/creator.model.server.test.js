'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Part = mongoose.model('Part'),
    Guitar = mongoose.model('Guitar');

/**
 * Globals
 */
var user, head, neck, body, guitar;

/**
 * Unit tests
 */
describe('Guitar Creator model tests:', function () {
    beforeEach(function (done) {
        // Create a new user
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password'
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

        done();
    });

    describe('Part Model unit tests:', function () {
        describe('Method save', function () {
            it('should to save without problems', function (done) {
                return head.save(function (err) {
                    should.not.exist(err);
                    done();
                });
            });

            it('should show an error when trying to save without a brand', function (done) {
                head.brand = '';

                return head.save(function (err) {
                    should.exist(err);
                    done();
                });
            });

            it('should show an error when trying to save without a range', function (done) {
                head.range = '';

                return head.save(function (err) {
                    should.exist(err);
                    done();
                });
            });

            it('should show an error when trying to save without a type', function (done) {
                head.type = '';

                return head.save(function (err) {
                    should.exist(err);
                    done();
                });
            });

            it('should show an error when trying to save with an incorrect type', function (done) {
                head.type = 'fsjal';

                return head.save(function (err) {
                    should.exist(err);
                    done();
                });
            });
        });
    });

    describe('Guitar Model unit tests:', function () {
        beforeEach(function (done) {
            // Create a new guitar
            guitar = new Guitar({
                name: 'Guitar Name'
            });

            // Save items to database and store their references in the new guitar
            head.save(function() {
                guitar.head = head._id;
            });
            neck.save(function() {
                guitar.neck = neck._id;
            });
            body.save(function() {
                guitar.body = body._id;
            });
            user.save(function () {
                guitar.creator = user._id;
            });

            done();
        });

        describe('Method Save', function () {
            it('should to save without problems', function (done) {
                return guitar.save(function (err) {
                    should.not.exist(err);
                    done();
                });
            });

            it('should show an error when trying to save without a name', function (done) {
                guitar.name = '';

                return guitar.save(function (err) {
                    should.exist(err);
                    done();
                });
            });

            it('should show an error when trying to save without a creator', function (done) {
                guitar.creator = '';

                return guitar.save(function (err) {
                    should.exist(err);
                    done();
                });
            });
        });

        afterEach(function (done) {
            Guitar.remove().exec();
            Part.remove().exec();
            User.remove().exec();
            done();
        });
    });
});
