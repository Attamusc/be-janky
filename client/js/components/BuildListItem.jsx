import React from 'react';
import { Link } from 'react-router';

const BuildListItem = React.createClass({
  _itemClass: "build-item",

  render() {
    const jobName = this.props.jobName;
    const build = this.props.build;

    return (
      <div className={this._resultToClassNames(build.get('result'))}>
        <h1>
          <Link to="build" params={{name: jobName, number: build.get('number')}}>{build.get('number')}</Link>
        </h1>
        <div><a href={build.get('url') + "console"} target="_blank">console</a></div>
        <div>{build.get('result')}</div>
      </div>
    );
  },

  _resultToClassNames(result) {
    return [
      this._itemClass,
      "build-" + (result ? result.toLowerCase() : 'inprogress')
    ].join(' ');
  }
});

export default BuildListItem;
