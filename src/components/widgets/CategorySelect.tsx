import { useContext } from "react";

import { FormContext } from "./Form";
import { CategoryEnum, CategoryEnumValues, stringToCategoryEnum } from "../../rust_api";
import Dropdown, { DropdownData, DropdownItemSetDataChild } from "./Dropdown";
import { I18nContext, translateCategoryName } from "../../utils/i18n/i18n";
import RadioButtons from "./RadioButtons";

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
    <RadioButtons
      disabled={!!disabled}
      data={options.map((r) => {
        return { text: translateCategoryName(r, lang), value: r };
      })}
      state={value}
      setState={onChange}
    />
  );
};

const CategorySelect = ({ options, value, onChange, disabled }: CategorySelectProps) => {
  disabled = !!disabled;
  const { lang } = useContext(I18nContext);

  if (options === undefined) {
    options = CategoryEnumValues;
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
                    text: translateCategoryName(category, lang),
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

export interface CategoryFieldProps {
  /** Categories to include in select element. Default to all categories if not defined. */
  options?: CategoryEnum[];
  /** Name of the state property to manage */
  field: string;
  /** Field label */
  label: string;
  disabled?: boolean;
}

export const CategoryField = ({ options, field, label, disabled }: CategoryFieldProps) => {
  const { getValue, setValue, disabled: disabledByForm } = useContext(FormContext);

  return (
    <div className="field">
      <p>{label}</p>
      <CategorySelect
        options={options}
        value={stringToCategoryEnum(getValue(field) ?? "")}
        onChange={(category) => {
          setValue(field, category.toString());
        }}
        disabled={disabled || disabledByForm}
      />
    </div>
  );
};

export const CategoryRadioField = ({ options, field, label, disabled }: CategoryFieldProps) => {
  const { getValue, setValue, disabled: disabledByForm } = useContext(FormContext);

  return (
    <div className="field">
      <p>{label}</p>
      <CategoryRadio
        options={options}
        value={stringToCategoryEnum(getValue(field) ?? "")}
        onChange={(category) => {
          setValue(field, category.toString());
        }}
        disabled={disabledByForm || disabled}
      />
    </div>
  );
};

export default CategorySelect;
