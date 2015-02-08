var React = require('react');
var Link = require('react-router').Link;
var Immutable = require('immutable');
var { Map, List } = Immutable;
var xhr = require('../lib/xhr');

var Jobs = React.createClass({
  getInitialState: function() {
    return Map({
      jobs: List([])
    });
  },

  componentWillMount: function() {
    xhr({ url: '/api/jobs' })
    .then((data) => {
      this.replaceState(this.state.set('jobs', data));
    });
  },

  render: function() {
    var jobs = this.state.get('jobs', []).map(function(job) {
      var name = job.get('name');

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

module.exports = Jobs;
