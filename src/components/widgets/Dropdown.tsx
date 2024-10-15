import "./Dropdown.css";
import Icon from "./Icon";
import { useEffect, useRef, useState, cloneElement } from "react";
import { normalizeIntoArray } from "../../utils/ArrayUtils";

export interface DropdownProp {
  /** Only <DropdownItem> is accepted */
  children: JSX.Element[] | JSX.Element;
  /** useState() value setter callback */
  valueSetter: React.Dispatch<React.SetStateAction<any>>;
  /** Disables onClick event for <DropdownItem> and for <Dropdown> */
  disabled?: boolean;
}

export interface DropdownItemProp {
  /** Displayed Text */
  text: string;
  /** Item Value */
  value: any;
  /** Optional Left-side Icon */
  leftIcon?: JSX.Element;
  /** Optional Right-side Icon */
  rightIcon?: JSX.Element;
  /** Do not set this value. This is needed for graphical logic. */
  _selectedSetter?: React.Dispatch<
    React.SetStateAction<{
      text: string;
      icon: JSX.Element;
    }>
  >;
  /** Do not set this value. This is automatically set by <Dropdown>. */
  _valueSetter?: React.Dispatch<React.SetStateAction<any>>;
}

interface DropdownListProp {
  shown: boolean;
  children: JSX.Element[] | JSX.Element;
  x: number;
  y: number;
  width: number;
}

function selectIconForHead(x: DropdownItemProp) {
  return x.rightIcon ?? x.leftIcon ?? <></>;
}

const Dropdown = ({ children, disabled, valueSetter }: DropdownProp) => {
  children = normalizeIntoArray(children);

  let [dropdownListShown, setDropdownListShown] = useState(false);
  const [dropdownListPos, setDropdownListPos] = useState({ x: 0, y: 0, width: 0 });
  const [selectedItemData, setSelectedItemData] = useState({
    text: children[0].props.text,
    icon: selectIconForHead(children[0].props),
  });

  children = children.map((child) =>
    cloneElement(child, {
      ...child.props,
      _selectedSetter: setSelectedItemData,
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
        {selectedItemData.text}
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
  _selectedSetter,
  _valueSetter,
}: DropdownItemProp) => {
  if (_selectedSetter === undefined) return <></>;
  if (_valueSetter === undefined) return <></>;
  return (
    <div
      className="dropdown-item"
      onClick={() => {
        _selectedSetter({
          text: text,
          icon: rightIcon ?? leftIcon ?? <></>,
        });
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
