import { Children, isValidElement, ReactElement, ReactNode, useEffect, useState } from "react";

import "./TabbedModule.css";

export interface TabProps {
  title: string;
  element: ReactElement;
}

export const Tab = (_props: TabProps) => {
  throw TypeError("<Tab> element must be a child of <TabbedModule>.");
};

export interface TabbedModuleProps {
  children?: ReactNode;
}

export interface TabbedModuleState {
  activeTabIndex: number;
}

const TabbedModule = ({ children }: TabbedModuleProps) => {
  const initialState = { activeTabIndex: -1 };
  const [state, setState] = useState<TabbedModuleState>(initialState);

  const tabs = new Array<ReactElement<TabProps>>();

  Children.forEach(children, (tab) => {
    if (!isValidElement(tab)) {
      return;
    }

    if (tab.type === Tab) {
      tabs.push(tab as ReactElement<TabProps>);
    }
  });

  const childrenCount = tabs.length;

  useEffect(() => {
    if (state.activeTabIndex === -1 && childrenCount > 0) {
      setState((prev) => ({ ...prev, activeTabIndex: 0 }));
    } else if (state.activeTabIndex >= childrenCount) {
      setState((prev) => ({ ...prev, activeTabIndex: childrenCount - 1 }));
    }
  }, [childrenCount, state]);

  const setActiveTab = (index: number) => () => {
    setState((prev) => ({ ...prev, activeTabIndex: index }));
  };

  return (
    <div className="tabbed-module">
      <div className="tabbed-module-tabs">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`tabbed-module-tab nobr ${state.activeTabIndex === index ? "active" : ""}`}
            onClick={setActiveTab(index)}
          >
            {tab.props.title}
          </div>
        ))}
      </div>
      <div className="tabbed-module-content">
        {state.activeTabIndex !== -1 && tabs[state.activeTabIndex].props.element}
      </div>
    </div>
  );
};

export default TabbedModule;
