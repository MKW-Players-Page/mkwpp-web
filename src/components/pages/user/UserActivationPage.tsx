import { useContext, useEffect, useReducer } from "react";
import { useSearchParams } from "react-router-dom";
import { FinalErrorResponse, User } from "../../../api";

import { I18nContext, translate } from "../../../utils/i18n/i18n";
import Deferred from "../../widgets/Deferred";

enum UserActivationActionType {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}

interface UserActivationAction {
  type: UserActivationActionType;
  payload: string;
}

interface UserActivationState {
  isLoading: boolean;
  isSuccess?: boolean;
  content?: string;
}

const initialState: UserActivationState = { isLoading: true };

const userActivationReducer = (state: UserActivationState, action: UserActivationAction) => {
  const { type, payload } = action;
  switch (type) {
    case UserActivationActionType.SUCCESS:
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        content: payload,
      };
    case UserActivationActionType.FAILURE:
      if (state.isSuccess === undefined) {
        return {
          ...state,
          isLoading: false,
          isSuccess: false,
          content: payload,
        };
      } else {
        return state;
      }
    default:
      return state;
  }
};

const UserActivationPage = () => {
  const [query] = useSearchParams();

  const token = query.get("tkn");

  const { lang } = useContext(I18nContext);

  const [state, dispatch] = useReducer(userActivationReducer, initialState);

  useEffect(() => {
    if (!token) {
      dispatch({
        type: UserActivationActionType.FAILURE,
        payload: translate("userActivationPageContentMissingToken", lang),
      });
    } else {
      User.activate(token)
        .then(() => {
          dispatch({
            type: UserActivationActionType.SUCCESS,
            payload: translate("userActivationPageContentSuccess", lang),
          });
        })
        .catch((error: FinalErrorResponse) => {
          dispatch({
            type: UserActivationActionType.FAILURE,
            payload: error.non_field_errors.toString(),
          });
        });
    }
  }, [lang, token]);

  return (
    <Deferred isWaiting={state.isLoading}>
      <h1>
        {state.isSuccess
          ? translate("userActivationPageHeadingSuccess", lang)
          : translate("userActivationPageHeadingFailure", lang)}
      </h1>
      <div className="module">
        <div className="module-content">{state.content}</div>
      </div>
    </Deferred>
  );
};

export default UserActivationPage;
