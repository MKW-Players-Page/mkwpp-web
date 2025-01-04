import { useContext } from "react";

import { FormContext } from "./Form";
import { Metadata } from "../../utils/Metadata";
import Dropdown, { DropdownData, DropdownItemSetDataChild } from "./Dropdown";
import { I18nContext, translateTrack } from "../../utils/i18n/i18n";

export interface TrackSelectProps {
  /** Metadata object */
  metadata: Metadata;
  /** Name of the state property to control */
  field: string;
  /** Select label */
  label?: string;
  disabled?: boolean;
}

const TrackSelect = ({ metadata, field, label, disabled }: TrackSelectProps) => {
  const { getValue, setValue, getErrors, disabled: disabledByForm } = useContext(FormContext);
  const { lang } = useContext(I18nContext);

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
            type: "Normal",
            value: getValue(field),
            valueSetter: onChange,
            disabled: disabledByForm || disabled,
            defaultItemSet: 0,
            data: [
              {
                id: 0,
                children: metadata.tracks?.map((track) => {
                  return {
                    type: "DropdownItemData",
                    element: {
                      text: translateTrack(track, lang),
                      value: track.id,
                    },
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
