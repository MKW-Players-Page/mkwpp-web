import { useContext } from "react";
import { Link } from "react-router-dom";

import "./Header.css";
import { Pages, resolvePage } from "../pages";
import { logoutUser, UserContext } from "../../utils/User";
import { I18nContext } from "../../utils/i18n/i18n";
import Icon from "../widgets/Icon";

export interface HeaderProps {
  setNavbarHidden: React.Dispatch<React.SetStateAction<boolean>>;
  navbarHidden: boolean;
}

const Header = ({ setNavbarHidden, navbarHidden }: HeaderProps) => {
  const { isLoading, user, setUser } = useContext(UserContext);
  const { translations, lang } = useContext(I18nContext);

  const onLogout = () => {
    logoutUser(setUser);
  };

  return (
    <header className="header">
      <div>
        <span
          className="hamburger"
          onClick={() => {
            setNavbarHidden(!navbarHidden);
          }}
        >
          <Icon icon="Hamburger" />
        </span>
        <Link to={resolvePage(Pages.Home)}>
          <img className="logo" src="/mariokartwiilogo.png" alt="Mario Kart Wii" />
        </Link>
      </div>
      {!isLoading && (
        <div className="account-actions">
          {user ? (
            <>
              {/* TODO: Link to a page allowing user to claim a profile if they don't have one. */}
              <Link to={resolvePage(Pages.PlayerProfile, { id: user.player })}>
                {user.username}
              </Link>
              <Link to={resolvePage(Pages.Options)}>{translations.headerOptions[lang]}</Link>
              <Link to={resolvePage(Pages.Submission)}>{translations.headerSubmit[lang]}</Link>
              <Link onClick={onLogout} to="">
                {translations.headerLogOut[lang]}
              </Link>
            </>
          ) : (
            <>
              <Link to={resolvePage(Pages.Options)}>{translations.headerOptions[lang]}</Link>
              <Link to={resolvePage(Pages.UserLogin)}>{translations.headerLogIn[lang]}</Link>
              <Link to={resolvePage(Pages.UserJoin)}>{translations.headerJoin[lang]}</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
