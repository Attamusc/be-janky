import React from 'react';
import Router from 'react-router';
import routes from './routes.jsx';

Router.run(routes, Router.HistoryLocation, function(Handler, state) {
  const params = state.params;
  React.render(<Handler params={params}/>, document.body);
});

window.React = React;
