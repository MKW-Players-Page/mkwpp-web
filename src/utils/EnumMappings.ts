import { CategoryEnum } from '../api';

export const getCategoryName = (category: CategoryEnum) => {
  switch (category) {
    case 'nonsc': return "Non-SC";
    case 'sc': return "Shortcut";
    case 'unres': return "Unrestricted";
    default: return "Unknown";
  }
};
