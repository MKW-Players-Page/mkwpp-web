import { useContext } from 'react';
import { Link } from 'react-router-dom';

import './Header.css';
import { Pages, resolvePage } from '../pages';
import { logoutUser, UserContext } from '../../utils/User';

const Header = () => {
  const { user, setUser } = useContext(UserContext);

  const onLogout = () => {
    logoutUser(setUser);
  };

  return (
    <header className="header">
      <Link to={resolvePage(Pages.Home)}>
        <img className="logo" src="/mariokartwiilogo.png" alt="Mario Kart Wii" />
      </Link>
      <div className="account-actions">
        {user ? (
          <>
            <Link to={resolvePage(Pages.PlayerProfile, { id: user.player })}>
              {user.username}
            </Link>
            <button onClick={onLogout}>Log Out</button>
          </>
        ) : (
          <>
            <Link to={resolvePage(Pages.UserLogin)}>
              Log In
            </Link>
            <Link to="">
              Join
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
