import React from 'react';
import xhr from '../lib/xhr';

import BuildInfo from '../components/BuildInfo.jsx';
import ConsoleStream from '../components/ConsoleStream.jsx';

const Build = React.createClass({
  _progressiveConsoleIntervalId: null,

  _consoleRequestInterval: 1000,

  componentWillUnmount() {
    if (this._progressiveConsoleIntervalId) {
      window.clearInterval(this._progressiveConsoleIntervalId);
      this._progressiveConsoleIntervalId = null;
    }
  },

  render() {
    const jobName = this.props.params.name;
    const jobNumber = this.props.params.number;

    return (
      <div className="container">
        <BuildInfo name={jobName} number={jobNumber} />
        <ConsoleStream name={jobName} number={jobNumber} />
      </div>
    );
  },

  _requestConsoleOutput() {
    const name = this.props.params.name;
    const number = this.props.params.number;
    const consoleOffset = this.state.data.get('consoleOffset');

    return xhr({
      url: '/api/jobs/' + name + '/' + number + '/console',
      data: { start: consoleOffset },
      method: 'get'
    })
    .then((data) => {
      const offset = data.get('offset');
      const output = data.get('output');
      const more = data.get('more');

      if (this.state.data.get('offset') !== offset) {
        this.setState({
          data: this.state.data.merge(Map({
            console: this.state.data.get('console') + output,
            consoleOffset: offset
          }))
        });
      }

      if (more) {
        this._progressiveConsoleIntervalId = window.setTimeout(() => {
          this._requestConsoleOutput();
        }, this._consoleRequestInerval);
      }
    });
  }
});

export default Build;
