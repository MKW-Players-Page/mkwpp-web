import { useContext } from "react";

import { FormContext } from "./Form";
import { CategoryEnum } from "../../api";
import Dropdown, { DropdownData, DropdownItemSetDataChild } from "./Dropdown";
import { getCategoryNameTranslationKey, getCategoryNumerical } from "../../utils/EnumUtils";
import { I18nContext } from "../../utils/i18n/i18n";

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

const CategorySelect = ({ options, value, onChange, disabled }: CategorySelectProps) => {
  disabled = !!disabled;
  const { translations, lang } = useContext(I18nContext);

  if (!options) {
    options = Object.values(CategoryEnum);
  }
  options.sort((a, b) => getCategoryNumerical(a) - getCategoryNumerical(b));

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
                    text: translations[getCategoryNameTranslationKey(category)][lang],
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
}

export const CategoryField = ({ options, field, label }: CategoryFieldProps) => {
  const { getValue, setValue, disabled } = useContext(FormContext);

  return (
    <div className="field">
      <p>{label}</p>
      <CategorySelect
        options={options}
        value={getValue(field) as CategoryEnum}
        onChange={(category) => {
          setValue(field, category);
        }}
        disabled={disabled}
      />
    </div>
  );
};

export default CategorySelect;
