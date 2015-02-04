/* @flow */

var React = require('react');
var Router = require('react-router');
var routes = require('./routes.jsx');

Router.run(routes, Router.HistoryLocation, function(Handler, state) {
  var params = state.params;
  React.render(<Handler params={params}/>, document.body);
});

window.React = React;
