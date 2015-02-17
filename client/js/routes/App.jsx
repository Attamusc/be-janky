import React from 'react';
import { RouteHandler } from 'react-router';

import Header from '../components/Header.jsx';

const App = React.createClass({
  render() {
    return (
      <div className="content">
        <Header/>

        <div className="container">
          <RouteHandler {...this.props}/>
        </div>
      </div>
    );
  }
});

export default App;
