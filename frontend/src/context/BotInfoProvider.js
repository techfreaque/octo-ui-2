import React, { useState, useContext, createContext, useCallback } from "react";
import { fetchBotInfo } from "../api/botData";
import { useBotDomainContext } from "./BotDomainProvider";

const BotInfoContext = createContext();
const UpdateBotInfoContext = createContext();

export const useBotInfoContext = () => {
  return useContext(BotInfoContext);
};

export const useUpdateBotInfoContext = () => {
  return useContext(UpdateBotInfoContext);
};

export const useFetchBotInfo = () => {
  const setBotInfo = useUpdateBotInfoContext()
  const botDomain = useBotDomainContext()
  const logic = useCallback(() => {
    fetchBotInfo(botDomain, setBotInfo)
  }, [setBotInfo, botDomain]);
  return logic;
};

export const BotInfoProvider = ({ children }) => {
  const [botInfo, setBotInfo] = useState();
  const botDomain = useBotDomainContext()
  React.useEffect(() => {
    fetchBotInfo(botDomain, setBotInfo)
}, [botDomain])
  return (
    <BotInfoContext.Provider value={botInfo}>
      <UpdateBotInfoContext.Provider value={setBotInfo}>
        {children}
      </UpdateBotInfoContext.Provider>
    </BotInfoContext.Provider>
  );
};
