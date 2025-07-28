import { useContext } from "react";
import { useApi } from "../../hooks";
import { PlayerBasic } from "../../api";
import { MetadataContext } from "../../utils/Metadata";
import { FormContext } from "./Form";
import { FlagIcon } from "./Icon";
import { Autocomplete, Chip, createFilterOptions, TextField } from "@mui/material";
import Deferred from "./Deferred";
import PlayerMention from "./PlayerMention";

export interface PlayerSelectDropdownProps {
  setId:
    | React.Dispatch<React.SetStateAction<number>>
    | React.Dispatch<React.SetStateAction<number[]>>;
  id: number | number[];
  restrictSet?: number[];
  blacklist?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  label?: string;
}

const PlayerSelectDropdown = ({
  id,
  setId,
  restrictSet,
  blacklist,
  disabled = false,
  multiple = false,
  label,
}: PlayerSelectDropdownProps) => {
  const { data: players, isLoading } = useApi(
    () =>
      PlayerBasic.getPlayerList().then((players) =>
        players
          .filter((player) =>
            restrictSet
              ? blacklist
                ? !restrictSet.includes(player.id)
                : restrictSet.includes(player.id)
              : true,
          )
          .sort((a, b) => (a.alias ?? a.name).localeCompare(b.alias ?? b.name)),
      ),
    [],
    "playerData",
  );

  if (multiple)
    return (
      <Deferred isWaiting={isLoading}>
        <PlayerSelectDropdownMultiple
          id={id as number[]}
          setId={setId as React.Dispatch<React.SetStateAction<number[]>>}
          disabled={disabled}
          players={players}
          label={label}
        />
      </Deferred>
    );

  return (
    <Deferred isWaiting={isLoading}>
      <PlayerSelectDropdownSingle
        id={id as number}
        setId={setId as React.Dispatch<React.SetStateAction<number>>}
        disabled={disabled}
        players={players}
        label={label}
      />
    </Deferred>
  );
};

export interface PlayerSelectDropdownPropsMultiple {
  setId: React.Dispatch<React.SetStateAction<number[]>>;
  id: number[];
  disabled?: boolean;
  players?: PlayerBasic[];
  label?: string;
}

const PlayerSelectDropdownMultiple = ({
  id,
  setId,
  disabled = false,
  players,
  label,
}: PlayerSelectDropdownPropsMultiple) => {
  const metadata = useContext(MetadataContext);

  return (
    <Autocomplete
      value={id.map((a) => players?.find((r) => r.id === a) as PlayerBasic)}
      onChange={(_, v) => {
        if (v === null) {
          setId([]);
          return;
        }
        setId(v.map((r) => r.id));
      }}
      disabled={disabled}
      autoComplete
      autoHighlight
      openOnFocus
      multiple
      filterSelectedOptions
      options={players ?? []}
      filterOptions={createFilterOptions({
        limit: 100,
        ignoreCase: true,
        ignoreAccents: true,
      })}
      renderInput={(params) => <TextField label={label} {...params} />}
      getOptionLabel={(player) => player.alias ?? player.name}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            <PlayerMention redirect={false} xxFlag playerOrId={option} />
          </li>
        );
      }}
      renderTags={(value: PlayerBasic[], getItemProps) => {
        return value.map((option, index: number) => {
          const { key, ...itemProps } = getItemProps({ index });
          return (
            <Chip
              variant="outlined"
              icon={<FlagIcon region={metadata.getRegionById(option.regionId)} />}
              label={option.alias ?? option.name ?? ""}
              key={key}
              {...itemProps}
            />
          );
        });
      }}
    />
  );
};

export interface PlayerSelectDropdownPropsSingle {
  setId: React.Dispatch<React.SetStateAction<number>>;
  id: number;
  disabled?: boolean;
  players?: PlayerBasic[];
  label?: string;
}

const PlayerSelectDropdownSingle = ({
  id,
  setId,
  disabled = false,
  players,
  label,
}: PlayerSelectDropdownPropsSingle) => {
  const metadata = useContext(MetadataContext);

  return (
    <Autocomplete
      value={players?.find((r) => r.id === id) as PlayerBasic}
      onChange={(_, v) => {
        if (v === null) return;
        setId(v.id);
      }}
      autoComplete
      autoHighlight
      openOnFocus
      filterSelectedOptions
      options={players ?? []}
      disabled={disabled}
      filterOptions={createFilterOptions({
        limit: 100,
        ignoreCase: true,
        ignoreAccents: true,
      })}
      renderInput={(params) => {
        params.InputProps.startAdornment = (
          <FlagIcon region={metadata.getRegionById(players?.find((r) => r.id === id)?.regionId)} />
        );

        return <TextField label={label} {...params} />;
      }}
      getOptionLabel={(player) => player.alias ?? player.name}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            <PlayerMention redirect={false} xxFlag playerOrId={option} />
          </li>
        );
      }}
    />
  );
};

export interface PlayerSelectDropdownFieldProps {
  restrictSet?: number[];
  blacklist?: boolean;
  disabled?: boolean;
  /** Name of the state property to manage */
  field: string;
  /** Field label */
  label: string;
}

export const PlayerSelectDropdownField = ({
  restrictSet,
  blacklist,
  field,
  label,
  disabled,
}: PlayerSelectDropdownFieldProps) => {
  const { getValue, setValue, disabled: disabledByForm } = useContext(FormContext);

  const setId = ((id: number) => setValue(field, id)) as React.Dispatch<
    React.SetStateAction<number>
  >;
  return (
    <div className="field">
      <PlayerSelectDropdown
        restrictSet={restrictSet}
        blacklist={blacklist}
        id={getValue(field)}
        setId={setId}
        disabled={disabledByForm || !!disabled}
        label={label}
      />
    </div>
  );
};

export default PlayerSelectDropdown;
