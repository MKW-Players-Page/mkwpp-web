import { Region } from "../../api";
import { Link } from "react-router-dom";
import { Pages, resolvePage } from "../pages";
import "./RegionSelection.css";

export interface ComplexRegionSelectionProps {
  regions: Region[];
  cupId: number;
}

export interface RegionSelectionRowProps {
  regions: Region[];
  cupId: number;
  shown: boolean;
}

const RegionSelection = ({ regions, cupId, shown }: RegionSelectionRowProps) => {
  let classes = `module-row`;
  classes += shown ? ` show-row` : ` hide-row`;

  return (
    <div className={classes}>
      {regions
        ?.filter((r) => r.isRanked)
        .map((r) => (
          <div key={r.id} className="module">
            <div className="module-content">
              <Link
                to={resolvePage(Pages.TrackTops, {
                  region: r.code.toLowerCase(),
                  cup: cupId,
                })}
              >
                {r.name}
              </Link>
            </div>
          </div>
        ))}
    </div>
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
          shown={true}
          cupId={cupId}
          regions={sortedSubregions[parseInt(sortedSubregionsKey)]}
        />
      ))}
    </>
  );
};

export default ComplexRegionSelection;
