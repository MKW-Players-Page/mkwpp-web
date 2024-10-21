import { useContext } from "react";

import { FormContext } from "./Form";
import { Metadata } from "../../utils/Metadata";
import Dropdown, { DropdownItem, DropdownItemSet } from "./Dropdown";

export interface TrackSelectProps {
  /** Metadata object */
  metadata: Metadata;
  /** Name of the state property to control */
  field: string;
  /** Select label */
  label?: string;
}

const TrackSelect = ({ metadata, field, label }: TrackSelectProps) => {
  const { getValue, setValue, getErrors, disabled } = useContext(FormContext);

  const onChange = (e: string) => {
    setValue(field, e);
  };

  const errors = getErrors(field);

  return (
    <div className="field">
      {label && <p>{label}</p>}
      <Dropdown
        defaultItemSet={0}
        value={getValue(field)}
        disabled={disabled}
        valueSetter={onChange}
      >
        <DropdownItemSet id={0}>
          {metadata.tracks?.map((track) => <DropdownItem text={track.name} value={track.id} />)}
        </DropdownItemSet>
      </Dropdown>
      {errors.map((error) => (
        <p className="field-error">{error}</p>
      ))}
    </div>
  );
};

export default TrackSelect;
