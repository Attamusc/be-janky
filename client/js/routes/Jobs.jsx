import React from 'react';
import { Link } from 'react-router';
import { Map, List } from 'immutable';
import xhr from '../lib/xhr';

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
    const jobs = this.state.get('jobs', []).map(function(job) {
      const name = job.get('name');

      return (
        <li key={name}>
          <Link to="job" params={{name: name}}>{name}</Link>
        </li>
      );
    });

    return (
      <div className="main">
        <h1>Jobs</h1>

        <div className="jobs-list">
          <ul>
            {jobs.toArray()}
          </ul>
        </div>
      </div>
    );
  }
});

export default Jobs;
