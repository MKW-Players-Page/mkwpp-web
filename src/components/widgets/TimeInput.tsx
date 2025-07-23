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
    if (minutes.current === null || seconds.current === null || millis.current === null)
      return value;

    let minutesParsed = minutes.current.value ? parseOnlyNumbers(minutes.current.value) : 0;
    if (isNaN(minutesParsed)) minutesParsed = 0;
    if (minutesParsed > 5) minutes.current.value = "5";
    out += Math.min(minutesParsed, 5) * 60000;

    let secondsParsed = seconds.current.value ? parseOnlyNumbers(seconds.current.value) : 0;
    if (isNaN(secondsParsed)) secondsParsed = 0;
    if (secondsParsed > 59) seconds.current.value = "59";
    out += Math.min(secondsParsed, 59) * 1000;

    let millisParsed = millis.current.value ? parseOnlyNumbers(millis.current.value) : 0;
    if (isNaN(millisParsed)) millisParsed = 0;
    if (millisParsed > 999) millis.current.value = "999";
    out += Math.min(millisParsed, 999);

    setValue(out);
  };

  const defaultMinutes = Math.floor(value / 60000);
  const defaultSeconds = Math.floor(value / 1000) - defaultMinutes * 60;
  const defaultMillis = value - (defaultMinutes * 60000 + defaultSeconds * 1000);

  const formatMinutes = () => {
    if (minutes.current) minutes.current.value = String(defaultMinutes);
  };
  const formatSeconds = () => {
    if (seconds.current) seconds.current.value = String(defaultSeconds).padStart(2, "0");
  };
  const formatMillis = () => {
    if (millis.current) millis.current.value = String(defaultMillis).padStart(3, "0");
  };

  const onPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    const parsed = parseTime(text);
    if (parsed === null) return;
    setValue(parsed);
    formatMinutes();
    formatSeconds();
    formatMillis();
  };

  return (
    <div>
      <input
        onChange={onChange}
        onPaste={onPaste}
        onBlur={formatMinutes}
        type="number"
        ref={minutes}
        disabled={disabled}
        max={5}
        min={0}
        defaultValue="0"
        step={1}
        size={1}
      />
      :
      <input
        onChange={onChange}
        onPaste={onPaste}
        onBlur={formatSeconds}
        defaultValue="00"
        type="number"
        ref={seconds}
        disabled={disabled}
        max={59}
        min={0}
        step={1}
        size={2}
      />
      .
      <input
        onChange={onChange}
        onPaste={onPaste}
        onBlur={formatMillis}
        defaultValue="000"
        type="number"
        ref={millis}
        disabled={disabled}
        max={999}
        min={0}
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
