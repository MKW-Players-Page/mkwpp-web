import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";

import { coreApi } from "../../../api";
import { ResponseError } from "../../../api/generated";
import { I18nContext, translate } from "../../../utils/i18n/i18n";
import { UserContext } from "../../../utils/User";
import Form, { Field, FormState } from "../../widgets/Form";
import { Pages, resolvePage } from "../Pages";

enum ProfileCreateState {
  CREATE = "CREATE",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

interface ProfileCreateFormState extends FormState {
  name: string;
  alias: string;
  region: number;
  state: ProfileCreateState;
}

const ProfileCreatePage = () => {
  const { lang } = useContext(I18nContext);
  const { isLoading, user, setUser } = useContext(UserContext);

  const initialState = {
    name: "",
    alias: "",
    region: 0,
    errors: {},
    submitting: false,
    state: ProfileCreateState.CREATE,
  };
  const [state, setState] = useState<ProfileCreateFormState>(initialState);

  const submit = (done: () => void) => {
    if (!user) {
      done();
      return;
    }

    coreApi
      .coreProfileCreateCreate({
        profileCreate: { name: state.name, alias: state.alias, region: state.region },
      })
      .then((profile) => {
        setUser({ ...user, player: profile.id });
        setState((prev) => ({ ...prev, state: ProfileCreateState.SUCCESS }));
      })
      .catch((error: ResponseError) => {
        if (error.response.status === 400) {
          error.response
            .json()
            .then((json) => setState((prev) => ({ ...prev, errors: { ...json } })));
        } else {
          setState((prev) => ({ ...prev, state: ProfileCreateState.ERROR }));
        }
      })
      .finally(done);
  };

  return (
    <>
      {!isLoading && !user && <Navigate to={resolvePage(Pages.UserLogin)} />}
      {state.state === ProfileCreateState.CREATE && (
        <Form
          state={state}
          setState={setState}
          title={translate("profileCreatePageHeading", lang)}
          submitLabel={translate("profileCreatePageSubmitLabel", lang)}
          submit={submit}
        >
          <Field
            type="text"
            field="name"
            label={translate("profileCreatePageFieldLabelName", lang)}
          />
          <Field
            type="text"
            field="alias"
            label={translate("profileCreatePageFieldLabelAlias", lang)}
          />
          <Field
            type="number"
            field="region"
            label={translate("profileCreatePageFieldLabelRegion", lang)}
          />
        </Form>
      )}
      {state.state === ProfileCreateState.SUCCESS && (
        <div className="module">
          <div className="module-content">{translate("profileCreatePageSuccess", lang)}</div>
        </div>
      )}
      {state.state === ProfileCreateState.ERROR && (
        <div className="module">
          <div className="module-content">{translate("profileCreatePageFailure", lang)}</div>
        </div>
      )}
    </>
  );
};

export default ProfileCreatePage;
