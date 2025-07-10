import { useContext, useRef } from "react";
import { FormContext } from "./Form";

export interface TimeInputProps {
  setValue: (x: number) => void;
  value: number;
  disabled?: boolean;
}

const TimeInput = ({ setValue, value, disabled }: TimeInputProps) => {
  const minutes = useRef<HTMLInputElement>(null);
  const seconds = useRef<HTMLInputElement>(null);
  const millis = useRef<HTMLInputElement>(null);
  const onChange = () => {
    let out = 0;
    if (minutes.current?.value) {
      if (parseInt(minutes.current.value) > 5) minutes.current.value = "5";
      out += parseInt(minutes.current.value) * 60000;
    } else {
      return value;
    }
    if (seconds.current?.value) {
      if (parseInt(seconds.current.value) > 59) seconds.current.value = "59";
      out += parseInt(seconds.current.value) * 1000;
    } else {
      return value;
    }
    if (millis.current?.value) {
      if (parseInt(millis.current.value) > 999) millis.current.value = "999";
      out += parseInt(millis.current.value);
    } else {
      return value;
    }
    setValue(out);
  };
  const defaultMinutes = Math.floor(value / 60000);
  const defaultSeconds = Math.floor(value / 1000) - defaultMinutes * 60;
  const defaultMillis = value - (defaultMinutes * 60000 + defaultSeconds * 1000);
  return (
    <div>
      <input
        onChange={onChange}
        defaultValue={defaultMinutes}
        type="number"
        ref={minutes}
        disabled={disabled}
        max={5}
        min={0}
        placeholder="0"
        step={1}
        size={1}
      />
      :
      <input
        onChange={onChange}
        defaultValue={defaultSeconds}
        type="number"
        ref={seconds}
        disabled={disabled}
        max={59}
        min={0}
        placeholder="00"
        step={1}
        size={2}
      />
      .
      <input
        onChange={onChange}
        defaultValue={defaultMillis}
        type="number"
        ref={millis}
        disabled={disabled}
        max={999}
        min={0}
        placeholder="000"
        step={1}
        size={3}
      />
    </div>
  );
};

export interface TimeInputFieldProps {
  /** Name of the state property to manage */
  field: string;
  /** Field label */
  label: string;
  disabled?: boolean;
}

export const TimeInputField = ({ field, label, disabled }: TimeInputFieldProps) => {
  const { getValue, setValue, disabled: disabledByForm } = useContext(FormContext);

  return (
    <div className="field">
      <p>{label}</p>
      <TimeInput
        value={getValue(field)}
        setValue={(time) => {
          setValue(field, time);
        }}
        disabled={disabledByForm || !!disabled}
      />
    </div>
  );
};

export default TimeInput;
