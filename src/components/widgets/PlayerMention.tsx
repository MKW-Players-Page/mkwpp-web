import { useContext } from "react";
import { Link } from "react-router-dom";
import { Region, PlayerBasic } from "../../api";
import { useApi } from "../../hooks";
import { MetadataContext } from "../../utils/Metadata";
import { Pages, resolvePage } from "../pages";
import { FlagIcon } from "./Icon";

export interface FlagIconSpanPlayerIdProps {
  id: number;
  showRegFlagRegardless: boolean;
  xxFlag: boolean;
}

const FlagIconSpanPlayerId = ({ id, showRegFlagRegardless, xxFlag }: FlagIconSpanPlayerIdProps) => {
  const metadata = useContext(MetadataContext);
  const { data: player } = useApi(() => PlayerBasic.getPlayerBasic(id), [id], "player", [], false);
  return player?.regionId !== undefined || xxFlag ? (
    <FlagIcon
      region={metadata.getRegionById(player?.regionId ?? 0)}
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
    <FlagIcon
      region={xxFlag && region?.id === 1 ? undefined : region}
      showRegFlagRegardless={showRegFlagRegardless}
    />
  ) : (
    <></>
  );
};

export interface PlayerTextFromIdProps {
  id: number;
}

const PlayerTextFromId = ({ id }: PlayerTextFromIdProps) => {
  const { data: player } = useApi(() => PlayerBasic.getPlayerBasic(id), [id], "player", [], false);

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
    () => PlayerBasic.getPlayerBasic(id, metadata),
    [id],
    "player",
    [],
    false,
  );

  if (metadata.isLoading || isLoading) return <>Loading..</>;

  return (
    <>
      <FlagIconSpan
        region={metadata.getRegionById(player?.regionId ?? 0)}
        showRegFlagRegardless={showRegFlagRegardless}
        xxFlag={xxFlag}
      />
      {player?.alias ?? player?.name}
    </>
  );
};

export interface PlayerMentionProps {
  playerOrId: number | PlayerBasic;
  regionOrId?: number | Region;
  showRegFlagRegardless?: boolean;
  xxFlag?: boolean;
  redirect?: boolean;
}

const PlayerMention = ({
  playerOrId,
  regionOrId,
  showRegFlagRegardless,
  xxFlag,
  redirect = true,
}: PlayerMentionProps) => {
  const metadata = useContext(MetadataContext);

  if (metadata.isLoading) return <>Loading..</>;

  let resolvedPlayerId: number = typeof playerOrId === "number" ? playerOrId : playerOrId.id;
  if (typeof playerOrId !== "number") metadata.cachePlayers(playerOrId);

  const region: Region | undefined =
    regionOrId !== undefined
      ? typeof regionOrId === "number"
        ? metadata.getRegionById(regionOrId)
        : regionOrId
      : typeof playerOrId === "number"
        ? undefined
        : metadata.getRegionById(playerOrId.regionId);

  if (!redirect)
    return (
      <span>
        {region === undefined && typeof playerOrId === "number" ? (
          <PlayerMentionNoPrecalc
            xxFlag={!!xxFlag}
            id={resolvedPlayerId}
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
                  id={resolvedPlayerId}
                  showRegFlagRegardless={!!showRegFlagRegardless}
                />
              )}
            </>
            <>
              {typeof playerOrId !== "number" ? (
                (playerOrId.alias ?? playerOrId.name)
              ) : (
                <PlayerTextFromId id={resolvedPlayerId} />
              )}
            </>
          </>
        )}
      </span>
    );

  return (
    <Link
      to={resolvePage(Pages.PlayerProfile, {
        id: resolvedPlayerId,
      })}
    >
      {region === undefined && typeof playerOrId === "number" ? (
        <PlayerMentionNoPrecalc
          xxFlag={!!xxFlag}
          id={resolvedPlayerId}
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
                id={resolvedPlayerId}
                showRegFlagRegardless={!!showRegFlagRegardless}
              />
            )}
          </>
          <>
            {typeof playerOrId !== "number" ? (
              (playerOrId.alias ?? playerOrId.name)
            ) : (
              <PlayerTextFromId id={resolvedPlayerId} />
            )}
          </>
        </>
      )}
    </Link>
  );
};

export default PlayerMention;
