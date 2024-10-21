import { useContext } from "react";

import { FormContext } from "./Form";
import { Metadata } from "../../utils/Metadata";
import Dropdown, { DropdownData, DropdownItemSetDataChild } from "./Dropdown";

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
          data={
            {
              value: getValue(field),
              valueSetter: onChange,
              disabled: disabled,
              defaultItemSet: 0,
              data: [
                {
                  id: 0,
                  children: metadata.tracks?.map((track) => {
                    return {
                      type: "DropdownItemData",
                      element: { text: track.name, value: track.id },
                    } as DropdownItemSetDataChild;
                  }),
                },
              ],
            } as DropdownData
          }
        />
      {errors.map((error) => (
        <p className="field-error">{error}</p>
      ))}
    </div>
  );
};

export default TrackSelect;
