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
  if (!!disabled || data.length === 1) functionSetState = () => {};
  return (
    <div className="module radio-button-row">
      {data.map((r) => (
        <div
          onClick={() => {
            functionSetState(r.value);
          }}
          className={`radio-button${state === r.value ? " active" : ""}`}
        >
          {r.text}
        </div>
      ))}
    </div>
  );
};

export default RadioButtons;
