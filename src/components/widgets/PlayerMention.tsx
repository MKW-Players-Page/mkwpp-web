import { useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { useApi } from "../../hooks";
import { getRegionById, MetadataContext } from "../../utils/Metadata";
import { Pages, resolvePage } from "../pages";
import { FlagIcon } from "./Icon";

export interface PlayerMentionProps {
  id: number;
}

const PlayerMention = ({ id }: PlayerMentionProps) => {
  const metadata = useContext(MetadataContext);
  const { isLoading, data: player } = useApi(
    () => api.timetrialsPlayersRetrieve({ id }),
    [id],
  );

  if (metadata.isLoading || isLoading) return <>Loading..</>;

  return (
    <Link to={resolvePage(Pages.PlayerProfile, { id })}>
      <FlagIcon region={getRegionById(metadata, player?.region ?? 1)} />
      {player?.alias ?? player?.name}
    </Link>
  );
};

export default PlayerMention;
