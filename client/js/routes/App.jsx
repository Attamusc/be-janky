import React from 'react';
import { RouteHandler } from 'react-router';

const App = React.createClass({
  render() {
    return (
      <RouteHandler {...this.props}/>
    );
  }
});

export default App;
