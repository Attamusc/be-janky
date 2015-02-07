var React = require('react');
var reqwest = require('reqwest');

var Build = React.createClass({
  _progressiveConsoleIntervalId: null,

  _consoleRequestInterval: 1000,

  getInitialState: function() {
    return {
      build: {},
      consoleOffset: 0,
      console: ''
    };
  },

  componentWillMount: function() {
    reqwest({
      url: '/api/jobs/' + this.props.params.name + '/' + this.props.params.number,
      method: 'get'
    })
    .then(function(data) {
      this.setState({ build: data });
    }.bind(this));

    this._progressiveConsoleIntervalId = window.setInterval(function() {
      this._requestNewConsoleOutput();
    }.bind(this), this._consoleRequestInterval);
  },

  componentWillUnmount: function() {
    if (this._progressiveConsoleIntervalId) {
      window.clearInterval(this._progressiveConsoleIntervalId);
      this._progressiveConsoleIntervalId = null;
    }
  },

  render: function() {
    var jobName = this.props.params.name;
    var jobNumber = this.props.params.number;
    var build = this.state.build;
    var console = this.state.console;

    return (
      <div className="build-detail">
        <h1>{jobName}#{jobNumber}</h1>
        <a href={build.url + "console"} target="_blank">console</a>
        <section class="console-output">
          <h1>Console Output</h1>
          <pre>{console}</pre>
        </section>
      </div>
    );
  },

  _requestNewConsoleOutput: function() {
    var name = this.props.params.name;
    var number = this.props.params.number;
    var consoleOffset = this.props.params.consoleOffset;

    reqwest({
      url: '/api/jobs/' + name + '/' + number + '/console',
      data: {
        start: consoleOffset
      },
      method: 'get'
    })
    .then(function(data) {
      var offset = data.offset;
      var output = data.output;

      this.setState({
        console: output,
        consoleOffset: offset
      });
    }.bind(this));
  }
});

module.exports = Build;
