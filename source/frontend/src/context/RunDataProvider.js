import React, {
  useState,
  useContext,
  createContext,
  useCallback,
  useEffect,
} from "react";
import { fetchRunData } from "../api/botData";
import { useBotDomainContext } from "./BotDomainProvider";
import { useUiConfigContext, useUpdateUiConfigContext } from "./UiConfigProvider";

const RunDataContext = createContext();
const UpdateRunDataContext = createContext();

export const useRunDataContext = () => {
  return useContext(RunDataContext);
};

export const useUpdateRunDataContext = () => {
  return useContext(UpdateRunDataContext);
};

export const useFetchRunData = () => {
  const setRunData = useUpdateRunDataContext();
  const botDomain = useBotDomainContext();
  const logic = useCallback(() => {
    fetchRunData(setRunData, botDomain, false, [])
  }, [setRunData, botDomain]);
  return logic;
};

export const RunDataProvider = ({ children }) => {
  const [runData, setRunData] = useState({});
  const botDomain = useBotDomainContext();
  const uiConfig = useUiConfigContext()
  const setUiConfig = useUpdateUiConfigContext()

  useEffect(() => {
    uiConfig.optimizer_campaigns_to_load
      && fetchRunData(setRunData, botDomain, false, { ...uiConfig.optimizer_campaigns_to_load })
    
  }, [botDomain, uiConfig.optimizer_campaigns_to_load]);
  return (
    <RunDataContext.Provider value={runData}>
      <UpdateRunDataContext.Provider value={setRunData}>
        {children}
      </UpdateRunDataContext.Provider>
    </RunDataContext.Provider>
  );
};
