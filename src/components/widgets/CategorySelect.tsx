import { useContext } from "react";

import { FormContext } from "./Form";
import { CategoryEnum, CategoryEnumValues } from "../../api";
import { I18nContext, translateCategoryName } from "../../utils/i18n/i18n";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

export interface CategorySelectProps {
  /** Categories to include in select element. Default to all categories if not defined. */
  options?: CategoryEnum[];
  /** The currently selected category */
  value: CategoryEnum;
  /** Callback to invoke when user attempts to select a new category */
  onChange: (category: CategoryEnum) => void;
  /** Whether this element is disabled */
  disabled?: boolean;
}

export const CategoryRadio = ({ options, value, onChange, disabled }: CategorySelectProps) => {
  const { lang } = useContext(I18nContext);

  if (options === undefined) {
    options = CategoryEnumValues;
  }
  options.sort((a, b) => a - b);

  return (
    <ToggleButtonGroup
      value={value}
      onChange={(_, v: CategoryEnum) => {
        if (v !== null) onChange(v);
      }}
      exclusive
      disabled={disabled || options.length === 1}
    >
      {options.map((option) => (
        <ToggleButton value={option}>{translateCategoryName(option, lang)}</ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export interface CategoryFieldProps {
  /** Categories to include in select element. Default to all categories if not defined. */
  options?: CategoryEnum[];
  /** Name of the state property to manage */
  field: string;
  /** Field label */
  label: string;
  disabled?: boolean;
}

export const CategoryRadioField = ({ options, field, label, disabled }: CategoryFieldProps) => {
  const { getValue, setValue, disabled: disabledByForm } = useContext(FormContext);

  return (
    <div className="field">
      <p>{label}</p>
      <CategoryRadio
        options={options}
        value={getValue(field)}
        onChange={(category) => {
          setValue(field, category);
        }}
        disabled={disabledByForm || disabled}
      />
    </div>
  );
};

export default CategoryRadio;
