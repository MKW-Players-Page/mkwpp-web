import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AdminPlayer, AdminScore, CategoryEnum, PlayerBasic, Region } from "../../../../api";
import { useApi } from "../../../../hooks";
import { getHighestValid } from "../../../../utils/EnumUtils";
import { formatDate, formatTime } from "../../../../utils/Formatters";
import { Language, translateCategoryName } from "../../../../utils/i18n/i18n";
import { MetadataContext } from "../../../../utils/Metadata";
import Deferred from "../../../widgets/Deferred";
import OverwriteColor from "../../../widgets/OverwriteColor";
import PlayerMention from "../../../widgets/PlayerMention";
import RegionSelectionDropdown from "../../../widgets/RegionDropdown";
import { Pages, resolvePage } from "../../Pages";

interface OutputLineWarningProps {
  lineNum: number;
  children: React.ReactNode;
}

const OutputLineWarning = ({ lineNum, children }: OutputLineWarningProps) => {
  return (
    <OverwriteColor key={String(lineNum)} hue={0}>
      <div className="module">
        <div className="module-content">{children}</div>
      </div>
    </OverwriteColor>
  );
};

interface OutputLinePlayerProps {
  lineNum: number;
  arrayIndex: number;
  data: React.MutableRefObject<ActionPlayer[]>;
  children: React.ReactNode;
}

