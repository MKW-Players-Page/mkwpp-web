import { useContext, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Pages, resolvePage } from "./Pages";
import Deferred from "../global/Deferred";
import { getCategoryName, getCategorySiteHue } from "../../utils/EnumUtils";
import { formatTime } from "../../utils/Formatters";
import { MetadataContext } from "../../utils/Metadata";
import { CategorySelect } from "../widgets";
import { Standard, StandardLevel } from "../../api";
import { getCategoryNumerical } from "../../utils/EnumUtils";
import OverwriteColor from "../widgets/OverwriteColor";
import Dropdown, { DropdownData, DropdownItemSetDataChild } from "../widgets/Dropdown";
import { useCategoryParam, useStandardLevelIdParam } from "../../utils/SearchParams";

const StandardsPage = () => {
  const searchParams = useSearchParams();
  const { category, setCategory } = useCategoryParam(searchParams);
  const { levelId, setLevelId } = useStandardLevelIdParam(searchParams);

  const metadata = useContext(MetadataContext);

  useEffect(() => {
    if (levelId === 0 && !metadata.isLoading) {
      setLevelId(metadata.standards?.at(0)?.id ?? 1);
    }
  }, [levelId, setLevelId, metadata]);

  const level =
    metadata.standards?.find((l) => l.id === levelId) ??
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
      <OverwriteColor hue={siteHue}>
        <div className="module-row">
          <Dropdown
            data={
              {
                type: "Normal",
                value: levelId,
                valueSetter: setLevelId,
                defaultItemSet: 0,
                data: [
                  {
                    id: 0,
                    children: metadata.standards?.map((l) => {
                      return {
                        type: "DropdownItemData",
                        element: { text: l.name, value: l.id },
                      } as DropdownItemSetDataChild;
                    }) ?? [{ type: "DropdownItemData", element: { text: "God", value: 1 } }],
                  },
                ],
              } as DropdownData
            }
          />
          <CategorySelect value={category} onChange={setCategory} />
        </div>
        <div className="module">
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
      </OverwriteColor>
    </>
  );
};

export default StandardsPage;
