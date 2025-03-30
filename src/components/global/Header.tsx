import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import "./Header.css";
import "./Header.scss";
import { Pages, resolvePage } from "../pages";
import { logoutUser, UserContext } from "../../utils/User";
import { I18nContext, translate } from "../../utils/i18n/i18n";
import Icon from "../widgets/Icon";
import ObscuredModule from "../widgets/ObscuredModule";

export interface HeaderProps {
  setNavbarHidden: React.Dispatch<React.SetStateAction<boolean>>;
  navbarHidden: boolean;
}

const Header = ({ setNavbarHidden, navbarHidden }: HeaderProps) => {
  const { isLoading, user, setUser } = useContext(UserContext);
  const { lang } = useContext(I18nContext);

  const [accountActionsVisible, setAccountActionsVisible] = useState(false);

  const onLogout = () => {
    logoutUser(setUser);
    setAccountActionsVisible(false);
  };

  return (
    <header className="header">
      <div className="logo-div">
        <span
          className="hamburger"
          onClick={() => {
            setNavbarHidden(!navbarHidden);
          }}
        >
          <Icon icon="Hamburger" />
        </span>
        <Link to={resolvePage(Pages.Home)}>
          <img className="logo" src="/mkw/banner/00.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/01.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/02.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/03.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/04.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/05.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/06.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/07.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/08.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/09.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/10.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/11.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/12.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/13.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/14.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/15.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/16.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/17.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/18.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/19.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/20.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/21.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/22.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/23.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/24.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/25.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/26.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/27.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/28.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/29.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/30.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/31.png" alt="Mario Kart Wii" />
          <img className="logo" src="/mkw/banner/32.png" alt="Mario Kart Wii" />
        </Link>
      </div>
      {!isLoading && (
        <div className="account-actions">
          {user ? (
            <>
              {/* TODO: Link to a page allowing user to claim a profile if they don't have one. */}
              <Link
                className="small-hide"
                to={resolvePage(Pages.PlayerProfile, { id: user.playerId })}
              >
                {user.username}
              </Link>
              <Link className="small-hide" to={resolvePage(Pages.Options)}>
                {translate("headerOptions", lang)}
              </Link>
              <Link className="small-hide" to={resolvePage(Pages.Submission)}>
                {translate("headerSubmit", lang)}
              </Link>
              <Link className="small-hide" onClick={onLogout} to="">
                {translate("headerLogOut", lang)}
              </Link>
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  setAccountActionsVisible(true);
                }}
                to=""
              >
                {translate("headerActions", lang)}
              </Link>
            </>
          ) : (
            <>
              <Link className="small-hide" to={resolvePage(Pages.Options)}>
                {translate("headerOptions", lang)}
              </Link>
              <Link className="small-hide" to={resolvePage(Pages.UserLogin)}>
                {translate("headerLogIn", lang)}
              </Link>
              <Link className="small-hide" to={resolvePage(Pages.UserJoin)}>
                {translate("headerJoin", lang)}
              </Link>
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  setAccountActionsVisible(true);
                }}
                to=""
              >
                {translate("headerActions", lang)}
              </Link>
            </>
          )}
        </div>
      )}
      {user ? (
        <ObscuredModule
          stateVisible={accountActionsVisible}
          setStateVisible={setAccountActionsVisible}
        >
          <Link
            onClick={(e) => {
              setAccountActionsVisible(false);
            }}
            to={resolvePage(Pages.PlayerProfile, { id: user.playerId })}
          >
            {user.username}
          </Link>
          <Link
            onClick={(e) => {
              setAccountActionsVisible(false);
            }}
            to={resolvePage(Pages.Options)}
          >
            {translate("headerOptions", lang)}
          </Link>
          <Link
            onClick={(e) => {
              setAccountActionsVisible(false);
            }}
            to={resolvePage(Pages.Submission)}
          >
            {translate("headerSubmit", lang)}
          </Link>
          <Link onClick={onLogout} to="">
            {translate("headerLogOut", lang)}
          </Link>
        </ObscuredModule>
      ) : (
        <ObscuredModule
          stateVisible={accountActionsVisible}
          setStateVisible={setAccountActionsVisible}
        >
          <Link
            onClick={(e) => {
              setAccountActionsVisible(false);
            }}
            to={resolvePage(Pages.Options)}
          >
            {translate("headerOptions", lang)}
          </Link>
          <Link
            onClick={(e) => {
              setAccountActionsVisible(false);
            }}
            to={resolvePage(Pages.UserLogin)}
          >
            {translate("headerLogIn", lang)}
          </Link>
          <Link
            onClick={(e) => {
              setAccountActionsVisible(false);
            }}
            to={resolvePage(Pages.UserJoin)}
          >
            {translate("headerJoin", lang)}
          </Link>
        </ObscuredModule>
      )}
    </header>
  );
};

export default Header;
