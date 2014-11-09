var chromepet = require('../src/chromepet');
var expect = require('chai').expect;

describe('chromepet', function() {
  var publishingVersion = null;

  it('should keep scraping when new version is not published', function(done) {
    this.timeout(5000);
    var counter = 0;
    var pet = chromepet({
      extensionURL: 'https://chrome.google.com/webstore/detail/zenhub-for-github/ogcgkffhplmphkaahpmffcafajaocjbd/details',
      publishingVersion: '0.0.1',
      watchIntervalMS: 1000,
    });

    pet
    .watch()
    .on('error', done)
    .on('data', function(extension) {
      expect(extension.version).to.be.a('string');
      publishingVersion = extension.version;
      counter++;
      if (counter > 2) {
        pet.stopScraping();
        done();
      }
    });
  });

  it('should stop scraping when new version is published', function(done) {
    chromepet({
      extensionURL: 'https://chrome.google.com/webstore/detail/zenhub-for-github/ogcgkffhplmphkaahpmffcafajaocjbd/details',
      publishingVersion: publishingVersion,
      watchIntervalMS: 1000,
    })
    .watch()
    .on('error', done)
    .on('end', function(extension, totalSeconds) {
      done();
    });
  });
});

