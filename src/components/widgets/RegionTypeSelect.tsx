import { useContext } from "react";

import { FormContext } from "./Form";
import { RegionType, RegionTypeValues } from "../../api";
import { I18nContext, translateRegionType } from "../../utils/i18n/i18n";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

export interface RegionTypeSelectProps {
  /** Categories to include in select element. Default to all categories if not defined. */
  options?: RegionType[];
  /** The currently selected category */
  value: RegionType;
  /** Callback to invoke when user attempts to select a new category */
  onChange: (category: RegionType) => void;
  /** Whether this element is disabled */
  disabled?: boolean;
}

export const RegionTypeRadio = ({ options, value, onChange, disabled }: RegionTypeSelectProps) => {
  const { lang } = useContext(I18nContext);

  if (options === undefined) {
    options = RegionTypeValues;
  }
  options.sort((a, b) => a - b);

  return (
    <ToggleButtonGroup
      value={value}
      onChange={(_, v: RegionType) => {
        if (v !== null) onChange(v);
      }}
      exclusive
      disabled={disabled || options.length === 1}
    >
      {options.map((option) => (
        <ToggleButton value={option}>{translateRegionType(option, lang)}</ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export interface RegionTypeFieldProps {
  /** Categories to include in select element. Default to all categories if not defined. */
  options?: RegionType[];
  /** Name of the state property to manage */
  field: string;
  /** Field label */
  label: string;
  disabled?: boolean;
}

export const RegionTypeRadioField = ({ options, field, label, disabled }: RegionTypeFieldProps) => {
  const { getValue, setValue, disabled: disabledByForm } = useContext(FormContext);

  return (
    <div className="field">
      <p>{label}</p>
      <RegionTypeRadio
        options={options}
        value={getValue(field)}
        onChange={(regionType) => {
          setValue(field, regionType);
        }}
        disabled={disabledByForm || disabled}
      />
    </div>
  );
};

export default RegionTypeRadio;
