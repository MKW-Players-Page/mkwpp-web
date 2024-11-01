import api from "../../api";
import { useApi } from "../../hooks";
import Dropdown, { DropdownItemSetDataChild } from "./Dropdown";

export interface PlayerSelectDropdownProps {
  setId: React.Dispatch<React.SetStateAction<number>>;
  id: number;
}

const PlayerSelectDropdown = ({ id, setId }: PlayerSelectDropdownProps) => {
  const { data: players } = useApi(() => api.timetrialsPlayersList());
  const defaultValue: DropdownItemSetDataChild = {
    type: "DropdownItemData",
    hidden: true,
    autodeleteText: true,
    element: { text: "Select Player", value: 0 },
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
              ...((players?.map((player) => {
                return {
                  type: "DropdownItemData",
                  element: { text: player.alias ?? player.name, value: player.id },
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
