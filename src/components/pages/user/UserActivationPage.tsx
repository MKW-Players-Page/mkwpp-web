import { useContext, useEffect, useReducer } from "react";
import { useSearchParams } from "react-router";

import { coreApi } from "../../../api";
import { ResponseError } from "../../../api/generated";
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

  const token = query.get("token");

  const { lang } = useContext(I18nContext);

  const [state, dispatch] = useReducer(userActivationReducer, initialState);

  useEffect(() => {
    if (!token) {
      dispatch({
        type: UserActivationActionType.FAILURE,
        payload: translate("userActivationPageContentMissingToken", lang),
      });
    } else {
      coreApi
        .coreVerifyCreate({ token: { token } })
        .then(() => {
          dispatch({
            type: UserActivationActionType.SUCCESS,
            payload: translate("userActivationPageContentSuccess", lang),
          });
        })
        .catch((error: ResponseError) => {
          error.response
            .json()
            .then((json) => {
              dispatch({
                type: UserActivationActionType.FAILURE,
                payload: json.detail,
              });
            })
            .catch(() => {
              dispatch({
                type: UserActivationActionType.FAILURE,
                payload: translate("userActivationPageContentUnknownError", lang),
              });
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
