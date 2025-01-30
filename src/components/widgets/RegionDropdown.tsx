import { useContext } from "react";

import { Region } from "../../api";
import { getFirstRankedParent, getRegionById, MetadataContext } from "../../utils/Metadata";

import "./RegionDropdown.css";
import Dropdown, {
  DropdownData,
  DropdownItemData,
  DropdownItemSetDataChild,
  DropdownItemSetSetterData,
} from "./Dropdown";
import { I18nContext, translate, translateRegionName } from "../../utils/i18n/i18n";
import { FlagIcon } from "./Icon";

export interface RegionSelectionDropdownProps {
  ranked: boolean;
  onePlayerMin: boolean;
  twoPlayerMin: boolean;
  value: Region;
  setValue: React.Dispatch<React.SetStateAction<any>>;
}

const RegionSelectionDropdown = ({
  ranked,
  twoPlayerMin,
  onePlayerMin,
  value,
  setValue,
}: RegionSelectionDropdownProps) => {
  const { lang } = useContext(I18nContext);
  const metadata = useContext(MetadataContext);
  if (metadata.isLoading) return <></>;
  const regions = metadata.regions.length === 1 ? [value] : metadata.regions;

  const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr.reduce(
      (groups, item) => {
        (groups[key(item)] ||= []).push(item);
        return groups;
      },
      {} as Record<K, T[]>,
    );

  const dropdownData: DropdownData = {
    type: "Normal",
    defaultItemSet: (ranked ? getFirstRankedParent(metadata, value)?.id : value.parent) ?? 0,
    value: value,
    valueSetter: setValue,
    data: [],
  };

  const sortedRegions = groupBy(
    regions.filter((r) => r.isRanked || !ranked),
    (i) => (ranked ? getFirstRankedParent(metadata, i)?.id : i.parent) ?? 0,
  );

  for (let [parentId, children] of Object.entries(sortedRegions)) {
    const parentIdConv = parseInt(parentId);

    let outChildren: DropdownItemSetDataChild[] = [];
    let parent = getRegionById(metadata, parentIdConv);

    if (parent !== undefined)
      outChildren.push({
        type: "DropdownItemSetSetterData",
        element: {
          text: translate("genericBackButton", lang),
          toItemSetId: getFirstRankedParent(metadata, parent)?.id ?? 0,
        } as DropdownItemSetSetterData,
      });

    children
      .sort((a, b) => (translateRegionName(a, lang) > translateRegionName(b, lang) ? 1 : -1))
      .forEach((region) => {
        if (twoPlayerMin && region.playerCount < 2) {
          return;
        } else if (onePlayerMin && region.playerCount < 1) {
          return;
        }

        outChildren.push({
          type: "DropdownItemData",
          element: {
            text: translateRegionName(region, lang),
            rightIcon: <FlagIcon region={region} showRegFlagRegardless />,
            value: region,
          } as DropdownItemData,
        });

        if (sortedRegions[region.id] !== undefined)
          outChildren.push({
            type: "DropdownItemSetSetterData",
            element: {
              text: translateRegionName(region, lang, "Subregions"),
              rightIcon: <span style={{ paddingRight: "7px" }}>»</span>,
              toItemSetId: region.id,
            } as DropdownItemSetSetterData,
          });
      });

    dropdownData.data.push({
      id: parentIdConv,
      children: outChildren,
    });
  }

  return <Dropdown data={dropdownData} />;
};

export default RegionSelectionDropdown;
