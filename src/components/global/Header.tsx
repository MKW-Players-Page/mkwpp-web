import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import "./Header.css";
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
          <img className="logo" src="/mariokartwiilogo.png" alt="Mario Kart Wii" />
        </Link>
      </div>
      {!isLoading && (
        <div className="account-actions">
          {user ? (
            <>
              {/* TODO: Link to a page allowing user to claim a profile if they don't have one. */}
              <Link
                className="small-hide"
                to={resolvePage(Pages.PlayerProfile, { id: user.player })}
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
            to={resolvePage(Pages.PlayerProfile, { id: user.player })}
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
