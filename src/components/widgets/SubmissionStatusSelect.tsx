import { useContext } from "react";

import { FormContext } from "./Form";
import { SubmissionStatus, SubmissionStatusValues } from "../../api";
import Dropdown, { DropdownData, DropdownItemSetDataChild } from "./Dropdown";
import { I18nContext, translateSubmissionStatus } from "../../utils/i18n/i18n";
import RadioButtons from "./RadioButtons";

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
    <RadioButtons
      disabled={!!disabled}
      data={SubmissionStatusValues.map((r) => {
        return { text: translateSubmissionStatus(r, lang), value: r };
      })}
      state={value}
      setState={onChange}
    />
  );
};

const SubmissionStatusSelect = ({ value, onChange, disabled }: SubmissionStatusSelectProps) => {
  disabled = !!disabled;
  const { lang } = useContext(I18nContext);

  return (
    <Dropdown
      data={
        {
          type: "Normal",
          value: value,
          valueSetter: onChange,
          disabled: disabled,
          defaultItemSet: 0,
          data: [
            {
              id: 0,
              children: SubmissionStatusValues.map((category) => {
                return {
                  type: "DropdownItemData",
                  element: {
                    text: translateSubmissionStatus(category, lang),
                    value: category,
                  },
                } as DropdownItemSetDataChild;
              }),
            },
          ],
        } as DropdownData
      }
    />
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

export const SubmissionStatusField = ({ field, label, disabled }: SubmissionStatusFieldProps) => {
  const { getValue, setValue, disabled: disabledByForm } = useContext(FormContext);

  return (
    <div className="field">
      <p>{label}</p>
      <SubmissionStatusSelect
        value={getValue(field) ?? SubmissionStatus.Pending}
        onChange={(category) => {
          setValue(field, category.toString());
        }}
        disabled={disabled || disabledByForm}
      />
    </div>
  );
};

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

export default SubmissionStatusSelect;
