import "./Dropdown.css";
import Icon from "./Icon";
import { useEffect, useRef, useState, cloneElement } from "react";

export interface DropdownProp<T> {
  /** Default value, or previously selected value. Will default to children[0].value if invalid. */
  value: T;
  /** Only <DropdownItem> is accepted */
  children: JSX.Element[] | JSX.Element | undefined;
  /** useState() value setter callback */
  valueSetter: React.Dispatch<React.SetStateAction<T>>;
  /** Disables onClick event for <DropdownItem> and for <Dropdown> */
  disabled?: boolean;
}

export interface DropdownItemProp<T> {
  /** Displayed Text */
  text: string;
  /** Item Value */
  value: T;
  /** Optional Left-side Icon */
  leftIcon?: JSX.Element;
  /** Optional Right-side Icon */
  rightIcon?: JSX.Element;
  /** Do not set this value. This is automatically set by <Dropdown>. */
  _valueSetter?: React.Dispatch<React.SetStateAction<T>>;
}

interface DropdownListProp {
  shown: boolean;
  children: JSX.Element[] | JSX.Element;
  x: number;
  y: number;
  width: number;
}

const Dropdown = ({ children, disabled, valueSetter, value }: DropdownProp<any>) => {
  if (!Array.isArray(children)) {
    if (children === undefined) {
      children = [<DropdownItem text="Error!" value="" />];
    } else {
      children = [children];
    }
  } else if (children[0] === undefined) children = [<DropdownItem text="Error!" value="" />];

  let selectedIndex = children.findIndex((r) => r.props.value === value);
  if (selectedIndex < 0) selectedIndex = 0;

  let [dropdownListShown, setDropdownListShown] = useState(false);
  const [dropdownListPos, setDropdownListPos] = useState({ x: 0, y: 0, width: 0 });
  
  children = children.map((child) =>
    cloneElement(child, {
      ...child.props,
      _valueSetter: valueSetter,
    }),
  );

  disabled = !!disabled;
  if (children.length === 1) disabled = true;
  if (disabled) setDropdownListShown = () => {};

  document.addEventListener("click", (e) => {
    if (dropdownListShown && e.target && e.target !== dropdown.current) setDropdownListShown(false);
  });

  const dropdown = useRef(null);

  useEffect(() => {
    if (!dropdown.current) return;
    const resizeObserver = new ResizeObserver(() => {
      let boundingBox = (dropdown.current as any).getBoundingClientRect();
      setDropdownListPos({ x: boundingBox.x, y: boundingBox.bottom, width: boundingBox.width });
    });
    resizeObserver.observe(dropdown.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <>
      <div
        ref={dropdown}
        className="module dropdown"
        onClick={(e) => {
          setDropdownListShown(!dropdownListShown);
          let boundingBox = (e.target as any).getBoundingClientRect();
          setDropdownListPos({ x: boundingBox.x, y: boundingBox.bottom, width: boundingBox.width });
        }}
      >
        {children[selectedIndex].props.leftIcon ?? children[selectedIndex].props.rightIcon ?? <></>}
        {children[selectedIndex].props.text}
        {disabled ? <></> : <Icon icon="Caret" />}
      </div>
      <DropdownList
        shown={dropdownListShown}
        x={dropdownListPos.x}
        y={dropdownListPos.y}
        width={dropdownListPos.width}
      >
        {children}
      </DropdownList>
    </>
  );
};

export const DropdownItem = ({
  text,
  leftIcon,
  rightIcon,
  value,
  _valueSetter,
}: DropdownItemProp<any>) => {
  if (_valueSetter === undefined) return <></>;
  return (
    <div
      className="dropdown-item"
      onClick={() => {
        _valueSetter(value);
      }}
    >
      {leftIcon !== undefined ? leftIcon : <></>}
      {text}
      {rightIcon !== undefined ? rightIcon : <></>}
    </div>
  );
};

const DropdownList = ({ shown, children, x, y, width }: DropdownListProp) => {
  let style = shown ? {} : ({ display: "none" } as React.CSSProperties);
  style.left = x;
  style.top = y;
  style.width = width;

  return (
    <div className="module dropdown-list" style={style}>
      {children}
    </div>
  );
};

export default Dropdown;
