import { Tooltip } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminRegion, Region, RegionType, RegionTypeValues } from "../../../../api";
import { FlagIcon } from "../../../widgets";
import { Flags } from "../../../widgets/Flags";
import Form, { FormState, SwitchFormField, TextFormField } from "../../../widgets/Form";
import { RegionSelectionDropdownField } from "../../../widgets/RegionDropdown";
import { RegionTypeRadioField } from "../../../widgets/RegionTypeSelect";

export interface AdminRegionModuleProps {
  region?: Region;
}

interface AdminRegionModuleState extends FormState {
  code: string;
  type: RegionType;
  isRanked: boolean;
  parentId: number;
}

const AdminRegionModule = ({ region }: AdminRegionModuleProps) => {
  const initialState = {
    code: region?.code ?? "",
    type: region?.regionType ?? RegionType.World,
    isRanked: region?.isRanked ?? false,
    parentId: region?.parentId ?? 0,
    errors: {},
    submitting: false,
  };

  const navigate = useNavigate();
  const [state, setState] = useState<AdminRegionModuleState>(initialState);

  const apiFunction = region
    ? async () =>
        AdminRegion.editRegion(region.id, state.code, state.type, state.parentId, state.isRanked)
    : async () => AdminRegion.insertRegion(state.code, state.type, state.parentId, state.isRanked);

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
                AdminRegion.deleteRegion(region.id).then((r) => navigate(0));
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
            <Tooltip title={"This should not be modified while the server is running."}>
              <span style={{ fontWeight: "700", fontSize: "1.4em" }}>ID - {region.id}</span>
            </Tooltip>
          </p>
        ) : (
          <></>
        )}

        <div style={{ display: "flex", gap: "16px", alignItems: "stretch" }}>
          <TextFormField field="code" label={"Code"} />
          <FlagIcon
            region={state.code.toLocaleLowerCase() as keyof typeof Flags}
            showRegFlagRegardless
            width={70}
          />
        </div>

        <RegionTypeRadioField field="type" label="Type" options={RegionTypeValues} />

        <RegionSelectionDropdownField field="parentId" label="Parent Region" />

        <SwitchFormField
          field="isRanked"
          label="Is Ranked"
          defaultChecked={region?.isRanked ?? false}
        />
      </Form>
    </div>
  );
};

export default AdminRegionModule;
