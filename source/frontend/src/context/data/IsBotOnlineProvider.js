import {
  useState,
  useContext,
  createContext,
  useEffect,
} from "react";
import createNotification from "../../components/Notifications/Notification";
import { useBotDomainContext } from "../config/BotDomainProvider";
import { useFetchBotInfo } from "./BotInfoProvider";

const IsBotOnlineContext = createContext();
const UpdateIsBotOnlineContext = createContext();

export const useIsBotOnlineContext = () => {
  return useContext(IsBotOnlineContext);
};

export const useUpdateIsBotOnlineContext = () => {
  return useContext(UpdateIsBotOnlineContext);
};

export const IsBotOnlineProvider = ({ children }) => {
  const [isBotOnline, setIsBotOnline] = useState(true);
  const botDomain = useBotDomainContext();
  const fetchBotInfo = useFetchBotInfo();
  const socket = new WebSocket("ws://" + botDomain + "/notifications");
  useEffect(() => {
    socket.onmessage = () => {
      if (!isBotOnline) {
        setIsBotOnline(true);
        fetchBotInfo();
        createNotification("Your bot is now online again")
      }
    }
    socket.onclose = () => {
      // setIsBotOnline(false);
      // createNotification("Your bot is offline", "danger")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botDomain]);
  return (
    <IsBotOnlineContext.Provider value={isBotOnline}>
      <UpdateIsBotOnlineContext.Provider value={setIsBotOnline}>
        {children}
      </UpdateIsBotOnlineContext.Provider>
    </IsBotOnlineContext.Provider>
  );
};
