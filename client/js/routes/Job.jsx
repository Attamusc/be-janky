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
      this.setState({ builds: data });
    }.bind(this));
  },

  render: function() {
    var name = this.props.params.name;
    var builds = this.state.builds.map(function(build) {
      return (
        <li key={build.number}><BuildListItem jobName={name} build={build}/></li>
      );
    });

    return (
      <div className="main">
        <h1>{name}</h1>

        <div className="builds-list">
          <ul>
            {builds}
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = Job;
