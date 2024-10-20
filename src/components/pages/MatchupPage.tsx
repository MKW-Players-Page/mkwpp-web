import { useContext, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { Pages, resolvePage } from "./Pages";
import Deferred from "../global/Deferred";
import api, { CategoryEnum, PlayerMatchupPlayer, PlayerMatchupScore } from "../../api";
import { useApi } from "../../hooks";
import { formatTime, formatTimeDiff } from "../../utils/Formatters";
import { getRegionById, MetadataContext } from "../../utils/Metadata";
import { integerOr } from "../../utils/Numbers";
import { CategorySelect, FlagIcon } from "../widgets";
import OverwriteColor from "../widgets/OverwriteColor";
import { getCategorySiteHue } from "../../utils/EnumUtils";
import Form, { Field } from "../widgets/Form";

interface MatchupHomePageState {
  id1: string;
  id2: string;
  errors: { [key: string]: string[] };
  submitting: boolean;
}

export const MatchupHomePage = () => {
  const navigate = useNavigate();

  const initialState = { id1: "", id2: "", errors: {}, submitting: false };
  const [state, setState] = useState<MatchupHomePageState>(initialState);

  const submit = (done: () => void) => {
    navigate(resolvePage(Pages.Matchup, { id1: state.id1, id2: state.id2 }));
    done();
  };

  return (
    <>
      <h1>Matchup</h1>
      <div className="module">
        <div className="module-content">
          <Form state={state} setState={setState} submitLabel="Compare" submit={submit}>
            <Field type="text" field="id1" label="Player 1" />
            <Field type="text" field="id2" label="Player 2" />
          </Form>
        </div>
      </div>
    </>
  );
};

const MatchupPage = () => {
  const { id1: id1Str, id2: id2Str } = useParams();
  const id1 = Math.max(integerOr(id1Str, 0), 0);
  const id2 = Math.max(integerOr(id2Str, 0), 0);

  const [category, setCategory] = useState<CategoryEnum>(CategoryEnum.NonShortcut);

  const metadata = useContext(MetadataContext);

  const { isLoading, data: matchup } = useApi(
    () =>
      api.timetrialsMatchupsRetrieve({
        pk1: id1,
        pk2: id2,
        category,
      }),
    [id1, id2, category],
  );

  const scoreClasses = (score?: PlayerMatchupScore) => {
    if (!score) {
      return "";
    }
    return (
      (score.category !== category ? "fallthrough " : "") +
      (score.difference === null || score.difference <= 0 ? "winner" : "loser")
    );
  };

  const diff = (p1Score?: PlayerMatchupScore, p2Score?: PlayerMatchupScore) => {
    if (p1Score) {
      return p1Score.difference !== null ? formatTimeDiff(p1Score.difference) : "-";
    } else if (p2Score) {
      return p2Score.difference !== null ? formatTimeDiff(p2Score.difference) : "-";
    } else {
      return "-";
    }
  };

  const diffClass = (score?: PlayerMatchupScore) => {
    if (!score || score.difference === null) {
      return "";
    }
    return score.difference === 0 ? "diff-eq" : score.difference > 0 ? "diff-gt" : "diff-lt";
  };

  const totalTime = (player: PlayerMatchupPlayer, isLap: boolean) => {
    return formatTime(
      player.scores.reduce((total, score) => total + (score.isLap === isLap ? score.value : 0), 0),
    );
  };

  const siteHue = getCategorySiteHue(category);

  return (
    <>
      {/** Redirect if any id is invalid or API fetch failed */}
      {(id1 === 0 || id2 === 0 || (!isLoading && !matchup)) && (
        <Navigate to={resolvePage(Pages.MatchupHome)} />
      )}
      <Link to={resolvePage(Pages.MatchupHome)}>&lt; Back</Link>
      <h1>Matchup</h1>
      <OverwriteColor hue={siteHue}>
        <CategorySelect value={category} onChange={setCategory} />
        <div className="module">
          <Deferred isWaiting={metadata.isLoading || isLoading}>
            <table>
              <thead>
                <tr>
                  <th />
                  <th colSpan={2}>
                    <FlagIcon region={getRegionById(metadata, matchup?.p1.region || 0)} />
                    {matchup?.p1.alias || matchup?.p1.name}
                  </th>
                  <th />
                  <th colSpan={2}>
                    <FlagIcon region={getRegionById(metadata, matchup?.p2.region || 0)} />
                    {matchup?.p2.alias || matchup?.p2.name}
                  </th>
                </tr>
                <tr>
                  <th>Track</th>
                  <th>Course</th>
                  <th>Lap</th>
                  <th>Diff</th>
                  <th>Course</th>
                  <th>Lap</th>
                </tr>
              </thead>
              <tbody className="table-hover-rows">
                {metadata.tracks?.map((track) =>
                  [false, true].map((isLap) => {
                    const p1Score = matchup?.p1.scores.find(
                      (score) => score.track === track.id && score.isLap === isLap,
                    );
                    const p2Score = matchup?.p2.scores.find(
                      (score) => score.track === track.id && score.isLap === isLap,
                    );
                    return (
                      <tr key={`${isLap ? "l" : "c"}${track.id}`}>
                        {!isLap && (
                          <td rowSpan={2}>
                            <Link to={resolvePage(Pages.TrackChart, { id: track.id })}>
                              {track.name}
                            </Link>
                          </td>
                        )}
                        {isLap && <td />}
                        <td className={scoreClasses(p1Score)}>
                          {p1Score ? formatTime(p1Score.value) : "-"}
                        </td>
                        {!isLap && <td />}
                        <td className={diffClass(p1Score)}>{diff(p1Score, p2Score)}</td>
                        {isLap && <td />}
                        <td className={scoreClasses(p2Score)}>
                          {p2Score ? formatTime(p2Score.value) : "-"}
                        </td>
                        {!isLap && <td />}
                      </tr>
                    );
                  }),
                )}
              </tbody>
              <tfoot>
                <tr>
                  <th>Total</th>
                  <th>{matchup && totalTime(matchup.p1, false)}</th>
                  <th>{matchup && totalTime(matchup.p1, true)}</th>
                  <th />
                  <th>{matchup && totalTime(matchup.p2, false)}</th>
                  <th>{matchup && totalTime(matchup.p2, true)}</th>
                </tr>
                <tr>
                  <th>Tally</th>
                  <th colSpan={2}>{matchup?.p1.totalWins} win(s)</th>
                  <th>{matchup?.p1.totalTies} draw(s)</th>
                  <th colSpan={2}>{matchup?.p2.totalWins} win(s)</th>
                </tr>
              </tfoot>
            </table>
          </Deferred>
        </div>
      </OverwriteColor>
    </>
  );
};

export default MatchupPage;
