import { useContext } from "react";
import { I18nContext } from "../../utils/i18n/i18n";
import { setSettingKV, SettingsContext } from "../../utils/Settings";
import { UserContext } from "../../utils/User";

const OptionsPage = () => {
  const { user } = useContext(UserContext);
  const { translations, lang } = useContext(I18nContext);
  const { settings, setSettings } = useContext(SettingsContext);

  return (
    <>
      <h1>{translations.optionsPageBrowserHeading[lang]}</h1>
      <div className="module">
        <div className="module-content">
          <h2>{translations.optionsPageBrowserOptRegFlagsHeading[lang]}</h2>
          <div style={{ display: "flex", gap: "5px" } as React.CSSProperties}>
            <p>{translations.optionsPageBrowserOptRegFlagsParagraph[lang]}</p>
            <input
              type="checkbox"
              onClick={() =>
                setSettings(setSettingKV(settings, "showRegFlags", !settings.showRegFlags))
              }
              checked={settings.showRegFlags}
            />
          </div>
        </div>
      </div>
      <h1>{translations.optionsPageAccountHeading[lang]}</h1>
      <div className="module">
        <div className="module-content">
          {user === undefined ? (
            <>{translations.optionsPageLogInWarning[lang]}</>
          ) : (
            <>Coming soon!</>
          )}
        </div>
      </div>
    </>
  );
};

export default OptionsPage;
