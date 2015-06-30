exports.config = {
    /**
     * Use `seleniumAddress` for faster startup; run `./node_modules/.bin/webdriver-manager start` to launch the Selenium server.
     * Use `seleniumPort` to let Protractor manage its own Selenium server instance (using the server JAR in its default location).
     */
    seleniumAddress: 'http://localhost:4444/wd/hub',

    'baseUrl': 'http://localhost:3001',

    /**
     * Path to your E2E test files, relative to the location of this configuration file.
     * We're pointing to the directory where our CoffeeScript output goes.
     */
    specs: [
        'e2e/*.js'
    ],

    /**
     * Properties passed to Selenium -- see https://code.google.com/p/selenium/wiki/DesiredCapabilities for more info.
     */
    capabilities: {
        'browserName': 'chrome'
    },

    onPrepare: function () {
        // Add Jasmine spec reporter
        var SpecReporter = require('jasmine-spec-reporter');
        jasmine.getEnv().addReporter(new SpecReporter(
            {
                displayStacktrace: 'none',    // display stacktrace for each failed assertion, values: (all|specs|summary|none)
                displayFailuresSummary: false, // display summary of all failures after execution
                displaySuccessfulSpec: true,  // display each successful spec
                displayFailedSpec: true,      // display each failed spec
                displayPendingSpec: true,    // display each pending spec
                displaySpecDuration: true,   // display each spec duration
                colors: {
                    success: 'green',
                    failure: 'red',
                    pending: 'cyan'
                }
            }
        ));
    }
};
