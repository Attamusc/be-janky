import React from 'react';
import { Map, List } from 'immutable';

import xhr from '../lib/xhr';
import JobsList from '../components/JobsList.jsx';

const Jobs = React.createClass({
  getInitialState() {
    return Map({
      jobs: List([])
    });
  },

  componentWillMount() {
    xhr({ url: '/api/jobs' })
    .then((data) => {
      this.replaceState(this.state.set('jobs', data));
    });
  },

  render() {
    return (
      <div className="main">
        <h1>Jobs</h1>
        <JobsList jobs={this.state.get('jobs')} />
      </div>
    );
  }
});

export default Jobs;
