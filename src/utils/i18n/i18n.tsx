import Dropdown, { DropdownData } from "../../components/widgets/Dropdown";

import { createContext, useContext } from "react";

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
}

export const I18nContext = createContext<I18nContextType>({
  lang: getLang() as Language,
  setLang: () => {},
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
                [Language.English, "English"],
                [Language.Italian, "Italiano"],
              ].map(([value, text]) => {
                return {
                  type: "DropdownItemData",
                  element: { text, value },
                };
              }),
            },
          ],
        } as DropdownData
      }
    />
  );
};
