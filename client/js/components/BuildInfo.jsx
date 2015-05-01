import React from 'react';
import { Map } from 'immutable';

import BuildStore from '../stores/BuildStore';
import BuildActions from '../actions/BuildActions';

const BuildInfo = React.createClass({
  mixins: [BuildStore.mixin],

  getInitialState() {
    return {
      data: Map({
        build: Map({})
      })
    };
  },

  componentWillMount() {
    BuildActions.loadBuild(this.props.name, this.props.number);
  },

  storeDidChange() {
    this.setState({
      data: this.state.data.set('build', BuildStore.getBuild())
    });
  },

  render() {
    const jobName = this.props.name;
    const jobNumber = this.props.number;

    return (
      <header className="build-detail">
        <h1>{jobName}#{jobNumber}</h1>
        {this._renderConsoleLink()}
      </header>
    );
  },

  _renderConsoleLink() {
    const build = this.state.data.get('build');

    if (!build.get('url')) { return; }

    return (
      <a href={build.get('url') + "console"} target="_blank">console</a>
    );
  }
});

export default BuildInfo;
