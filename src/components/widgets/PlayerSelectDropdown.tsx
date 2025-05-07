import { useContext } from "react";

import api, { Player } from "../../api";
import { useApi } from "../../hooks";
import { I18nContext, translate } from "../../utils/i18n/i18n";
import { getRegionById, MetadataContext } from "../../utils/Metadata";
import Dropdown, { DropdownItemSetDataChild } from "./Dropdown";
import { FormContext } from "./Form";
import { FlagIcon } from "./Icon";

export interface PlayerSelectDropdownProps {
  setId: React.Dispatch<React.SetStateAction<number>>;
  id: number;
  filterFn?: (player: Player) => boolean;
  restrictSet?: number[];
  blacklist?: boolean;
  disabled?: boolean;
}

const PlayerSelectDropdown = ({
  id,
  setId,
  filterFn,
  restrictSet,
  blacklist,
  disabled,
}: PlayerSelectDropdownProps) => {
  const { data: players } = useApi(() => api.timetrialsPlayersList(), [], "playerData");
  const metadata = useContext(MetadataContext);
  const { lang } = useContext(I18nContext);
  const defaultValue: DropdownItemSetDataChild = {
    type: "DropdownItemData",
    hidden: true,
    autodeleteText: true,
    element: { text: translate("matchupPageDefaultValue", lang), value: 0 },
  };

  const filter =
    filterFn ??
    ((player: Player) => {
      return (
        restrictSet === undefined ||
        (blacklist ? restrictSet.includes(player.id) : !restrictSet.includes(player.id))
      );
    });

  return (
    <Dropdown
      data={{
        type: "TextInput",
        defaultItemSet: 0,
        value: id,
        valueSetter: setId,
        disabled: disabled,
        data: [
          {
            id: 0,
            children: [
              ...((players
                ?.filter(filter)
                .sort((a, b) => ((a.alias ?? a.name) < (b.alias ?? b.name) ? -1 : 1))
                .map((player) => {
                  return {
                    type: "DropdownItemData",
                    element: {
                      text: player.alias ?? player.name,
                      value: player.id,
                      rightIcon: <FlagIcon region={getRegionById(metadata, player.region ?? 0)} />,
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

export interface PlayerSelectDropdownFieldProps {
  filterFn?: (player: Player) => boolean;
  restrictSet?: number[];
  blacklist?: boolean;
  disabled?: boolean;
  /** Name of the state property to manage */
  field: string;
  /** Field label */
  label?: string;
}

export const PlayerSelectDropdownField = ({
  filterFn,
  restrictSet,
  blacklist,
  field,
  label,
  disabled,
}: PlayerSelectDropdownFieldProps) => {
  const { getValue, setValue, getErrors, disabled: disabledByForm } = useContext(FormContext);

  const errors = getErrors(field);

  return (
    <div className="field">
      {label && <p>{label}</p>}
      <PlayerSelectDropdown
        filterFn={filterFn}
        restrictSet={restrictSet}
        blacklist={blacklist}
        id={parseInt(getValue(field) ?? "1")}
        setId={(id) => {
          setValue(field, id.toString());
        }}
        disabled={disabledByForm || !!disabled}
      />
      {errors.map((error, index) => (
        <p key={index} className="field-error">
          {error}
        </p>
      ))}
    </div>
  );
};

export default PlayerSelectDropdown;
