import { useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { useApi } from "../../hooks";
import { getRegionById, MetadataContext } from "../../utils/Metadata";
import { Pages, resolvePage } from "../pages";
import Flag, { Flags } from "./Flags";

export interface PlayerMentionProps {
  id: number;
}

const PlayerMention = ({ id }: PlayerMentionProps) => {
  const metadata = useContext(MetadataContext);
  const { isLoading, data: player } = useApi(() => api.timetrialsPlayersRetrieve({ id }), [id]);

  if (metadata.isLoading || isLoading) return <>Loading..</>;

  return (
    <Link to={resolvePage(Pages.PlayerProfile, { id })}>
      {player?.region !== undefined && player?.region !== null ? (
        <span className="flag-icon" style={{ width: "24px" }}>
          <Flag
            flag={getRegionById(metadata, player?.region)?.code.toLowerCase() as keyof typeof Flags}
          />
        </span>
      ) : (
        <></>
      )}
      {player?.alias ?? player?.name}
    </Link>
  );
};

export default PlayerMention;
