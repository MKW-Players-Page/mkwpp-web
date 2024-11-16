import { createContext } from "react";

export interface Settings {
  version: number;
  showRegFlags: boolean;
  categoryHueColorNonSC: number;
  categoryHueColorSC: number;
  categoryHueColorUnres: number;
}

export const SettingsDataKey = "browserSettings";

export const browserSettingDefault = (key: keyof Settings) => {
  switch (key) {
    case "version":
      return 1;
    case "showRegFlags":
      return false;
    case "categoryHueColorNonSC":
      return 0;
    case "categoryHueColorSC":
      return 100;
    case "categoryHueColorUnres":
      return 216;
    default:
      return undefined;
  }
};

export const setSettingKV = (settings: Settings, key: keyof Settings, value: any) => {
  if (typeof settings[key] !== typeof value) return settings;
  (settings[key] as any) = value;
  return settings;
};

export const browserSettingsLoadParse = (): Settings => {
  const possibleBrowserSettings = localStorage.getItem(SettingsDataKey);
  if (possibleBrowserSettings === undefined || possibleBrowserSettings === null)
    return {
      version: browserSettingDefault("version"),
      showRegFlags: browserSettingDefault("showRegFlags"),
      categoryHueColorNonSC: browserSettingDefault("categoryHueColorNonSC"),
      categoryHueColorSC: browserSettingDefault("categoryHueColorSC"),
      categoryHueColorUnres: browserSettingDefault("categoryHueColorUnres"),
    } as Settings;

  const objectBrowserSettings: Record<string, any> = JSON.parse(possibleBrowserSettings);
  const SettingsKeys = [
    "version",
    "showRegFlags",
    "categoryHueColorNonSC",
    "categoryHueColorSC",
    "categoryHueColorUnres",
  ];
  for (const key in objectBrowserSettings)
    if (!SettingsKeys.includes(key)) delete objectBrowserSettings[key];
  for (const key of SettingsKeys)
    if (objectBrowserSettings[key] === null || objectBrowserSettings[key] === undefined)
      objectBrowserSettings[key] = browserSettingDefault(key as keyof Settings);
  return objectBrowserSettings as Settings;
};

export interface SettingsContextType {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

export const SettingsContext = createContext<SettingsContextType>({
  settings: browserSettingsLoadParse(),
  setSettings: () => {},
});
