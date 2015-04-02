import React from 'react';
import { RouteHandler } from 'react-router';
import { Map } from 'immutable';

import JobStore from '../stores/JobStore';
import JobActions from '../actions/JobActions';

import JobsList from '../components/JobsList.jsx';

const Jobs = React.createClass({
  mixins: [JobStore.mixin],

  getInitialState() {
    return {
      data: Map({
        jobs: JobStore.getJobs()
      })
    };
  },

  componentWillMount() {
    JobActions.loadJobs();
  },

  storeDidChange() {
    this.setState({ data: this.state.data.set('jobs', JobStore.getJobs()) });
  },

  render() {
    return (
      <div className="jobs-view">
        <div className="master-view">
          <JobsList jobs={this.state.data.get('jobs')} />
        </div>
        <div className="detail-view">
          <RouteHandler {...this.props}/>
        </div>
      </div>
    );
  }
});

export default Jobs;
