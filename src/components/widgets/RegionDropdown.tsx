import { useContext } from "react";

import { Region } from "../../api";
import { getRegionById, MetadataContext } from "../../utils/Metadata";

import "./RegionDropdown.css";
import Flag, { Flags } from "./Flags";
import Dropdown, {
  DropdownData,
  DropdownItemData,
  DropdownItemSetDataChild,
  DropdownItemSetSetterData,
} from "./Dropdown";

export interface RegionSelectionDropdownProps {
  ranked: boolean;
  value: Region;
  setValue: React.Dispatch<React.SetStateAction<any>>;
}

const RegionSelectionDropdown = ({ ranked, value, setValue }: RegionSelectionDropdownProps) => {
  const metadata = useContext(MetadataContext);
  if (metadata.isLoading) return <></>;
  const regions = metadata.regions ?? [];

  const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr.reduce(
      (groups, item) => {
        (groups[key(item)] ||= []).push(item);
        return groups;
      },
      {} as Record<K, T[]>,
    );

  const dropdownData: DropdownData = {
    defaultItemSet: value.parent || 0,
    value: value,
    valueSetter: setValue,
    data: [],
  };

  const sortedRegions = groupBy(
    regions.filter((r) => r.isRanked || !ranked),
    (i) => i.parent || 0,
  );

  for (let [parentId, children] of Object.entries(sortedRegions)) {
    const parentIdConv = parseInt(parentId);

    let outChildren: DropdownItemSetDataChild[] = [];
    let parent = getRegionById(metadata, parentIdConv);

    if (parent !== undefined)
      outChildren.push({
        type: "DropdownItemSetSetterData",
        element: { text: "<< Back", toItemSetId: parent.parent || 0 } as DropdownItemSetSetterData,
      });

    children
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .forEach((region) => {
        outChildren.push({
          type: "DropdownItemData",
          element: {
            text: region.name,
            rightIcon: <Flag flag={region.code.toLowerCase() as keyof typeof Flags} />,
            value: region,
          } as DropdownItemData,
        });

        if (sortedRegions[region.id] !== undefined)
          outChildren.push({
            type: "DropdownItemSetSetterData",
            element: {
              text: `${region.name} Subregions`,
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
