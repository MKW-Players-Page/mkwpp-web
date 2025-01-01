import { useContext } from "react";
import { I18nContext, translate } from "../../utils/i18n/i18n";
import {
  browserSettingDefault,
  setSettingKV,
  Settings,
  SettingsContext,
} from "../../utils/Settings";
import "./ColorSlider.css";

export interface ColorSliderProps {
  paragraphText: string;
  valueKey: keyof Settings;
}

const ColorSlider = ({ paragraphText, valueKey }: ColorSliderProps) => {
  const { lang } = useContext(I18nContext);
  const { settings, setSettings } = useContext(SettingsContext);
  return (
    <div
      style={{
        display: "flex",
        gap: "5px",
        alignItems: "center",
        width: "min(450px,35%)",
        justifyContent: "space-between",
      }}
    >
      <p style={{ width: "120px", whiteSpace: "nowrap" }}>{paragraphText}</p>
      <input
        className="rainbow-slider"
        type="range"
        defaultValue={(settings as any)[valueKey]}
        max={360}
        min={0}
        onChange={(e) => setSettings(setSettingKV(settings, valueKey, parseInt(e.target.value)))}
      />
      <button
        onClick={(e) => {
          setSettings(setSettingKV(settings, valueKey, browserSettingDefault(valueKey) as number));
          (e.target as any).previousSibling.value = browserSettingDefault(valueKey);
        }}
      >
        {translate("optionsPageResetBtnText", lang)}
      </button>
    </div>
  );
};

export default ColorSlider;
