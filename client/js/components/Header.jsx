import React from 'react/addons';
import { Link } from 'react-router';

const Header = React.createClass({
  mixin: [React.PureRenderMixin],

  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <Link to="jobs" className="brand-logo">Be-Janky</Link>
        </div>
      </nav>
    );
  }
});

export default Header;
