import React, {
  useState,
  useContext,
  createContext,
  useCallback,
} from "react";
import { fetchBacktestingRunData } from "../../api/data";
import { useBotDomainContext } from "../config/BotDomainProvider";
import { useUiConfigContext, useUpdateUiConfigContext } from "../config/UiConfigProvider";


const BacktestingRunDataContext = createContext();
const UpdateBacktestingRunDataContext = createContext();

export const useBacktestingRunDataContext = () => {
  return useContext(BacktestingRunDataContext);
};

export const useUpdateBacktestingRunDataContext = () => {
  return useContext(UpdateBacktestingRunDataContext);
};

export const useFetchBacktestingRunData = () => {
  const setBacktestingRunData = useUpdateBacktestingRunDataContext();
  const botDomain = useBotDomainContext();
  const uiConfig = useUiConfigContext()
  const setUiConfig = useUpdateUiConfigContext()
  const logic = useCallback(() => {
    uiConfig.optimizer_campaigns_to_load
      && fetchBacktestingRunData(
        setBacktestingRunData, setUiConfig, botDomain,
        false, { ...uiConfig.optimizer_campaigns_to_load }
      )
  }, [setBacktestingRunData, botDomain, uiConfig, setUiConfig]);
  return logic;
};

export const BacktestingRunDataProvider = ({ children }) => {
  const [backtestingRunData, setBacktestingRunData] = useState({});
  return (
    <BacktestingRunDataContext.Provider value={backtestingRunData}>
      <UpdateBacktestingRunDataContext.Provider value={setBacktestingRunData}>
        {children}
      </UpdateBacktestingRunDataContext.Provider>
    </BacktestingRunDataContext.Provider>
  );
};
