import { useContext } from "react";
import { Link } from "react-router-dom";

import { Pages, resolvePage } from "../pages";
import { Region } from "../../api";
import { getRegionById, MetadataContext } from "../../utils/Metadata";

import "./RegionSelection.css";
import Flag, { Flags } from "./Flags";
import { WorldRegion } from "../../utils/Defaults";

export interface ComplexRegionSelectionProps {
  region?: Region;
  cupId: number;
}

export interface RegionSelectionRowProps {
  regions: Region[];
  cupId: number;
  shown: boolean;
  selectedRegions: number[];
}

export interface RegionModuleProps {
  region: Region;
  cupId: number;
  selectedRegions: number[];
}

const RegionModule = ({ region, cupId, selectedRegions }: RegionModuleProps) => {
  let classes = "module region-selection-button";
  if (selectedRegions.includes(region.id)) classes += " selected-region";

  return (
    <div className={classes}>
      <Link
        to={resolvePage(Pages.TrackTops, {
          region: region.code.toLowerCase(),
          cup: cupId,
        })}
      >
        <div className="module-content">
          {region.name}
          <Flag flag={region.code.toLowerCase() as keyof typeof Flags} />
        </div>
      </Link>
    </div>
  );
};

const RegionSelection = ({ regions, cupId, shown, selectedRegions }: RegionSelectionRowProps) => {
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
        />
      ))}
    </div>
  );
};

const ComplexRegionSelection = ({ region, cupId }: ComplexRegionSelectionProps) => {
  const metadata = useContext(MetadataContext);
  if (metadata.isLoading) return <></>;
  const regions = metadata.regions ?? [WorldRegion];

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
    (i) => i.parent || -1,
  );

  const getRegionHierarchy = (region: Region): Region[] => {
    if (!region.parent) {
      return [region];
    }
    const parent = getRegionById(metadata, region.parent);
    if (!parent) {
      return [region];
    }
    return [...getRegionHierarchy(parent), region];
  };

  const selectedRegions = region ? getRegionHierarchy(region).map((region) => region.id) : [];

  return (
    <>
      <RegionSelection
        shown={true}
        cupId={cupId}
        regions={sortedRegions.world}
        selectedRegions={selectedRegions}
      />
      <RegionSelection
        shown={true}
        cupId={cupId}
        regions={sortedRegions.continent}
        selectedRegions={selectedRegions}
      />
      {Object.keys(sortedSubregions).map((sortedSubregionsKey) => (
        <RegionSelection
          key={sortedSubregionsKey}
          shown={selectedRegions.includes(parseInt(sortedSubregionsKey))}
          cupId={cupId}
          regions={sortedSubregions[parseInt(sortedSubregionsKey)]}
          selectedRegions={selectedRegions}
        />
      ))}
    </>
  );
};

export default ComplexRegionSelection;
