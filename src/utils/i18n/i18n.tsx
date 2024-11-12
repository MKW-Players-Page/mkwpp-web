import Dropdown, { DropdownData } from "../../components/widgets/Dropdown";
import { createContext, useContext } from "react";
/* Keys are camel case, and should start with the file name for easy retrieval while editing. */
import i18nJson from "./i18n.json";

import Flag, { Flags } from "../../components/widgets/Flags";

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
  return (window.localStorage.getItem("langCode") ??
    ((Object.values(Language) as string[]).includes(navigator.language)
      ? navigator.language
      : null) ??
    Language.English) as Language;
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
  handleBarKeyReplPairs: [string, string | JSX.Element][],
) => {
  let intermediateArray: (string | JSX.Element)[] = [stringWithHandleBars];
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
                [
                  Language.English,
                  LanguageName.English,
                  <Flag flag={"gb" as keyof typeof Flags} />,
                ],
                [
                  Language.Italian,
                  LanguageName.Italian,
                  <Flag flag={"it" as keyof typeof Flags} />,
                ],
                [Language.French, LanguageName.French, <Flag flag={"fr" as keyof typeof Flags} />],
                [Language.German, LanguageName.German, <Flag flag={"de" as keyof typeof Flags} />],
                [
                  Language.Japanese,
                  LanguageName.Japanese,
                  <Flag flag={"jp" as keyof typeof Flags} />,
                ],
                [
                  Language.Portuguese,
                  LanguageName.Portuguese,
                  <Flag flag={"pt" as keyof typeof Flags} />,
                ],
                [
                  Language.Spanish,
                  LanguageName.Spanish,
                  <Flag flag={"es" as keyof typeof Flags} />,
                ],
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
