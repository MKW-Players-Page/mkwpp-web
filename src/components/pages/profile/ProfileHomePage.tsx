import { useContext } from "react";
import { Navigate, useNavigate } from "react-router";

import { I18nContext, translate } from "../../../utils/i18n/i18n";
import { UserContext } from "../../../utils/User";
import { Pages, resolvePage } from "../Pages";

const ProfileHomePage = () => {
  const navigate = useNavigate();

  const { lang } = useContext(I18nContext);
  const { isLoading, user } = useContext(UserContext);

  return (
    <>
      {!isLoading && !user && <Navigate to={resolvePage(Pages.UserLogin)} />}
      <h1>{translate("profileHomePageHeading", lang)}</h1>
      <div className="module">
        <div className="module-content">
          <h3>{translate("profileHomePageWelcome", lang)}</h3>
          <p>{translate("profileHomePageInstructions", lang)}</p>
          <ul>
            <li>{translate("profileHomePageInstructionsCreate", lang)}</li>
            <li>{translate("profileHomePageInstructionsClaim", lang)}</li>
          </ul>
          <h3>{translate("profileHomePageReady", lang)}</h3>
          <div className="form-buttons">
            <button onClick={() => navigate(resolvePage(Pages.ProfileCreate))}>
              {translate("profileHomePageButtonLabelCreate", lang)}
            </button>
            <button onClick={() => navigate(resolvePage(Pages.ProfileClaim))}>
              {translate("profileHomePageButtonLabelClaim", lang)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHomePage;
