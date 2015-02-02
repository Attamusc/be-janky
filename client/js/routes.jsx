var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var App = require('./components/routes/App.jsx');
var Index = require('./components/routes/Index.jsx');
var Jobs = require('./components/routes/Jobs.jsx');
var Job = require('./components/routes/Job.jsx');
var Build = require('./components/routes/Build.jsx');

module.exports = (
  <Route path="/" handler={App}>
    <DefaultRoute handler={Index}/>
    <Route name="jobs" path="/jobs" handler={Jobs}/>
    <Route name="job" path="/jobs/:name" handler={Job}/>
    <Route name="build" path="/jobs/:name/:number" handler={Build}/>
  </Route>
);
