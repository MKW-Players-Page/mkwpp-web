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
}

const RadioButtons = ({ data, state, setState, disabled }: RadioButtonsProps) => {
  let functionSetState = setState;
  if (data.length === 1) disabled = true;
  if (disabled) functionSetState = () => {};
  return (
    <div className="module radio-button-row">
      {data.map((r) =>
        disabled && r.value !== state ? (
          <></>
        ) : (
          <div
            onClick={() => {
              functionSetState(r.value);
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
