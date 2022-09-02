import { useState, useContext, createContext, useEffect } from "react";
import { fetchPlotData } from "../api/botData";
import { useBotDomainContext } from "./BotDomainProvider";
import { useBotInfoContext } from "./BotInfoProvider";
import { useVisibleTimeFramesContext } from "./VisibleTimeFrameProvider/VisibleTimeFrameProvider";

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

export const BotPlottedElementsProvider = ({ children }) => {
  const [botPlottedElements, setBotPlottedElements] = useState({});
  const botInfo = useBotInfoContext();
  const botDomain = useBotDomainContext();
  const visibleTimeframes = useVisibleTimeFramesContext();
  useEffect(() => {
    if (botInfo) {
      console.log("test" + visibleTimeframes);
      fetchPlotData(
        setBotPlottedElements,
        botInfo.exchange_id,
        botInfo.symbols[0],
        visibleTimeframes,
        botDomain
      );
    }
  }, [botInfo, botDomain, visibleTimeframes]);
  return (
    <BotPlottedElementsContext.Provider value={botPlottedElements}>
      <UpdateBotPlottedElementsContext.Provider value={setBotPlottedElements}>
        {children}
      </UpdateBotPlottedElementsContext.Provider>
    </BotPlottedElementsContext.Provider>
  );
};
