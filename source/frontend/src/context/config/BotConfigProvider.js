import React, { useState, useContext, createContext } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { fetchBotConfigs } from "../../api/configs";
import { useBotDomainContext } from "./BotDomainProvider";

const BotConfigContext = createContext();
const UpdateBotConfigContext = createContext();

export const useSaveBotConfigContext = () => {
  return useContext(UpdateBotConfigContext);
};

export function useBotConfig(configKeys) {
  const _botConfig = useContext(BotConfigContext)

  const requestedBotConfig = {}
  configKeys.forEach(configKey => {
    const paths = configKey.split("/")
    let tmp_config = _botConfig.configs
    let tmp_data = _botConfig.data
    paths.forEach(path => {
      if (tmp_config) {
        tmp_config = tmp_config.properties[path]
        tmp_data = tmp_data[path]
      }
    })
    requestedBotConfig[configKey] = { schema: tmp_config, data: tmp_data }
  })
  return requestedBotConfig
};

export const useSaveBotConfig = () => {
  const _saveBotConfig = useSaveBotConfigContext()
  const logic = useCallback((dataToStore) => {
    _saveBotConfig(prevConfig => {
      return { ...prevConfig, ...dataToStore }
    })

  }, [_saveBotConfig]);
  return logic;
};

export const useSaveFormBotConfig = () => {
  const _saveBotConfig = useSaveBotConfigContext()
  const logic = useCallback((paths, dataToStore) => {
    _saveBotConfig(prevConfig => {
      const newConfig = { ...prevConfig }
      let tmpNewConfig = newConfig.data
      let i;
      const pathsList = paths.split('/');
      for (i = 0; i < pathsList.length - 1; i++) tmpNewConfig = tmpNewConfig[pathsList[i]];
      tmpNewConfig[pathsList[i]] = dataToStore.formData
      return newConfig
    })

  }, [_saveBotConfig]);
  return logic;
};

export const useFetchBotConfigs = () => {
  const _saveBotConfig = useSaveBotConfigContext()
  const botDomain = useBotDomainContext()
  const logic = useCallback((configKeys) => {
    fetchBotConfigs(_saveBotConfig, botDomain, configKeys)
  }, [_saveBotConfig, botDomain]);
  return logic;
}


export const BotConfigProvider = ({ children }) => {
  const [botConfig, setBotConfig] = useState({});
  const botDomain = useBotDomainContext()
  useEffect(() => {
    fetchBotConfigs(setBotConfig, botDomain, ["profile", "test"])
  }, [botDomain])
  return (
    <BotConfigContext.Provider value={botConfig}>
      <UpdateBotConfigContext.Provider value={setBotConfig}>
        {children}
      </UpdateBotConfigContext.Provider>
    </BotConfigContext.Provider>
  );
};
