import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import { useApi } from "../../hooks";
import { I18nContext, translate } from "../../utils/i18n/i18n";
import { setSettingKV, SettingsContext } from "../../utils/Settings";
import { UserContext } from "../../utils/User";
import ColorSlider from "../widgets/ColorSlider";
import Deferred from "../widgets/Deferred";
import PlayerMention from "../widgets/PlayerMention";
import PlayerSelectDropdown from "../widgets/PlayerSelectDropdown";

const OptionsPage = () => {
  const { user } = useContext(UserContext);
  const { lang } = useContext(I18nContext);
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
  const navigate = useNavigate();

  const [newSubmitterId, newSubmitterSetId] = useState(0);
  const [newSubmitterIdFieldError, setNewSubmitterIdFieldError] = useState("");
  const [resetSubmittersList, setResetSubmittersList] = useState(0);
  const { isLoading: submittersLoading, data: submitters } = useApi(
    () => api.timetrialsSubmissionsSubmittersList(),
    [user, resetSubmittersList],
    "loadedSubmitters",
  );

  const [debugActive, setDebugActive] = useState(0);
  useEffect(() => {
    const eventListener = (e: KeyboardEvent) => {
      const debugText = "nobuo";
      if (e.key === debugText[debugActive]) {
        setDebugActive(debugActive + 1);
        if (debugActive === 4) {
          const audio = new Audio("/mkw/audio/nobuo.mp3");
          audio.volume = 0.1;
          audio.play();
        }
      }
    };
    document.addEventListener("keydown", eventListener);
    return () => document.removeEventListener("keydown", eventListener);
  });

  return (
    <>
      <Link
        to=""
        onClick={(e) => {
          e.preventDefault();
          navigate(-1);
        }}
      >
        {translate("genericBackButton", lang)}
      </Link>
      {debugActive === 5 ? (
        <>
          <h1>
            Debug{" "}
            <span style={{ color: "grey", fontSize: ".7rem" }}>
              To activate this, type 'nobuo' ;) --FalB
            </span>
          </h1>
          <div className="module">
            <div className="module-content">
              <h2>Translation Keys</h2>
              <div style={horizDivStyle}>
                <p>
                  Click on this to show key text instead of translations for strings on the site
                  (refresh for it to take effect)
                </p>
                <input
                  type="checkbox"
                  onChange={() =>
                    setSettings(
                      setSettingKV(settings, "debugTranslation", !settings.debugTranslation),
                    )
                  }
                  defaultChecked={settings.debugTranslation}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      <h1>{translate("optionsPageBrowserHeading", lang)}</h1>
      <div className="module">
        <div className="module-content">
          <h2>{translate("optionsPageBrowserOptRegFlagsHeading", lang)}</h2>
          <div style={horizDivStyle}>
            <p>{translate("optionsPageBrowserOptRegFlagsParagraph", lang)}</p>
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
          <h2>{translate("optionsPageBrowserOptLockTableCellHeading", lang)}</h2>
          <div style={horizDivStyle}>
            <p>{translate("optionsPageBrowserOptLockTableCellParagraph", lang)}</p>
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
          <h2>{translate("optionsPageBrowserOptHueShiftHeading", lang)}</h2>
          <ColorSlider
            paragraphText={translate("constantCategoryNameNoSCLong", lang)}
            valueKey="categoryHueColorNonSC"
          />
          <ColorSlider
            paragraphText={translate("constantCategoryNameSCLong", lang)}
            valueKey="categoryHueColorSC"
          />
          <ColorSlider
            paragraphText={translate("constantCategoryNameUnresLong", lang)}
            valueKey="categoryHueColorUnres"
          />
        </div>
      </div>
      <h1>{translate("optionsPageAccountHeading", lang)}</h1>
      {user === undefined ? (
        <div className="module">
          <div className="module-content">{translate("optionsPageLogInWarning", lang)}</div>
        </div>
      ) : (
        <>
          <div className="module">
            <div className="module-content">
              <Deferred isWaiting={submittersLoading}>
                <h2>{translate("optionsPageSubmitterHeading", lang)}</h2>
                <p style={{ marginBottom: "10px" }}>
                  {translate("optionsPageSubmitterParagraph", lang)}
                  {submitters === undefined || submitters.length === 0
                    ? translate("optionsPageSubmitterListNoOne", lang)
                    : submitters.map((r) => <PlayerMention precalcPlayer={r} />)}
                </p>
                <p className="field-error">{newSubmitterIdFieldError}</p>
                <PlayerSelectDropdown
                  id={newSubmitterId}
                  setId={newSubmitterSetId}
                  blacklist
                  restrictSet={[user.player]}
                />
                <button
                  style={{ marginRight: "10px" }}
                  onClick={async () => {
                    if (
                      newSubmitterId !== 0 &&
                      !submitters?.map((r) => r.id).includes(newSubmitterId)
                    )
                      api
                        .timetrialsSubmissionsSubmittersAddCreate({
                          id: newSubmitterId,
                        })
                        .then(
                          () => {
                            setResetSubmittersList(Math.random());
                          },
                          () => {
                            setNewSubmitterIdFieldError(
                              translate("optionsPageSubmitterListNoUserError", lang),
                            );
                          },
                        );
                    newSubmitterSetId(0);
                    setNewSubmitterIdFieldError("");
                  }}
                >
                  {translate("optionsPageAddBtnText", lang)}
                </button>
                <button
                  onClick={async () => {
                    if (
                      newSubmitterId !== 0 &&
                      submitters?.map((r) => r.id).includes(newSubmitterId)
                    )
                      api
                        .timetrialsSubmissionsSubmittersRemoveDestroy({
                          id: newSubmitterId,
                        })
                        .then(() => {
                          setResetSubmittersList(Math.random());
                        });
                    newSubmitterSetId(0);
                    setNewSubmitterIdFieldError("");
                  }}
                >
                  {translate("optionsPageRemoveBtnText", lang)}
                </button>
              </Deferred>
            </div>
          </div>
          <div className="module">
            <div className="module-content">
              <Deferred isWaiting={playerLoading}>
                <h2>{translate("optionsPageAccountOptAliasHeading", lang)}</h2>
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
                  {translate("optionsPageSaveBtnText", lang)}
                </button>
              </Deferred>
            </div>
          </div>
          <div className="module">
            <div className="module-content">
              <Deferred isWaiting={playerLoading}>
                <h2>{translate("optionsPageAccountOptBioHeading", lang)}</h2>
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
                  {translate("optionsPageSaveBtnText", lang)}
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
