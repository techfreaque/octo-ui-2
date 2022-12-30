import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import AppWidgets from "../../AppWidgets";
import SplitPane from "react-split-pane";
import "./index.css";
import { useBotColorsContext } from "../../../context/config/BotColorsProvider";

const CurrentPanelContext = createContext();
const UpdateCurrentPanelContext = createContext();

export const useCurrentPanelContext = () => {
  return useContext(CurrentPanelContext);
};

export const useUpdateCurrentPanelContext = () => {
  return useContext(UpdateCurrentPanelContext);
};

export const useSetCurrentPanelPercent = () => {
  const setPanelSize = useUpdateCurrentPanelContext()
  const logic = useCallback((percent) => {
    setPanelSize(prevSize => (
      { ...prevSize, size: (prevSize.maxSize * percent / 100) }
    ));
  }, [setPanelSize]);
  return logic;
}

export default function SplitMainContent({ height, upperContent, lowerContent }) {
  const maxSize = height - 49 - 4; // tabs + resizer
  const [panelSize, setPanelSize] = useState({ maxSize: maxSize, size: maxSize * 0.4 });
  useEffect(() => {
    setPanelSize((prevSize) => (
      { maxSize: maxSize, size: (prevSize.size < maxSize ? prevSize.size : maxSize) }
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);
  const botColors = useBotColorsContext();
  return (
    <CurrentPanelContext.Provider value={panelSize}>
      <UpdateCurrentPanelContext.Provider value={setPanelSize}>
        <div
          style={{ height: "100%", width: "100%", position: "relative" }}
        >
          <SplitPane
            split="horizontal"
            resizerStyle={{ borderColor: botColors.border }}
            defaultSize="40%"
            minSize={0}
            maxSize={maxSize}
            size={panelSize.size}
            onChange={(size) => setPanelSize({ maxSize: maxSize, size: size })}
          >
            <div style={{ height: "100%", width: "100%", overflow: "hidden" }}>
              {useMemo(() => (<AppWidgets layout={upperContent} panelSize={panelSize} />), [upperContent, panelSize])}
            </div>
            <div style={{ height: height - panelSize.size }}>
              {useMemo(() => (<AppWidgets layout={lowerContent} />), [lowerContent])}
            </div>
          </SplitPane>
        </div>
      </UpdateCurrentPanelContext.Provider>
    </CurrentPanelContext.Provider>
  );
}
