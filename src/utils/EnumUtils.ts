import { CategoryEnum } from "../api";

export const getCategoryName = (category: CategoryEnum) => {
  switch (category) {
    case "nonsc":
      return "Non-SC";
    case "sc":
      return "Shortcut";
    case "unres":
      return "Unrestricted";
    default:
      return "Unknown";
  }
};

/** Return all categories eligible for a given category. For example, eligible categories for
 * Shortcut are Shortcut, since it is the category itself, as well as NonShortcut, since the rules
 * of Shortcut all apply to NonShortcut. NonShortcut returns only itself since it is has the most
 * restrictive ruleset, and Unrestricted returns all categories, since it has no rules.
 */
export const eligibleCategories = (category: CategoryEnum) => {
  return Object.values(CategoryEnum).slice(0, Object.values(CategoryEnum).indexOf(category) + 1);
};
