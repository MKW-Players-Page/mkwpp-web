import { createContext, useContext } from "react";
/* Keys are camel case, and should start with the file name for easy retrieval while editing. */
import i18nJson from "./i18n.json";

import {
  deDE as deDEpickers,
  itIT as itITpickers,
  jaJP as jaJPpickers,
  ptPT as ptPTpickers,
  ptBR as ptBRpickers,
  esES as esESpickers,
  enUS as enUSpickers,
  frFR as frFRpickers,
} from "@mui/x-date-pickers/locales";
import {
  deDE as deDEcore,
  itIT as itITcore,
  jaJP as jaJPcore,
  ptPT as ptPTcore,
  ptBR as ptBRcore,
  esES as esEScore,
  enUS as enUScore,
  frFR as frFRcore,
} from "@mui/material/locale";

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
  SubmissionStatus,
  CountryRankingsTopEnum,
} from "../../api";
import { MenuItem, OutlinedInput, Select } from "@mui/material";

export type TranslationKey = keyof typeof i18nJson;
export type TranslationJson = Record<TranslationKey, Record<Language, string>>;

export enum Language {
  English = "en",
  Italian = "it",
  French = "fr",
  German = "de",
  Japanese = "jp",
  Portuguese = "pt",
  Brazilian = "br",
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

export const getMuiXLocaleText = (lang: Language) => {
  switch (lang) {
    case Language.English:
      return { core: enUScore, pickers: enUSpickers };
    case Language.German:
      return { core: deDEcore, pickers: deDEpickers };
    case Language.Italian:
      return { core: itITcore, pickers: itITpickers };
    case Language.Japanese:
      return { core: jaJPcore, pickers: jaJPpickers };
    case Language.Portuguese:
      return { core: ptPTcore, pickers: ptPTpickers };
    case Language.Brazilian:
      return { core: ptBRcore, pickers: ptBRpickers };
    case Language.Spanish:
      return { core: esEScore, pickers: esESpickers };
    case Language.French:
      return { core: frFRcore, pickers: frFRpickers };
  }
};

export const langCodeToLanguageName = (lang: Language) => {
  switch (lang) {
    case Language.English:
      return LanguageName.English;
    case Language.German:
      return LanguageName.German;
    case Language.Italian:
      return LanguageName.Italian;
    case Language.Japanese:
      return LanguageName.Japanese;
    case Language.Portuguese:
    case Language.Brazilian:
      return LanguageName.Portuguese;
    case Language.Spanish:
      return LanguageName.Spanish;
    case Language.French:
      return LanguageName.French;
  }
};

export const langCodeToFlagIcon = (lang: Language) => {
  switch (lang) {
    case Language.English:
      return <FlagIcon region={"gb"} />;
    default:
      return <FlagIcon region={lang} />;
  }
};

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
  for (const [key, value] of handleBarKeyReplPairs) {
    intermediateArray = intermediateArray
      .map((part) => {
        if (typeof part !== "string") return part;
        const out = [];
        const parts = part.split(`{{${key}}}`);
        for (const partX of parts) {
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
  const { lang, setLang } = useContext(I18nContext);
  return (
    <Select
      style={{ marginTop: "15px" }}
      value={lang}
      onChange={(e) => {
        if (e.target.value === null) return;
        setLang(e.target.value);
      }}
      fullWidth
      input={<OutlinedInput size="small" />}
      renderValue={() => (
        <span>
          {langCodeToFlagIcon(lang)}
          {langCodeToLanguageName(lang)}
        </span>
      )}
    >
      {[
        Language.English,
        Language.Italian,
        Language.French,
        Language.German,
        Language.Japanese,
        Language.Portuguese,
        Language.Brazilian,
        Language.Spanish,
      ].map((lang) => (
        <MenuItem key={lang} value={lang}>
          {langCodeToFlagIcon(lang)}
          {langCodeToLanguageName(lang)}
        </MenuItem>
      ))}
    </Select>
  );
};

export const translate = (key: TranslationKey, lang: Language): string => {
  if (browserSettingsLoadParse().debugTranslation) return key; // DEBUG
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
  if (
    region === undefined ||
    region === null ||
    (turnWorldToUnknown && region.regionType === RegionType.World)
  )
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

export const translateRegionType = (regionType: undefined | null | RegionType, lang: Language) => {
  return translate(`constantRegionType${regionType}` as TranslationKey, lang);
};

export const translateSubmissionStatus = (
  submissionStatus: undefined | null | SubmissionStatus,
  lang: Language,
) => {
  return translate(`constantSubmissionStatus${submissionStatus}` as TranslationKey, lang);
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

export const translateCountryRankingsTopEnum = (
  topType: CountryRankingsTopEnum,
  lang: Language,
): string => {
  switch (topType) {
    case CountryRankingsTopEnum.Records:
      return translate("constantCountryRankingsTopEnumRecords", lang);
    case CountryRankingsTopEnum.Top3:
      return translate("constantCountryRankingsTopEnumTop3", lang);
    case CountryRankingsTopEnum.Top5:
      return translate("constantCountryRankingsTopEnumTop5", lang);
    case CountryRankingsTopEnum.Top10:
      return translate("constantCountryRankingsTopEnumTop10", lang);
    case CountryRankingsTopEnum.All:
      return translate("constantCountryRankingsTopEnumAll", lang);
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
