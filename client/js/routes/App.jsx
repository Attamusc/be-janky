import React from 'react';
import { RouteHandler } from 'react-router';

import Header from '../components/Header.jsx';

const App = React.createClass({
  render() {
    return (
      <div className="content">
        <Header/>
        <RouteHandler {...this.props}/>
      </div>
    );
  }
});

export default App;
