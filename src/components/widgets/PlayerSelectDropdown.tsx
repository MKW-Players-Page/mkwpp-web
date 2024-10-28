import api from "../../api";
import { useApi } from "../../hooks";
import Dropdown from "./Dropdown";

export interface PlayerSelectDropdownProps {
    setId: React.Dispatch<React.SetStateAction<number>>
    id: number
}

const PlayerSelectDropdown = ({id, setId}: PlayerSelectDropdownProps) => {
    const { data: players } = useApi(() => api.timetrialsPlayersList());
    return <Dropdown data={{
      type: "TextInput",
      defaultItemSet: 0,
      value: id,
      valueSetter: setId,
      data: [
        {
          id: 0,
          children:
            players?.map((player) => {
              return {
                type: "DropdownItemData",
                element: { text: player.alias ?? player.name, value: player.id },
              };
            }) ?? [],
        },
      ],
    }} />
     
}

 export  default PlayerSelectDropdown;