import React from 'react/addons';

const Header = React.createClass({
  mixin: [React.PureRenderMixin],

  render() {
    return (
      <nav>
        <div className="nav-wrapper blue lighten-1">
          <a href="/" className="brand-logo">Be-Janky</a>
        </div>
      </nav>
    );
  }
});

export default Header;
