import { createContext } from "react";

export interface Settings {
  version: number;
  showRegFlags: boolean;
  lockTableCells: boolean;
  categoryHueColorNonSC: number;
  categoryHueColorSC: number;
  categoryHueColorUnres: number;
  debugTranslation: boolean;
  sidebarAnim: boolean;
}

export const SettingsDataKey = "browserSettings";

export const browserSettingDefault = (key: keyof Settings) => {
  switch (key) {
    case "version":
      return 1;
    case "showRegFlags":
      return false;
    case "lockTableCells":
      return false;
    case "categoryHueColorNonSC":
      return 0;
    case "categoryHueColorSC":
      return 100;
    case "categoryHueColorUnres":
      return 216;
    case "debugTranslation":
      return false;
    case "sidebarAnim":
      return false;
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
      lockTableCells: browserSettingDefault("lockTableCells"),
      categoryHueColorNonSC: browserSettingDefault("categoryHueColorNonSC"),
      categoryHueColorSC: browserSettingDefault("categoryHueColorSC"),
      categoryHueColorUnres: browserSettingDefault("categoryHueColorUnres"),
      debugTranslation: browserSettingDefault("debugTranslation"),
    } as Settings;

  const objectBrowserSettings: Record<string, any> = JSON.parse(possibleBrowserSettings);
  const SettingsKeys = [
    "version",
    "showRegFlags",
    "lockTableCells",
    "categoryHueColorNonSC",
    "categoryHueColorSC",
    "categoryHueColorUnres",
    "debugTranslation",
    "sidebarAnim",
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
