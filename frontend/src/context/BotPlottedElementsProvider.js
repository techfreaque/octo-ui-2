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

// export const useUpdateVisiblePlottedElements = () => {
//   const updateBotPlottedElements = useUpdateBotPlottedElementsContext()
//   const logic = useCallback((dataToStore) => {
//     updateBotPlottedElements(prevData => {
//       console.log(dataToStore)
//       return {...prevData, plot_sources: dataToStore.formData}
//     })
        
//   }, [updateBotPlottedElements]);
//   return logic;
// };

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
