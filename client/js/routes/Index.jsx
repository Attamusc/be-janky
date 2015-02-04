var React = require('react');
var reqwest = require('reqwest');

var App = React.createClass({
  componentWillMount: function() {
    return reqwest({
      url: '/api/recent',
      method: 'get'
    })
    .then(function(data) {
      console.log(data);
    });
  },

  render: function() {
    return (
      <div>
        <h1>Hello World!</h1>
      </div>
    );
  }
});

module.exports = App;
