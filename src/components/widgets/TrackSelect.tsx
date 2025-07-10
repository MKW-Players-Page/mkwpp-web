import { useContext } from "react";

import { FormContext } from "./Form";
import { MetadataContext } from "../../utils/Metadata";
import Dropdown, { DropdownData, DropdownItemSetDataChild } from "./Dropdown";
import { I18nContext, translate, translateTrack } from "../../utils/i18n/i18n";

export interface TrackDropdownProps {
  /** The currently selected option. If included, the value for allTracks is `-5`. */
  value: number;
  /** Callback to invoke when user attempts to select a new track */
  onChange: any;
  disabled?: boolean;
  /** Enables an all tracks option */
  allTracks?: boolean;
}

export const TrackDropdown = ({ value, onChange, disabled, allTracks }: TrackDropdownProps) => {
  const metadata = useContext(MetadataContext);
  const { lang } = useContext(I18nContext);

  const options: DropdownItemSetDataChild[] = [];

  if (allTracks)
    options.push({
      type: "DropdownItemData",
      element: {
        text: translate("trackDropdownAllTracks", lang),
        value: -5,
      },
    } as DropdownItemSetDataChild);

  metadata.tracks?.forEach((track) =>
    options.push({
      type: "DropdownItemData",
      element: {
        text: translateTrack(track, lang),
        value: track.id,
      },
    } as DropdownItemSetDataChild),
  );

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
              children: options,
            },
          ],
        } as DropdownData
      }
    />
  );
};

export interface TrackSelectProps {
  /** Name of the state property to control */
  field: string;
  /** Select label */
  label?: string;
  disabled?: boolean;
}

const TrackSelect = ({ field, label, disabled }: TrackSelectProps) => {
  const { getValue, setValue, getErrors, disabled: disabledByForm } = useContext(FormContext);

  const onChange = (e: number) => {
    setValue(field, e);
  };

  const errors = getErrors(field);

  return (
    <div className="field">
      {label && <p>{label}</p>}
      <TrackDropdown
        onChange={onChange}
        disabled={disabled || disabledByForm}
        value={getValue(field)}
      />
      {errors.map((error) => (
        <p className="field-error">{error}</p>
      ))}
    </div>
  );
};

export default TrackSelect;
