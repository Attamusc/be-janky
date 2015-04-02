import React from 'react/addons';

const Header = React.createClass({
  mixin: [React.PureRenderMixin],

  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <a href="/" className="brand-logo">Be-Janky</a>
        </div>
      </nav>
    );
  }
});

export default Header;
