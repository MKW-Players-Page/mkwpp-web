import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { handleBars, I18nContext, Language, LanguageName, translate } from "../../utils/i18n/i18n";
import PlayerMention from "../widgets/PlayerMention";

interface Question {
  type: 0;
  text: string;
  posAns: string;
  negAns: string;
  posFollowup: number;
  negFollowup: number;
}

interface Answer {
  type: 1;
  text: string;
}

const ContributionsPage = () => {
  const { lang, translations } = useContext(I18nContext);

  const QuestionsAndAnswers: Record<number, Question | Answer> = {
    1: {
      type: 0,
      text: translate("contributionsPageQuestionsAndAnswers1", lang),
      posAns: translate("contributionsPagePositiveResponse", lang),
      negAns: translate("contributionsPageNegativeResponse", lang),
      posFollowup: 2,
      negFollowup: 3,
    },
    2: {
      type: 1,
      text: translate("contributionsPageQuestionsAndAnswers2", lang),
    },
    3: {
      type: 0,
      text: translate("contributionsPageQuestionsAndAnswers3", lang),
      posAns: translate("contributionsPagePositiveResponse", lang),
      negAns: translate("contributionsPageNegativeResponse", lang),
      posFollowup: 4,
      negFollowup: 5,
    },
    4: {
      type: 1,
      text: translate("contributionsPageQuestionsAndAnswers4", lang),
    },
    5: {
      type: 0,
      text: translate("contributionsPageQuestionsAndAnswers5", lang),
      posAns: translate("contributionsPagePositiveResponse", lang),
      negAns: translate("contributionsPageNegativeResponse", lang),
      posFollowup: 6,
      negFollowup: 1,
    },
    6: {
      type: 1,
      text: translate("contributionsPageQuestionsAndAnswers6", lang),
    },
  };

  const [questionIndex, setQuestionIndex] = useState(1);
  return (
    <>
      <h1>{translate("contributionsPageHeading", lang)}</h1>
      <div className="module">
        <div className="module-content">
          {QuestionsAndAnswers[questionIndex].type === 0 ? (
            <>
              <h2>{QuestionsAndAnswers[questionIndex].text}</h2>
              <button
                onClick={() => {
                  setQuestionIndex((QuestionsAndAnswers[questionIndex] as Question).posFollowup);
                }}
                style={{ marginRight: "10px" }}
              >
                {(QuestionsAndAnswers[questionIndex] as Question).posAns}
              </button>
              <button
                onClick={() => {
                  setQuestionIndex((QuestionsAndAnswers[questionIndex] as Question).negFollowup);
                }}
              >
                {(QuestionsAndAnswers[questionIndex] as Question).negAns}
              </button>
            </>
          ) : (
            <p>{QuestionsAndAnswers[questionIndex].text}</p>
          )}
        </div>
      </div>
      <div className="module">
        <div className="module-content">
          <h2>{translate("contributionsPageLanguageCompletionHeading", lang)}</h2>
          <table style={{ marginBottom: "10px" }}>
            <thead>
              <tr>
                <th>{translate("contributionsPageLanguageCompletionLanguageCol", lang)}</th>
                <th>{translate("contributionsPageLanguageCompletionPercentageCol", lang)}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(LanguageName).map(([key, value]) => (
                <tr>
                  <td>{value}</td>
                  <td>
                    {(
                      ((
                        Object.values(translations).map((val) =>
                          val[
                            (
                              Object.entries(Language).find(([keyX, value]) => keyX === key) as [
                                string,
                                Language,
                              ]
                            )[1]
                          ] !== ""
                            ? 1
                            : 0,
                        ) as number[]
                      ).reduce((accumulator, currentValue) => accumulator + currentValue) /
                        Object.keys(translations).length) *
                      100
                    ).toFixed(3) + "%"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>{translate("contributionsPageLanguageCompletionThanksText", lang)}</p>
          <ul style={{ listStyleType: "disc" }}>
            {[
              {
                player: <PlayerMention id={918} />,
                langs: [LanguageName.Italian, LanguageName.English],
              },
              { player: <PlayerMention id={1165} />, langs: [LanguageName.English] },
              { player: <PlayerMention id={145} />, langs: [LanguageName.English] },
            ].map((credit) => (
              <li>
                {credit.player} ({credit.langs.join(", ")})
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="module">
        <div className="module-content">
          <h2>{translate("contributionsPageFeatureRoadmapHeading", lang)}</h2>
          <FeatureElement
            title={translate("contributionsPageFeatureTimelineFilterHeading", lang)}
            description={handleBars(
              translate("contributionsPageFeatureTimelineFilterParagraph", lang),
              [
                [
                  "TMX",
                  <Link target="_blank" to="//tmuf.exchange/trackreplayshow/37085">
                    TMX
                  </Link>,
                ],
              ],
            )}
            images={<img style={{ userSelect: "none" }} src="/misc/TMXSlider.png" alt="Slider" />}
            suggestedBy={[918]}
          />
          <FeatureElement
            title={translate("contributionsPageFeatureRustBackendHeading", lang)}
            description={<>{translate("contributionsPageFeatureRustBackendParagraph", lang)}</>}
            suggestedBy={[918]}
          />
          <FeatureElement
            title={translate("contributionsPageFeatureChadsoftAPIInterfaceHeading", lang)}
            description={
              <>{translate("contributionsPageFeatureChadsoftAPIInterfaceParagraph", lang)}</>
            }
            suggestedBy={[918, 1165, 630, 237]}
          />
        </div>
      </div>
      <div className="module">
        <div className="module-content">
          <h2>{translate("contributionsPageOngoingDevelopmentHeading", lang)}</h2>
          <FeatureElement
            title={translate("contributionsPageFeatureRivalriesHeading", lang)}
            description={<>{translate("contributionsPageFeatureRivalriesParagraph", lang)}</>}
            workedOnBy={[918]}
          />
          <FeatureElement
            title={translate("contributionsPageFeatureAwardsHeading", lang)}
            description={<>{translate("contributionsPageFeatureAwardsParagraph", lang)}</>}
            workedOnBy={[1165]}
          />
          <FeatureElement
            title={translate("contributionsPageFeatureUserSettingsHeading", lang)}
            description={<>{translate("contributionsPageFeatureUserSettingsParagraph", lang)}</>}
            workedOnBy={[918]}
            suggestedBy={[1165]}
          />
          <FeatureElement
            title={translate("contributionsPageFeatureFurtherSubregionsHeading", lang)}
            description={
              <>{translate("contributionsPageFeatureFurtherSubregionsParagraph", lang)}</>
            }
            workedOnBy={[1165, 918]}
            suggestedBy={[1165, 918]}
          />
          <FeatureElement
            title={translate("contributionsPageFeaturePastChampsHeading", lang)}
            description={<>{translate("contributionsPageFeaturePastChampsParagraph", lang)}</>}
            workedOnBy={[1165, 1167]}
          />
          <FeatureElement
            title={translate("contributionsPageFeatureSubmissionHeading", lang)}
            description={<>{translate("contributionsPageFeatureSubmissionParagraph", lang)}</>}
            workedOnBy={[1165]}
          />
          <FeatureElement
            title={translate("contributionsPageFeatureSvgFlagsHeading", lang)}
            description={<>{translate("contributionsPageFeatureSvgFlagsParagraph", lang)}</>}
            workedOnBy={[1165, 918, 144]}
          />
        </div>
      </div>
      <div className="module">
        <div className="module-content">
          <h2>{translate("contributionsPageDevelopedCreditsHeading", lang)}</h2>
          <FeatureElement
            title={translate("contributionsPageFeatureContributionsPageHeading", lang)}
            description={
              <>{translate("contributionsPageFeatureContributionsPageParagraph", lang)}</>
            }
            suggestedBy={[918]}
            workedOnBy={[918]}
          />
          <FeatureElement
            title={translate("contributionsPageFeatureLocalizationHeading", lang)}
            description={<>{translate("contributionsPageFeatureLocalizationParagraph", lang)}</>}
            workedOnBy={[1165, 918]}
            suggestedBy={[1165, 918]}
          />
          <FeatureElement
            title={translate("contributionsPageFeatureProfileFiltersHeading", lang)}
            description={<>{translate("contributionsPageFeatureProfileFiltersParagraph", lang)}</>}
            workedOnBy={[918]}
            suggestedBy={[918, 144]}
          />
          <FeatureElement
            title={translate("contributionsPageFeatureCountryAFHeading", lang)}
            description={<>{translate("contributionsPageFeatureCountryAFParagraph", lang)}</>}
            workedOnBy={[918]}
          />
          <FeatureElement
            title={translate("contributionsPageFeatureMatchupsHeading", lang)}
            description={<>{translate("contributionsPageFeatureMatchupsParagraph", lang)}</>}
            workedOnBy={[1165, 918]}
          />
          <FeatureElement
            title={translate("contributionsPageFeatureCustomDropdownsHeading", lang)}
            description={<>{translate("contributionsPageFeatureCustomDropdownsParagraph", lang)}</>}
            workedOnBy={[918]}
          />
          <FeatureElement
            title={translate("contributionsPageFeatureRulesPageHeading", lang)}
            description={<>{translate("contributionsPageFeatureRulesPageParagraph", lang)}</>}
            workedOnBy={[918, 145]}
          />
          <FeatureElement
            title={translate("contributionsPageFeatureCategoryHueHeading", lang)}
            description={<>{translate("contributionsPageFeatureCategoryHueParagraph", lang)}</>}
            workedOnBy={[918, 1165]}
            suggestedBy={[144]}
          />
          <FeatureElement
            title={translate("contributionsPageFeatureTallyPointsHeading", lang)}
            description={<>{translate("contributionsPageFeatureTallyPointsParagraph", lang)}</>}
            suggestedBy={[1165, 630, 144]}
            workedOnBy={[1165, 918, 1167]}
          />
          <FeatureElement
            title={translate("contributionsPageFeatureRegionSelectionHeading", lang)}
            description={<>{translate("contributionsPageFeatureRegionSelectionParagraph", lang)}</>}
            suggestedBy={[918]}
            workedOnBy={[918]}
          />
          <FeatureElement
            title={translate("contributionsPageFeatureTopsHeading", lang)}
            description={<>{translate("contributionsPageFeatureTopsParagraph", lang)}</>}
            workedOnBy={[1165]}
          />
          <FeatureElement
            title={translate("contributionsPageFeaturePlayersHeading", lang)}
            description={<>{translate("contributionsPageFeaturePlayersParagraph", lang)}</>}
            workedOnBy={[1165]}
          />
          <FeatureElement
            title={translate("contributionsPageFeatureLoginHeading", lang)}
            description={<>{translate("contributionsPageFeatureLoginParagraph", lang)}</>}
            workedOnBy={[1165]}
          />
          <FeatureElement
            title={translate("contributionsPageFeatureRankingsHeading", lang)}
            description={<>{translate("contributionsPageFeatureRankingsParagraph", lang)}</>}
            workedOnBy={[1165]}
          />
          <FeatureElement
            title={translate("contributionsPageFeatureChartsHeading", lang)}
            description={<>{translate("contributionsPageFeatureChartsParagraph", lang)}</>}
            workedOnBy={[1165]}
          />
          <FeatureElement
            title={translate("contributionsPageFeatureSiteHeading", lang)}
            description={<>{translate("contributionsPageFeatureSiteParagraph", lang)}</>}
            workedOnBy={[1165]}
          />
        </div>
      </div>
      <div className="module">
        <div className="module-content">
          <h2>{translate("contributionsPageSpecialCreditsHeading", lang)}</h2>
          <p>
            {handleBars(translate("contributionsPageSpecialCreditsPenevParagraph", lang), [
              ["Penev", <PlayerMention id={58} />],
            ])}
          </p>
          <p>
            {translate("contributionsPageSpecialCreditsUpdatersParagraph", lang)}{" "}
            <PlayerMention id={1167} />, <PlayerMention id={145} />, <PlayerMention id={630} />,{" "}
            <PlayerMention id={144} />, <PlayerMention id={1588} />, <PlayerMention id={1372} />,{" "}
            <PlayerMention id={308} />
          </p>
          <p>
            {translate("contributionsPageSpecialCreditsFormerUpdatersParagraph", lang)}{" "}
            <PlayerMention id={1626} />, <PlayerMention id={1539} />, <PlayerMention id={1538} />,{" "}
            <PlayerMention id={644} />, <PlayerMention id={383} />, <PlayerMention id={718} />,{" "}
            <PlayerMention id={1598} />
          </p>
        </div>
      </div>
    </>
  );
};

interface FeatureProps {
  title?: string;
  description?: JSX.Element;
  images?: JSX.Element;
  workedOnBy?: number[];
  suggestedBy?: number[];
}

const FeatureElement = ({ title, description, images, suggestedBy, workedOnBy }: FeatureProps) => {
  const { lang } = useContext(I18nContext);
  return (
    <div>
      <hr style={{ width: "100%" }} />
      <h3>{title}</h3>
      <div>{description}</div>
      {images}
      <div
        style={{
          marginTop: "10px",
          marginBottom: "10px",
          fontSize: ".75em",
          display: "flex",
          gap: "10px",
        }}
      >
        {workedOnBy ? (
          <div>
            <div>{translate("contributionsPageFeatureWorkedOnBy", lang)}</div>
            {workedOnBy.map((r) => (
              <div>
                <PlayerMention id={r} />
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}
        {suggestedBy ? (
          <div>
            <div>{translate("contributionsPageFeatureSuggestedBy", lang)}</div>
            {suggestedBy.map((r) => (
              <div>
                <PlayerMention id={r} />
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ContributionsPage;
