var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var App = require('./components/App.jsx');

module.exports = (
  <Route path="/" handler={App}/>
);
