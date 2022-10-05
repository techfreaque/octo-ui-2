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
  const uiConfig = useUiConfigContext();
  const botDomain = useBotDomainContext();
  const logic = useCallback((newConfig) => {
    if (uiConfig.optimization_campaign && uiConfig.optimization_campaign.name) {
      let newCombinedConfig = {}
      setUiConfig(prevConfig => {
        newCombinedConfig = { ...prevConfig, ...newConfig }
        newCombinedConfig.optimization_campaign
        && newCombinedConfig.optimization_campaign.name
        && saveStrategyDesignConfig(botDomain, newCombinedConfig);
        return newCombinedConfig
      })
    }
  }, [setUiConfig, botDomain, uiConfig]);
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
