import { FetchBotConfigs } from "./botData"
import React, { useState, useContext } from "react";
import { useCallback } from "react";
import { useEffect } from "react";

const BotConfigContext = React.createContext();
const UpdateBotConfigContext = React.createContext();

const useSaveBotConfigContext = () => {
  return useContext(UpdateBotConfigContext);
};

export function useBotConfig(configKeys){
  const _botConfig = useContext(BotConfigContext)
  const requestedBotConfig = {}
  configKeys.forEach(configKey => {
    requestedBotConfig[configKey] = _botConfig[configKey]
  })
  return requestedBotConfig
};

export const useSaveBotConfig = () => {
  const _saveBotConfig = useSaveBotConfigContext()
  const logic = useCallback((dataToStore) => {
    _saveBotConfig(prevConfig => {
      return {...prevConfig, ...dataToStore}
    })
        
  }, [_saveBotConfig]);
  return logic;
};

export const useSaveFormBotConfig = () => {
  const _saveBotConfig = useSaveBotConfigContext()
  const logic = useCallback((key, dataToStore) => {
    _saveBotConfig(prevConfig => {
      const newConfig = {...prevConfig}
      newConfig[key].data = dataToStore.formData
      console.log(newConfig)
      return newConfig
    })
        
  }, [_saveBotConfig]);
  return logic;
};


export const BotConfigProvider = ({ botDataManager, children }) => {
  const [botConfig, setBotConfig] = useState({frontendSettings: {schema: undefined, data: undefined}});
  React.useEffect(() => {
    FetchBotConfigs(setBotConfig, botDataManager, ["frontendSettings", "test"])
  }, [])  
  return (
    <BotConfigContext.Provider value={botConfig}>
      <UpdateBotConfigContext.Provider value={setBotConfig}>
        {children}
      </UpdateBotConfigContext.Provider>
    </BotConfigContext.Provider>
  );
};
