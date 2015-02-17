import React from 'react/addons';

import JobsListItem from './JobsListItem.jsx';

const JobsList = React.createClass({
  mixin: [React.PureRenderMixin],

  render() {
    const jobs = this.props.jobs.map(function(job) {
      return <JobsListItem  key={job.get('name')} job={job} />;
    });

    return (
      <div className="jobs-list">
        <ul className="collection">
          {jobs.toArray()}
        </ul>
      </div>
    );
  }
});

export default JobsList;
