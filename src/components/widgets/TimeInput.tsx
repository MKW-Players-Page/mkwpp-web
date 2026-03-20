import { TextField, styled } from "@mui/material";
import { useContext, useRef, useState } from "react";

import { parseTime } from "../../utils/Formatters";
import { destructureTimeValue, toTimeValue } from "../../utils/Numbers";
import { FormContext } from "./Form";

/** Shorthand since we use this type frequently */
type InputRef = React.RefObject<HTMLInputElement | null>;

export interface TimeInputProps {
  setValue: (x: number) => void;
  value: number;
  disabled?: boolean;
}

const TimeInput = ({ setValue, value, disabled }: TimeInputProps) => {
  const minutesField = useRef<HTMLInputElement>(null);
  const secondsField = useRef<HTMLInputElement>(null);
  const millisField = useRef<HTMLInputElement>(null);

  const [activeFieldValue, setActiveFieldValue] = useState<string>("");

  const { minutes, seconds, millis } = destructureTimeValue(value);

  const updateValue = ({
    newMinutes,
    newSeconds,
    newMillis,
  }: {
    newMinutes?: number;
    newSeconds?: number;
    newMillis?: number;
  }) => {
    setValue(toTimeValue(newMinutes ?? minutes, newSeconds ?? seconds, newMillis ?? millis));
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setActiveFieldValue(e.target.value);
    e.target.select();
  };

  const onBlur = () => {
    setActiveFieldValue("");
  };

  type FocusFieldPosition = "start" | "end" | "all";
  const focusField = (field: InputRef, position: FocusFieldPosition = "end") => {
    if (!field.current) return;
    field.current.focus();
    if (position === "all") {
      field.current.select();
    } else {
      const pos = position === "start" ? 0 : (field.current.value?.length ?? 0);
      field.current.setSelectionRange(pos, pos);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      // Handle up/down arrow keys to increment/decrement the value in the active field
      e.preventDefault();
      const delta = e.key === "ArrowUp" ? 1 : -1;
      if (document.activeElement === minutesField.current) {
        const newMinutes = Math.max(0, Math.min(5, minutes + delta));
        updateValue({ newMinutes });
        setActiveFieldValue(String(newMinutes));
      } else if (document.activeElement === secondsField.current) {
        const newSeconds = Math.max(0, Math.min(59, seconds + delta));
        updateValue({ newSeconds });
        setActiveFieldValue(String(newSeconds).padStart(2, "0"));
      } else if (document.activeElement === millisField.current) {
        const newMillis = Math.max(0, Math.min(999, millis + delta));
        updateValue({ newMillis });
        setActiveFieldValue(String(newMillis).padStart(3, "0"));
      }
    } else if (e.key === "ArrowLeft") {
      // Handle left arrow key to move focus to the previous field if the cursor is at the start
      if (document.activeElement === secondsField.current) {
        if (secondsField.current?.selectionEnd === 0) {
          e.preventDefault();
          focusField(minutesField, "end");
        }
      } else if (document.activeElement === millisField.current) {
        if (millisField.current?.selectionEnd === 0) {
          e.preventDefault();
          focusField(secondsField, "end");
        }
      }
    } else if (e.key === "ArrowRight") {
      // Handle right arrow key to move focus to the next field if the cursor is at the end
      if (document.activeElement === minutesField.current) {
        if (minutesField.current?.selectionStart === minutesField.current?.value.length) {
          e.preventDefault();
          focusField(secondsField, "start");
        }
      } else if (document.activeElement === secondsField.current) {
        if (secondsField.current?.selectionStart === secondsField.current?.value.length) {
          e.preventDefault();
          focusField(millisField, "start");
        }
      }
    }
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text");
    const parsed = parseTime(text);
    if (parsed === null) return;
    e.preventDefault();
    focusField(millisField, "end");
    setValue(parsed);
    const { millis } = destructureTimeValue(parsed);
    setActiveFieldValue(String(millis).padStart(3, "0"));
  };

  const endsInDelimiter = (str: string) => {
    return /[:'."]$/.test(str);
  };

  const isNumerical = (str: string) => {
    return /^\d*$/.test(str);
  };

  const onChangeMinutes = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (endsInDelimiter(e.target.value)) {
      focusField(secondsField, "all");
      return;
    } else if (!isNumerical(e.target.value)) {
      return;
    }
    updateValue({ newMinutes: Math.min(+e.target.value % 10, 5) });
    if (e.target.value.length >= 1) {
      focusField(secondsField, "all");
    } else {
      setActiveFieldValue(e.target.value);
    }
  };

  const onChangeSeconds = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (endsInDelimiter(e.target.value)) {
      focusField(millisField, "all");
      return;
    } else if (!isNumerical(e.target.value)) {
      return;
    }
    const clamped = +e.target.value % 100;
    updateValue({ newSeconds: clamped > 59 ? 50 + (clamped % 10) : clamped });
    if (e.target.value.length >= 2) {
      focusField(millisField, "all");
    } else {
      setActiveFieldValue(e.target.value);
    }
  };

  const onChangeMillis = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNumerical(e.target.value)) {
      return;
    }
    updateValue({ newMillis: +e.target.value % 1000 });
    setActiveFieldValue(e.target.value.slice(-3));
  };

  const getValue = (value: number, field: InputRef, digits: number) => {
    if (field.current === document.activeElement) {
      return activeFieldValue;
    } else {
      return value ? String(value).padStart(digits, "0") : "";
    }
  };

  return (
    <TimeInputContainer className="time-input">
      <TextField
        inputRef={minutesField}
        disabled={disabled}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onChange={onChangeMinutes}
        value={getValue(minutes, minutesField, 1)}
        placeholder="0"
        autoComplete="off"
      />
      <span>'</span>
      <TextField
        inputRef={secondsField}
        disabled={disabled}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onChange={onChangeSeconds}
        value={getValue(seconds, secondsField, 2)}
        placeholder="00"
        autoComplete="off"
      />
      <span>"</span>
      <TextField
        inputRef={millisField}
        disabled={disabled}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onChange={onChangeMillis}
        value={getValue(millis, millisField, 3)}
        placeholder="000"
        autoComplete="off"
      />
    </TimeInputContainer>
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

// Styles

const TimeInputContainer = styled("div")({
  display: "inline-flex",
  "& .MuiInputBase-input": {
    textAlign: "center",
    width: "28px",
  },
  "& span": {
    alignItems: "center",
    textAlign: "center",
    width: "12px",
    paddingTop: "14px",
  },
});
