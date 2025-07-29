import { useContext, useState } from "react";
import { Link } from "react-router";
import { handleBars, I18nContext, Language, LanguageName, translate } from "../../utils/i18n/i18n";
import PlayerMention from "../widgets/PlayerMention";

interface Question {
  type: 0;
  text: React.ReactNode;
  posAns: React.ReactNode;
  negAns: React.ReactNode;
  posFollowup: number;
  negFollowup: number;
}

interface Answer {
  type: 1;
  text: React.ReactNode;
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
      text: handleBars(translate("contributionsPageQuestionsAndAnswers4", lang), [
        [
          "sheetLink",
          <Link
            target="_blank"
            to="//docs.google.com/spreadsheets/d/1mu2XyG_WQID0dYY0clTgRJAPg_oBb3BO5Z2Nb-VCDhg"
          >
            https://docs.google.com/spreadsheets/d/1mu2XyG_WQID0dYY0clTgRJAPg_oBb3BO5Z2Nb-VCDhg
          </Link>,
        ],
        [
          "video",
          <Link target="_blank" to="//youtu.be/0U11gGmC5mo">
            https://youtu.be/0U11gGmC5mo
          </Link>,
        ],
      ]),
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
                              Object.entries(Language).find(([keyX, _]) => keyX === key) as [
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
                player: <PlayerMention playerOrId={918} />,
                langs: [LanguageName.Italian, LanguageName.English],
              },
              { player: <PlayerMention playerOrId={1165} />, langs: [LanguageName.English] },
              { player: <PlayerMention playerOrId={1230} />, langs: [LanguageName.Spanish] },
              { player: <PlayerMention playerOrId={1231} />, langs: [LanguageName.Spanish] },
              { player: <PlayerMention playerOrId={144} />, langs: [LanguageName.French] },
              { player: <PlayerMention playerOrId={145} />, langs: [LanguageName.English] },
              { player: <PlayerMention playerOrId={632} />, langs: [LanguageName.Portuguese] },
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
          <Feature
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
            images={
              <img
                style={{ userSelect: "none", aspectRatio: "499/62", width: "100%" }}
                src="/misc/TMXSlider.png"
                alt="Slider"
              />
            }
            suggestedBy={[918]}
          />
          <Feature
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
          <Feature
            title={translate("contributionsPageFeatureRustBackendHeading", lang)}
            description={<>{translate("contributionsPageFeatureRustBackendParagraph", lang)}</>}
            workedOnBy={[918]}
            suggestedBy={[918]}
          />
          <Feature
            title={translate("contributionsPageFeatureRivalriesHeading", lang)}
            description={<>{translate("contributionsPageFeatureRivalriesParagraph", lang)}</>}
            workedOnBy={[918]}
          />
          <Feature
            title={translate("contributionsPageFeatureAwardsHeading", lang)}
            description={<>{translate("contributionsPageFeatureAwardsParagraph", lang)}</>}
            workedOnBy={[1165]}
          />
          <Feature
            title={translate("contributionsPageFeatureUserSettingsHeading", lang)}
            description={<>{translate("contributionsPageFeatureUserSettingsParagraph", lang)}</>}
            workedOnBy={[918]}
            suggestedBy={[1165]}
          />
          <Feature
            title={translate("contributionsPageFeatureFurtherSubregionsHeading", lang)}
            description={
              <>{translate("contributionsPageFeatureFurtherSubregionsParagraph", lang)}</>
            }
            workedOnBy={[1165, 918]}
            suggestedBy={[1165, 918]}
          />
          <Feature
            title={translate("contributionsPageFeaturePastChampsHeading", lang)}
            description={<>{translate("contributionsPageFeaturePastChampsParagraph", lang)}</>}
            workedOnBy={[1165, 1167]}
          />
          <Feature
            title={translate("contributionsPageFeatureSubmissionHeading", lang)}
            description={<>{translate("contributionsPageFeatureSubmissionParagraph", lang)}</>}
            workedOnBy={[1165]}
          />
          <Feature
            title={translate("contributionsPageFeatureSvgFlagsHeading", lang)}
            description={<>{translate("contributionsPageFeatureSvgFlagsParagraph", lang)}</>}
            workedOnBy={[1165, 918, 144]}
          />
        </div>
      </div>
      <div className="module">
        <div className="module-content">
          <h2>{translate("contributionsPageDevelopedCreditsHeading", lang)}</h2>
          <Feature
            title={translate("contributionsPageFeatureContributionsPageHeading", lang)}
            description={
              <>{translate("contributionsPageFeatureContributionsPageParagraph", lang)}</>
            }
            suggestedBy={[918]}
            workedOnBy={[918]}
          />
          <Feature
            title={translate("contributionsPageFeatureLocalizationHeading", lang)}
            description={<>{translate("contributionsPageFeatureLocalizationParagraph", lang)}</>}
            workedOnBy={[1165, 918]}
            suggestedBy={[1165, 918]}
          />
          <Feature
            title={translate("contributionsPageFeatureProfileFiltersHeading", lang)}
            description={<>{translate("contributionsPageFeatureProfileFiltersParagraph", lang)}</>}
            workedOnBy={[918]}
            suggestedBy={[918, 144]}
          />
          <Feature
            title={translate("contributionsPageFeatureCountryAFHeading", lang)}
            description={<>{translate("contributionsPageFeatureCountryAFParagraph", lang)}</>}
            workedOnBy={[918]}
          />
          <Feature
            title={translate("contributionsPageFeatureMatchupsHeading", lang)}
            description={<>{translate("contributionsPageFeatureMatchupsParagraph", lang)}</>}
            workedOnBy={[1165, 918]}
          />
          <Feature
            title={translate("contributionsPageFeatureCustomDropdownsHeading", lang)}
            description={<>{translate("contributionsPageFeatureCustomDropdownsParagraph", lang)}</>}
            workedOnBy={[918]}
          />
          <Feature
            title={translate("contributionsPageFeatureRulesPageHeading", lang)}
            description={<>{translate("contributionsPageFeatureRulesPageParagraph", lang)}</>}
            workedOnBy={[918, 145]}
          />
          <Feature
            title={translate("contributionsPageFeatureCategoryHueHeading", lang)}
            description={<>{translate("contributionsPageFeatureCategoryHueParagraph", lang)}</>}
            workedOnBy={[918, 1165]}
            suggestedBy={[144]}
          />
          <Feature
            title={translate("contributionsPageFeatureTallyPointsHeading", lang)}
            description={<>{translate("contributionsPageFeatureTallyPointsParagraph", lang)}</>}
            suggestedBy={[1165, 630, 144]}
            workedOnBy={[1165, 918, 1167]}
          />
          <Feature
            title={translate("contributionsPageFeatureRegionSelectionHeading", lang)}
            description={<>{translate("contributionsPageFeatureRegionSelectionParagraph", lang)}</>}
            suggestedBy={[918]}
            workedOnBy={[918]}
          />
          <Feature
            title={translate("contributionsPageFeatureTopsHeading", lang)}
            description={<>{translate("contributionsPageFeatureTopsParagraph", lang)}</>}
            workedOnBy={[1165]}
          />
          <Feature
            title={translate("contributionsPageFeaturePlayersHeading", lang)}
            description={<>{translate("contributionsPageFeaturePlayersParagraph", lang)}</>}
            workedOnBy={[1165]}
          />
          <Feature
            title={translate("contributionsPageFeatureLoginHeading", lang)}
            description={<>{translate("contributionsPageFeatureLoginParagraph", lang)}</>}
            workedOnBy={[1165]}
          />
          <Feature
            title={translate("contributionsPageFeatureRankingsHeading", lang)}
            description={<>{translate("contributionsPageFeatureRankingsParagraph", lang)}</>}
            workedOnBy={[1165]}
          />
          <Feature
            title={translate("contributionsPageFeatureStandardsHeading", lang)}
            description={<>{translate("contributionsPageFeatureStandardsParagraph", lang)}</>}
            workedOnBy={[1165, 918]}
          />
          <Feature
            title={translate("contributionsPageFeatureChartsHeading", lang)}
            description={<>{translate("contributionsPageFeatureChartsParagraph", lang)}</>}
            workedOnBy={[1165]}
          />
          <Feature
            title={translate("contributionsPageFeatureSiteHeading", lang)}
            description={<>{translate("contributionsPageFeatureSiteParagraph", lang)}</>}
            workedOnBy={[1165]}
          />
        </div>
      </div>
      <div className="module">
        <div className="module-content how-to-contribute-thanks">
          <h2>{translate("contributionsPageSpecialCreditsHeading", lang)}</h2>
          <p>
            {handleBars(translate("contributionsPageSpecialCreditsPenevParagraph", lang), [
              ["Penev", <PlayerMention playerOrId={58} />],
            ])}
          </p>
          <p>
            {translate("contributionsPageSpecialCreditsUpdatersParagraph", lang)}{" "}
            <PlayerMention playerOrId={1167} />, <PlayerMention playerOrId={145} />,{" "}
            <PlayerMention playerOrId={365} />, <PlayerMention playerOrId={144} />,{" "}
            <PlayerMention playerOrId={1588} />, <PlayerMention playerOrId={1372} />,{" "}
            <PlayerMention playerOrId={308} />, <PlayerMention playerOrId={180} />,{" "}
            <PlayerMention playerOrId={1204} />, <PlayerMention playerOrId={448} />,{" "}
          </p>
          <p>
            {translate("contributionsPageSpecialCreditsFormerUpdatersParagraph", lang)}{" "}
            <PlayerMention playerOrId={1626} />, <PlayerMention playerOrId={1539} />,{" "}
            <PlayerMention playerOrId={1538} />, <PlayerMention playerOrId={644} />,{" "}
            <PlayerMention playerOrId={383} />, <PlayerMention playerOrId={718} />,{" "}
            <PlayerMention playerOrId={1598} />, <PlayerMention playerOrId={630} />
          </p>
        </div>
      </div>
    </>
  );
};

interface FeatureProps {
  title?: string;
  description?: React.ReactNode;
  images?: React.ReactNode;
  workedOnBy?: number[];
  suggestedBy?: number[];
}

const Feature = ({ title, description, images, suggestedBy, workedOnBy }: FeatureProps) => {
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
                <PlayerMention playerOrId={r} />
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
                <PlayerMention playerOrId={r} />
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
