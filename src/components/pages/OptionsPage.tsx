import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApi } from "../../hooks";
import { I18nContext, translate } from "../../utils/i18n/i18n";
import { setSettingKV, SettingsContext } from "../../utils/Settings";
import { UserContext } from "../../utils/User";
import ColorSlider from "../widgets/ColorSlider";
import Deferred from "../widgets/Deferred";
import PlayerSelectDropdown from "../widgets/PlayerSelectDropdown";
import AccountPasswordChangeForm from "../widgets/options/AccountPasswordChangeForm";
import { Player, User } from "../../api";
import { Switch, TextField } from "@mui/material";
import { arrayEquals } from "../../utils/ArrayUtils";

const OptionsPage = () => {
  const { user } = useContext(UserContext);
  const { lang } = useContext(I18nContext);
  const { settings, setSettings } = useContext(SettingsContext);

  const horizDivStyle = {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  };

  const [forciblyReloadPlayer, triggerForciblyReloadPlayer] = useState(0);
  // it doesn't matter what player is loaded if you aren't logged in.
  const { isLoading: playerLoading, data: player } = useApi(
    () => Player.getPlayer(user?.playerId ?? 1),
    [user, forciblyReloadPlayer],
    "loadedUser",
  );

  const pronounsTextArea = useRef(null);
  const bioTextArea = useRef(null);
  const aliasTextArea = useRef(null);
  const navigate = useNavigate();
  const [resetSubmittersList, setResetSubmittersList] = useState(0);
  const [submitterIds, setSubmitterIds] = useState<number[]>([]);
  const [submitterIdsFieldError, setSubmitterIdsFieldError] = useState("");

  const { isLoading: submittersLoading, data: submitters } = useApi(
    () =>
      User.getSubmitterList(user?.userId ?? 0).then((submitters) => {
        setSubmitterIds(submitters?.map((r) => r.id) ?? []);
        return submitters;
      }),
    [user, resetSubmittersList],
    "loadedSubmitters",
    [{ variable: user?.userId, defaultValue: undefined }],
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
                <Switch
                  onChange={() =>
                    setSettings(
                      setSettingKV(settings, "debugTranslation", !settings.debugTranslation),
                    )
                  }
                  defaultChecked={settings.debugTranslation}
                />
                <p>
                  Click on this to show key text instead of translations for strings on the site
                  (refresh for it to take effect)
                </p>
              </div>
            </div>
          </div>
          <div className="module">
            <div className="module-content">
              <h2>Content Editable</h2>
              <div style={horizDivStyle}>
                <Switch onChange={() => (document.designMode = "on")} defaultChecked={false} />
                <p>Click on this to enable design mode (disables on refresh)</p>
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
            <Switch
              onChange={() =>
                setSettings(setSettingKV(settings, "showRegFlags", !settings.showRegFlags))
              }
              defaultChecked={settings.showRegFlags}
            />
            <p>{translate("optionsPageBrowserOptRegFlagsParagraph", lang)}</p>
          </div>
        </div>
      </div>
      <div className="module">
        <div className="module-content">
          <h2>{translate("optionsPageBrowserOptLockTableCellHeading", lang)}</h2>
          <div style={horizDivStyle}>
            <Switch
              onChange={() =>
                setSettings(setSettingKV(settings, "lockTableCells", !settings.lockTableCells))
              }
              defaultChecked={settings.lockTableCells}
            />
            <p>{translate("optionsPageBrowserOptLockTableCellParagraph", lang)}</p>
          </div>
        </div>
      </div>
      <div className="module">
        <div className="module-content">
          <h2>{translate("optionsPageBrowserOptSidebarAnimHeading", lang)}</h2>
          <div style={horizDivStyle}>
            <Switch
              onChange={() =>
                setSettings(setSettingKV(settings, "sidebarAnim", !settings.sidebarAnim))
              }
              defaultChecked={settings.sidebarAnim}
            />
            <p>{translate("optionsPageBrowserOptSidebarAnimParagraph", lang)}</p>
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
                </p>
                <p className="field-error">{submitterIdsFieldError}</p>
                <PlayerSelectDropdown
                  id={submitterIds}
                  setId={setSubmitterIds}
                  multiple
                  blacklist
                  restrictSet={[user.playerId ?? 0]}
                />
                <button
                  style={{ marginRight: "10px" }}
                  onClick={async () => {
                    if (
                      !arrayEquals(
                        submitters?.map((r) => r.id) ?? [],
                        submitterIds,
                        (a, b) => a - b,
                      )
                    )
                      User.setSubmitterList(user.userId, submitterIds).then(
                        () => {
                          setResetSubmittersList(Math.random());
                        },
                        () => {
                          setSubmitterIdsFieldError(
                            translate("optionsPageSubmitterListNoUserError", lang),
                          );
                        },
                      );
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
                <h2>{translate("optionsPageAccountOptAliasHeading", lang)}</h2>
                <div>
                  <TextField
                    inputProps={{ maxLength: 64, ref: aliasTextArea }}
                    defaultValue={player?.alias ?? ""}
                  />
                </div>
                <button
                  onClick={async () => {
                    const newAlias: string = (aliasTextArea.current as any).value;
                    if (aliasTextArea.current === null || newAlias === (player?.alias ?? ""))
                      return;
                    await User.updateAlias(user.userId, newAlias).then((_) =>
                      triggerForciblyReloadPlayer(Math.random()),
                    );
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
                <div>
                  <TextField
                    inputProps={{ maxLength: 1024, ref: bioTextArea }}
                    defaultValue={player?.bio ?? ""}
                    multiline
                  />
                </div>
                <button
                  onClick={async () => {
                    const newBio: string = (bioTextArea.current as any).value;
                    if (bioTextArea.current === null || newBio === (player?.bio ?? "")) return;
                    await User.updateBio(user.userId, newBio).then((_) =>
                      triggerForciblyReloadPlayer(Math.random()),
                    );
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
                <h2>{translate("optionsPageAccountOptPronounsHeading", lang)}</h2>
                <div>
                  <TextField
                    inputProps={{ maxLength: 30, ref: pronounsTextArea }}
                    defaultValue={player?.pronouns ?? ""}
                  />
                </div>
                <button
                  onClick={async () => {
                    const newPronouns: string = (pronounsTextArea.current as any).value;
                    if (
                      pronounsTextArea.current === null ||
                      newPronouns === (player?.pronouns ?? "")
                    )
                      return;
                    await User.updatePronouns(user.userId, newPronouns).then((_) =>
                      triggerForciblyReloadPlayer(Math.random()),
                    );
                  }}
                >
                  {translate("optionsPageSaveBtnText", lang)}
                </button>
              </Deferred>
            </div>
          </div>
          <div className="module">
            <div className="module-content">
              <h2>{translate("optionsPageAccountOptPasswordHeading", lang)}</h2>
              <AccountPasswordChangeForm />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OptionsPage;
