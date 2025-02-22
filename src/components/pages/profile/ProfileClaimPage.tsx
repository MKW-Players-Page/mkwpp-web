import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";

import { coreApi } from "../../../api";
import { I18nContext, translate } from "../../../utils/i18n/i18n";
import { UserContext } from "../../../utils/User";
import Form, { FormState } from "../../widgets/Form";
import PlayerMention from "../../widgets/PlayerMention";
import { PlayerSelectDropdownField } from "../../widgets/PlayerSelectDropdown";
import { Pages, resolvePage } from "../Pages";

enum ProfileClaimState {
  CHOOSE = "CHOOSE",
  CONFIRM = "CONFIRM",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

interface ProfileClaimFormState extends FormState {
  id: number;
  state: ProfileClaimState;
}

const ProfileClaimPage = () => {
  const { lang } = useContext(I18nContext);
  const { isLoading, user, setUser } = useContext(UserContext);

  const initialState = { id: 0, errors: {}, submitting: false, state: ProfileClaimState.CHOOSE };
  const [state, setState] = useState<ProfileClaimFormState>(initialState);

  const submit = (done: () => void) => {
    if (state.id === 0) {
      setState((prev) => ({
        ...prev,
        errors: { ...prev.errors, id: [translate("profileClaimPageErrorNoPlayerSelected", lang)] },
      }));
    } else {
      setState((prev) => ({ ...prev, state: ProfileClaimState.CONFIRM }));
    }
    done();
  };

  const confirm = () => {
    if (!user) {
      return;
    }

    coreApi
      .coreProfileClaimCreate({ profileClaim: { player: state.id } })
      .then(() => {
        setUser({ ...user, player: state.id });
        setState((prev) => ({ ...prev, state: ProfileClaimState.SUCCESS }));
      })
      .catch(() => setState((prev) => ({ ...prev, state: ProfileClaimState.ERROR })));
  };

  const cancel = () => {
    setState((prev) => ({ ...prev, showConfirmation: false }));
  };

  return (
    <>
      {!isLoading && !user && <Navigate to={resolvePage(Pages.UserLogin)} />}
      <h1>{translate("profileClaimPageHeading", lang)}</h1>
      {state.state === ProfileClaimState.CHOOSE && (
        <Form
          state={state}
          setState={setState}
          submitLabel={translate("profileClaimPageButtonLabelClaim", lang)}
          submit={submit}
        >
          <PlayerSelectDropdownField field="id" filterFn={(player) => !player.user} />
        </Form>
      )}
      {state.state === ProfileClaimState.CONFIRM && (
        <div>
          <p>
            {translate("profileClaimPageConfirmationSummary", lang)}
            <PlayerMention id={state.id} />
          </p>
          <p>{translate("profileClaimPageConfirmationWarning", lang)}</p>
          <br />
          <div className="form-buttons">
            <button onClick={confirm}>
              {translate("profileClaimPageButtonLabelConfirm", lang)}
            </button>
            <button onClick={cancel}>{translate("profileClaimPageButtonLabelCancel", lang)}</button>
          </div>
        </div>
      )}
      {state.state === ProfileClaimState.SUCCESS && (
        <div className="module">
          <div className="module-content">{translate("profileClaimPageSuccess", lang)}</div>
        </div>
      )}
      {state.state === ProfileClaimState.ERROR && (
        <div className="module">
          <div className="module-content">{translate("profileClaimPageFailure", lang)}</div>
        </div>
      )}
    </>
  );
};

export default ProfileClaimPage;
