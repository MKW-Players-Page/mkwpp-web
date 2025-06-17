import { CategoryEnum } from "../rust_api";
import { TimetrialsRegionsRankingsListTopEnum } from "../api/generated";
import { Settings } from "./Settings";

export const getCategorySiteHue = (category: CategoryEnum, settings: Settings) => {
  switch (category) {
    case 0:
      return settings.categoryHueColorNonSC;
    case 1:
      return settings.categoryHueColorSC;
    case 2:
      return settings.categoryHueColorUnres;
    default:
      return settings.categoryHueColorUnres;
  }
};

export const getCategoryNumerical = (category: string): number => {
  switch (category) {
    case "nonsc":
      return 0;
    case "sc":
      return 1;
    case "unres":
      return 2;
    default:
      return -1;
  }
};

export const getCategoryFromNumber = (categoryId: number): CategoryEnum => {
  switch (categoryId) {
    case 0:
      return CategoryEnum.NonShortcut;
    case 1:
      return CategoryEnum.Shortcut;
    default:
      return CategoryEnum.Unrestricted;
  }
};

export const getHighestValid = (category: CategoryEnum, trackCategories: CategoryEnum[]) => {
  const x = trackCategories.sort((a, b) => a - b).filter((r) => r <= category);
  return x[x.length - 1];
};

/** Return all categories eligible for a given category. For example, eligible categories for
 * Shortcut are Shortcut, since it is the category itself, as well as NonShortcut, since the rules
 * of Shortcut all apply to NonShortcut. NonShortcut returns only itself since it is has the most
 * restrictive ruleset, and Unrestricted returns all categories, since it has no rules.
 */
export const eligibleCategories = (category: CategoryEnum) => {
  return Object.values(CategoryEnum).slice(0, Object.values(CategoryEnum).indexOf(category) + 1);
};

/** Return the highest category eligible for a given category. */
export const highestEligibleCategory = (
  category: CategoryEnum,
  trackCategories: CategoryEnum[],
) => {
  const x = trackCategories.slice(0, Object.values(CategoryEnum).indexOf(category));
  return x[x.length - 1];
};
