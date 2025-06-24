import Dropdown, { DropdownData } from "../../components/widgets/Dropdown";
import { createContext, useContext } from "react";
/* Keys are camel case, and should start with the file name for easy retrieval while editing. */
import i18nJson from "./i18n.json";

import { Metadata } from "../Metadata";
import { browserSettingsLoadParse } from "../Settings";
import { FlagIcon } from "../../components/widgets";
import {
  Region,
  RegionType,
  CategoryEnum,
  Track,
  LapModeEnum,
  StandardLevel,
} from "../../api";

export type TranslationKey = keyof typeof i18nJson;
export type TranslationJson = Record<TranslationKey, Record<Language, string>>;

export enum Language {
  English = "en",
  Italian = "it",
  French = "fr",
  German = "de",
  Japanese = "jp",
  Portuguese = "pt",
  Spanish = "es",
}

export enum LanguageName {
  English = "English",
  Italian = "Italiano",
  French = "Français",
  German = "Deutsch",
  Japanese = "日本語",
  Portuguese = "Português",
  Spanish = "Español",
}

/** Get selected language from localStorage. */
export const getLang = (): Language => {
  return (
    (Object.values(Language) as string[]).includes(
      window.localStorage.getItem("langCode") ?? "DEFINITELYNOTALANGCODE",
    )
      ? window.localStorage.getItem("langCode")
      : (((Object.values(Language) as string[]).includes(navigator.language)
          ? navigator.language
          : null) ?? Language.English)
  ) as Language;
};

export interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  translations: TranslationJson;
}

export const I18nContext = createContext<I18nContextType>({
  lang: getLang() as Language,
  setLang: () => {},
  translations: i18nJson,
});

export const handleBars = (
  stringWithHandleBars: string,
  handleBarKeyReplPairs: [string, string | React.ReactNode][],
) => {
  let intermediateArray: (string | React.ReactNode)[] = [stringWithHandleBars];
  for (let [key, value] of handleBarKeyReplPairs) {
    intermediateArray = intermediateArray
      .map((part) => {
        if (typeof part !== "string") return part;
        let out = [];
        const parts = part.split(`{{${key}}}`);
        for (let partX of parts) {
          out.push(partX);
          out.push(value);
        }
        return out.slice(0, out.length - 1);
      })
      .flat();
  }

  return <>{intermediateArray}</>;
};

export const LanguageDropdown = () => {
  const context = useContext(I18nContext);
  return (
    <Dropdown
      data={
        {
          type: "Normal",
          defaultItemSet: 0,
          value: context.lang,
          valueSetter: context.setLang,
          data: [
            {
              id: 0,
              children: [
                [Language.English, LanguageName.English, <FlagIcon region={"gb"} />],
                [Language.Italian, LanguageName.Italian, <FlagIcon region={"it"} />],
                [Language.French, LanguageName.French, <FlagIcon region={"fr"} />],
                [Language.German, LanguageName.German, <FlagIcon region={"de"} />],
                [Language.Japanese, LanguageName.Japanese, <FlagIcon region={"jp"} />],
                [Language.Portuguese, LanguageName.Portuguese, <FlagIcon region={"pt"} />],
                [Language.Spanish, LanguageName.Spanish, <FlagIcon region={"es"} />],
              ].map(([value, text, rightIcon]) => {
                return {
                  type: "DropdownItemData",
                  element: { text, value, rightIcon },
                };
              }),
            },
          ],
        } as DropdownData
      }
    />
  );
};

export const translate = (key: TranslationKey, lang: Language): string => {
  if (false || browserSettingsLoadParse().debugTranslation) return key; // DEBUG
  if (!Object.keys(i18nJson).includes(key)) return `key '${key}' doesn't exist!`;
  return i18nJson[key][lang];
};

export const translateTrack = (track: Track | undefined | null, lang: Language): string => {
  if (track === undefined || track === null) return "Track Not Loaded";
  return translate(`constantTrackName${track.abbr.toUpperCase()}` as TranslationKey, lang);
};

/** The full name of a region is constructed as follows:
 *
 * 1. If the region type is `Subnational`, return the name of the region followed by the name of
 *    its parent separated by a comma.
 * 2. Otherwise, simply return the region name.
 *
 * @param metadata The Metadata object returned from `useContext(MetadataContext)`
 * @param regionId The id of the region
 * @returns The full name of the region, or `undefined` if no region with the given id exists.
 */
export const translateRegionNameFull = (
  metadata: Metadata,
  lang: Language,
  regionCompute: number | Region | undefined | null,
  turnWorldToUnknown = false,
) => {
  let region: typeof regionCompute = undefined;
  if (typeof regionCompute === "number") {
    region = metadata.getRegionById(regionCompute);
  } else {
    region = regionCompute;
  }
  if (region === undefined || region === null || turnWorldToUnknown)
    return translate("constantRegionXX", lang);

  if (region.parentId && region.regionType === RegionType.Subnational) {
    const parent = metadata.getRegionById(region.parentId);
    if (parent) {
      return `${translateRegionName(parent, lang)}, ${translateRegionName(region, lang)}`;
    }
  }

  return translateRegionName(region, lang);
};

export const translateRegionName = (
  region: undefined | null | Region,
  lang: Language,
  type?: "Region" | "Subregions" | "Record" | undefined | null,
) => {
  if (!region) {
    return translate(`constantRegionXX`, lang);
  }
  return translate(
    `constantRegion${type === "Record" || type === "Subregions" ? type : ""}${region.code}` as TranslationKey,
    lang,
  );
};

export const translateCategoryName = (category: CategoryEnum, lang: Language): string => {
  switch (category) {
    case CategoryEnum.NonShortcut:
      return translate("constantCategoryNameNoSCShort", lang);
    case CategoryEnum.Shortcut:
      return translate("constantCategoryNameSCShort", lang);
    case CategoryEnum.Unrestricted:
      return translate("constantCategoryNameUnresLong", lang);
  }
};

export const translateLapModeName = (lapMode: LapModeEnum, lang: Language): string => {
  switch (lapMode) {
    case LapModeEnum.Course:
      return translate("constantLapModeCourse", lang);
    case LapModeEnum.Lap:
      return translate("constantLapModeLap", lang);
    case LapModeEnum.Overall:
      return translate("constantLapModeOverall", lang);
  }
};

export const translateStandardName = (
  standardLevel: StandardLevel | undefined | string,
  lang: Language,
): string => {
  return typeof standardLevel === "string"
    ? translate(`constantStandardLevel${standardLevel}` as TranslationKey, lang)
    : translate(`constantStandardLevel${standardLevel?.code ?? "NW"}` as TranslationKey, lang);
};
