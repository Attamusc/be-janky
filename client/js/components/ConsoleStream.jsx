import React from 'react';
import { Map } from 'immutable';

import ConsoleStore from '../stores/ConsoleStore';
import BuildActions from '../actions/BuildActions';

const ConsoleStream = React.createClass({
  mixins: [ConsoleStore.mixin],

  getInitialState() {
    return {
      data: Map({
        console: Map({
          output: '',
          offset: 0,
          more: false
        })
      })
    };
  },

  componentWillMount() {
    BuildActions.loadBuildConsole(this.props.name, this.props.number, 0);
  },

  storeDidChange() {
    this.setState({
      data: this.state.data.set('console', ConsoleStore.getConsole())
    });
  },

  render() {
    const output = this.state.data.getIn(['console', 'output']);

    return (
      <section className="console-output">
        <h1>Console Output</h1>
        <pre dangerouslySetInnerHTML={{__html: output}} />
      </section>
    );
  }
});

export default ConsoleStream;
