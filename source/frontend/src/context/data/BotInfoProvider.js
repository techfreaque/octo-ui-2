import React, {
  useState,
  useContext,
  createContext,
  useCallback,
  useEffect,
} from "react";
import { fetchBotInfo } from "../../api/data";
import { useBotDomainContext } from "../config/BotDomainProvider";
import { useUpdateVisibleTimeFramesContext } from "../config/VisibleTimeFrameProvider";
import { useUpdateVisiblePairsContext } from "../config/VisiblePairProvider";


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
  const setVisiblePairs = useUpdateVisiblePairsContext();
  useEffect(() => {
    fetchBotInfo(botDomain, setBotInfo);
  }, [botDomain]);
  useEffect(() => {
    if (botInfo && botInfo.traded_time_frames) {
      setVisibleTimeframes(botInfo.traded_time_frames[0]);
      setVisiblePairs(botInfo.symbols[0]);
    }
  }, [botInfo, setVisibleTimeframes, setVisiblePairs]);

  return (
    <BotInfoContext.Provider value={botInfo}>
      <UpdateBotInfoContext.Provider value={setBotInfo}>
        {children}
      </UpdateBotInfoContext.Provider>
    </BotInfoContext.Provider>
  );
};
