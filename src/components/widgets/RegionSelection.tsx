import { useContext, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { Pages, resolvePage } from "../pages";
import { CategoryEnum, Region } from "../../api";
import { getFirstRankedParent, getRegionById, MetadataContext } from "../../utils/Metadata";

import "./RegionSelection.css";
import { I18nContext, translateRegionName } from "../../utils/i18n/i18n";
import { LapModeEnum } from "./LapModeSelect";
import { FlagIcon } from "./Icon";

export interface ComplexRegionSelectionProps {
  region?: Region;
  cupId: number;
  currentCategory: CategoryEnum;
  currentLap: LapModeEnum;
}

export interface RegionSelectionRowProps {
  regions: Region[];
  cupId: number;
  shown: boolean;
  selectedRegions: number[];
  currentCategory: CategoryEnum;
  currentLap: LapModeEnum;
}

export interface RegionModuleProps {
  region: Region;
  cupId: number;
  selectedRegions: number[];
  currentCategory: CategoryEnum;
  currentLap: LapModeEnum;
}

const RegionModule = ({
  region,
  cupId,
  selectedRegions,
  currentCategory,
  currentLap,
}: RegionModuleProps) => {
  let classes = "module region-selection-button";
  if (selectedRegions.includes(region.id)) classes += " selected-region";
  const { lang } = useContext(I18nContext);

  const div = useRef(null);
  useLayoutEffect(() => {
    if (!div.current) return;
    const cb = () => {
      if ((div.current as any).clientWidth < 210) {
        (div.current as any).classList.add("flag-only");
      } else {
        (div.current as any).classList.remove("flag-only");
      }
    };
    window.addEventListener("resize", cb);
    return () => window.removeEventListener("resize", cb);
  }, [div]);

  return (
    <div className={classes}>
      <Link
        to={resolvePage(
          Pages.TrackTops,
          {
            region: region.code.toLowerCase(),
            cup: cupId,
          },
          {
            cat: currentCategory !== CategoryEnum.NonShortcut ? currentCategory : null,
            lap: currentLap === LapModeEnum.Lap ? currentLap : null,
          },
        )}
      >
        <div ref={div} className="module-content">
          <span className="hide-for-flag">{translateRegionName(region, lang)}</span>
          <span className="show-for-flag"></span>
          <FlagIcon width={40} region={region} />
          <span className="show-for-flag"></span>
        </div>
      </Link>
    </div>
  );
};

const RegionSelection = ({
  regions,
  cupId,
  shown,
  selectedRegions,
  currentCategory,
  currentLap,
}: RegionSelectionRowProps) => {
  let classes = `module-row`;
  classes += shown ? ` show-region-row` : ` hide-region-row`;

  return (
    <div className={classes}>
      {regions?.map((region) => (
        <RegionModule
          key={region.id}
          region={region}
          cupId={cupId}
          selectedRegions={selectedRegions}
          currentCategory={currentCategory}
          currentLap={currentLap}
        />
      ))}
    </div>
  );
};

const ComplexRegionSelection = ({
  region,
  cupId,
  currentCategory,
  currentLap,
}: ComplexRegionSelectionProps) => {
  const metadata = useContext(MetadataContext);
  if (metadata.isLoading) return <></>;
  const regions = metadata.regions;

  const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr.reduce(
      (groups, item) => {
        (groups[key(item)] ||= []).push(item);
        return groups;
      },
      {} as Record<K, T[]>,
    );

  const sortedRegions = groupBy(
    regions.filter((r) => r.isRanked),
    (i) => i.type,
  );
  const sortedSubregions = groupBy(
    [...sortedRegions.country_group, ...sortedRegions.country],
    (i) => getFirstRankedParent(metadata, i)?.id ?? -1,
  );

  const getRegionHierarchy = (region: Region): Region[] => {
    if (!region.parent) return [region];

    let parent = getRegionById(metadata, region.parent);
    const out: Region[] = [region];

    while (parent !== undefined && parent.id > 0) {
      if (parent.isRanked) out.push(parent);
      parent = getRegionById(metadata, parent?.parent ?? 0);
    }

    return out.reverse();
  };

  const selectedRegions = region ? getRegionHierarchy(region).map((region) => region.id) : [];

  return (
    <div>
      <RegionSelection
        shown={true}
        cupId={cupId}
        regions={sortedRegions.world}
        selectedRegions={selectedRegions}
        currentCategory={currentCategory}
        currentLap={currentLap}
      />
      <RegionSelection
        shown={true}
        cupId={cupId}
        regions={sortedRegions.continent}
        selectedRegions={selectedRegions}
        currentCategory={currentCategory}
        currentLap={currentLap}
      />
      {Object.keys(sortedSubregions).map((sortedSubregionsKey) => (
        <RegionSelection
          key={sortedSubregionsKey}
          shown={selectedRegions.includes(parseInt(sortedSubregionsKey))}
          cupId={cupId}
          regions={sortedSubregions[parseInt(sortedSubregionsKey)]}
          selectedRegions={selectedRegions}
          currentCategory={currentCategory}
          currentLap={currentLap}
        />
      ))}
    </div>
  );
};

export default ComplexRegionSelection;
