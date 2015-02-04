var React = require('react');
var Link = require('react-router').Link;

var BuildListItem = React.createClass({
  _itemClass: "build-item",

  render: function() {
    var jobName = this.props.jobName;
    var build = this.props.build;

    return (
      <div className={this._resultToClassNames(build.result)}>
        <h1>
          <Link to="build" params={{name: jobName, number: build.number}}>{build.number}</Link>
        </h1>
        <div><a href={build.url + "console"} target="_blank">console</a></div>
        <div>{build.result}</div>
      </div>
    );
  },

  _resultToClassNames: function(result) {
    return [
      this._itemClass,
      "build-" + result.toLowerCase()
    ].join(' ');

  }
});

module.exports = BuildListItem;
