var Immutable = require('immutable');
var transit = require('transit-js');
var reqwest = require('reqwest');

var reader = transit.reader("json", {
  arrayBuilder: {
    init: function() { return Immutable.List().asMutable(); },
    add: function(ret, val) { return ret.push(val); },
    finalize: function(ret) { return ret.asImmutable(); }
  },
  mapBuilder: {
    init: function() { return Immutable.OrderedMap().asMutable(); },
    add: function(ret, key, val) { return ret.set(key, val);  },
    finalize: function(ret) { return ret.asImmutable(); }
  }
});

module.exports = function(options) {
  options.type = 'text';
  options.method = 'get';

  return reqwest(options)
  .then(function(data) {
    return reader.read(data.response);
  });
};
