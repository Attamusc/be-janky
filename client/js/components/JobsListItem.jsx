import React from 'react/addons';
import { Link } from 'react-router';

const JobsListItem = React.createClass({
  mixin: [React.PureRenderMixin],

  render() {
    const name = this.props.job.get('name');

    return (
      <Link to="jobs.job" params={{name: name}} className="job-item">{name}</Link>
    );
  }
});

export default JobsListItem;
