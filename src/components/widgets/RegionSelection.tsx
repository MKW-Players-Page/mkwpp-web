import { useContext, useLayoutEffect, useRef } from "react";
import { Link } from "react-router";

import { Pages, resolvePage } from "../pages";
import { MetadataContext } from "../../utils/Metadata";

import "./RegionSelection.css";
import { I18nContext, translateRegionName } from "../../utils/i18n/i18n";
import { FlagIcon } from "./Icon";
import { Region, RegionType, CategoryEnum, LapModeEnum } from "../../api";
import { useApi } from "../../hooks";
import Deferred from "./Deferred";

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
  const { data: sortedRegions, isLoading: sortedRegionsIsLoading } = useApi(
    () => Region.getRegionTypeHashmap(),
    [],
    "regionTypeHashMap",
  );
  if (metadata.isLoading || sortedRegions === undefined || sortedRegionsIsLoading) return <></>;

  const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr.reduce(
      (groups, item) => {
        (groups[key(item)] ||= []).push(item);
        return groups;
      },
      {} as Record<K, T[]>,
    );

  const sortedSubregions = groupBy(
    [...sortedRegions[RegionType.CountryGroup], ...sortedRegions[RegionType.Country]].reduce(
      (acc: Region[], id) => Region.reduceRankedViaId(metadata, acc, id),
      [],
    ),
    (region) => metadata.getFirstRankedParent(region)?.id ?? -1,
  );

  const getRegionHierarchy = (regions: Region[]): Region[] => {
    const latest = regions[regions.length - 1];
    if (!latest.parentId) return regions.reverse();
    const parent = metadata.getFirstRankedParent(latest);
    if (parent) {
      regions.push(parent);
      return getRegionHierarchy(regions);
    }
    return regions.reverse();
  };

  const selectedRegions = region ? getRegionHierarchy([region]).map((region) => region.id) : [];

  return (
    <div>
      <Deferred isWaiting={sortedRegionsIsLoading}>
        <RegionSelection
          shown
          cupId={cupId}
          regions={sortedRegions[RegionType.World].reduce(
            (acc: Region[], id) => Region.reduceRankedViaId(metadata, acc, id),
            [],
          )}
          selectedRegions={selectedRegions}
          currentCategory={currentCategory}
          currentLap={currentLap}
        />
        <RegionSelection
          shown
          cupId={cupId}
          regions={sortedRegions[RegionType.Continent].reduce(
            (acc: Region[], id) => Region.reduceRankedViaId(metadata, acc, id),
            [],
          )}
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
      </Deferred>
    </div>
  );
};

export default ComplexRegionSelection;
