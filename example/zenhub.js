var fs = require('fs');
var path = require('path');
var join = path.join;

var chromepet = require('../src/chromepet');

var manifestPath = join(__dirname, '../package.json');
console.log('reading manifest from path', manifestPath);
var manifest = require(manifestPath);
var publishingVersion = manifest.version;

chromepet({
  extensionURL: 'https://chrome.google.com/webstore/detail/zenhub-for-github/ogcgkffhplmphkaahpmffcafajaocjbd/details',
  publishingVersion: publishingVersion,
  watchIntervalMS: 1000,
})
.watch(function(err, extension) {
  if (err) {
    console.log('Fail to fetch update', error);
    return ;
  }

  console.log('new version released', extension.version);
});
