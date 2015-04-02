import React from 'react/addons';
import Infinite from 'react-infinite/src/react-infinite.jsx';

import JobsListItem from './JobsListItem.jsx';

const JobsList = React.createClass({
  getInitialState() {
    return {
      height: window.innerHeight - 64
    };
  },

  componentDidMount() {
    window.addEventListener('resize', () => this._handleResize())
  },

  render() {
    return (
      <div className="master-view">
        <div className="jobs-list">
          <Infinite className="collection" containerHeight={this.state.height} elementHeight={43}>
            {this.props.jobs.map((job) => {
              return <JobsListItem  key={job.get('name')} job={job} />;
            }).toArray()}
          </Infinite>
        </div>
      </div>
    );
  },

  _handleResize() {
    this.setState({ height: window.innerHeight - 64 });
  }
});

export default JobsList;
