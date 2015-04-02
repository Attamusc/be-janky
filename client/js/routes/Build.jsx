import React from 'react';
import { Map, List } from 'immutable';
import xhr from '../lib/xhr';

const Build = React.createClass({
  _progressiveConsoleIntervalId: null,

  _consoleRequestInterval: 1000,

  getInitialState() {
    return {
      data: Map({
        build: Map({}),
        consoleOffset: 0,
        console: ''
      })
    };
  },

  componentWillMount() {
    xhr({
      url: '/api/jobs/' + this.props.params.name + '/' + this.props.params.number,
      method: 'get'
    })
    .then((data) => {
      this.setState({ data: this.state.data.set('build', data) });
    })
    .then(() => this._requestConsoleOutput());
  },

  componentWillUnmount() {
    if (this._progressiveConsoleIntervalId) {
      window.clearInterval(this._progressiveConsoleIntervalId);
      this._progressiveConsoleIntervalId = null;
    }
  },

  render() {
    const jobName = this.props.params.name;
    const jobNumber = this.props.params.number;
    const build = this.state.data.get('build');
    const consoleOutput = this.state.data.get('console');

    return (
      <div className="container">
        <div className="build-detail">
          <h1>{jobName}#{jobNumber}</h1>
          <a href={build.get('url') + "console"} target="_blank">console</a>
          <section className="console-output">
            <h1>Console Output</h1>
            <pre dangerouslySetInnerHTML={{__html: consoleOutput}} />
          </section>
        </div>
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
