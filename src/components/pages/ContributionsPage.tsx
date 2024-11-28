import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { handleBars, I18nContext, Language, LanguageName } from "../../utils/i18n/i18n";
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
  const { translations, lang } = useContext(I18nContext);

  const QuestionsAndAnswers: Record<number, Question | Answer> = {
    1: {
      type: 0,
      text: translations.contributionsPageQuestionsAndAnswers1[lang],
      posAns: translations.contributionsPagePositiveResponse[lang],
      negAns: translations.contributionsPageNegativeResponse[lang],
      posFollowup: 2,
      negFollowup: 3,
    },
    2: {
      type: 1,
      text: translations.contributionsPageQuestionsAndAnswers2[lang],
    },
    3: {
      type: 0,
      text: translations.contributionsPageQuestionsAndAnswers3[lang],
      posAns: translations.contributionsPagePositiveResponse[lang],
      negAns: translations.contributionsPageNegativeResponse[lang],
      posFollowup: 4,
      negFollowup: 5,
    },
    4: {
      type: 1,
      text: translations.contributionsPageQuestionsAndAnswers4[lang],
    },
    5: {
      type: 0,
      text: translations.contributionsPageQuestionsAndAnswers5[lang],
      posAns: translations.contributionsPagePositiveResponse[lang],
      negAns: translations.contributionsPageNegativeResponse[lang],
      posFollowup: 6,
      negFollowup: 1,
    },
    6: {
      type: 1,
      text: translations.contributionsPageQuestionsAndAnswers6[lang],
    },
  };

  const [questionIndex, setQuestionIndex] = useState(1);
  return (
    <>
      <h1>{translations.contributionsPageHeading[lang]}</h1>
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
          <h2>{translations.contributionsPageLanguageCompletionHeading[lang]}</h2>
          <table style={{ marginBottom: "10px" }}>
            <thead>
              <tr>
                <th>{translations.contributionsPageLanguageCompletionLanguageCol[lang]}</th>
                <th>{translations.contributionsPageLanguageCompletionPercentageCol[lang]}</th>
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
          <p>{translations.contributionsPageLanguageCompletionThanksText[lang]}</p>
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
          <h2>{translations.contributionsPageFeatureRoadmapHeading[lang]}</h2>
          <FeatureElement
            title={translations.contributionsPageFeatureTimelineFilterHeading[lang]}
            description={handleBars(
              translations.contributionsPageFeatureTimelineFilterParagraph[lang],
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
            title={translations.contributionsPageFeatureRustBackendHeading[lang]}
            description={<>{translations.contributionsPageFeatureRustBackendParagraph[lang]}</>}
            suggestedBy={[918]}
          />
          <FeatureElement
            title={translations.contributionsPageFeatureChadsoftAPIInterfaceHeading[lang]}
            description={
              <>{translations.contributionsPageFeatureChadsoftAPIInterfaceParagraph[lang]}</>
            }
            suggestedBy={[918, 1165, 630, 237]}
          />
        </div>
      </div>
      <div className="module">
        <div className="module-content">
          <h2>{translations.contributionsPageOngoingDevelopmentHeading[lang]}</h2>
          <FeatureElement
            title={translations.contributionsPageFeatureRivalriesHeading[lang]}
            description={<>{translations.contributionsPageFeatureRivalriesParagraph[lang]}</>}
            workedOnBy={[918]}
          />
          <FeatureElement
            title={translations.contributionsPageFeatureAwardsHeading[lang]}
            description={<>{translations.contributionsPageFeatureAwardsParagraph[lang]}</>}
            workedOnBy={[1165]}
          />
          <FeatureElement
            title={translations.contributionsPageFeatureUserSettingsHeading[lang]}
            description={<>{translations.contributionsPageFeatureUserSettingsParagraph[lang]}</>}
            workedOnBy={[918]}
            suggestedBy={[1165]}
          />
          <FeatureElement
            title={translations.contributionsPageFeatureFurtherSubregionsHeading[lang]}
            description={
              <>{translations.contributionsPageFeatureFurtherSubregionsParagraph[lang]}</>
            }
            workedOnBy={[1165, 918]}
            suggestedBy={[1165, 918]}
          />
          <FeatureElement
            title={translations.contributionsPageFeaturePastChampsHeading[lang]}
            description={<>{translations.contributionsPageFeaturePastChampsParagraph[lang]}</>}
            workedOnBy={[1165, 1167]}
          />
          <FeatureElement
            title={translations.contributionsPageFeatureSubmissionHeading[lang]}
            description={<>{translations.contributionsPageFeatureSubmissionParagraph[lang]}</>}
            workedOnBy={[1165]}
          />
          <FeatureElement
            title={translations.contributionsPageFeatureSvgFlagsHeading[lang]}
            description={<>{translations.contributionsPageFeatureSvgFlagsParagraph[lang]}</>}
            workedOnBy={[1165, 918, 144]}
          />
        </div>
      </div>
      <div className="module">
        <div className="module-content">
          <h2>{translations.contributionsPageDevelopedCreditsHeading[lang]}</h2>
          <FeatureElement
            title={translations.contributionsPageFeatureContributionsPageHeading[lang]}
            description={
              <>{translations.contributionsPageFeatureContributionsPageParagraph[lang]}</>
            }
            suggestedBy={[918]}
            workedOnBy={[918]}
          />
          <FeatureElement
            title={translations.contributionsPageFeatureLocalizationHeading[lang]}
            description={<>{translations.contributionsPageFeatureLocalizationParagraph[lang]}</>}
            workedOnBy={[1165, 918]}
            suggestedBy={[1165, 918]}
          />
          <FeatureElement
            title={translations.contributionsPageFeatureProfileFiltersHeading[lang]}
            description={<>{translations.contributionsPageFeatureProfileFiltersParagraph[lang]}</>}
            workedOnBy={[918]}
            suggestedBy={[918, 144]}
          />
          <FeatureElement
            title={translations.contributionsPageFeatureCountryAFHeading[lang]}
            description={<>{translations.contributionsPageFeatureCountryAFParagraph[lang]}</>}
            workedOnBy={[918]}
          />
          <FeatureElement
            title={translations.contributionsPageFeatureMatchupsHeading[lang]}
            description={<>{translations.contributionsPageFeatureMatchupsParagraph[lang]}</>}
            workedOnBy={[1165, 918]}
          />
          <FeatureElement
            title={translations.contributionsPageFeatureCustomDropdownsHeading[lang]}
            description={<>{translations.contributionsPageFeatureCustomDropdownsParagraph[lang]}</>}
            workedOnBy={[918]}
          />
          <FeatureElement
            title={translations.contributionsPageFeatureRulesPageHeading[lang]}
            description={<>{translations.contributionsPageFeatureRulesPageParagraph[lang]}</>}
            workedOnBy={[918, 145]}
          />
          <FeatureElement
            title={translations.contributionsPageFeatureCategoryHueHeading[lang]}
            description={<>{translations.contributionsPageFeatureCategoryHueParagraph[lang]}</>}
            workedOnBy={[918, 1165]}
            suggestedBy={[144]}
          />
          <FeatureElement
            title={translations.contributionsPageFeatureTallyPointsHeading[lang]}
            description={<>{translations.contributionsPageFeatureTallyPointsParagraph[lang]}</>}
            suggestedBy={[1165, 630, 144]}
            workedOnBy={[1165, 918, 1167]}
          />
          <FeatureElement
            title={translations.contributionsPageFeatureRegionSelectionHeading[lang]}
            description={<>{translations.contributionsPageFeatureRegionSelectionParagraph[lang]}</>}
            suggestedBy={[918]}
            workedOnBy={[918]}
          />
          <FeatureElement
            title={translations.contributionsPageFeatureTopsHeading[lang]}
            description={<>{translations.contributionsPageFeatureTopsParagraph[lang]}</>}
            workedOnBy={[1165]}
          />
          <FeatureElement
            title={translations.contributionsPageFeaturePlayersHeading[lang]}
            description={<>{translations.contributionsPageFeaturePlayersParagraph[lang]}</>}
            workedOnBy={[1165]}
          />
          <FeatureElement
            title={translations.contributionsPageFeatureLoginHeading[lang]}
            description={<>{translations.contributionsPageFeatureLoginParagraph[lang]}</>}
            workedOnBy={[1165]}
          />
          <FeatureElement
            title={translations.contributionsPageFeatureRankingsHeading[lang]}
            description={<>{translations.contributionsPageFeatureRankingsParagraph[lang]}</>}
            workedOnBy={[1165]}
          />
          <FeatureElement
            title={translations.contributionsPageFeatureChartsHeading[lang]}
            description={<>{translations.contributionsPageFeatureChartsParagraph[lang]}</>}
            workedOnBy={[1165]}
          />
          <FeatureElement
            title={translations.contributionsPageFeatureSiteHeading[lang]}
            description={<>{translations.contributionsPageFeatureSiteParagraph[lang]}</>}
            workedOnBy={[1165]}
          />
        </div>
      </div>
      <div className="module">
        <div className="module-content">
          <h2>{translations.contributionsPageSpecialCreditsHeading[lang]}</h2>
          <p>
            {handleBars(translations.contributionsPageSpecialCreditsPenevParagraph[lang], [
              ["Penev", <PlayerMention id={58} />],
            ])}
          </p>
          <p>
            {translations.contributionsPageSpecialCreditsUpdatersParagraph[lang]}{" "}
            <PlayerMention id={1167} />, <PlayerMention id={145} />, <PlayerMention id={630} />,{" "}
            <PlayerMention id={144} />, <PlayerMention id={1588} />, <PlayerMention id={1372} />,{" "}
            <PlayerMention id={308} />
          </p>
          <p>
            {translations.contributionsPageSpecialCreditsFormerUpdatersParagraph[lang]}{" "}
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
  const { translations, lang } = useContext(I18nContext);
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
            <div>{translations.contributionsPageFeatureWorkedOnBy[lang]}</div>
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
            <div>{translations.contributionsPageFeatureSuggestedBy[lang]}</div>
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
