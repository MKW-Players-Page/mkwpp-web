import { Link } from 'react-router-dom';

import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <Link to="/">
        <img className="logo" src="/mariokartwiilogo.png" alt="Mario Kart Wii" />
      </Link>
    </header>
  );
};

export default Header;
