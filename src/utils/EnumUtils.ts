import { CategoryEnum } from "../api";
import { TimetrialsRegionsRankingsListTopEnum } from "../api/generated";

export const getCategorySiteHue = (category: CategoryEnum) => {
  switch (category) {
    case "nonsc":
      return 0;
    case "sc":
      return 100;
    case "unres":
      return 216;
    default:
      return 216;
  }
};

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

export const getCategoryNumerical = (category: CategoryEnum) => {
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

export const getHighestValid = (category: CategoryEnum, trackCategories: CategoryEnum[]) => {
  const x = trackCategories
    .sort((a, b) => getCategoryNumerical(a) - getCategoryNumerical(b))
    .filter((r) => getCategoryNumerical(r) <= getCategoryNumerical(category));
  return x.at(-1);
};

export const countryAFTopNumerical = (x: TimetrialsRegionsRankingsListTopEnum) => {
  switch (x) {
    case TimetrialsRegionsRankingsListTopEnum.Records:
      return 1;
    case TimetrialsRegionsRankingsListTopEnum.Top3:
      return 2;
    case TimetrialsRegionsRankingsListTopEnum.Top5:
      return 3;
    case TimetrialsRegionsRankingsListTopEnum.Top10:
      return 4;
    case TimetrialsRegionsRankingsListTopEnum.All:
      return 5;
  }
};

export const countryAFTopToString = (x: TimetrialsRegionsRankingsListTopEnum) => {
  switch (x) {
    case TimetrialsRegionsRankingsListTopEnum.Records:
      return "Records";
    case TimetrialsRegionsRankingsListTopEnum.Top3:
      return "Top 3";
    case TimetrialsRegionsRankingsListTopEnum.Top5:
      return "Top 5";
    case TimetrialsRegionsRankingsListTopEnum.Top10:
      return "Top 10";
    case TimetrialsRegionsRankingsListTopEnum.All:
      return "All";
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
