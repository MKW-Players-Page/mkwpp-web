import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Pages, resolvePage } from "./Pages";
import Deferred from "../global/Deferred";
import { getCategoryName, getCategorySiteHue } from "../../utils/EnumUtils";
import { formatTime } from "../../utils/Formatters";
import { MetadataContext } from "../../utils/Metadata";
import { CategorySelect } from "../widgets";
import { CategoryEnum, Standard, StandardLevel } from "../../api";
import { getCategoryNumerical } from "../../utils/EnumUtils";

const StandardsPage = () => {
  const [levelId, setLevelId] = useState<number>(0);
  const [category, setCategory] = useState<CategoryEnum>(CategoryEnum.NonShortcut);

  const metadata = useContext(MetadataContext);

  useEffect(() => {
    if (levelId === 0 && !metadata.isLoading) {
      setLevelId(metadata.standards?.at(0)?.id || 0);
    }
  }, [levelId, metadata]);
  const level =
    (metadata.standards && metadata.standards.find((l) => l.id === levelId)) ||
    ({ standards: [] } as unknown as StandardLevel);
  let filteredStandards: Standard[] = [];
  let lastChecked = {} as Standard;
  level?.standards
    .filter((r) => getCategoryNumerical(r.category) <= getCategoryNumerical(category))
    .sort((a, b) => getCategoryNumerical(b.category) - getCategoryNumerical(a.category)) // Sort these in reverse order
    .sort((a, b) => (a.isLap ? 1 : 0) - (b.isLap ? 1 : 0))
    .sort((a, b) => a.track - b.track)
    .forEach((r) => {
      if (lastChecked.track !== r.track || lastChecked.isLap !== r.isLap) {
        filteredStandards.push(r);
        lastChecked = r;
      }
    });

  const siteHue = getCategorySiteHue(category);

  return (
    <>
      <h1>Legacy Standards</h1>
      <div className="module-row overwrite-color" style={siteHue}>
        <select
          className="module filter-select"
          value={levelId}
          onChange={(e) => setLevelId(+e.target.value)}
        >
          {metadata.standards?.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
        <CategorySelect value={category} onChange={setCategory} />
      </div>
      <div className="module overwrite-color" style={siteHue}>
        <Deferred isWaiting={metadata.isLoading}>
          <table>
            <thead>
              <tr>
                <th>Track</th>
                <th>Category</th>
                <th>Standard</th>
                <th>Points</th>
                <th>Course</th>
                <th>Lap</th>
              </tr>
            </thead>
            <tbody className="table-hover-rows">
              {filteredStandards.map((standard) => {
                const track = metadata.tracks?.find((track) => track.id === standard.track);
                return (
                  <tr key={standard.id}>
                    {!standard.isLap ? (
                      <td rowSpan={2}>
                        <Link
                          to={resolvePage(Pages.TrackChart, {
                            id: track?.id || 0,
                          })}
                        >
                          {track?.name}
                        </Link>
                      </td>
                    ) : (
                      <></>
                    )}
                    <td>{getCategoryName(standard.category)}</td>
                    <td>{level.name}</td>
                    <td>{level.value}</td>
                    {standard.isLap && <td />}
                    <td>{standard.value ? formatTime(standard.value) : "*"}</td>
                    {!standard.isLap && <td />}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Deferred>
      </div>
    </>
  );
};

export default StandardsPage;
