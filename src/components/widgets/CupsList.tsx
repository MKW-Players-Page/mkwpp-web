import { useContext } from "react";
import { Link } from "react-router-dom";
import { I18nContext, translate, translateTrack, TranslationKey } from "../../utils/i18n/i18n";
import { MetadataContext } from "../../utils/Metadata";
import { Pages, resolvePage } from "../pages";
import Deferred from "./Deferred";
import "./CupsList.css";
import { Cup, Region, CategoryEnum, LapModeEnum } from "../../rust_api";

interface CupsListNoTracksProps {
  currentRegion: Region;
  /** Cup Id */
  currentCup: number;
  currentCategory: CategoryEnum;
  currentLap: LapModeEnum;
}

export const CupsListNoTracks = ({
  currentRegion,
  currentCup,
  currentCategory,
  currentLap,
}: CupsListNoTracksProps) => {
  const metadata = useContext(MetadataContext);

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div className="cups-list-no-tracks">
        {metadata.cups?.map((cup) => (
          <CupNoTracks
            key={`cup-no-tracks-${cup.id}`}
            cup={cup}
            selected={currentCup === cup.id}
            href={resolvePage(
              Pages.TrackTops,
              {
                region: currentRegion.code.toLowerCase(),
                cup: cup.id,
              },
              {
                cat: currentCategory !== CategoryEnum.NonShortcut ? currentCategory : null,
                lap: currentLap === LapModeEnum.Lap ? currentLap : null,
              },
            )}
          />
        ))}
      </div>
    </div>
  );
};

interface CupNoTracksProps {
  cup: Cup;
  selected: boolean;
  href: string;
}

const CupNoTracks = ({ cup, selected, href }: CupNoTracksProps) => {
  return (
    <div key={cup.id} className={`module cups-list-no-tracks-cup${selected ? " selected" : ""}`}>
      <div className="module-content">
        <Link to={href}>
          <img src={`/mkw/cups/${cup.id}.png`} alt="Cup Icon" />
        </Link>
      </div>
    </div>
  );
};

interface CupTracksProps {
  cup: Cup;
}

const CupTracks = ({ cup }: CupTracksProps) => {
  const { lang } = useContext(I18nContext);
  const metadata = useContext(MetadataContext);

  return (
    <div key={cup.id} className="module">
      <div className="module-content cups-list-cup">
        <b>{translate(`constantCup${cup.code.toUpperCase()}` as TranslationKey, lang)}</b>
        <ul>
          {cup.trackIds.map((trackId) => (
            <li key={trackId}>
              <Link to={resolvePage(Pages.TrackChart, { id: trackId })}>
                {translateTrack(metadata.getTrackById(trackId), lang)}
              </Link>
            </li>
          ))}
        </ul>
        <div className="cups-list-cup-image-div">
          <img
            src={`/mkw/cups/${cup.id}.png`}
            className="cups-list-cup-image"
            alt="cups-list-cup-image"
          />
        </div>
      </div>
    </div>
  );
};

const CupsList = () => {
  const metadata = useContext(MetadataContext);
  return (
    <>
      <Deferred isWaiting={metadata.isLoading}>
        <div className="cups-list">{metadata.cups?.map((cup) => <CupTracks cup={cup} />)}</div>
      </Deferred>
    </>
  );
};

export default CupsList;
