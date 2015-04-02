import React from 'react/addons';
import Infinite from 'react-infinite';

import BuildListItem from '../components/BuildListItem.jsx';

const BuildList = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render() {
    return (
      <div className="builds-list">
        <Infinite className="collection" containerHeight={this.props.height} elementHeight={133}>
          {this._genBuildsList().toArray()}
        </Infinite>
      </div>
    );
  },

  _genBuildsList() {
    const name = this.props.jobName;

    return this.props.builds.map((build) => {
      const key = `${build.get('name')}#${build.get('number')}`;
      return <BuildListItem key={key} jobName={name} build={build}/>;
    });
  }
});

export default BuildList;
