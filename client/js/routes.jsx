import React from 'react';
import { Route, DefaultRoute } from 'react-router';

const App = require('./routes/App.jsx');
const Index = require('./routes/Index.jsx');
const Jobs = require('./routes/Jobs.jsx');
const Job = require('./routes/Job.jsx');
const Build = require('./routes/Build.jsx');

module.exports = (
  <Route path="/" handler={App}>
    <DefaultRoute handler={Jobs}/>
    <Route name="job" path="/:name" handler={Job}/>
    <Route name="build" path="/:name/:number" handler={Build}/>
  </Route>
);
