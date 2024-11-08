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
      negFollowup: 1,
    },
    4: {
      type: 1,
      text: translations.contributionsPageQuestionsAndAnswers4[lang],
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
                style={{ marginRight: "10px" } as React.CSSProperties}
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
          <table style={{ marginBottom: "10px" } as React.CSSProperties}>
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
          <ul style={{ listStyleType: "disc" } as React.CSSProperties}>
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
            suggestedBy={[918]}
          />
          <FeatureElement
            title={translations.contributionsPageFeatureFurtherSubregionsHeading[lang]}
            description={
              <>{translations.contributionsPageFeatureFurtherSubregionsParagraph[lang]}</>
            }
            suggestedBy={[1165, 918]}
          />
          <FeatureElement
            title={"Port Rivalries"}
            description={<>{"Port Rivalries from the Old Site"}</>}
          />
        </div>
      </div>
      <div className="module">
        <div className="module-content">
          <h2>{translations.contributionsPageOngoingDevelopmentHeading[lang]}</h2>
          <FeatureElement
            title={translations.contributionsPageFeatureContributionsPageHeading[lang]}
            description={
              <>{translations.contributionsPageFeatureContributionsPageParagraph[lang]}</>
            }
            suggestedBy={[918]}
            workedOnBy={[918]}
          />
          <FeatureElement
            title={"Port Awards"}
            description={<>{"Port Awards from the Old Site"}</>}
            workedOnBy={[1165]}
          />
          <FeatureElement
            title={"Port Past Champions"}
            description={<>{"Port Past Champions from the Old Site"}</>}
            workedOnBy={[1165]}
          />
        </div>
      </div>
      <div className="module">
        <div className="module-content">
          <h2>{translations.contributionsPageDevelopedCreditsHeading[lang]}</h2>
          <FeatureElement
            title={"Localization"}
            description={<>{"Allow for pages to have multiple languages"}</>}
            workedOnBy={[1165, 918]}
            suggestedBy={[1165, 918]}
          />
          <FeatureElement
            title={"Filters on Player Profile Charts"}
            description={
              <>{"Sort the chart on Player Profiles by clicking on the table headings"}</>
            }
            workedOnBy={[918]}
            suggestedBy={[918, 144]}
          />
          <FeatureElement
            title={"Port Country AF"}
            description={<>{"Port Country AF from the Old Site"}</>}
            workedOnBy={[918]}
          />
          <FeatureElement
            title={"Port Matchups"}
            description={<>{"Port Matchups from the Old Site"}</>}
            workedOnBy={[1165, 918]}
          />
          <FeatureElement
            title={"Custom dropdowns"}
            description={<>{"Create Custom Dropdowns"}</>}
            workedOnBy={[918]}
          />
          <FeatureElement
            title={"Rules Page"}
            description={<>{"Port Rules from old Site and update them."}</>}
            workedOnBy={[918, 145]}
          />
          <FeatureElement
            title={"Visually indicate Category"}
            description={<>{"Change the hue of the site based on the page's category"}</>}
            workedOnBy={[918, 1165]}
            suggestedBy={[144]}
          />
          <FeatureElement
            title={"Region Selection"}
            description={<>{"Create a custom Region Selection for the Top 10s page"}</>}
            suggestedBy={[918]}
            workedOnBy={[918]}
          />
          <FeatureElement
            title={"Tally Points Rankings"}
            description={<>{"Mimick Tally Points from MKL"}</>}
            suggestedBy={[1165, 630, 144]}
            workedOnBy={[1165, 918, 1167]}
          />
          <FeatureElement
            title={"Port Standards"}
            description={<>{"Port Standards from the Old Site"}</>}
            workedOnBy={[1165]}
          />
          <FeatureElement
            title={"Top 10s"}
            description={<>{"Mimick Top 10s from MKL"}</>}
            workedOnBy={[1165]}
          />
          <FeatureElement
            title={"Port Players"}
            description={<>{"Port Players from the Old Site"}</>}
            workedOnBy={[1165]}
          />
          <FeatureElement
            title={"Port Rankings"}
            description={<>{"Port Rankings from the Old Site, AF, ARR, PRWR, Total Time"}</>}
            workedOnBy={[1165]}
          />
          <FeatureElement
            title={"Port Charts"}
            description={<>{"Port Charts from the Old Site"}</>}
            workedOnBy={[1165]}
          />
          <FeatureElement
            title={"New Site!"}
            description={<>{"Begin work on a new site"}</>}
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
            <PlayerMention id={144} />, <PlayerMention id={1588} />, <PlayerMention id={1372} />
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
      <hr style={{ width: "100%" } as React.CSSProperties} />
      <h3>{title}</h3>
      <div>{description}</div>
      {images}
      <div
        style={
          {
            marginTop: "10px",
            marginBottom: "10px",
            fontSize: ".75em",
            display: "flex",
            gap: "10px",
          } as React.CSSProperties
        }
      >
        {workedOnBy ? (
          <div>
            <div>{translations.contributionsPageFeautreWorkedOnBy[lang]}</div>
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
            <div>{translations.contributionsPageFeautreSuggestedBy[lang]}</div>
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
