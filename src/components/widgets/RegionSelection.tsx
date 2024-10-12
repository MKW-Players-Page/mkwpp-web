import { Region } from "../../api";
import { MetadataContext } from "../../utils/Metadata";
import { Link } from "react-router-dom";
import { Pages, resolvePage } from "../pages";
import "./RegionSelection.css";
import { useContext } from "react";

export interface ComplexRegionSelectionProps {
  regions: Region[];
  cupId: number;
}

export interface RegionSelectionRowProps {
  regions: Region[];
  cupId: number;
  shown: boolean;
}

export interface RegionModuleProps {
  region: Region;
  cupId: number;
}

let selectedRegions = [1];

const RegionModule = ({ region, cupId }: RegionModuleProps) => {
  const regions = useContext(MetadataContext).regions || [];
  const getParentRegions = (array: Region[], parentId: number | null | undefined): Region[] => {
    if (parentId === undefined || parentId === null) return array;
    let parentRegion = regions.find((r) => r.id === parentId);
    if (parentRegion === undefined || parentRegion === null) return array;
    array.push(parentRegion);
    return getParentRegions(array, parentRegion?.parent);
  };

  let classes = "module";
  if (selectedRegions.includes(region.id)) classes += " selected-region";

  return (
    <div key={region.id} className={classes}>
      <div className="module-content">
        <Link
          to={resolvePage(Pages.TrackTops, {
            region: region.code.toLowerCase(),
            cup: cupId,
          })}
          onClick={() => {
            selectedRegions = getParentRegions([region], region?.parent)?.map(
              (region) => region.id,
            ) || [-1];
          }}
        >
          {region.name}
        </Link>
      </div>
    </div>
  );
};

const RegionSelection = ({ regions, cupId, shown }: RegionSelectionRowProps) => {
  let classes = `module-row`;
  classes += shown ? ` show-region-row` : ` hide-region-row`;

  return (
    <div className={classes}>{regions?.map((r) => <RegionModule region={r} cupId={cupId} />)}</div>
  );
};

const ComplexRegionSelection = ({ regions, cupId }: ComplexRegionSelectionProps) => {
  const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr.reduce(
      (groups, item) => {
        (groups[key(item)] ||= []).push(item);
        return groups;
      },
      {} as Record<K, T[]>,
    );

  let sortedRegions = groupBy(
    regions.filter((r) => r.isRanked),
    (i) => i.type,
  );
  let sortedSubregions = groupBy(
    [...sortedRegions.country_group, ...sortedRegions.country],
    (i) => i.parent || -1,
  );

  return (
    <>
      <RegionSelection shown={true} cupId={cupId} regions={sortedRegions.world} />
      <RegionSelection shown={true} cupId={cupId} regions={sortedRegions.continent} />
      {Object.keys(sortedSubregions).map((sortedSubregionsKey) => (
        <RegionSelection
          shown={selectedRegions.includes(parseInt(sortedSubregionsKey))}
          cupId={cupId}
          regions={sortedSubregions[parseInt(sortedSubregionsKey)]}
        />
      ))}
    </>
  );
};

export default ComplexRegionSelection;
