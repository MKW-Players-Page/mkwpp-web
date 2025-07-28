import { Slider } from "@mui/material";
import { useContext, useState } from "react";
import { I18nContext, translate } from "../../utils/i18n/i18n";
import {
  browserSettingDefault,
  setSettingKV,
  Settings,
  SettingsContext,
} from "../../utils/Settings";
import "./ColorSlider.css";
import OverwriteColor from "./OverwriteColor";

export interface ColorSliderProps {
  paragraphText: string;
  valueKey: keyof Settings;
}

const ColorSlider = ({ paragraphText, valueKey }: ColorSliderProps) => {
  const { lang } = useContext(I18nContext);
  const { settings, setSettings } = useContext(SettingsContext);
  const [currentColor, setCurrentColor] = useState((settings as any)[valueKey]);
  return (
    <OverwriteColor hue={currentColor}>
      <div className="color-slider">
        <div style={{ flexGrow: 1, width: "100px", maxWidth: "170px", whiteSpace: "nowrap" }}>
          {paragraphText}
        </div>
        <Slider
          style={{ flexGrow: 1, maxWidth: "300px" }}
          className="rainbow-slider"
          value={currentColor}
          max={360}
          onChange={(_, v) => {
            setSettings(setSettingKV(settings, valueKey, v));
            setCurrentColor(v);
          }}
        />
        <button
          style={{ flexShrink: 10, marginBottom: "16px" }}
          onClick={(e) => {
            setSettings(
              setSettingKV(settings, valueKey, browserSettingDefault(valueKey) as number),
            );
            (e.target as any).previousSibling.value = browserSettingDefault(valueKey);
            setCurrentColor(browserSettingDefault(valueKey));
          }}
        >
          {translate("optionsPageResetBtnText", lang)}
        </button>
      </div>
    </OverwriteColor>
  );
};

export default ColorSlider;
