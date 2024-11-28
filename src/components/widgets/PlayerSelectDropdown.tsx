import { useContext } from "react";
import api from "../../api";
import { useApi } from "../../hooks";
import { I18nContext } from "../../utils/i18n/i18n";
import Dropdown, { DropdownItemSetDataChild } from "./Dropdown";

export interface PlayerSelectDropdownProps {
  setId: React.Dispatch<React.SetStateAction<number>>;
  id: number;
}

const PlayerSelectDropdown = ({ id, setId }: PlayerSelectDropdownProps) => {
  const { data: players } = useApi(() => api.timetrialsPlayersList(), [], "playerData");
  const { translations, lang } = useContext(I18nContext);
  const defaultValue: DropdownItemSetDataChild = {
    type: "DropdownItemData",
    hidden: true,
    autodeleteText: true,
    element: { text: translations.matchupPageDefaultValue[lang], value: 0 },
  };
  return (
    <Dropdown
      data={{
        type: "TextInput",
        defaultItemSet: 0,
        value: id,
        valueSetter: setId,
        data: [
          {
            id: 0,
            children: [
              ...((players
                ?.sort((a, b) => ((a.alias ?? a.name) < (b.alias ?? b.name) ? -1 : 1))
                .map((player) => {
                  return {
                    type: "DropdownItemData",
                    element: {
                      text: player.alias ?? player.name,
                      value: player.id,
                    },
                  };
                }) as DropdownItemSetDataChild[]) ?? []),
              defaultValue,
            ],
          },
        ],
      }}
    />
  );
};

export default PlayerSelectDropdown;
