#!/usr/bin/env node

var util = require('util');
var commander = require('commander');
var chromepet = require('../src/chromepet');

commander
  .option('-u, --url [chrome extension url]', 'The Chrome Extension URL on Chrome Web Store')
  .option('-v, --version [publishing version', 'The publishing version')
  .parse(process.argv);

chromepet({
  extensionURL: commander.url,
  publishingVersion: commander.version,
  watchIntervalMS: 1000,
})
.watch()
.on('error', function(error) {
  console.error('Fail to fetch', error);
})
.on('data', function(extension) {
  console.log(util.format('Publishing version: %s; Published version: %s; Not published yet',
    publishingVersion,
    extension.version));
})
.on('end', function(extension, totalSeconds) {
  console.log(util.format('New version %s is published! %s.',
    extension.version,
    extension.interactionCount));
  console.log('Total seconds:', totalSeconds);
});
