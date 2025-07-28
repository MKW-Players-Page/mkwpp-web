import { useContext } from "react";
import { I18nContext, translateLapModeName } from "../../utils/i18n/i18n";
import { LapModeEnum } from "../../api";

import { FormContext } from "./Form";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

export interface LapModeSelectProps {
  /** Whether to include Overall as an option. Defaults to false if not defined. */
  includeOverall?: boolean;
  /** The currently selected option. If included, the value for Overall is `undefined`. */
  value: LapModeEnum;
  /** Callback to invoke when user attempts to select a new lap mode */
  onChange: (lapMode: LapModeEnum) => void;
  /** Whether this element is disabled */
  disabled?: boolean;
  /** Classes to add on top of the element */
  className?: string;
}

export const LapModeRadio = ({
  includeOverall,
  value,
  onChange,
  disabled,
  className,
}: LapModeSelectProps) => {
  const { lang } = useContext(I18nContext);

  const options = [
    ...(includeOverall ? [LapModeEnum.Overall] : []),
    LapModeEnum.Course,
    LapModeEnum.Lap,
  ];

  return (
    <ToggleButtonGroup
      className={className}
      value={value}
      onChange={(_, v: LapModeEnum) => {
        if (v !== null) onChange(v);
      }}
      exclusive
      disabled={disabled || options.length === 1}
    >
      {options.map((option) => (
        <ToggleButton value={option}>{translateLapModeName(option, lang)}</ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export interface LapModeFieldProps {
  /** Categories to include in select element. Default to all categories if not defined. */
  includeOverall?: boolean;
  /** Name of the state property to manage */
  field: string;
  /** Field label */
  label: string;
  disabled?: boolean;
}

export const LapModeRadioField = ({
  includeOverall,
  field,
  label,
  disabled,
}: LapModeFieldProps) => {
  const { getValue, setValue, disabled: disabledByForm } = useContext(FormContext);

  return (
    <div className="field">
      <p>{label}</p>
      <LapModeRadio
        includeOverall={includeOverall}
        value={getValue(field)}
        onChange={(lapMode) => {
          setValue(field, lapMode);
        }}
        disabled={disabledByForm || disabled}
      />
    </div>
  );
};

export default LapModeRadio;
