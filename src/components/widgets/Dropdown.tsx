import "./Dropdown.css";
import Icon from "./Icon";
import { useEffect, useRef, useState } from "react";

export interface DropdownProp {
  data: DropdownData;
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
  /** Dropdown Type */
  type: "Normal" | "TextInput";
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
  /** Determines whether this element is rendered or not */
  hidden?: boolean;
  /** This only applies on Dropdown type TextInput. The text gets deleted on focus. */
  autodeleteText?: boolean;
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

const convolutedBoundingBoxCalc = (x: any) => {
  const getScrollParent = (node: any): any => {
    if (node == null) {
      return { scrollLeft: 0, scrollTop: 0 };
    }

    if (
      node.scrollHeight > node.clientHeight &&
      ["scroll", "auto"].includes(window.getComputedStyle(node).overflowY)
    ) {
      return node;
    } else {
      return getScrollParent(node.parentNode);
    }
  };
  const originBoundingRect = x.getBoundingClientRect();
  return {
    x: x.offsetLeft - getScrollParent(x).scrollLeft,
    y: x.offsetTop - getScrollParent(x).scrollTop + originBoundingRect.height,
    width: originBoundingRect.width,
  };
};

const Dropdown = ({ data }: DropdownProp) => {
  let [dropdownListShown, setDropdownListShown] = useState(false);
  const [dropdownListPos, setDropdownListPos] = useState({ x: 0, y: 0, width: 0 });
  const [selectedItemSet, setSelectedItemSet] = useState<number>(data.defaultItemSet);
  const [selectedValueItemSet, setSelectedValueItemSet] = useState<number>(data.defaultItemSet);

  const selectedValueItemSetIndex = data.data.findIndex((r) => r.id === selectedValueItemSet);
  const selectedItemSetIndex = data.data.findIndex((r) => r.id === selectedItemSet);
  let selectedValueIndex = data.data[selectedValueItemSetIndex].children.findIndex(
    (r) => r.type === "DropdownItemData" && (r.element as DropdownItemData).value === data.value,
  );
  if (selectedValueIndex < 0) selectedValueIndex = 0;

  if (data.data.length === 0) {
    data.data.push({
      id: data.defaultItemSet,
      children: [
        {
          type: "DropdownItemData",
          element: { value: data.value, text: "Error" },
        },
      ],
    });
    if (data.defaultItemSet !== selectedValueItemSetIndex)
      data.data.push({
        id: selectedValueItemSetIndex,
        children: [
          {
            type: "DropdownItemData",
            element: { value: data.value, text: "Error" },
          },
        ],
      });
  } else if (
    data.data[selectedValueItemSetIndex].children.length === 0 ||
    data.data[selectedItemSetIndex].children.length === 0
  ) {
    if (data.data[selectedValueItemSetIndex].children.length === 0)
      data.data[selectedValueItemSetIndex].children.push({
        type: "DropdownItemData",
        element: { value: data.value, text: "Error" },
      });
    if (data.data[selectedItemSetIndex].children.length === 0)
      data.data[selectedItemSetIndex].children.push({
        type: "DropdownItemData",
        element: { value: data.value, text: "Error" },
      });
  }

  const [filterString, setFilterString] = useState("");

  return (
    <>
      {data.type === "Normal" ? (
        <NormalDropdown
          disabled={!!data.disabled}
          selectedValueItemSetChildrenLength={data.data[selectedValueItemSetIndex].children.length}
          dropdownListShown={dropdownListShown}
          setDropdownListShown={setDropdownListShown}
          setSelectedItemSet={setSelectedItemSet}
          setDropdownListPos={setDropdownListPos}
          selectedValueItemSet={selectedValueItemSet}
          leftIcon={
            data.data[selectedValueItemSetIndex].children[selectedValueIndex].element.leftIcon
          }
          rightIcon={
            data.data[selectedValueItemSetIndex].children[selectedValueIndex].element.rightIcon
          }
          text={data.data[selectedValueItemSetIndex].children[selectedValueIndex].element.text}
        />
      ) : data.type === "TextInput" ? (
        <TextInputDropdown
          disabled={!!data.disabled}
          selectedValueItemSetChildrenLength={data.data[selectedValueItemSetIndex].children.length}
          dropdownListShown={dropdownListShown}
          setDropdownListShown={setDropdownListShown}
          setSelectedItemSet={setSelectedItemSet}
          setDropdownListPos={setDropdownListPos}
          selectedValueItemSet={selectedValueItemSet}
          setFilterString={setFilterString}
          leftIcon={
            data.data[selectedValueItemSetIndex].children[selectedValueIndex].element.leftIcon
          }
          rightIcon={
            data.data[selectedValueItemSetIndex].children[selectedValueIndex].element.rightIcon
          }
          text={data.data[selectedValueItemSetIndex].children[selectedValueIndex].element.text}
          autodeleteText={
            !!data.data[selectedValueItemSetIndex].children[selectedValueIndex].autodeleteText
          }
        />
      ) : (
        <></>
      )}
      <DropdownList
        selectedItemSet={selectedItemSet}
        shown={dropdownListShown}
        x={dropdownListPos.x}
        y={dropdownListPos.y}
        width={dropdownListPos.width}
      >
        {data.data[selectedItemSetIndex].children.map((dropdownItem, idx) => {
          if (dropdownItem.hidden) return <></>;
          if (dropdownItem.type === "DropdownItemData")
            if (
              filterString === "" ||
              dropdownItem.element.text.toLowerCase().includes(filterString)
            )
              return (
                <DropdownItem
                  key={`dropdown-${dropdownItem.element.text}-${idx}`}
                  text={dropdownItem.element.text}
                  rightIcon={dropdownItem.element.rightIcon}
                  leftIcon={dropdownItem.element.leftIcon}
                  value={(dropdownItem.element as DropdownItemData).value}
                  valueSetter={data.valueSetter}
                  itemSetId={data.data[selectedItemSetIndex].id}
                  selectedValueItemSetSetter={setSelectedValueItemSet}
                  setDropdownListShown={setDropdownListShown}
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

interface NormalDropdownProp {
  disabled: boolean;
  selectedValueItemSetChildrenLength: number;
  setDropdownListShown: React.Dispatch<React.SetStateAction<boolean>>;
  dropdownListShown: boolean;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  text: string;
  setSelectedItemSet: React.Dispatch<React.SetStateAction<number>>;
  setDropdownListPos: React.Dispatch<React.SetStateAction<any>>;
  selectedValueItemSet: number;
}

const NormalDropdown = ({
  disabled,
  selectedValueItemSetChildrenLength,
  setDropdownListShown,
  dropdownListShown,
  leftIcon,
  rightIcon,
  text,
  setSelectedItemSet,
  setDropdownListPos,
  selectedValueItemSet,
}: NormalDropdownProp) => {
  if (selectedValueItemSetChildrenLength <= 1) disabled = true;
  if (disabled) setDropdownListShown = () => {};

  const dropdown = useRef(null);

  useEffect(() => {
    if (!dropdown.current) return;
    const resizeObserver = new ResizeObserver(() => {
      if (!dropdown.current) return;
      setDropdownListPos(convolutedBoundingBoxCalc(dropdown.current as any));
    });

    resizeObserver.observe(dropdown.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [setDropdownListPos]);

  return (
    <div
      style={{ cursor: disabled ? "not-allowed" : "pointer" }}
      ref={dropdown}
      tabIndex={-1}
      onFocus={() => {
        setDropdownListShown(true);
        if (!dropdown.current) return;
        setDropdownListPos(convolutedBoundingBoxCalc(dropdown.current as any));
      }}
      onBlur={(e) => {
        if (
          !(
            e.relatedTarget?.classList.contains("dropdown-itemset-setter") ||
            e.relatedTarget?.classList.contains("dropdown-item") ||
            e.relatedTarget?.classList.contains("dropdown-list")
          ) &&
          dropdownListShown
        ) {
          console.log(e.relatedTarget);
          setSelectedItemSet(selectedValueItemSet);
          setDropdownListShown(false);
        }
      }}
      className="module dropdown"
    >
      {leftIcon ?? rightIcon ?? <></>}
      <span>{text}</span>
      {disabled ? <></> : <Icon icon="Caret" />}
    </div>
  );
};

interface TextInputDropdownProp {
  disabled: boolean;
  selectedValueItemSetChildrenLength: number;
  setDropdownListShown: React.Dispatch<React.SetStateAction<boolean>>;
  dropdownListShown: boolean;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  text: string;
  setSelectedItemSet: React.Dispatch<React.SetStateAction<number>>;
  setDropdownListPos: React.Dispatch<React.SetStateAction<any>>;
  selectedValueItemSet: number;
  setFilterString: React.Dispatch<React.SetStateAction<string>>;
  autodeleteText: boolean;
}

const TextInputDropdown = ({
  disabled,
  selectedValueItemSetChildrenLength,
  setDropdownListShown,
  dropdownListShown,
  leftIcon,
  rightIcon,
  text,
  setSelectedItemSet,
  setDropdownListPos,
  selectedValueItemSet,
  setFilterString,
  autodeleteText,
}: TextInputDropdownProp) => {
  if (selectedValueItemSetChildrenLength <= 1) disabled = true;
  if (disabled) setDropdownListShown = () => {};

  const textarea = useRef(null);
  const dropdown = useRef(null);

  useEffect(() => {
    if (!dropdown.current) return;
    (textarea.current as any).value = text;
    setFilterString("");
    const resizeObserver = new ResizeObserver(() => {
      if (!dropdown.current) return;
      setDropdownListPos(convolutedBoundingBoxCalc(dropdown.current as any));
    });
    resizeObserver.observe(dropdown.current);
    return () => resizeObserver.disconnect();
  }, [setDropdownListPos, text, setFilterString]);

  return (
    <div
      style={{ cursor: disabled ? "not-allowed" : "pointer" }}
      tabIndex={-1}
      onFocus={(e) => {
        if (e.target.children[0] !== undefined) (e.target.children[0] as any).focus();
      }}
      ref={dropdown}
      className="module dropdown"
    >
      {leftIcon ?? rightIcon ?? <></>}
      <textarea
        disabled={disabled}
        ref={textarea}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        onFocus={() => {
          if (autodeleteText) (textarea.current as any).value = "";
          setDropdownListShown(true);
          setDropdownListPos(convolutedBoundingBoxCalc(dropdown.current as any));
          setFilterString("");
        }}
        onBlur={(e) => {
          if (
            !(
              e.relatedTarget?.classList.contains("dropdown-itemset-setter") ||
              e.relatedTarget?.classList.contains("dropdown-item") ||
              e.relatedTarget?.classList.contains("dropdown-list")
            ) &&
            dropdownListShown
          ) {
            setSelectedItemSet(selectedValueItemSet);
            setDropdownListShown(false);
            (textarea.current as any).value = text;
          }
        }}
        onChange={() => {
          setFilterString((textarea.current as any).value.toLowerCase());
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if ((dropdown.current as any).nextElementSibling.children[0] !== undefined) {
              (dropdown.current as any).nextElementSibling.children[0].focus();
              (textarea.current as any).value = text;
            } else {
              (textarea.current as any).blur();
            }
          }
        }}
        rows={1}
        style={{
          resize: "none",
          height: "100%",
          background: "transparent",
          border: 0,
          color: "#fff",
          whiteSpace: "pre-line",
        }}
      />
      {disabled ? <></> : <Icon icon="Caret" />}
    </div>
  );
};

interface DropdownItemProp {
  /** Displayed Text */
  text: string;
  /** Item Value */
  value: any;
  /** Optional Left-side Icon */
  leftIcon?: JSX.Element;
  /** Optional Right-side Icon */
  rightIcon?: JSX.Element;
  /** Value State Setter */
  valueSetter: React.Dispatch<React.SetStateAction<any>>;
  /** Do not set this value. This is automatically set by <DropdownItemSet>. */
  selectedValueItemSetSetter: React.Dispatch<React.SetStateAction<any>>;
  /** Do not set this value. This is automatically set by <DropdownItemSet>. */
  setDropdownListShown: React.Dispatch<React.SetStateAction<boolean>>;
  itemSetId: number;
}

const DropdownItem = ({
  text,
  leftIcon,
  rightIcon,
  value,
  valueSetter,
  selectedValueItemSetSetter,
  itemSetId,
  setDropdownListShown,
}: DropdownItemProp) => {
  if (valueSetter === undefined) return <></>;
  if (selectedValueItemSetSetter === undefined) return <></>;
  return (
    <div
      tabIndex={-1}
      className="dropdown-item"
      onFocus={(e) => {
        valueSetter(value);
        selectedValueItemSetSetter(itemSetId);
        setDropdownListShown(false);
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
    <div tabIndex={-1} className="module dropdown-list" style={style}>
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
      tabIndex={-1}
      className="dropdown-item dropdown-itemset-setter"
      onFocus={(e) => {
        _selectedItemSetSetter(toItemSetId);
        (e.target.parentElement?.previousElementSibling as any).focus();
      }}
    >
      {leftIcon !== undefined ? leftIcon : <></>}
      {text}
      {rightIcon !== undefined ? rightIcon : <></>}
    </div>
  );
};

export default Dropdown;
