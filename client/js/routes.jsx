var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var App = require('./routes/App.jsx');
var Index = require('./routes/Index.jsx');
var Jobs = require('./routes/Jobs.jsx');
var Job = require('./routes/Job.jsx');
var Build = require('./routes/Build.jsx');

module.exports = (
  <Route path="/" handler={App}>
    <DefaultRoute handler={Index}/>
    <Route name="jobs" path="/jobs" handler={Jobs}/>
    <Route name="job" path="/jobs/:name" handler={Job}/>
    <Route name="build" path="/jobs/:name/:number" handler={Build}/>
  </Route>
);
