import React from 'react/addons';

const BuildsLoading = React.createClass({
  mixins: [React.PureRenderMixin],

  getDefaultProps() {
    return {
      size: 'medium',
      text: 'Loading...'
    };
  },

  render() {
    return (
      <div className={this.props.size + ' loading'}>
        <i className='fa fa-refresh fa-spin'></i>
        {this.props.text}
      </div>
    );
  }
});

export default BuildsLoading;