const OutputLinePlayer = ({ arrayIndex, data, children, lineNum }: OutputLinePlayerProps) => {
  const metadata = useContext(MetadataContext);
  const value: undefined | ActionPlayer = data.current[arrayIndex];
  const [region, setRegion] = useState(
    value
      ? (metadata.getRegionById(value.regionId) ?? Region.worldDefault())
      : Region.worldDefault(),
  );
  data.current[arrayIndex].regionId = region.id;

  return (
    <div key={lineNum} className="module">
      <div className="module-content">
        {children}
        {value !== undefined ? (
          <RegionSelectionDropdown
            onePlayerMin={false}
            twoPlayerMin={false}
            ranked={false}
            value={region}
            setValue={setRegion}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

interface OutputLineScoreProps {
  lineNum: number;
  arrayIndex: number;
  data: React.MutableRefObject<ActionScore[]>;
  children: React.ReactNode;
}

const OutputLineScore = ({ lineNum, arrayIndex, data, children }: OutputLineScoreProps) => {
  const metadata = useContext(MetadataContext);
  const thisData = data.current[arrayIndex];
  return (
    <div key={lineNum} className="module">
      <div className="module-content">
        {children}
        {typeof thisData.player === "string" ? (
          <p>NEW Player: {thisData.player}</p>
        ) : (
          <p>
            Player: <PlayerMention playerOrId={thisData.player} />
          </p>
        )}
        <p>Track: {metadata.getTrackById(thisData.trackId)?.abbr ?? "INVALID"}</p>
        <p>Category: {translateCategoryName(thisData.category, Language.English)}</p>
        <p>Flap: {thisData.isLap.toString()}</p>
        <p>Time: {formatTime(thisData.value)}</p>
        <p>Date: {formatDate(thisData.date)}</p>
        {thisData.videoLink && (
          <a href={thisData.videoLink} target="_blank" rel="noreferrer">
            Video link
          </a>
        )}
      </div>
    </div>
  );
};

interface ActionPlayer {
  playerName: string;
  regionId: number;
}

interface ActionScore {
  player: PlayerBasic | string;
  category: CategoryEnum;
  trackId: number;
  isLap: boolean;
  value: number;
  date: Date;
  videoLink: string;
}

const AdminParserOutputPage = () => {
  const [textareaValue, setTextareaValue] = useState<string>("");
  const scoresActions = useRef<ActionScore[]>([]);
  const playersActions = useRef<ActionPlayer[]>([]);
  const metadata = useContext(MetadataContext);
  const navigate = useNavigate();

  scoresActions.current = [];
  playersActions.current = [];

  const ref = useRef<HTMLTextAreaElement>(null);

  const { isLoading, data: playerList } = useApi(
    () => PlayerBasic.getPlayerList(),
    [],
    "playerList",
  );

  const onChange = () => {
    if (ref.current !== null) {
      setTextareaValue(ref.current.value);
    }
  };

  return (
    <>
      <Link to={resolvePage(Pages.AdminUi)}>« Back</Link>
      <h1>CSV Output Parser</h1>
      <p>
        WARNING! THIS PARSER DOES NOT HANDLE COUNTRIES! YOU MUST SET NEW PLAYER'S COUNTRIES MANUALLY
        IN THE OUTPUT SECTION!
      </p>
      <p>Much love, FαlB</p>
      <Deferred isWaiting={isLoading || metadata.isLoading}>
        <div className="module">
          <div className="module-content">
            <textarea
              ref={ref}
              autoCorrect="off"
              autoCapitalize="off"
              autoComplete="off"
              style={{ width: "100%" }}
              onChange={onChange}
            />
          </div>
        </div>
      </Deferred>
      <h1>Output</h1>
      <div className="module">
        <div className="module-content">
          {textareaValue
            .split("\n")
            .map((r) => r.trim())
            .map((line, lineIndex) => {
              if (line.length === 0) return <></>;
              const columns = line.split(",");

              if (columns.length === 5) {
                const arrayIndex = playersActions.current.length;
                const playerNameExists =
                  playerList?.find((r) => r.name === columns[1]) !== undefined;
                playersActions.current.push({ playerName: columns[1], regionId: 1 });
                return (
                  <OutputLinePlayer
                    lineNum={lineIndex}
                    data={playersActions}
                    arrayIndex={arrayIndex}
                  >
                    <p>{`Found player named ${columns[1]} at line ${lineIndex}`}</p>
                    {playerNameExists && <p>Player with the same name exists already</p>}
                  </OutputLinePlayer>
                );
              } else if (columns.length === 6) {
                const player =
                  playerList?.find((r) => r.name === columns[0]) ??
                  playersActions.current.find((r) => r.playerName === columns[0])?.playerName;
                if (!player)
                  return (
                    <OutputLineWarning
                      lineNum={lineIndex}
                    >{`Error at line ${lineIndex}, player does not exist for score`}</OutputLineWarning>
                  );

                const trackIdOld = parseInt(columns[2]);
                if (isNaN(trackIdOld))
                  return (
                    <OutputLineWarning
                      lineNum={lineIndex}
                    >{`Error at line ${lineIndex}, couldn't parse track ID`}</OutputLineWarning>
                  );

                const isLap = trackIdOld % 2 === 1;
                const trackId = Math.floor(trackIdOld / 2) + 1;
                const category =
                  columns[1] === "NonSC"
                    ? CategoryEnum.NonShortcut
                    : getHighestValid(
                        CategoryEnum.Unrestricted,
                        metadata.getTrackById(trackId)?.categories ?? [CategoryEnum.NonShortcut],
                      );

                const value = columns[3]
                  .split(".")
                  .reduce(
                    (acc, item, index) =>
                      index === 0 ? acc + parseInt(item) * 1000 : acc + parseInt(item),
                    0,
                  );

                const date = new Date(columns[4]);
                const videoLink = columns[5] === "N/A" ? "" : columns[5];

                const arrayIndex = scoresActions.current.length;
                scoresActions.current.push({
                  player,
                  trackId,
                  isLap,
                  category,
                  value,
                  date,
                  videoLink,
                });

                return (
                  <OutputLineScore lineNum={lineIndex} data={scoresActions} arrayIndex={arrayIndex}>
                    <></>
                  </OutputLineScore>
                );
              } else {
                return (
                  <OutputLineWarning
                    lineNum={lineIndex}
                  >{`Error at line ${lineIndex}, line does not have the correct number of columns`}</OutputLineWarning>
                );
              }
            })}
        </div>
      </div>
      <input
        type="button"
        value="Submit"
        onClick={(e) => {
          (e.target as HTMLInputElement).disabled = true;
          // TODO: Find a way to fix this
          // eslint-disable-next-line
          new Promise(async (resolve: (value: PlayerBasic[]) => void) => {
            if (playersActions.current.length === 0 && playerList !== undefined)
              return resolve(playerList);

            const promises = playersActions.current.map((r) =>
              AdminPlayer.insertPlayer(r.playerName, r.regionId, new Date(), new Date(), [], []),
            );

            await Promise.all(promises);
            return resolve(await PlayerBasic.getPlayerList());
          })
            .then(async (playerList) => {
              const promises = scoresActions.current.map((scoreData) => {
                const playerId =
                  typeof scoreData.player === "string"
                    ? (playerList as PlayerBasic[])
                        .reverse()
                        .find((r: PlayerBasic) => r.name === scoreData.player)?.id
                    : scoreData.player.id;
                if (playerId === undefined) return Promise.resolve(); // This should be impossible
                return AdminScore.insertScore(
                  scoreData.value,
                  scoreData.category,
                  scoreData.isLap,
                  playerId,
                  scoreData.trackId,
                  scoreData.date,
                  scoreData.videoLink === "" ? undefined : scoreData.videoLink,
                );
              });
              await Promise.all(promises);
            })
            .then(() => {
              navigate(0);
            });
        }}
      />
    </>
  );
};

export default AdminParserOutputPage;
