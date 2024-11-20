import { useContext } from "react";
import { Link } from "react-router-dom";
import api, { Player, Region } from "../../api";
import { useApi } from "../../hooks";
import { getRegionById, MetadataContext } from "../../utils/Metadata";
import { Pages, resolvePage } from "../pages";
import { FlagIcon } from "./Icon";

export interface FlagIconSpanPlayerIdProps {
  id: number;
  showRegFlagRegardless: boolean;
  xxFlag: boolean;
}

const FlagIconSpanPlayerId = ({ id, showRegFlagRegardless, xxFlag }: FlagIconSpanPlayerIdProps) => {
  const metadata = useContext(MetadataContext);
  const { data: player } = useApi(
    () => api.timetrialsPlayersRetrieve({ id: id }),
    [id],
    "player",
    [],
    false,
  );
  return player?.region !== undefined || xxFlag ? (
    <FlagIcon
      region={getRegionById(metadata, player?.region ?? 0)}
      showRegFlagRegardless={showRegFlagRegardless}
    />
  ) : (
    <></>
  );
};

export interface FlagIconSpanProps {
  region: Region | undefined;
  showRegFlagRegardless: boolean;
  xxFlag: boolean;
}

const FlagIconSpan = ({ region, showRegFlagRegardless, xxFlag }: FlagIconSpanProps) => {
  return region !== undefined || xxFlag ? (
    <FlagIcon region={region} showRegFlagRegardless={showRegFlagRegardless} />
  ) : (
    <></>
  );
};

export interface PlayerTextFromIdProps {
  id: number;
}

const PlayerTextFromId = ({ id }: PlayerTextFromIdProps) => {
  const { data: player } = useApi(
    () => api.timetrialsPlayersRetrieve({ id: id }),
    [id],
    "player",
    [],
    false,
  );

  return <>{player?.alias ?? player?.name}</>;
};

export interface PlayerMentionNoPrecalcProps {
  id: number;
  showRegFlagRegardless: boolean;
  xxFlag: boolean;
}

const PlayerMentionNoPrecalc = ({
  id,
  showRegFlagRegardless,
  xxFlag,
}: PlayerMentionNoPrecalcProps) => {
  const metadata = useContext(MetadataContext);

  const { isLoading, data: player } = useApi(
    () => api.timetrialsPlayersRetrieve({ id: id }),
    [id],
    "player",
    [],
    false,
  );

  if (metadata.isLoading || isLoading) return <>Loading..</>;

  return (
    <>
      <FlagIconSpan
        region={getRegionById(metadata, player?.region ?? 0)}
        showRegFlagRegardless={showRegFlagRegardless}
        xxFlag={xxFlag}
      />
      {player?.alias ?? player?.name}
    </>
  );
};

export interface PlayerMentionProps {
  id?: number;
  precalcPlayer?: Player;
  precalcRegion?: Region;
  precalcRegionId?: number;
  showRegFlagRegardless?: boolean;
  xxFlag?: boolean;
}

const PlayerMention = ({
  id,
  showRegFlagRegardless,
  precalcRegion,
  precalcRegionId,
  precalcPlayer,
  xxFlag,
}: PlayerMentionProps) => {
  const metadata = useContext(MetadataContext);

  if (metadata.isLoading) return <>Loading..</>;
  if (id === undefined && precalcPlayer === undefined) return <>Error.</>;

  const region =
    (precalcRegion ?? precalcRegionId !== undefined)
      ? getRegionById(metadata, precalcRegionId as number)
      : precalcPlayer !== undefined
        ? getRegionById(metadata, precalcPlayer.region as number)
        : undefined;

  return (
    <Link
      to={resolvePage(Pages.PlayerProfile, {
        id: precalcPlayer !== undefined ? precalcPlayer.id : id,
      })}
    >
      {region === undefined && precalcPlayer === undefined ? (
        <PlayerMentionNoPrecalc
          xxFlag={!!xxFlag}
          id={id as number}
          showRegFlagRegardless={!!showRegFlagRegardless}
        />
      ) : (
        <>
          <>
            {region !== undefined ? (
              <FlagIconSpan
                region={region}
                showRegFlagRegardless={!!showRegFlagRegardless}
                xxFlag={!!xxFlag}
              />
            ) : (
              <FlagIconSpanPlayerId
                xxFlag={!!xxFlag}
                id={id as number}
                showRegFlagRegardless={!!showRegFlagRegardless}
              />
            )}
          </>
          <>
            {precalcPlayer ? (
              (precalcPlayer.alias ?? precalcPlayer.name)
            ) : (
              <PlayerTextFromId id={id as number} />
            )}
          </>
        </>
      )}
    </Link>
  );
};

export default PlayerMention;
