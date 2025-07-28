import { useContext } from "react";

import { Region } from "../../api";
import { MetadataContext } from "../../utils/Metadata";

import "./RegionDropdown.css";
import { I18nContext, translateRegionName } from "../../utils/i18n/i18n";
import { FlagIcon } from "./Icon";
import { FormContext } from "./Form";
import { Autocomplete, createFilterOptions, TextField } from "@mui/material";

export interface RegionSelectionDropdownProps {
  ranked: boolean;
  /* Hides all countries with 0 players */
  onePlayerMin: boolean;
  /* Hides all countries with 1 or less players */
  twoPlayerMin: boolean;
  value: Region;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  disabled?: boolean;
}

const RegionSelectionDropdown = ({
  ranked,
  twoPlayerMin,
  onePlayerMin,
  value,
  setValue,
  disabled,
}: RegionSelectionDropdownProps) => {
  const { lang } = useContext(I18nContext);
  const metadata = useContext(MetadataContext);
  if (metadata.isLoading) return <></>;

  const regions = metadata.regions.filter((region) => {
    if (ranked && !region.isRanked) return false;
    if (onePlayerMin && (region.playerCount ?? 0) < 1) return false;
    if (twoPlayerMin && (region.playerCount ?? 0) < 2) return false;
    return true;
  });

  regions.sort(
    (a, b) =>
      (a.parentId ?? 0) - (b.parentId ?? 0) ||
      translateRegionName(a, lang).localeCompare(translateRegionName(b, lang)),
  );

  return (
    <Autocomplete
      value={value}
      style={{ minWidth: "300px" }}
      onChange={(_, v) => {
        if (v === null) return;
        setValue(v);
      }}
      groupBy={(option) =>
        translateRegionName(metadata.getRegionById(option.parentId), lang, "Subregions")
      }
      autoComplete
      autoHighlight
      openOnFocus
      filterSelectedOptions
      options={regions}
      filterOptions={createFilterOptions({
        ignoreCase: true,
        ignoreAccents: true,
      })}
      renderInput={(params) => {
        params.InputProps.startAdornment = <FlagIcon region={value} showRegFlagRegardless />;

        return <TextField {...params} />;
      }}
      getOptionLabel={(region) => translateRegionName(region, lang)}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            {<FlagIcon region={option} showRegFlagRegardless />}
            {translateRegionName(option, lang)}
          </li>
        );
      }}
    />
  );
};

export default RegionSelectionDropdown;

export interface RegionSelectionDropdownFieldProps {
  /** Name of the state property to manage */
  field: string;
  /** Field label */
  label: string;
  disabled?: boolean;
}

export const RegionSelectionDropdownField = ({
  field,
  label,
  disabled,
}: RegionSelectionDropdownFieldProps) => {
  const { getValue, setValue, disabled: disabledByForm } = useContext(FormContext);
  const metadata = useContext(MetadataContext);

  return (
    <div className="field">
      <p>{label}</p>
      <RegionSelectionDropdown
        value={metadata.getRegionById(getValue(field) ?? 1) ?? Region.worldDefault()}
        setValue={(region) => {
          setValue(field, region.id);
        }}
        disabled={disabledByForm || !!disabled}
        ranked={false}
        onePlayerMin={false}
        twoPlayerMin={false}
      />
    </div>
  );
};
