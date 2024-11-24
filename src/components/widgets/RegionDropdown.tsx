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
import { I18nContext, TranslationKey } from "../../utils/i18n/i18n";

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
  const { translations, lang } = useContext(I18nContext);
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
    defaultItemSet: value.parent ?? 0,
    value: value,
    valueSetter: setValue,
    data: [],
  };

  const sortedRegions = groupBy(
    regions.filter((r) => r.isRanked || !ranked),
    (i) => i.parent ?? 0,
  );

  for (let [parentId, children] of Object.entries(sortedRegions)) {
    const parentIdConv = parseInt(parentId);

    let outChildren: DropdownItemSetDataChild[] = [];
    let parent = getRegionById(metadata, parentIdConv);

    if (parent !== undefined)
      outChildren.push({
        type: "DropdownItemSetSetterData",
        element: { text: "« Back", toItemSetId: parent.parent ?? 0 } as DropdownItemSetSetterData,
      });

    children
      .sort((a, b) =>
        translations[`constantRegion${a.code}` as TranslationKey][lang] >
        translations[`constantRegion${b.code}` as TranslationKey][lang]
          ? 1
          : -1,
      )
      .forEach((region) => {
        if (twoPlayerMin && region.playerCount < 2) {
          return;
        } else if (onePlayerMin && region.playerCount < 1) {
          return;
        }

        outChildren.push({
          type: "DropdownItemData",
          element: {
            text: translations[`constantRegion${region.code}` as TranslationKey][lang],
            rightIcon: <Flag flag={region.code.toLowerCase() as keyof typeof Flags} />,
            value: region,
          } as DropdownItemData,
        });

        if (sortedRegions[region.id] !== undefined)
          outChildren.push({
            type: "DropdownItemSetSetterData",
            element: {
              text: translations[`constantRegionSubregions${region.code}` as TranslationKey][lang],
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
