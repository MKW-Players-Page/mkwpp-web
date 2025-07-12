import { useContext } from "react";
import { I18nContext, translateLapModeName } from "../../utils/i18n/i18n";
import Dropdown, { DropdownData, DropdownItemSetDataChild } from "./Dropdown";
import { LapModeEnum } from "../../api";

import { FormContext } from "./Form";
import RadioButtons from "./RadioButtons";

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
    <RadioButtons
      disabled={!!disabled}
      data={options.map((r) => {
        return { text: translateLapModeName(r, lang), value: r };
      })}
      state={value}
      setState={onChange}
      className={className}
    />
  );
};

const LapModeSelect = ({ includeOverall, value, onChange, disabled }: LapModeSelectProps) => {
  disabled = !!disabled;
  const { lang } = useContext(I18nContext);

  const options = [
    ...(includeOverall ? [LapModeEnum.Overall] : []),
    LapModeEnum.Course,
    LapModeEnum.Lap,
  ];

  return (
    <Dropdown
      data={
        {
          type: "Normal",
          value: value,
          valueSetter: onChange,
          disabled: disabled,
          defaultItemSet: 0,
          data: [
            {
              id: 0,
              children: options.map((option) => {
                return {
                  type: "DropdownItemData",
                  element: {
                    text: translateLapModeName(option, lang),
                    value: option,
                  },
                } as DropdownItemSetDataChild;
              }),
            },
          ],
        } as DropdownData
      }
    />
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

export const LapModeField = ({ includeOverall, field, label }: LapModeFieldProps) => {
  const { getValue, setValue, disabled } = useContext(FormContext);

  return (
    <div className="field">
      <p>{label}</p>
      <LapModeSelect
        includeOverall={includeOverall}
        value={getValue(field)}
        onChange={(lapMode) => {
          setValue(field, lapMode);
        }}
        disabled={disabled}
      />
    </div>
  );
};

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

export default LapModeSelect;
