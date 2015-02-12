var React = require('react');
var { Map, List } = require('immutable');
var xhr = require('../lib/xhr');

var Build = React.createClass({
  _progressiveConsoleIntervalId: null,

  _consoleRequestInterval: 1000,

  getInitialState: function() {
    return Map({
      build: Map({}),
      consoleOffset: 0,
      console: ''
    });
  },

  componentWillMount: function() {
    xhr({
      url: '/api/jobs/' + this.props.params.name + '/' + this.props.params.number,
      method: 'get'
    })
    .then((data) => {
      this.replaceState(this.state.set('build', data));
    })
    .then(() => this._requestConsoleOutput());
  },

  componentWillUnmount: function() {
    if (this._progressiveConsoleIntervalId) {
      window.clearInterval(this._progressiveConsoleIntervalId);
      this._progressiveConsoleIntervalId = null;
    }
  },

  render: function() {
    console.log(this.state.get);
    var jobName = this.props.params.name;
    var jobNumber = this.props.params.number;
    var build = this.state.get('build');
    var consoleOutput = this.state.get('console');

    console.log('hello');

    return (
      <div className="build-detail">
        <h1>{jobName}#{jobNumber}</h1>
        <a href={build.get('url') + "console"} target="_blank">console</a>
        <section className="console-output">
          <h1>Console Output</h1>
          <pre dangerouslySetInnerHTML={{__html: consoleOutput}} />
        </section>
      </div>
    );
  },

  _requestConsoleOutput: function() {
    var name = this.props.params.name;
    var number = this.props.params.number;
    var consoleOffset = this.state.get('consoleOffset');

    return xhr({
      url: '/api/jobs/' + name + '/' + number + '/console',
      data: { start: consoleOffset },
      method: 'get'
    })
    .then((data) => {
      var offset = data.get('offset');
      var output = data.get('output');
      var more = data.get('more');

      if (this.state.get('offset') !== offset) {
        this.replaceState(this.state.merge(Map({
          console: this.state.get('console') + output,
          consoleOffset: offset
        })));
      }

      if (more) {
        this._progressiveConsoleIntervalId = window.setTimeout(() => {
          this._requestConsoleOutput();
        }, this._consoleRequestInerval);
      }
    });
  }
});

module.exports = Build;
