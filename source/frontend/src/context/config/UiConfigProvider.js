import {
  useState,
  useContext,
  createContext,
  useCallback,
  useEffect,
} from "react";
import { fetchUIConfig, saveUIConfig } from "../../api/configs";
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
    fetchUIConfig(botDomain, setUiConfig);
  }, [setUiConfig, botDomain]);
  return logic;
};

export const useSaveUiConfig = () => {
  const setUiConfig = useUpdateUiConfigContext();
  const botDomain = useBotDomainContext();
  const logic = useCallback((newConfig, callbackSucces) => {
      let newCombinedConfig = {}
      setUiConfig(prevConfig => {
        newCombinedConfig = { ...prevConfig, ...newConfig }
        saveUIConfig(botDomain, newCombinedConfig, callbackSucces);
        return newCombinedConfig
      })
  }, [setUiConfig, botDomain]);
  return logic;
};

export const UiConfigProvider = ({ children }) => {
  const [uiConfig, setUiConfig] = useState();
  const botDomain = useBotDomainContext();
  useEffect(() => {
    fetchUIConfig(botDomain, setUiConfig);
  }, [botDomain]);
  return (
    <UiConfigContext.Provider value={uiConfig}>
      <UpdateUiConfigContext.Provider value={setUiConfig}>
        {children}
      </UpdateUiConfigContext.Provider>
    </UiConfigContext.Provider>
  );
};
