import { ChangeEvent, useContext } from 'react';

import { FormContext } from './Form';
import { Metadata } from '../../utils/Metadata'

export interface TrackSelectProps {
  /** Metadata object */
  metadata: Metadata;
  /** Name of the state property to control */
  field: string;
  /** Select label */
  label?: string;
};

const TrackSelect = ({ metadata, field, label }: TrackSelectProps) => {
  const { getValue, setValue, getErrors, disabled } = useContext(FormContext);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(field, e.target.value);
  };

  const errors = getErrors(field);

  return (
    <div className="field">
      {label && <p>{label}</p>}
      <select disabled={disabled} value={getValue(field)} onChange={onChange}>
        {metadata.tracks?.map((track) => (
          <option key={track.id} value={track.id}>{track.name}</option>
        ))}
      </select>
      {errors.map((error) => (
        <p className="field-error">{error}</p>
      ))}
    </div>
  );
};

export default TrackSelect;
