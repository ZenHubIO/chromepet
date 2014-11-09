var fs = require('fs');
var path = require('path');
var join = path.join;
var util = require('util');

var chromepet = require('../src/chromepet');

var manifestPath = join(__dirname, './manifest.json');
console.log('reading manifest from path', manifestPath);
var manifest = require(manifestPath);
var publishingVersion = manifest.version;

chromepet({
  extensionURL: 'https://chrome.google.com/webstore/detail/zenhub-for-github/ogcgkffhplmphkaahpmffcafajaocjbd/details',
  publishingVersion: publishingVersion,
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
