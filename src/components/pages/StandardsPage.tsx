import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Pages, resolvePage } from './Pages';
import Deferred from '../global/Deferred';
import { getCategoryName } from '../../utils/EnumUtils';
import { formatTime } from '../../utils/Formatters';
import { MetadataContext } from '../../utils/Metadata';

const StandardsPage = () => {
    const [levelId, setLevelId] = useState<number>(0);

    const metadata = useContext(MetadataContext);

    useEffect(() => {
        if (levelId === 0 && !metadata.isLoading) {
            setLevelId(metadata.standards?.at(0)?.id || 0);
        }
    }, [levelId, metadata]);

    const level = metadata.standards && metadata.standards.find((l) => l.id === levelId);

    return (
        <>
            <h1>Legacy Standards</h1>
            <select className='module' style={{ "color": "#fff" } as React.CSSProperties} value={levelId} onChange={(e) => setLevelId(+e.target.value)}>
                {metadata.standards?.map((l) => (
                    <option key={l.id} value={l.id}>
                        {l.name}
                    </option>
                ))}
            </select>
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
                        <tbody>
                            {level?.standards.map((standard) => {
                                const track = metadata.tracks?.find((track) => track.id === standard.track);
                                return (
                                    <tr key={standard.id}>
                                        <td>
                                            <Link to={resolvePage(Pages.TrackChart, { id: track?.id || 0 })}>
                                                {track?.name}
                                            </Link>
                                        </td>
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
