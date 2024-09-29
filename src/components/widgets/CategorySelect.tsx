import { FormContext } from './Form';
import { CategoryEnum } from "../../api";
import { getCategoryName } from "../../utils/EnumUtils";
import { useContext } from 'react';

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

  if (!options) {
    options = Object.values(CategoryEnum);
  }

  return (
    <select
      className="filter-select module"
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(e.target.value as CategoryEnum)}
    >
      {options.map((category) => (
        <option key={category} value={category}>
          {getCategoryName(category)}
        </option>
      ))}
    </select>
  );
};

export interface CategoryFieldProps {
  /** Categories to include in select element. Default to all categories if not defined. */
  options?: CategoryEnum[];
  /** Name of the state property to manage */
  field: string;
  /** Field label */
  label: string;
};

export const CategoryField = ({ options, field, label }: CategoryFieldProps) => {
  const { getValue, setValue, disabled } = useContext(FormContext);

  return (
    <div className="field">
      <p>{label}</p>
      <CategorySelect
        options={options}
        value={getValue(field) as CategoryEnum}
        onChange={(category) => { setValue(field, category); }}
        disabled={disabled}
      />
    </div>
  );
};

export default CategorySelect;
