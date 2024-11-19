import { useContext } from "react";
import { Link } from "react-router-dom";
import { I18nContext, TranslationKey } from "../../utils/i18n/i18n";
import { MetadataContext } from "../../utils/Metadata";
import { Pages, resolvePage } from "../pages";
import Deferred from "./Deferred";

const CupsList = () => {
  const { translations, lang } = useContext(I18nContext);
  const metadata = useContext(MetadataContext);
  return (
    <>
      <Deferred isWaiting={metadata.isLoading}>
        <div
          style={
            {
              display: "grid",
              gap: "16px",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, max(250px, 100%/5)), 1fr))" /* Don't ask me how or why this works */,
            } as React.CSSProperties
          }
        >
          {metadata.cups?.map((cup) => (
            <div
              key={cup.id}
              className="module"
              style={{ margin: 0, overflow: "hidden" } as React.CSSProperties}
            >
              <div className="module-content">
                <b>
                  {translations[`constantCup${cup.code.toUpperCase()}` as TranslationKey][lang]}
                </b>
                <ul>
                  {cup.tracks.map((trackId) => (
                    <li key={trackId}>
                      <Link to={resolvePage(Pages.TrackChart, { id: trackId })}>
                        {
                          translations[
                            `constantTrackName${metadata.tracks
                              ?.find((track) => track.id === trackId)
                              ?.abbr.toUpperCase()}` as TranslationKey
                          ][lang]
                        }
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Deferred>
    </>
  );
};

export default CupsList;
