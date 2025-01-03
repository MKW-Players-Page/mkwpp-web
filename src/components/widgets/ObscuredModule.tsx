import "./ObscuredModule.css";

export interface ObscuredModuleProps {
  children: JSX.Element;
  stateVisible: boolean;
  setStateVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ObscuredModule = ({ children, stateVisible, setStateVisible }: ObscuredModuleProps) => {
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setStateVisible(false);
      }}
      className={`obscured-module-dark-layer${stateVisible ? " visible" : ""}`}
    >
      <div className="module obscured-module">
        <div className="obscured-module-body">
          <div>{children}</div>
        </div>
      </div>
      <div className="module obscured-module-close-button">Close</div>
    </div>
  );
};

export default ObscuredModule;
