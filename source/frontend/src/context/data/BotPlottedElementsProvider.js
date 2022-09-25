import React, { useState, useContext, createContext, useEffect, useCallback } from "react";
import { fetchPlotData } from "../../api/data";
import { useBotDomainContext } from "../config/BotDomainProvider";
import { useVisiblePairsContext } from "../config/VisiblePairProvider";
import { useVisibleTimeFramesContext } from "../config/VisibleTimeFrameProvider";
import { useBotInfoContext } from "./BotInfoProvider";


const BotPlottedElementsContext = createContext();
const UpdateBotPlottedElementsContext = createContext();

export const useBotPlottedElementsContext = () => {
  return useContext(BotPlottedElementsContext);
};

export const useUpdateBotPlottedElementsContext = () => {
  return useContext(UpdateBotPlottedElementsContext);
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
    <BotPlottedElementsContext.Provider value={botPlottedElements}>
      <UpdateBotPlottedElementsContext.Provider value={setBotPlottedElements}>
        {children}
      </UpdateBotPlottedElementsContext.Provider>
    </BotPlottedElementsContext.Provider>
  );
};
