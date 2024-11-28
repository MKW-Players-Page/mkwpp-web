import { useContext, useRef } from "react";
import api from "../../api";
import { useApi } from "../../hooks";
import { I18nContext } from "../../utils/i18n/i18n";
import { setSettingKV, SettingsContext } from "../../utils/Settings";
import { UserContext } from "../../utils/User";
import ColorSlider from "../widgets/ColorSlider";
import Deferred from "../widgets/Deferred";

const OptionsPage = () => {
  const { user } = useContext(UserContext);
  const { translations, lang } = useContext(I18nContext);
  const { settings, setSettings } = useContext(SettingsContext);

  const horizDivStyle = {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  };

  // it doesn't matter what player is loaded if you aren't logged in.
  const { isLoading: playerLoading, data: player } = useApi(
    () => api.timetrialsPlayersRetrieve({ id: user?.player ?? 1 }),
    [user],
    "loadedUser",
  );

  const bioTextArea = useRef(null);
  const aliasTextArea = useRef(null);

  return (
    <>
      <h1>{translations.optionsPageBrowserHeading[lang]}</h1>
      <div className="module">
        <div className="module-content">
          <h2>{translations.optionsPageBrowserOptRegFlagsHeading[lang]}</h2>
          <div style={horizDivStyle}>
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
      <div className="module">
        <div className="module-content">
          <h2>{translations.optionsPageBrowserOptLockTableCellHeading[lang]}</h2>
          <div style={horizDivStyle}>
            <p>{translations.optionsPageBrowserOptLockTableCellParagraph[lang]}</p>
            <input
              type="checkbox"
              onChange={() =>
                setSettings(setSettingKV(settings, "lockTableCells", !settings.lockTableCells))
              }
              defaultChecked={settings.lockTableCells}
            />
          </div>
        </div>
      </div>
      <div className="module">
        <div className="module-content">
          <h2>{translations.optionsPageBrowserOptHueShiftHeading[lang]}</h2>
          <ColorSlider
            paragraphText={translations.constantCategoryNameNoSCLong[lang]}
            valueKey="categoryHueColorNonSC"
          />
          <ColorSlider
            paragraphText={translations.constantCategoryNameSCLong[lang]}
            valueKey="categoryHueColorSC"
          />
          <ColorSlider
            paragraphText={translations.constantCategoryNameUnresLong[lang]}
            valueKey="categoryHueColorUnres"
          />
        </div>
      </div>
      <h1>{translations.optionsPageAccountHeading[lang]}</h1>
      {user === undefined ? (
        <div className="module">
          <div className="module-content">{translations.optionsPageLogInWarning[lang]}</div>
        </div>
      ) : (
        <>
          <div className="module">
            <div className="module-content">
              <Deferred isWaiting={playerLoading}>
                <h2>{translations.optionsPageAccountOptAliasHeading[lang]}</h2>
                <textarea
                  ref={aliasTextArea}
                  style={{ color: "#fff" }}
                  maxLength={64}
                  defaultValue={player?.alias ?? ""}
                  className="module"
                />
                <button
                  onClick={async () => {
                    if (
                      aliasTextArea.current === null ||
                      (aliasTextArea.current as any).value === (player?.alias ?? "")
                    )
                      return;
                    await api.timetrialsProfileUpdate({
                      playerUpdate: { alias: (aliasTextArea.current as any).value },
                    });
                  }}
                >
                  {translations.optionsPageSaveBtnText[lang]}
                </button>
              </Deferred>
            </div>
          </div>
          <div className="module">
            <div className="module-content">
              <Deferred isWaiting={playerLoading}>
                <h2>{translations.optionsPageAccountOptBioHeading[lang]}</h2>
                <textarea
                  ref={bioTextArea}
                  style={{ color: "#fff" }}
                  maxLength={1024}
                  defaultValue={player?.bio ?? ""}
                  className="module"
                />
                <button
                  onClick={async () => {
                    if (
                      bioTextArea.current === null ||
                      (bioTextArea.current as any).value === (player?.bio ?? "")
                    )
                      return;
                    await api.timetrialsProfileUpdate({
                      playerUpdate: { bio: (bioTextArea.current as any).value },
                    });
                  }}
                >
                  {translations.optionsPageSaveBtnText[lang]}
                </button>
              </Deferred>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OptionsPage;
