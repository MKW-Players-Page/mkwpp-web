import { useContext } from "react";

import { FormContext } from "./Form";
import { RegionType, RegionTypeValues, stringToRegionType } from "../../api";
import Dropdown, { DropdownData, DropdownItemSetDataChild } from "./Dropdown";
import { I18nContext, translateRegionType } from "../../utils/i18n/i18n";
import RadioButtons from "./RadioButtons";

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
    <RadioButtons
      disabled={!!disabled}
      data={options.map((r) => {
        return { text: translateRegionType(r, lang), value: r };
      })}
      state={value}
      setState={onChange}
    />
  );
};

const RegionTypeSelect = ({ options, value, onChange, disabled }: RegionTypeSelectProps) => {
  disabled = !!disabled;
  const { lang } = useContext(I18nContext);

  if (options === undefined) {
    options = RegionTypeValues;
  }
  options.sort((a, b) => a - b);

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
              children: options.map((category) => {
                return {
                  type: "DropdownItemData",
                  element: {
                    text: translateRegionType(category, lang),
                    value: category,
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

export interface RegionTypeFieldProps {
  /** Categories to include in select element. Default to all categories if not defined. */
  options?: RegionType[];
  /** Name of the state property to manage */
  field: string;
  /** Field label */
  label: string;
  disabled?: boolean;
}

export const RegionTypeField = ({ options, field, label, disabled }: RegionTypeFieldProps) => {
  const { getValue, setValue, disabled: disabledByForm } = useContext(FormContext);

  return (
    <div className="field">
      <p>{label}</p>
      <RegionTypeSelect
        options={options}
        value={stringToRegionType(getValue(field) ?? "")}
        onChange={(category) => {
          setValue(field, category.toString());
        }}
        disabled={disabled || disabledByForm}
      />
    </div>
  );
};

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

export default RegionTypeSelect;
