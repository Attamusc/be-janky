import React from 'react';
import { Route, DefaultRoute } from 'react-router';

const App = require('./routes/App.jsx');
const Jobs = require('./routes/Jobs.jsx');
const JobsIndex = require('./routes/JobsIndex.jsx');
const Job = require('./routes/Job.jsx');
const Build = require('./routes/Build.jsx');

module.exports = (
  <Route handler={App}>
    <Route name="jobs" path="/" handler={Jobs}>
      <DefaultRoute name="jobs.index" handler={JobsIndex}/>
      <Route name="jobs.job" path=":name" handler={Job}/>
    </Route>
    <Route name="build" path="/jobs/:name/:number" handler={Build}/>
  </Route>
);
