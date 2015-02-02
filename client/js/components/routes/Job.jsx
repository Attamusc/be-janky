var React = require('react');
var Link = require('react-router').Link;
var reqwest = require('reqwest');

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
        <li><Link to="build" params={{name: name, number: build.number}}>{build.number}</Link></li>
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
