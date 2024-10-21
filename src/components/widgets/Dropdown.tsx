import "./Dropdown.css";
import Icon from "./Icon";
import { useEffect, useRef, useState, cloneElement } from "react";

export interface DropdownProp {
  /** Only <DropdownItemSet><DropdownItem /></DropdownItemSet> is accepted */
  children: JSX.Element[] | JSX.Element;
  /** Default ItemSet by ID. MUST match value. */
  defaultItemSet: number;
  /** Default value, or previously selected value. Will default to children[0].value if invalid. */
  value: any;
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

interface DropdownItemSetProp {
  children: JSX.Element[] | JSX.Element | undefined;
  /** SubList Id */
  id: number;
  /** Do not set this value. This is automatically set by <Dropdown>. */
  _valueSetter?: React.Dispatch<React.SetStateAction<any>>;
  /** Do not set this value. This is automatically set by <Dropdown>. */
  _selectedValueItemSetSetter?: React.Dispatch<React.SetStateAction<any>>;
  /** Do not set this value. This is automatically set by <Dropdown>. */
  _selectedItemSetSetter?: React.Dispatch<React.SetStateAction<any>>;
}

export interface DropdownItemSetSetterProp {
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

export function isFragment(
  node: React.ReactNode,
): node is React.ReactElement<{ children: React.ReactNode }> {
  return (node as any)?.type === Symbol.for("react.fragment");
}

const runThroughChildren = (
  x: JSX.Element[],
  newPropsPerType: Record<string, any>,
): JSX.Element[] => {
  return x
    .map((child) => {
      if (isFragment(child)) {
        return runThroughChildren(child.props.children as JSX.Element[], newPropsPerType);
      }
      if (newPropsPerType[child.type.name] !== undefined)
        return cloneElement(child, {
          ...child.props,
          ...newPropsPerType[child.type.name],
        });
      return child;
    })
    .flat();
};

const Dropdown = ({ children, disabled, valueSetter, value, defaultItemSet }: DropdownProp) => {
  if (!Array.isArray(children)) {
    children = [children];
  } else if (
    children[0] === undefined ||
    children.filter((r) => r.type.name !== "DropdownItemSet").length > 0
  )
    children = [
      <DropdownItemSet id={0}>
        <DropdownItem text="Error!" value="" />
      </DropdownItemSet>,
    ];

  let selectedItemSetIndex = children.findIndex((r) => r.props.id === defaultItemSet);
  let selectedIndex = children[selectedItemSetIndex].props.children.findIndex(
    (r: JSX.Element) => r.props.value === value,
  );
  if (selectedIndex < 0) selectedIndex = 0;

  let [dropdownListShown, setDropdownListShown] = useState(false);
  const [dropdownListPos, setDropdownListPos] = useState({ x: 0, y: 0, width: 0 });
  const [selectedItemSet, setSelectedItemSet] = useState<number>(0);
  const [selectedValueItemSet, setSelectedValueItemSet] = useState<number>(0);

  children = runThroughChildren(children, {
    DropdownItemSet: {
      _valueSetter: valueSetter,
      _selectedValueItemSetSetter: setSelectedValueItemSet,
      _selectedItemSetSetter_: setSelectedItemSet,
    },
  });

  disabled = !!disabled;
  if (disabled) setDropdownListShown = () => {};

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
        {children[selectedItemSetIndex].props.children[selectedIndex].props.leftIcon ??
          children[selectedItemSetIndex].props.children[selectedIndex].props.rightIcon ?? <></>}
        <span>{children[selectedItemSetIndex].props.children[selectedIndex].props.text}</span>
        {disabled ? <></> : <Icon icon="Caret" />}
      </div>
      <DropdownList
        selectedItemSet={selectedItemSet}
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

const DropdownList = ({ shown, children, x, y, width, selectedItemSet }: DropdownListProp) => {
  let style = shown ? {} : ({ display: "none" } as React.CSSProperties);
  style.left = x;
  style.top = y;
  style.width = width;

  return (
    <div className="module dropdown-list" style={style}>
      {children.find((r) => r.props.id === selectedItemSet)}
    </div>
  );
};

export const DropdownItemSet = ({
  children,
  id,
  _valueSetter,
  _selectedValueItemSetSetter,
  _selectedItemSetSetter,
}: DropdownItemSetProp) => {
  if (!Array.isArray(children)) {
    if (children === undefined) {
      children = [<DropdownItem text="Error!" value="" />];
    } else {
      children = [children];
    }
  } else if (
    children[0] === undefined ||
    children.filter((r) => r.type.name !== "DropdownItem").length > 0
  )
    children = [<DropdownItem text="Error!" value="" />];
  children = runThroughChildren(children, {
    DropdownItem: {
      _valueSetter: _valueSetter,
      _selectedValueItemSetSetter: _selectedValueItemSetSetter,
      _itemSetId: id,
    },
    DropdownItemSetSetter: { _selectedItemSetSetter: _selectedItemSetSetter },
  });

  return <>{children}</>;
};

export const DropdownItemSetSetter = ({
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
