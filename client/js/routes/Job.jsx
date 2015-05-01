import React from 'react/addons';
import { Map, List } from 'immutable';

import BuildStore from '../stores/BuildStore';
import JobActions from '../actions/JobActions';

import BuildsLoading from '../components/BuildsLoading.jsx';
import BuildList from '../components/BuildList.jsx';
import EmptyBuildList from '../components/EmptyBuildList.jsx';

const Job = React.createClass({
  mixins: [BuildStore.mixin],

  getInitialState() {
    return {
      height: window.innerHeight - 64,
      loading: true,
      data: Map({
        builds: BuildStore.getBuilds()
      })
    };
  },

  componentWillMount() {
    JobActions.loadJobBuilds(this.props.params.name);
  },

  componentWillReceiveProps(newProps) {
    this.setState({ loading: true });
    JobActions.loadJobBuilds(newProps.params.name);
  },

  componentWillUnmount() {
    if (this._jobPollId) {
      window.clearInterval(this._jobPollId);
      this._jobPollId = null;
    }
  },

  componentDidMount() {
    window.addEventListener('resize', () => this._handleResize());
  },

  storeDidChange() {
    this.setState({
      data: this.state.data.set('builds', BuildStore.getBuilds()),
      loading: false
    });
  },

  render() {
    let innerContent;

    if (this.state.loading) {
      innerContent = <BuildsLoading />;
    }
    else if (this.state.data.get('builds').count()) {
      innerContent = <BuildList builds={this.state.data.get('builds')} jobName={this.props.params.name} height={this.state.height} />;
    }
    else {
      innerContent = <EmptyBuildList />;
    }

    return innerContent;
  },

  _handleResize() {
    this.setState({ height: window.innerHeight - 64 });
  },

  _requestInitialJobBuilds(props) {
    const jobName = props.params.name;

    this.setState({ data: this.state.data.set('loading', true) });

    this._requestJobBuilds(props)
    .then(() => {
      this.setState({ data: this.state.data.set('loading', false) });

      const pollingId = this._jobPollId = window.setInterval(() => {
        if (jobName !== this.props.params.name) {
          window.clearInterval(pollingId);
        }

        this._requestJobBuilds(props);
      }, this._requestInterval);
    });
  },

  _requestJobBuilds(props) {
    const jobName = props.params.name;

    if (jobName !== this.props.params.name) { return; }

    if (data.get('builds')) {
      this.setState({ data: this.state.data.set('builds', data.get('builds')) });
    }
  }
});

export default Job;
