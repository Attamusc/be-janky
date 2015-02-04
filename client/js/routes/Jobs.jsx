var React = require('react');
var Link = require('react-router').Link;
var reqwest = require('reqwest');

var Jobs = React.createClass({
  getInitialState: function() {
    return {
      jobs: []
    };
  },

  componentWillMount: function() {
    reqwest({
      url: '/api/jobs',
      method: 'get'
    })
    .then(function(data) {
      this.setState({ jobs: data });
    }.bind(this));
  },

  render: function() {
    var jobs = this.state.jobs.map(function(job) {
      return (
        <li key={job.name}>
          <Link to="job" params={{name: job.name}}>{job.name}</Link>
        </li>
      );
    });

    return (
      <div className="main">
        <h1>Jobs</h1>

        <div className="jobs-list">
          <ul>
            {jobs}
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = Jobs;

