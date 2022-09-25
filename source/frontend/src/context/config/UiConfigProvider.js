import {
  useState,
  useContext,
  createContext,
  useCallback,
  useEffect,
} from "react";
import { fetchStrategyDesignConfig, saveStrategyDesignConfig } from "../../api/configs";
import { useBotDomainContext } from "./BotDomainProvider";

const UiConfigContext = createContext();
const UpdateUiConfigContext = createContext();

export const useUiConfigContext = () => {
  return useContext(UiConfigContext);
};

export const useUpdateUiConfigContext = () => {
  return useContext(UpdateUiConfigContext);
};

export const useFetchUiConfig = () => {
  const setUiConfig = useUpdateUiConfigContext();
  const botDomain = useBotDomainContext();
  const logic = useCallback(() => {
    fetchStrategyDesignConfig(botDomain, setUiConfig);
  }, [setUiConfig, botDomain]);
  return logic;
};

export const useSaveUiConfig = () => {
  const setUiConfig = useUpdateUiConfigContext();
  const botDomain = useBotDomainContext();
  const logic = useCallback((newConfig) => {
    saveStrategyDesignConfig(botDomain, setUiConfig, newConfig);
  }, [setUiConfig, botDomain]);
  return logic;
};

export const UiConfigProvider = ({ children }) => {
  const [uiConfig, setUiConfig] = useState({});
  const botDomain = useBotDomainContext();
  useEffect(() => {
    fetchStrategyDesignConfig(botDomain, setUiConfig);
  }, [botDomain]);
  return (
    <UiConfigContext.Provider value={uiConfig}>
      <UpdateUiConfigContext.Provider value={setUiConfig}>
        {children}
      </UpdateUiConfigContext.Provider>
    </UiConfigContext.Provider>
  );
};
