import { useContext } from "react";

import { Region, RegionTree } from "../../rust_api";
import { MetadataContext } from "../../utils/Metadata";

import "./RegionDropdown.css";
import Dropdown, {
  DropdownData,
  DropdownItemData,
  DropdownItemSetDataChild,
  DropdownItemSetSetterData,
} from "./Dropdown";
import { I18nContext, translate, translateRegionName } from "../../utils/i18n/i18n";
import { FlagIcon } from "./Icon";
import { useApi } from "../../hooks";

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

  const { isLoading, data: tree } = useApi(
    () => Region.getRegionDescendentsTree(),
    [],
    "getRegionDescendentsTree",
  );

  if (metadata.isLoading || isLoading || tree === undefined) return <></>;

  const dropdownData: DropdownData = {
    type: "Normal",
    defaultItemSet: (ranked ? metadata.getFirstRankedParent(value)?.id : value.parentId) ?? 0,
    value: value,
    valueSetter: setValue,
    data: [],
  };

  const read = (
    parentId: number,
    children: Array<number | RegionTree>,
    backParent: number | null = null,
  ) => {
    let outChildren: DropdownItemSetDataChild[] = [];
    if (typeof backParent === "number")
      outChildren.push({
        type: "DropdownItemSetSetterData",
        element: {
          text: translate("genericBackButton", lang),
          toItemSetId: backParent,
        } satisfies DropdownItemSetSetterData,
      });

    for (const child of children) {
      const hasChildren = typeof child !== "number";
      const regionId = hasChildren ? Number(Object.keys(child)[0]) : child;
      if (hasChildren) read(regionId, child[regionId], parentId);

      const region = metadata.getRegionById(regionId);
      if (region === undefined) continue;
      if (twoPlayerMin && (region.playerCount ?? 0) < 2) {
        continue;
      } else if (onePlayerMin && (region.playerCount ?? 0) < 1) {
        continue;
      }

      outChildren.push({
        type: "DropdownItemData",
        element: {
          text: translateRegionName(region, lang),
          rightIcon: <FlagIcon region={region} showRegFlagRegardless />,
          value: region,
        } satisfies DropdownItemData,
      });

      if (hasChildren)
        outChildren.push({
          type: "DropdownItemSetSetterData",
          element: {
            text: translateRegionName(region, lang, "Subregions"),
            rightIcon: <span style={{ paddingRight: "7px" }}>»</span>,
            toItemSetId: region.id,
          } satisfies DropdownItemSetSetterData,
        });
    }

    if (outChildren.length === 0) return;

    dropdownData.data.push({
      id: parentId,
      children: outChildren.sort((a, b) =>
        a.element.text === translate("genericBackButton", lang)
          ? -1
          : a.type === b.type
            ? a.element.text > b.element.text
              ? 1
              : -1
            : a.type > b.type
              ? 1
              : -1,
      ),
    });
  };
  read(0, [tree]);

  return <Dropdown data={dropdownData} />;
};

export default RegionSelectionDropdown;
