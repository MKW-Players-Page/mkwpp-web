import { CategoryEnum } from '../../api';
import { getCategoryName } from '../../utils/EnumUtils';
import './CategorySelect.css';

export interface CategorySelectProps {
    /** Categories to include in select element. Default to all categories if not defined. */
    options?: CategoryEnum[];
    /** The currently selected category */
    value: CategoryEnum;
    /** Callback to invoke when user attempts to select a new category */
    onChange: (category: CategoryEnum) => void;
};

const CategorySelect = ({ options, value, onChange }: CategorySelectProps) => {
    if (!options) {
        options = Object.values(CategoryEnum);
    }

    return (
        <select className="category-select module" value={value} onChange={(e) => onChange(e.target.value as CategoryEnum)}>
            {options.map((category) => (
                <option key={category} value={category}>
                    {getCategoryName(category)}
                </option>
            ))}
        </select>
    );
};

export default CategorySelect;
