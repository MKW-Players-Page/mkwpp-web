import { useContext, useState } from "react";
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
        </div>
      </div>
      <div className="module">
        <div className="module-content">
          <h2>{translations.contributionsPageOngoingDevelopmentHeading[lang]}</h2>
        </div>
      </div>
      <div className="module">
        <div className="module-content">
          <h2>{translations.contributionsPageDevelopedCreditsHeading[lang]}</h2>
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

export default ContributionsPage;
