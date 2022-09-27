import React, { useState, useContext, createContext, useEffect, useCallback } from "react";
import { fetchPlotData } from "../../api/data";
import { useBotDomainContext } from "../config/BotDomainProvider";
import { useVisiblePairsContext } from "../config/VisiblePairProvider";
import { useVisibleTimeFramesContext } from "../config/VisibleTimeFrameProvider";
import { useBotInfoContext } from "./BotInfoProvider";


const BotPlottedElementsContext = createContext();
const UpdateBotPlottedElementsContext = createContext();
const HiddenBacktestingMetadataColumnsContext = createContext();
const UpdateHiddenBacktestingMetadataColumnsContext = createContext();
const DisplayedRunIdsContext = createContext();
const UpdateDisplayedRunIdsContext = createContext();

export const useBotPlottedElementsContext = () => {
  return useContext(BotPlottedElementsContext);
};
export const useUpdateBotPlottedElementsContext = () => {
  return useContext(UpdateBotPlottedElementsContext);
};
export const useHiddenBacktestingMetadataColumnsContext = () => {
  return useContext(HiddenBacktestingMetadataColumnsContext);
};
export const useUpdateHiddenBacktestingMetadataColumnsContext = () => {
  return useContext(UpdateHiddenBacktestingMetadataColumnsContext);
};
export const useDisplayedRunIdsContext = () => {
  return useContext(DisplayedRunIdsContext);
};
export const useUpdateDisplayedRunIdsContext = () => {
  return useContext(UpdateDisplayedRunIdsContext);
};

export const useFetchPlotData = () => {
  const updateBotPlottedElements = useUpdateBotPlottedElementsContext()
  const botInfo = useBotInfoContext();
  const botDomain = useBotDomainContext();
  const visiblePairs = useVisiblePairsContext();
  const visibleTimeframes = useVisibleTimeFramesContext();
  const logic = useCallback(() => {
    fetchPlotData(
      updateBotPlottedElements,
      botInfo.exchange_id,
      visiblePairs,
      visibleTimeframes,
      botDomain
    );

  }, [updateBotPlottedElements, botInfo, botDomain, visibleTimeframes, visiblePairs]);
  return logic;
};

export const BotPlottedElementsProvider = ({ children }) => {
  const [botPlottedElements, setBotPlottedElements] = useState({});
  const [hiddenBacktestingMetadataColumns, setHiddenBacktestingMetadataColumns] = useState();
  const [displayedRunIds, setDisplayedRunIds] = useState({live: [], backtesting: []});
  const botInfo = useBotInfoContext();
  const botDomain = useBotDomainContext();
  const visiblePairs = useVisiblePairsContext();
  const visibleTimeframes = useVisibleTimeFramesContext();
  useEffect(() => {
    if (botInfo && visibleTimeframes && visiblePairs) {
      fetchPlotData(
        setBotPlottedElements,
        botInfo.exchange_id,
        visiblePairs,
        visibleTimeframes,
        botDomain
      );
    }
  }, [botInfo, botDomain, visibleTimeframes, visiblePairs]);
  return (
    <DisplayedRunIdsContext.Provider value={displayedRunIds}>
      <UpdateDisplayedRunIdsContext.Provider value={setDisplayedRunIds}>
        <BotPlottedElementsContext.Provider value={botPlottedElements}>
          <UpdateBotPlottedElementsContext.Provider value={setBotPlottedElements}>
            <HiddenBacktestingMetadataColumnsContext.Provider value={hiddenBacktestingMetadataColumns}>
              <UpdateHiddenBacktestingMetadataColumnsContext.Provider value={setHiddenBacktestingMetadataColumns}>
                {children}
              </UpdateHiddenBacktestingMetadataColumnsContext.Provider>
            </HiddenBacktestingMetadataColumnsContext.Provider>
          </UpdateBotPlottedElementsContext.Provider>
        </BotPlottedElementsContext.Provider>
      </UpdateDisplayedRunIdsContext.Provider>
    </DisplayedRunIdsContext.Provider>
  );
};
