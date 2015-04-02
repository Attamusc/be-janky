import Immutable from 'immutable';
import transit from 'transit-js';
import reqwest from 'reqwest';

const reader = transit.reader("json", {
  arrayBuilder: {
    init: function() { return Immutable.List().asMutable(); },
    add: function(ret, val) { return ret.push(val); },
    finalize: function(ret) { return ret.asImmutable(); }
  },

  mapBuilder: {
    init: function() { return Immutable.OrderedMap().asMutable(); },
    add: function(ret, key, val) { return ret.set(key, val); },
    finalize: function(ret) { return ret.asImmutable(); }
  }
});

function xhr(options) {
  options.type = 'text';
  options.method = 'get';

  return reqwest(options)
  .then((data) => reader.read(data.response));
}

export default xhr;
