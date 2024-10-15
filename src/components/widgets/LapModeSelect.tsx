import { useContext } from "react";
import Dropdown, { DropdownItem } from "./Dropdown";

import { FormContext } from "./Form";

export enum LapModeEnum {
  Course = "course",
  Lap = "lap",
  Overall = "overall",
}

export interface LapModeSelectProps {
  /** Whether to include Overall as an option. Defaults to false if not defined. */
  includeOverall?: boolean;
  /** The currently selected option. If included, the value for Overall is `undefined`. */
  value: LapModeEnum;
  /** Callback to invoke when user attempts to select a new lap mode */
  onChange: (lapMode: LapModeEnum) => void;
  /** Whether this element is disabled */
  disabled?: boolean;
}

const LapModeSelect = ({ includeOverall, value, onChange, disabled }: LapModeSelectProps) => {
  disabled = !!disabled;

  const options = [
    ...(includeOverall ? [LapModeEnum.Overall] : []),
    LapModeEnum.Course,
    LapModeEnum.Lap,
  ];

  return (
    <Dropdown disabled={disabled} valueSetter={onChange}>
      {options.map((option) => (
        <DropdownItem
          text={Object.keys(LapModeEnum)[Object.values(LapModeEnum).indexOf(option)]}
          value={option}
        />
      ))}
    </Dropdown>
  );
};

export interface LapModeFieldProps {
  /** Categories to include in select element. Default to all categories if not defined. */
  includeOverall?: boolean;
  /** Name of the state property to manage */
  field: string;
  /** Field label */
  label: string;
}

export const LapModeField = ({ includeOverall, field, label }: LapModeFieldProps) => {
  const { getValue, setValue, disabled } = useContext(FormContext);

  return (
    <div className="field">
      <p>{label}</p>
      <LapModeSelect
        includeOverall={includeOverall}
        value={getValue(field) as LapModeEnum}
        onChange={(lapMode) => {
          setValue(field, lapMode);
        }}
        disabled={disabled}
      />
    </div>
  );
};

export default LapModeSelect;
