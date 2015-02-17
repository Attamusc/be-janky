import React from 'react/addons';
import { Link } from 'react-router';

const JobsListItem = React.createClass({
  mixin: [React.PureRenderMixin],

  render() {
    const name = this.props.job.get('name');

    return (
      <li className="collection-item">
        <Link to="job" params={{name: name}}>{name}</Link>
      </li>
    );
  }
});

export default JobsListItem;
