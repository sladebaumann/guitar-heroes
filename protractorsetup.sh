#!/bin/sh
webdriver-manager update
webdriver-manager start&
NODE_ENV=test node server.js
