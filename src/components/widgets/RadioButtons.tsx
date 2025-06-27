import "./RadioButton.css";

export interface RadioButtonData {
  text: string;
  value: any;
}

export interface RadioButtonsProps {
  data: RadioButtonData[];
  state: any;
  setState: React.Dispatch<React.SetStateAction<any>>;
  disabled?: boolean;
  className?: string;
}

const RadioButtons = ({ data, state, setState, disabled, className }: RadioButtonsProps) => {
  if (data.length === 1) disabled = true;
  if (disabled) setState = () => {};
  return (
    <div className={`${className ? className + " " : ""}module radio-button-row`}>
      {data.map((r) =>
        disabled && r.value !== state ? (
          <></>
        ) : (
          <div
            onClick={() => {
              setState(r.value);
            }}
            style={{ cursor: disabled ? "not-allowed" : "" }}
            className={`radio-button${state === r.value ? " active" : ""}`}
          >
            {r.text}
          </div>
        ),
      )}
    </div>
  );
};

export default RadioButtons;
