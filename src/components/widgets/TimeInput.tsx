import { useContext, useRef } from "react";
import { parseTime } from "../../utils/Formatters";
import { parseOnlyNumbers } from "../../utils/Numbers";
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

  const onChange = (e: React.ChangeEvent) => {
    let out = 0;
    if (minutes.current !== null) {
      let minutesParsed = minutes.current.value ? parseOnlyNumbers(minutes.current.value) : 0;
      if (isNaN(minutesParsed)) minutesParsed = 0;
      if (minutesParsed > 5) minutes.current.value = "5";
      out += Math.min(minutesParsed, 5) * 60000;
    } else {
      return value;
    }
    if (seconds.current !== null) {
      let secondsParsed = seconds.current.value ? parseOnlyNumbers(seconds.current.value) : 0;
      if (isNaN(secondsParsed)) secondsParsed = 0;
      if (secondsParsed > 59) seconds.current.value = "59";
      out += Math.min(secondsParsed, 59) * 1000;
    } else {
      return value;
    }
    if (millis.current !== null) {
      let millisParsed = millis.current.value ? parseOnlyNumbers(millis.current.value) : 0;
      if (isNaN(millisParsed)) millisParsed = 0;
      if (millisParsed > 999) millis.current.value = "999";
      out += Math.min(millisParsed, 999);
    } else {
      return value;
    }
    setValue(out);
  };

  const onPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    const parsed = parseTime(text);
    if (parsed === null) return;
    setValue(parsed);
  };

  const defaultMinutes = Math.floor(value / 60000);
  const defaultSeconds = Math.floor(value / 1000) - defaultMinutes * 60;
  const defaultMillis = value - (defaultMinutes * 60000 + defaultSeconds * 1000);
  return (
    <div>
      <input
        onChange={onChange}
        onPaste={onPaste}
        value={defaultMinutes === 0 ? "" : defaultMinutes}
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
        onPaste={onPaste}
        value={defaultSeconds === 0 ? "" : defaultSeconds}
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
        onPaste={onPaste}
        value={defaultMillis === 0 ? "" : defaultMillis}
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
