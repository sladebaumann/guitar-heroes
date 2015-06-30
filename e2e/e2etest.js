var fs = require('fs'),
    config = require('../config/config'),
    mongoose = require('mongoose'),
    db = mongoose.connect(config.db, function (err) {
        if (err) {
            console.error(chalk.red('Could not connect to MongoDB!'));
            console.log(chalk.red(err));
        }
    });

require('../app/models/user.server.model');
require('../app/models/part.server.model');

var User = mongoose.model('User'),
    Part = mongoose.model('Part'),
    username = 'username',
    password = 'password',
    head1, head2;

describe('End to end tests:', function () {
    // Create a new user
    beforeEach(function (done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: username,
            password: password,
            provider: 'local'
        });

        // Create one of each type of part
        head1 = new Part({
            brand: 'Head Brand',
            range: 'Head Range',
            type: 'head'
        });
        head2 = new Part({
            brand: 'Other Head Brand',
            range: 'Head Range',
            type: 'head'
        });

        user.save();
        head1.save();
        head2.save(done);
    });

    afterEach(function (done) {
        User.remove().exec(done);
        Part.remove().exec(done);
    });

    describe('Tests involving the guitar creator:', function () {
        it('should filter parts by brand', function () {
            // Navigate to Guitar Creator
            browser.get('/#!/creator');

            // Expect there to be two head parts
            $$('#heads .list-group-item').then(function (headsList) {
                expect(headsList.length).toBe(2);
            });

            // Click on the brand filter button
            var brandsButton = element(by.cssContainingText('.btn', 'Brand'));
            brandsButton.click().then(function () {

                // Expect the first element to be 'Head Brand'
                var filterElement = $$('#brandDropDown a').first();
                expect(filterElement.getText()).toMatch(/Head Brand/);

                // Click 'Head Brand'
                filterElement.click().then(function () {

                    // Expect the head parts still visible in the side bar to be 1
                    var visibleHeads = $$('#heads .list-group-item:not(.ng-hide)').count();
                    expect(visibleHeads).toBe(1);
                });
            });
        });
    });

    describe('Functionality tests:', function () {
        it('should verify return to the previous page after login', function () {
            // Go to about page
            browser.get('/#!/about');

            // Expect sign in href to be updated
            var signInButton = element(by.id('signin'));
            expect(signInButton.$('a').getAttribute('href')).toEqual(browser.baseUrl +
                                                                     '/#!/signin/about');

            // Click login button
            signInButton.click().then(function () {
                var usernameField = element(by.id('username')),
                    passwordField = element(by.id('password')),
                    signInButton = element(by.cssContainingText('.btn', 'Sign in')),
                    currentUrl = browser.getCurrentUrl();

                // Expect current url to include 'signin/about'
                expect(currentUrl).toMatch(/(signin\/about)/);

                // Fill out user credentials
                usernameField.sendKeys(username);
                passwordField.sendKeys(password);

                // Click 'Sign in'
                signInButton.click().then(function () {
                    var currentUrl = browser.getCurrentUrl();

                    expect(currentUrl).toEqual(browser.baseUrl + '/#!/about');
                });
            });
        });
    });
});
