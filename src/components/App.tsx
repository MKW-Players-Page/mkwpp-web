import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Outlet } from "react-router";

import { MetadataContext, useMetadata } from "../utils/Metadata";

import "./App.css";
import "./App.scss";
import { Header, Navbar } from "./global";
import { User } from "../api";
import { fetchCurrentUser, UserContext } from "../utils/User";
import { getLang, I18nContext, Language } from "../utils/i18n/i18n";
import i18nJson from "../utils/i18n/i18n.json";
import {
  browserSettingsLoadParse,
  Settings,
  SettingsContext,
  SettingsDataKey,
} from "../utils/Settings";

interface AppUserState {
  isLoading: boolean;
  user?: User;
}

const App = () => {
  const metadata = useMetadata();

  const [navbarHidden, setNavbarHidden] = useState(window.innerWidth < window.innerHeight);
  const isLandscape = useRef(window.innerWidth < window.innerHeight);
  const initialUserState = { isLoading: true };
  const [user, setUserState] = useState<AppUserState>(initialUserState);
  const [langCode, setLangCodeState] = useState(getLang());
  const [settings, setSettingsState] = useState(browserSettingsLoadParse());

  const setLang = (langCode: Language): void => {
    setLangCodeState(langCode);
    window.localStorage.setItem("langCode", langCode);
  };

  const setSettings = (newSettings: Settings): void => {
    setSettingsState(newSettings);
    window.localStorage.setItem(SettingsDataKey, JSON.stringify(newSettings));
  };

  const setUser = (user?: User) => {
    setUserState({ isLoading: false, user });
  };

  useLayoutEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < window.innerHeight) {
        // If it's turned to portrait
        if (isLandscape.current) {
          // And was landscape
          isLandscape.current = false;
          setNavbarHidden(true);
        }
      } else {
        // If it's turned to landscape
        if (!isLandscape.current) {
          // And was portrait
          isLandscape.current = true;
        }
      }
    };
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  });

  useEffect(() => {
    fetchCurrentUser(setUser);
  }, []);

  return (
    <>
      <UserContext.Provider value={{ isLoading: user.isLoading, user: user.user, setUser }}>
        <I18nContext.Provider value={{ lang: langCode, setLang, translations: i18nJson }}>
          <SettingsContext.Provider value={{ settings, setSettings }}>
            <Header navbarHidden={navbarHidden} setNavbarHidden={setNavbarHidden} />
            <Navbar navbarHidden={navbarHidden} setNavbarHidden={setNavbarHidden} />
            <div
              onClick={() => setNavbarHidden(true)}
              className={`darkener${navbarHidden ? "" : " navbar-shown"}`}
            ></div>
            <div
              className={`content${navbarHidden ? "" : " navbar-shown"}${settings.sidebarAnim ? " sidebar-anim" : ""}`}
            >
              <MetadataContext.Provider value={metadata}>
                <Outlet />
              </MetadataContext.Provider>
            </div>
          </SettingsContext.Provider>
        </I18nContext.Provider>
      </UserContext.Provider>
    </>
  );
};

export default App;
