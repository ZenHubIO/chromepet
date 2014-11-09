var EventEmitter = require('events').EventEmitter;

var _ = require('underscore');
var request = require('request');
var cheerio = require('cheerio');


var usage = function() {
  return 'extensionURL cannot be empty';
};


var Timer =  {
  start: function() {
    var start = new Date();

    return {
      end: function() {
        var end = new Date();
        var totalSeconds = (end - start) / 1000;
        return totalSeconds;
      }
    };
  },
};


var ChromePet = function(options) {
  this.options = _.defaults({
    watchIntervalMS: 1000,
  }, options);

  if (!options.extensionURL) {
    throw new Error(usage());
  }
};


ChromePet.prototype.watch = function() {
  this.timer = Timer.start();
  this.scraping = setInterval(this._scrape.bind(this), this.options.watchIntervalMS);

  this.emitter = new EventEmitter();

  return this.emitter;
};


ChromePet.prototype._scrape = function() {
  var me = this;

  request(this.options.extensionURL, function(err, response, body) {
    if (err) {
      return me.stopScraping(err);
    }

    var extension = me._parseExtensionInfo(body);
    if (me._isPublished(extension.version)) {
       return me.stopScraping(null, extension);
    }

    me.emitter.emit('data', extension);
  });
};


ChromePet.prototype.stopScraping = function(err, extension) {
  if (err) {
    return this.emitter.emit('error', err);
  }

  clearInterval(this.scraping);

  var totalSeconds = this.timer.end();
  this.emitter.emit('end', extension, totalSeconds);
};


ChromePet.prototype._parseExtensionInfo = function(body) {
  var $ = cheerio.load(body);
  var version = $('meta[itemprop="version"]').attr('content');
  var interactionCount = $('meta[itemprop="interactionCount"]').attr('content');

  return {
    version: version,
    interactionCount: interactionCount
  };
};


ChromePet.prototype._isPublished = function(version) {
  return this.options.publishingVersion === version;
};

module.exports = function(options) {
  return new ChromePet(options);
};
