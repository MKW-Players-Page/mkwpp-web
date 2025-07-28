import { useContext } from "react";

import { FormContext } from "./Form";
import { SubmissionStatus, SubmissionStatusValues } from "../../api";
import { I18nContext, translateSubmissionStatus } from "../../utils/i18n/i18n";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

export interface SubmissionStatusSelectProps {
  /** The currently selected status */
  value: SubmissionStatus;
  /** Callback to invoke when user attempts to select a new status */
  onChange: (submissionStatus: SubmissionStatus) => void;
  /** Whether this element is disabled */
  disabled?: boolean;
}

export const SubmissionStatusRadio = ({
  value,
  onChange,
  disabled,
}: SubmissionStatusSelectProps) => {
  const { lang } = useContext(I18nContext);

  return (
    <ToggleButtonGroup
      value={value}
      onChange={(_, v) => {
        if (v !== null) onChange(v);
      }}
      exclusive
      disabled={disabled}
    >
      {SubmissionStatusValues.map((option) => (
        <ToggleButton value={option}>{translateSubmissionStatus(option, lang)}</ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export interface SubmissionStatusFieldProps {
  /** Categories to include in select element. Default to all categories if not defined. */
  options?: SubmissionStatus[];
  /** Name of the state property to manage */
  field: string;
  /** Field label */
  label: string;
  disabled?: boolean;
}

export const SubmissionStatusRadioField = ({
  field,
  label,
  disabled,
}: SubmissionStatusFieldProps) => {
  const { getValue, setValue, disabled: disabledByForm } = useContext(FormContext);

  return (
    <div className="field">
      <p>{label}</p>
      <SubmissionStatusRadio
        value={getValue(field)}
        onChange={(submissionStatus) => {
          setValue(field, submissionStatus);
        }}
        disabled={disabledByForm || disabled}
      />
    </div>
  );
};

export default SubmissionStatusRadio;
