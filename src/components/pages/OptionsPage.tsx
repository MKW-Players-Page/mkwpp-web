import { useContext, useRef } from "react";
import api from "../../api";
import { useApi } from "../../hooks";
import { I18nContext } from "../../utils/i18n/i18n";
import { setSettingKV, SettingsContext } from "../../utils/Settings";
import { UserContext } from "../../utils/User";
import Deferred from "../widgets/Deferred";

const OptionsPage = () => {
  const { user } = useContext(UserContext);
  const { translations, lang } = useContext(I18nContext);
  const { settings, setSettings } = useContext(SettingsContext);

  // it doesn't matter what player is loaded if you aren't logged in.
  const { isLoading: playerLoading, data: player } = useApi(
    () => api.timetrialsPlayersRetrieve({ id: user?.player ?? 1 }),
    [user],
  );

  const bioTextArea = useRef(null);

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
              onChange={() =>
                setSettings(setSettingKV(settings, "showRegFlags", !settings.showRegFlags))
              }
              defaultChecked={settings.showRegFlags}
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
            <Deferred isWaiting={playerLoading}>
              <div>
                <h2>{translations.optionsPageAccountOptBioHeading[lang]}</h2>
                <textarea
                  ref={bioTextArea}
                  style={{ color: "#fff" } as React.CSSProperties}
                  maxLength={1024}
                  defaultValue={player?.bio ?? ""}
                  className="module"
                ></textarea>
                <button
                  onClick={() => {
                    // eslint-disable-next-line
                    const newBio = (bioTextArea.current as any).value;
                    // post request here, add api
                  }}
                  disabled={
                    bioTextArea.current === null ||
                    (bioTextArea.current as any).value === (player?.bio ?? "")
                  }
                >
                  {translations.optionsPageSaveBtnText[lang]}
                </button>
              </div>
            </Deferred>
          )}
        </div>
      </div>
    </>
  );
};

export default OptionsPage;
