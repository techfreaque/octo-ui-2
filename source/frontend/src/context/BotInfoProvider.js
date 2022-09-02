import React, {
  useState,
  useContext,
  createContext,
  useCallback,
  useEffect,
} from "react";
import { fetchBotInfo } from "../api/botData";
import { useBotDomainContext } from "./BotDomainProvider";
import { useUpdateVisibleTimeFramesContext } from "./VisibleTimeFrameProvider";

const BotInfoContext = createContext();
const UpdateBotInfoContext = createContext();

export const useBotInfoContext = () => {
  return useContext(BotInfoContext);
};

export const useUpdateBotInfoContext = () => {
  return useContext(UpdateBotInfoContext);
};

export const useFetchBotInfo = () => {
  const setBotInfo = useUpdateBotInfoContext();
  const botDomain = useBotDomainContext();
  const logic = useCallback(() => {
    fetchBotInfo(botDomain, setBotInfo);
  }, [setBotInfo, botDomain]);
  return logic;
};

export const BotInfoProvider = ({ children }) => {
  const [botInfo, setBotInfo] = useState();
  const botDomain = useBotDomainContext();
  const setVisibleTimeframes = useUpdateVisibleTimeFramesContext();
  useEffect(() => {
    fetchBotInfo(botDomain, setBotInfo);
  }, [botDomain]);
  useEffect(() => {
    if (botInfo && botInfo.traded_time_frames) {
      setVisibleTimeframes(botInfo.traded_time_frames[0]);
    }
  }, [botInfo, setVisibleTimeframes]);

  return (
    <BotInfoContext.Provider value={botInfo}>
      <UpdateBotInfoContext.Provider value={setBotInfo}>
        {children}
      </UpdateBotInfoContext.Provider>
    </BotInfoContext.Provider>
  );
};
