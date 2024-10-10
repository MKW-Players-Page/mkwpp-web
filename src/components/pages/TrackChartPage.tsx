import { useContext, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { Pages, resolvePage } from "./Pages";
import Deferred from "../global/Deferred";
import { CategorySelect, FlagIcon, LapModeSelect } from "../widgets";
import { LapModeEnum } from "../widgets/LapModeSelect";
import api, { CategoryEnum } from "../../api";
import { TimetrialsTracksScoresListLapModeEnum } from "../../api/generated";
import { useApi } from "../../hooks";
import { formatDate, formatTime } from "../../utils/Formatters";
import { getRegionById, getStandardLevel, MetadataContext } from "../../utils/Metadata";
import { integerOr } from "../../utils/Numbers";
import { UserContext } from "../../utils/User";

const TrackChartPage = () => {
    const { id: idStr } = useParams();
    const id = Math.max(integerOr(idStr, 0), 0);

    const [category, setCategory] = useState<CategoryEnum>(CategoryEnum.NonShortcut);
    const [lapMode, setLapMode] = useState<LapModeEnum>(LapModeEnum.Course);

    const { user } = useContext(UserContext);

    const metadata = useContext(MetadataContext);
    const track = metadata.tracks?.find((t) => t.id === id);


    const { isLoading, data: scores } = useApi(() => api.timetrialsTracksScoresList({
        id,
        category,
        lapMode: lapMode as TimetrialsTracksScoresListLapModeEnum,
    }), [category, lapMode]);

    return (
        <>
            {/* Redirect to courses list if id is invalid or does not exist. */}
            {metadata.tracks && !track && <Navigate to={resolvePage(Pages.TrackList)} />}
            <Link to={resolvePage(Pages.TrackList)}>{"< Back"}</Link>
            <h1>{track?.name}</h1>
            <div className='module-row'>
                <CategorySelect options={track?.categories} value={category} onChange={setCategory} />
                <LapModeSelect value={lapMode} onChange={setLapMode} />
            </div>
            <div className="module">
                <Deferred isWaiting={metadata.isLoading || isLoading}>
                    <table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Player</th>
                                <th>Time</th>
                                <th>Standard</th>
                                <th>Date</th>
                                <th className="col-icon" />
                                <th className="col-icon" />
                            </tr>
                        </thead>
                        <tbody>
                            {scores?.map((score) => (
                                <tr
                                    key={score.id}
                                    className={user && score.player.id === user.player ? 'highlighted' : ''}
                                >
                                    <td>{score.rank}</td>
                                    <td>
                                        <FlagIcon region={getRegionById(metadata, score.player.region || 0)} />
                                        <Link to={resolvePage(Pages.PlayerProfile, { id: score.player.id })}>
                                            {score.player.name}
                                        </Link>
                                    </td>
                                    <td className={score.category !== category ? 'fallthrough' : ''}>
                                        {formatTime(score.value)}
                                    </td>
                                    <td>{getStandardLevel(metadata, score.standard)?.name}</td>
                                    <td>{score.date && formatDate(score.date)}</td>
                                    <td>{score.videoLink && (
                                        <a href={score.videoLink} target="_blank" rel="noopener noreferrer">V</a>
                                    )}</td>
                                    <td>{score.ghostLink && (
                                        <a href={score.ghostLink} target="_blank" rel="noopener noreferrer">G</a>
                                    )}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Deferred>
            </div>
        </>
    );
};

export default TrackChartPage;
