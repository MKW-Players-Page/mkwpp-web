import "./Dropdown.css";
import Icon from "./Icon";
import { useEffect, useRef, useState } from "react";

export interface DropdownProp {
  data: DropdownData;
}

interface DropdownItemProp {
  /** Displayed Text */
  text: string;
  /** Item Value */
  value: any;
  /** Optional Left-side Icon */
  leftIcon?: JSX.Element;
  /** Optional Right-side Icon */
  rightIcon?: JSX.Element;
  /** Do not set this value. This is automatically set by <DropdownItemSet>. */
  _valueSetter?: React.Dispatch<React.SetStateAction<any>>;
  /** Do not set this value. This is automatically set by <DropdownItemSet>. */
  _selectedValueItemSetSetter?: React.Dispatch<React.SetStateAction<any>>;
  /** Do not set this value. This is automatically set by <DropdownItemSet>. */
  _itemSetId?: number;
}

interface DropdownListProp {
  shown: boolean;
  children: JSX.Element[];
  x: number;
  y: number;
  width: number;
  selectedItemSet: number;
}

interface DropdownItemSetSetterProp {
  /** Displayed Text */
  text: string;
  /** Optional Left-side Icon */
  leftIcon?: JSX.Element;
  /** Optional Right-side Icon */
  rightIcon?: JSX.Element;
  /** Value of item set ID to go to. */
  toItemSetId: number;
  /** Do not set this value. This is automatically set by <DropdownItemSet>. */
  _selectedItemSetSetter?: React.Dispatch<React.SetStateAction<any>>;
}

export interface DropdownData {
  /** Dropdown Data */
  data: DropdownItemSetData[];
  /** Default ItemSet by ID. MUST match value. */
  defaultItemSet: number;
  /** Default value, or previously selected value. Will default to children[0].value if invalid. */
  value: any;
  /** useState() value setter callback */
  valueSetter: React.Dispatch<React.SetStateAction<any>>;
  /** Disables onClick event for <DropdownItem> and for <Dropdown> */
  disabled?: boolean;
}
export interface DropdownItemSetData {
  id: number;
  children: DropdownItemSetDataChild[];
}
export interface DropdownItemSetDataChild {
  type: "DropdownItemData" | "DropdownItemSetSetterData";
  element: DropdownItemData | DropdownItemSetSetterData;
}
export interface DropdownItemData {
  /** Displayed Text */
  text: string;
  /** Item Value */
  value: any;
  /** Optional Left-side Icon */
  leftIcon?: JSX.Element;
  /** Optional Right-side Icon */
  rightIcon?: JSX.Element;
}

export interface DropdownItemSetSetterData {
  /** Displayed Text */
  text: string;
  /** Optional Left-side Icon */
  leftIcon?: JSX.Element;
  /** Optional Right-side Icon */
  rightIcon?: JSX.Element;
  /** Value of item set ID to go to. */
  toItemSetId: number;
}

const Dropdown = ({ data }: DropdownProp) => {
  let [dropdownListShown, setDropdownListShown] = useState(false);
  const [dropdownListPos, setDropdownListPos] = useState({ x: 0, y: 0, width: 0 });
  const [selectedItemSet, setSelectedItemSet] = useState<number>(data.defaultItemSet);
  const [selectedValueItemSet, setSelectedValueItemSet] = useState<number>(data.defaultItemSet);

  let selectedItemSetIndex = data.data.findIndex((r) => r.id === selectedItemSet);
  let selectedIndex = data.data[selectedItemSetIndex].children.findIndex(
    (r) => r.type === "DropdownItemData" && (r.element as DropdownItemData).value === data.value,
  );
  if (selectedIndex < 0) selectedIndex = 0;

  data.disabled = !!data.disabled;
  if (data.disabled) setDropdownListShown = () => {};

  document.addEventListener("click", (e) => {
    if (
      dropdownListShown &&
      e.target &&
      e.target !== dropdown.current &&
      !(e.target as any).classList.contains("dropdown-itemset-setter")
    ) {
      setDropdownListShown(false);
      setSelectedItemSet(selectedValueItemSet);
    }
  });

  const dropdown = useRef(null);

  useEffect(() => {
    if (!dropdown.current) return;
    const resizeObserver = new ResizeObserver(() => {
      if (!dropdown.current) return;
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
        {data.data[selectedItemSetIndex].children[selectedIndex].element.leftIcon ??
          data.data[selectedItemSetIndex].children[selectedIndex].element.rightIcon ?? <></>}
        <span>{data.data[selectedItemSetIndex].children[selectedIndex].element.text}</span>
        {data.disabled ? <></> : <Icon icon="Caret" />}
      </div>
      <DropdownList
        selectedItemSet={selectedItemSet}
        shown={dropdownListShown}
        x={dropdownListPos.x}
        y={dropdownListPos.y}
        width={dropdownListPos.width}
      >
        {data.data[selectedItemSet].children.map((dropdownItem) => {
          if (dropdownItem.type === "DropdownItemData")
            return (
              <DropdownItem
                text={dropdownItem.element.text}
                rightIcon={dropdownItem.element.rightIcon}
                leftIcon={dropdownItem.element.leftIcon}
                value={(dropdownItem.element as DropdownItemData).value}
                _valueSetter={data.valueSetter}
                _itemSetId={data.data[selectedItemSet].id}
                _selectedValueItemSetSetter={setSelectedValueItemSet}
              />
            );
          if (dropdownItem.type === "DropdownItemSetSetterData")
            return (
              <DropdownItemSetSetter
                text={dropdownItem.element.text}
                rightIcon={dropdownItem.element.rightIcon}
                leftIcon={dropdownItem.element.leftIcon}
                toItemSetId={(dropdownItem.element as DropdownItemSetSetterData).toItemSetId}
                _selectedItemSetSetter={setSelectedItemSet}
              />
            );
          return <></>;
        })}
      </DropdownList>
    </>
  );
};

const DropdownItem = ({
  text,
  leftIcon,
  rightIcon,
  value,
  _valueSetter,
  _selectedValueItemSetSetter,
  _itemSetId,
}: DropdownItemProp) => {
  if (_valueSetter === undefined) return <></>;
  if (_selectedValueItemSetSetter === undefined) return <></>;
  return (
    <div
      className="dropdown-item"
      onClick={() => {
        _valueSetter(value);
        _selectedValueItemSetSetter(_itemSetId);
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

const DropdownItemSetSetter = ({
  text,
  leftIcon,
  rightIcon,
  toItemSetId,
  _selectedItemSetSetter,
}: DropdownItemSetSetterProp) => {
  if (_selectedItemSetSetter === undefined) return <></>;
  return (
    <div
      className="dropdown-item dropdown-itemset-setter"
      onClick={() => {
        _selectedItemSetSetter(toItemSetId);
      }}
    >
      {leftIcon !== undefined ? leftIcon : <></>}
      {text}
      {rightIcon !== undefined ? rightIcon : <></>}
    </div>
  );
};

export default Dropdown;
