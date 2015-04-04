import React from 'react/addons';
import moment from '../lib/preciseRange';

const BuildListItem = React.createClass({
  mixins: [React.PureRenderMixin],

  contextTypes: {
    router: React.PropTypes.func
  },

  _itemClass: "build-item",

  render() {
    const build = this.props.build;
    const result = build.get('result');
    const resultClass = "build-" + (result ? result.toLowerCase() : 'inprogress');

    let buildTime;

    if (build.get('duration')) {
      const duration = moment().preciseDiff(moment().add(build.get('duration'), 'milliseconds'));
      buildTime = <div className="build-time">DURATION: {duration}</div>;
    }
    else {
      const estimated = moment().preciseDiff(moment().add(build.get('estimated'), 'milliseconds'));
      buildTime = <div className="build-time">ESTIMATED: {estimated}</div>;
    }

    return (
      <div className="build-item"
           onClick={() => this._navigateToBuild(build.get('number'))}>
        <div className={"left-bar " + resultClass}></div>

        <div className="main">
          <h1>{build.get('number')}</h1>
          <div className="build-result">{build.get('result')}</div>
        </div>

        <div className="time-data">
          <div className="started">STARTED: {moment(build.get('timestamp')).format('MM/DD/YYYY h:mm:ssa')}</div>
          {buildTime}
        </div>

        <div className="metadata">
          <div className="console-link">
            <a href={build.get('url') + "console"}
               target="_blank"
               onClick={(e) => e.stopPropagation()}>console</a>
          </div>
        </div>

        <div className={"right-bar " + resultClass}></div>
      </div>
    );
  },

  _navigateToBuild(buildNumber) {
    const jobName = this.props.jobName;
    this.context.router.transitionTo('build', { name: jobName, number: buildNumber });
  }
});

export default BuildListItem;
