ChromePet
=========

Report new extension version published on Chrome Web Store

## Quick Start
```
npm install chromepet
```

This file `example/zenhub.js` is to check if a new version of ZenHub Chrome Extension has been published on Chrome Web Store.

```js
var chromepet = require('chromepet');

chromepet({
  extensionURL: 'https://chrome.google.com/webstore/detail/zenhub-for-github/ogcgkffhplmphkaahpmffcafajaocjbd/details',
  publishingVersion: '1.0.3'
})
.watch()
.on('end', function(extension, totalSeconds) {
  console.log(util.format('New version %s is published! %s.',
    extension.version,
    extension.interactionCount));
  console.log('Total seconds:', totalSeconds);
});
```

Result:
```
$ node example/zenhub.js
Publishing version: 1.0.3; Published version: 1.0.2; Not published yet
Publishing version: 1.0.3; Published version: 1.0.2; Not published yet
Publishing version: 1.0.3; Published version: 1.0.2; Not published yet
Publishing version: 1.0.3; Published version: 1.0.2; Not published yet
...
Publishing version: 1.0.3; Published version: 1.0.2; Not published yet
New version 1.0.3 is published! UserDownloads:9,823.
Total seconds: 1.132
```


## Read Chrome Extension's Version from manifest.json
```js
var fs = require('fs');
var path = require('path');
var join = path.join;
var util = require('util');

var chromepet = require('chromepet');

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
```


## Contributors
* [Leo Zhang](https://github.com/zhangchiqing)

