import "./Dropdown.css";
import Icon from "./Icon";
import { useEffect, useRef, useState } from "react";

export interface DropdownProp {
    children: JSX.Element[] | JSX.Element;
}

export interface DropdownItemProp {
    text: string;
    leftIcon?: JSX.Element;
    rightIcon?: JSX.Element;
}

interface DropdownListProp {
    shown: boolean;
    children: JSX.Element[] | JSX.Element;
    x: number;
    y: number;
    width: number;
}

const Dropdown = ({ children }: DropdownProp) => {
    const [dropdownListShown, setDropdownListShown] = useState(false);
    const [dropdownListPos, setDropdownListPos] = useState({ x: 0, y: 0, width: 0 });

    const dropdown = useRef(null);

    useEffect(() => {
        if (!dropdown.current) return;
        const resizeObserver = new ResizeObserver(() => {
            console.log(dropdown);
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
                Test
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

export const DropdownItem = ({text,leftIcon,rightIcon}: DropdownItemProp) => {
    return <div className="dropdown-item">
    { 
            leftIcon !== undefined ? leftIcon : (<></>)
        }
            {text}
        { 
            rightIcon !== undefined ? rightIcon : (<></>)
        }
    </div>;
};

const DropdownList = ({ shown, children, x, y, width }: DropdownListProp) => {
    let style = shown ? {} : { display: "none" } as React.CSSProperties;
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
