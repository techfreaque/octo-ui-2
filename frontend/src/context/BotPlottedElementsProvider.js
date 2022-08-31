import { useState, useContext, createContext, useEffect } from "react";
import { fetchPlotData } from "../api/botData";
import { useBotDomainContext } from "./BotDomainProvider";
import { useBotInfoContext } from "./BotInfoProvider";

const BotPlottedElementsContext = createContext();
const UpdateBotPlottedElementsContext = createContext();

export const useBotPlottedElementsContext = () => {
  return useContext(BotPlottedElementsContext);
};

export const useUpdateBotPlottedElementsContext = () => {
  return useContext(UpdateBotPlottedElementsContext);
};

// export function useBotConfig(configKeys){
//   const _botConfig = useContext(BotConfigContext)
  
//   const requestedBotConfig = {}
//   configKeys.forEach(configKey => {
//     const paths = configKey.split("/")
//     let tmp_config = _botConfig.configs
//     let tmp_data = _botConfig.data
//     paths.forEach(path => {
//       if (tmp_config){
//         tmp_config = tmp_config.properties[path]
//         tmp_data = tmp_data[path]
//       }
//     })
//     requestedBotConfig[configKey] = {schema: tmp_config, data: tmp_data}
//   })
//   return requestedBotConfig
// };

// export const useSaveBotConfig = () => {
//   const _saveBotConfig = useSaveBotConfigContext()
//   const logic = useCallback((dataToStore) => {
//     _saveBotConfig(prevConfig => {
//       return {...prevConfig, ...dataToStore}
//     })
        
//   }, [_saveBotConfig]);
//   return logic;
// };

// export const useSaveFormBotConfig = () => {
//   const _saveBotConfig = useSaveBotConfigContext()
//   const logic = useCallback((paths, dataToStore) => {
//     _saveBotConfig(prevConfig => {
//       const newConfig = {...prevConfig}
//       let tmpNewConfig = newConfig.data
//       let i;
//       const pathsList = paths.split('/');
//       for (i=0;i<pathsList.length-1;i++) tmpNewConfig = tmpNewConfig[pathsList[i]];
//       tmpNewConfig[pathsList[i]] = dataToStore.formData
//       return newConfig
//     })
        
//   }, [_saveBotConfig]);
//   return logic;
// };

// export const useFetchBotConfigs = () => {
//   const _saveBotConfig = useSaveBotConfigContext()
//   const logic = useCallback((botDataManager, configKeys) => {
//     fetchBotConfigs(_saveBotConfig, botDataManager, configKeys)        
//   }, [_saveBotConfig]);
//   return logic;
// }
export const BotPlottedElementsProvider = ({children }) => {
  const [botPlottedElements, setBotPlottedElements] = useState({});
  const botInfo = useBotInfoContext()
  const botDomain = useBotDomainContext()
  useEffect(() => {
    if (botInfo){
      fetchPlotData(setBotPlottedElements, botInfo.exchange_id, 
                        botInfo.symbols[0], botInfo.traded_time_frames[0], botDomain)
    }
  }, [botInfo, botDomain])  
  return (
    <BotPlottedElementsContext.Provider value={botPlottedElements}>
      <UpdateBotPlottedElementsContext.Provider value={setBotPlottedElements}>
        {children}
      </UpdateBotPlottedElementsContext.Provider>
    </BotPlottedElementsContext.Provider>
  );
};
