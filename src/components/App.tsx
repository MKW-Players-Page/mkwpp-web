import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Outlet } from "react-router";

import { MetadataContext, useMetadata } from "../utils/Metadata";

import "./App.css";
import "./App.scss";
import { Header, Navbar } from "./global";
import { fetchCurrentUser, UserContext } from "../utils/User";
import { getLang, getMuiXLocaleText, I18nContext, Language } from "../utils/i18n/i18n";
import i18nJson from "../utils/i18n/i18n.json";
import {
  browserSettingsLoadParse,
  Settings,
  SettingsContext,
  SettingsDataKey,
} from "../utils/Settings";
import { User } from "../api";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/de";
import "dayjs/locale/it";
import "dayjs/locale/en";
import "dayjs/locale/fr";
import "dayjs/locale/ja";
import "dayjs/locale/pt";
import "dayjs/locale/es";

import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

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

  const muiLocales = getMuiXLocaleText(langCode);

  const muiTheme = createTheme(
    {
      palette: { mode: "dark" },
      components: {
        MuiSlider: {
          styleOverrides: {
            root: {
              color: "var(--input-selected)",
            },
          },
        },
        MuiToggleButtonGroup: {
          styleOverrides: {
            root: {
              flexGrow: 1,
              marginBottom: "16px",
            },
          },
        },
        MuiToggleButton: {
          styleOverrides: {
            root: {
              flexGrow: 1,
              textTransform: "none",
              "&.Mui-selected": {
                color: "var(--text-color)",
                backgroundColor: "var(--module-border-color)",
              },
              "&:hover, &.Mui-selected:hover": {
                backgroundColor: "var(--module-background-color-focus)",
              },
              color: "var(--text-color)",
              backgroundColor: "var(--module-background-color)",
              borderColor: "var(--module-border-color)",
              borderRadius: 0,
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: 0,
              color: "var(--text-color)",
              "&>.MuiChip-deleteIcon": {
                color: "var(--text-color)",
              },
              "&>.MuiChip-deleteIcon:hover": {
                color: "#a11",
              },
            },
          },
        },
        MuiAutocomplete: {
          styleOverrides: {
            root: {
              "& .MuiAutocomplete-endAdornment *": {
                color: "var(--text-color)",
              },
              marginBottom: "16px",
              "& .MuiTextField-root": {
                marginBottom: 0,
              },
              flexGrow: 1,
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              "& .MuiOutlinedInput-notchedOutline": {
                color: "var(--text-color)",
                borderRadius: 0,
                borderColor: "var(--module-border-color)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline, &:focus .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "var(--module-background-color-focus)",
                },
              backgroundColor: "var(--module-background-color)",
              color: "var(--text-color)",
              marginBottom: "16px",
            },
          },
        },
        MuiPopper: {
          styleOverrides: { root: { "& .MuiPickersLayout-root button": { padding: 0 } } },
        },
        MuiDialog: {
          styleOverrides: { root: { "& .MuiPickersLayout-root button": { padding: 0 } } },
        },
      },
    },
    {
      components: {
        MuiPickersInputBase: {
          styleOverrides: {
            root: {
              backgroundColor: "var(--module-background-color)",
              marginBottom: "16px",
              "& .MuiPickersOutlinedInput-notchedOutline": {
                color: "var(--text-color)",
                borderRadius: 0,
                borderColor: "var(--module-border-color)",
              },
              "&:hover .MuiPickersOutlinedInput-notchedOutline, &:focus .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "var(--module-background-color-focus)",
                },
            },
          },
        },
      },
    },
    muiLocales.core,
    muiLocales.pickers,
  );

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
            <ThemeProvider theme={muiTheme}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale={langCode}
                localeText={
                  muiLocales.pickers.components.MuiLocalizationProvider.defaultProps.localeText
                }
              >
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
              </LocalizationProvider>
            </ThemeProvider>
          </SettingsContext.Provider>
        </I18nContext.Provider>
      </UserContext.Provider>
    </>
  );
};

export default App;
