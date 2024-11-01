import Dropdown, { DropdownData } from "../../components/widgets/Dropdown";

import { createContext, useContext } from "react";
import i18nJson from "./i18n.json";
import Flag, { Flags } from "../../components/widgets/Flags";

export type TranslationKey = keyof typeof i18nJson;

export enum Language {
  Italian = "it",
  English = "en",
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
  setLang: (lang: Language, cb: React.Dispatch<React.SetStateAction<Language>>) => void;
  translations: Record<TranslationKey, Record<Language, string>>;
}

export const I18nContext = createContext<I18nContextType>({
  lang: getLang() as Language,
  setLang: () => {},
  translations: i18nJson,
});

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
                [Language.English, "English", <Flag flag={"gb" as keyof typeof Flags} />],
                [Language.Italian, "Italiano", <Flag flag={"it" as keyof typeof Flags} />],
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
