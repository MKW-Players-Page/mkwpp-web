import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { Pages, resolvePage } from "./../Pages";
import PlayerSelectDropdown from "../../widgets/PlayerSelectDropdown";
import { I18nContext, translate } from "../../../utils/i18n/i18n";

export const MatchupHomePage = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { lang } = useContext(I18nContext);

  return (
    <>
      <h1>{translate("matchupPageHeading", lang)}</h1>
      <div className="module">
        <div className="module-content">
          <PlayerSelectDropdown multiple setId={setSelectedIds} id={selectedIds} />
          <Link
            className="submit-style"
            to={
              selectedIds.length === 0 ? "" : resolvePage(Pages.Matchup, {}, { ids: selectedIds })
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
