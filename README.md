#Guitar heroes app
##Introduction
This readme will explain how to install and deploy the code included in this repository.
When set up, it will be a proof-of-concept application of the "design your own guitar" concept.
Below, the general installation, testing setup and other miscellaneous information will be discussed.
.

##Installation instructions
### General installation
1. Pull or unzip the code to an empty directory.
2. cd into the root of this directory.
3. Run npm install to install all the dependencies the app requires.
4. Run npm install -g grunt-cli to get some required grunt functionality, if you haven't done this for a previous project already.
5. Run grunt to run the default grunt task, which in this case is running the server.
6. Go to localhost with the port provided and use the application as you wish.
##Testing

### Protractor setup

In order to get the e2e tests running need to install Protractor globally:

	npm install -g protractor

This will install two command line tools, `protractor` and `webdriver-manager`. Try running `protractor --version` to make sure it`s working. Then we need the webdriver to run protractor. Run the following command to install it:

UNIX systems:

	./node_modules/protractor/bin/webdriver-manager update

Windows:

	node node_modules/protractor/bin/webdriver-manager update


###End to end testing with Protractor
In order to run the E2E Protractor tests seperate from the rest of the unit tests you will need to run `server.js` with the `NODE_ENV` set to `test` and execute `webdriver-manager start`.
Once the server is up in the `test` environment and the webdriver is running, execute the `grunt e2e` task.
$ grunt e2e

###Other tests
To run all other tests, please run the "test" task in Grunt.
$ grunt test