import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  CategoryEnum,
  Region,
  RegionType,
  RegionTypeValues,
  stringToRegionType,
  User,
} from "../../../../api";
import { FlagIcon, Tooltip } from "../../../widgets";
import { Flags } from "../../../widgets/Flags";
import Form, { FormState, Field } from "../../../widgets/Form";
import { RegionSelectionDropdownField } from "../../../widgets/RegionDropdown";
import { RegionTypeRadioField } from "../../../widgets/RegionTypeSelect";
import { Pages, resolvePage } from "../../Pages";

export interface AdminRegionModuleProps {
  region?: Region;
}

interface AdminRegionModuleState extends FormState {
  code: string;
  type: string;
  isRanked: string;
  parentId: string;
  category: CategoryEnum;
}

const AdminRegionModule = ({ region }: AdminRegionModuleProps) => {
  const initialState = {
    code: region?.code ?? "",
    type: (region?.regionType ?? RegionType.World).toString(),
    category: CategoryEnum.NonShortcut,
    isRanked: region?.isRanked.toString() ?? "false",
    parentId: region?.parentId?.toString() ?? "0",
    errors: {},
    submitting: false,
  };

  const navigate = useNavigate();
  const [state, setState] = useState<AdminRegionModuleState>(initialState);

  const apiFunction = region
    ? async () =>
        User.editRegion(
          region.id,
          state.code,
          stringToRegionType(state.type),
          parseInt(state.parentId),
          "true" === state.isRanked,
        )
    : async () =>
        User.insertRegion(
          state.code,
          stringToRegionType(state.type),
          parseInt(state.parentId),
          "true" === state.isRanked,
        );

  const submit = () =>
    apiFunction()
      .then((r) => {
        setState({ ...initialState });
        navigate(0);
      })
      .catch((error) => {
        setState((prev) => ({ ...prev, errors: error }));
      });

  return (
    <div className="module-content">
      <Form
        submit={submit}
        state={state}
        setState={setState}
        title="Region Editor"
        submitLabel="Save"
        extraButtons={
          region ? (
            <div
              onClick={() => {
                User.deleteRegion(region.id).then((r) => navigate(0));
              }}
              className="submit-style"
            >
              Delete
            </div>
          ) : undefined
        }
      >
        {region ? (
          <p>
            <Tooltip text={"This should not be modified while the server is running."} left>
              <span style={{ fontWeight: "700", fontSize: "1.4em" }}>ID - {region.id}</span>
            </Tooltip>
          </p>
        ) : (
          <></>
        )}

        <div style={{ display: "flex", gap: "16px", alignItems: "stretch" }}>
          <Field type="text" field="code" label={"Code"} />
          <FlagIcon
            region={state.code.toLocaleLowerCase() as keyof typeof Flags}
            showRegFlagRegardless
            width={70}
          />
        </div>

        <RegionTypeRadioField field="type" label="Type" options={RegionTypeValues} />

        <RegionSelectionDropdownField field="parentId" label="Parent Region" />

        <Field
          type="checkbox"
          field="isRanked"
          label="Is Ranked"
          defaultChecked={region?.isRanked ?? false}
        />
      </Form>
    </div>
  );
};

export default AdminRegionModule;
