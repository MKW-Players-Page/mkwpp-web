import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { MetadataContext, useMetadata } from "../utils/Metadata";

import "./App.css";
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

  const [navbarHidden, setNavbarHidden] = useState(false);
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

  useEffect(() => {
    fetchCurrentUser(setUser);
  }, []);

  return (
    <>
      <UserContext.Provider value={{ isLoading: user.isLoading, user: user.user, setUser }}>
        <I18nContext.Provider value={{ lang: langCode, setLang, translations: i18nJson }}>
          <SettingsContext.Provider value={{ settings, setSettings }}>
            <Header navbarHidden={navbarHidden} setNavbarHidden={setNavbarHidden} />
            <Navbar navbarHidden={navbarHidden} />
            <div className={`content${navbarHidden ? " navbarHidden" : ""}`}>
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
