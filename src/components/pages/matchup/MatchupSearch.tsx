import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { Pages, resolvePage } from "./../Pages";
import PlayerSelectDropdown from "../../widgets/PlayerSelectDropdown";
import { I18nContext, translate } from "../../../utils/i18n/i18n";
import { Icon } from "../../widgets";

interface PlayerSelectFieldProp {
  nth: number;
  setId: React.Dispatch<React.SetStateAction<number>>;
  id: number;
  showDelete: boolean;
  deleteOnClick: () => void;
}
const PlayerSelectField = ({
  nth,
  setId,
  id,
  showDelete,
  deleteOnClick,
}: PlayerSelectFieldProp) => {
  const { lang } = useContext(I18nContext);
  return (
    <div className="module-row" style={{ maxHeight: "43px" }}>
      <span
        style={{
          marginBottom: "16px",
          textDecorationColor: id === 0 && nth < 3 ? "red" : "white",
          textDecorationLine: id === 0 && nth < 3 ? "underline" : "none",
        }}
      >
        <span className="matchup-search-s1">{translate("matchupPagePlayerText", lang)}&nbsp;</span>
        {nth}
      </span>
      <PlayerSelectDropdown setId={setId} id={id} />
      {showDelete ? (
        <button
          onClick={deleteOnClick}
          className="module"
          style={{ flexShrink: 10, alignSelf: "stretch", fontSize: ".7em", padding: "4px" }}
        >
          <Icon icon="Delete" />
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

export const MatchupHomePage = () => {
  const idStates = [
    useState(0),
    useState(0),
    useState(0),
    useState(0),
    useState(0),
    useState(0),
    useState(0),
    useState(0),
  ];
  const { lang } = useContext(I18nContext);

  return (
    <>
      <h1>{translate("matchupPageHeading", lang)}</h1>
      <div className="module">
        <div className="module-content">
          {idStates.map(([idState, setIdState], idx, arr) => {
            if (idState === 0 && idx !== 0 && arr[idx - 1][0] === 0) return <></>;
            return (
              <PlayerSelectField
                showDelete={arr.reduce((x, r) => (r[0] !== 0 ? x + 1 : x), 0) > 1}
                nth={idx + 1}
                id={idState}
                setId={setIdState}
                deleteOnClick={
                  idState === 0
                    ? () => {}
                    : () => {
                        for (let i = idx; i < idStates.length; i++) {
                          if (idStates[i][0] === 0) return;
                          if (i === idStates.length - 1) {
                            idStates[i][1](0);
                            return;
                          }
                          idStates[i][1](idStates[i + 1][0]);
                        }
                      }
                }
              />
            );
          })}
          <Link
            className="submit-style"
            to={
              idStates[0][0] === 0 || idStates[1][0] === 0
                ? ""
                : resolvePage(
                    Pages.Matchup,
                    {},
                    { ids: idStates.map((idState) => idState[0]).filter((r) => r !== 0) },
                  )
            }
          >
            {translate("matchupPageCompareButtonText", lang)}
          </Link>
        </div>
      </div>
    </>
  );
};

export default MatchupHomePage;
