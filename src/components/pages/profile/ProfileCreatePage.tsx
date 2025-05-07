import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router";

import { coreApi } from "../../../api";
import { Region, ResponseError } from "../../../api/generated";
import { I18nContext, Language, translate, translateRegionName } from "../../../utils/i18n/i18n";
import { getRegionById, isRegionChildOf, MetadataContext } from "../../../utils/Metadata";
import { UserContext } from "../../../utils/User";
import Form, { Field, FormState, SelectField } from "../../widgets/Form";
import { Pages, resolvePage } from "../Pages";

enum ProfileCreateState {
  CREATE = "CREATE",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

interface ProfileCreateFormState extends FormState {
  name: string;
  alias: string;
  continent: string;
  country: string;
  subregion: string;
  state: ProfileCreateState;
}

const makeRegionList = (regions: Region[], lang: Language) => {
  return [
    { label: "None", value: "" },
    ...[
      ...regions.map((region) => ({
        label: translateRegionName(region, lang),
        value: region.id.toString(),
      }))
    ].sort((a, b) => a.label.localeCompare(b.label)),
  ];
};

const ProfileCreatePage = () => {
  const { lang } = useContext(I18nContext);
  const { isLoading: userLoading, user, setUser } = useContext(UserContext);
  const metadata = useContext(MetadataContext);

  const initialState = {
    name: "",
    alias: "",
    continent: "",
    country: "",
    subregion: "",
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

    const world = metadata.regions.find((region) => region.type === "world");
    if (!world) {
      done();
      return;
    }
    const regionId = state.subregion || state.country || state.continent || world.id.toString();

    coreApi
      .coreProfileCreateCreate({
        profileCreate: { name: state.name, alias: state.alias, region: +regionId },
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

  const selectedContinent = getRegionById(metadata, +state.continent);
  const selectedCountry = getRegionById(metadata, +state.country);
  const selectedSubregion = getRegionById(metadata, +state.subregion);

  const continents = makeRegionList(
    metadata.regions.filter((region) => region.type === "continent"),
    lang,
  );
  const countries = selectedContinent
    ? makeRegionList(
        metadata.regions.filter(
          (region) =>
            region.type === "country" && isRegionChildOf(metadata, region, selectedContinent),
        ),
        lang,
      )
    : [];
  const subregions = selectedCountry
    ? makeRegionList(
        metadata.regions.filter(
          (region) =>
            region.type === "subnational" && isRegionChildOf(metadata, region, selectedCountry),
        ),
        lang,
      )
    : [];

  useEffect(() => {
    if (
      selectedCountry &&
      (!selectedContinent || !isRegionChildOf(metadata, selectedCountry, selectedContinent))
    ) {
      setState((prev) => ({ ...prev, country: "", subregion: "" }));
    } else if (
      selectedSubregion &&
      (!selectedCountry || !isRegionChildOf(metadata, selectedSubregion, selectedCountry))
    ) {
      setState((prev) => ({ ...prev, subregion: "" }));
    }
  }, [metadata, selectedContinent, selectedCountry, selectedSubregion]);

  return (
    <>
      {!userLoading && !user && <Navigate to={resolvePage(Pages.UserLogin)} />}
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
          <SelectField
            options={continents}
            field="continent"
            label={translate("profileCreatePageFieldLabelContinent", lang)}
          />
          {selectedContinent && countries.length > 1 && (
            <SelectField
              options={countries}
              field="country"
              label={translate("profileCreatePageFieldLabelCountry", lang)}
            />
          )}
          {selectedCountry && subregions.length > 1 && (
            <SelectField
              options={subregions}
              field="subregion"
              label={translate("profileCreatePageFieldLabelRegion", lang)}
            />
          )}
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
