var React = require('react');
var reqwest = require('reqwest');

var BuildListItem = require('../components/BuildListItem.jsx');

var Job = React.createClass({
  getInitialState: function() {
    return { builds: [] };
  },

  componentWillMount: function() {
    reqwest({
      url: '/api/jobs/' + this.props.params.name,
      method: 'get'
    })
    .then(function(data) {
      this.setState({
        builds: (data.builds && data.builds.length) ? data.builds : []
      });
    }.bind(this));
  },

  render: function() {
    var name = this.props.params.name;

    return (
      <div className="main">
        <h1>{name}</h1>

        <div className="builds-list">
          <ul>
            {this._genBuildsList(name)}
          </ul>
        </div>
      </div>
    );
  },

  _genBuildsList: function(name) {
    var builds = this.state.builds.map(function(build) {
      return (
        <li key={build.number}><BuildListItem jobName={name} build={build}/></li>
      );
    });

    if (!builds.length) {
      builds = (
        <p>No builds yet for {name}</p>
      );
    }

    return builds;
  }
});

module.exports = Job;
