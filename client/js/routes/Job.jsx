import React from 'react/addons';
import { Map, List } from 'immutable';
import xhr from '../lib/xhr';

import BuildListItem from '../components/BuildListItem.jsx';

const Job = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  _jobPollId: null,

  _requestInterval: 2500,

  getInitialState() {
    return Map({ builds: List([]) });
  },

  componentWillMount() {
    this._requestJobBuilds()
    .then(() => {
      this._jobPollId = window.setInterval(() => {
        this._requestJobBuilds();
      }, this._requestInterval);
    });
  },

  componentWillUnmount() {
    if (this._jobPollId) {
      window.clearInterval(this._jobPollId);
      this._jobPollId = null;
    }
  },

  render() {
    const name = this.props.params.name;

    return (
      <div className="main">
        <h1>{name}</h1>

        <div className="builds-list">
          <ul>
            {this._genBuildsList(name).toArray()}
          </ul>
        </div>
      </div>
    );
  },

  _genBuildsList(name) {
    let builds = this.state.get('builds').map(function(build) {
      return (
        <li key={build.get('number')}><BuildListItem jobName={name} build={build}/></li>
      );
    });

    if (!builds.count()) {
      builds = List([(
        <li key="empty-builds">No builds yet for {name}</li>
      )]);
    }

    return builds;
  },

  _requestJobBuilds() {
    return xhr({
      url: '/api/jobs/' + this.props.params.name,
      method: 'get'
    })
    .then((data) => {
      if (data.get('builds')) {
        this.replaceState(this.state.set('builds', data.get('builds')));
      }
    });
  }
});

export default Job;
