import "./Dropdown.css";
import Icon from "./Icon";
import { useEffect, useRef, useState, cloneElement } from "react";
import { normalizeIntoArray } from "../../utils/ArrayUtils";

export interface DropdownProp {
  children: JSX.Element[] | JSX.Element;
  disabled?: boolean;
}

export interface DropdownItemProp {
  text: string;
  value: any;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  _selectedSetter?: React.Dispatch<
    React.SetStateAction<{
      text: string;
      icon: JSX.Element;
    }>
  >;
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

const Dropdown = ({ children, disabled }: DropdownProp) => {
  children = normalizeIntoArray(children);

  disabled = !!disabled;

  let [dropdownListShown, setDropdownListShown] = useState(false);
  const [dropdownListPos, setDropdownListPos] = useState({ x: 0, y: 0, width: 0 });
  const [selectedItemData, setSelectedItemData] = useState({
    text: children[0].props.text,
    icon: selectIconForHead(children[0].props),
  });

  if (disabled) setDropdownListShown = () => {};

  children = children.map((child) =>
    cloneElement(child, { _selectedSetter: setSelectedItemData, ...child.props }),
  );

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
        <Icon icon="Caret" />
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

export const DropdownItem = ({ text, leftIcon, rightIcon, _selectedSetter }: DropdownItemProp) => {
  if (_selectedSetter === undefined) return <></>;
  return (
    <div
      className="dropdown-item"
      onClick={() => {
        _selectedSetter({
          text: text,
          icon: rightIcon ?? leftIcon ?? <></>,
        });
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
