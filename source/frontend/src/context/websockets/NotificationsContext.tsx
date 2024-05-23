import { Dispatch, SetStateAction, useEffect } from "react";
import { createContext,useContext, useState } from "react";
import { useSocket, useSocketEvent } from "socket.io-react-hook";

import createNotification from "../../components/Notifications/Notification";
import { emptyValueFunction } from "../../helpers/helpers";
import { useBotDomainContext } from "../config/BotDomainProvider";
import { useUpdateIsBotOnlineContext } from "../data/IsBotOnlineProvider";

interface WebsocketNotificationType {
  notifications: {
    Title: string;
    Level: "info" | "success" | "warning" | "error" | "danger" | undefined;
    Message?: string | undefined;
  }[];
}

export interface NotificationHistoryNotificationsType {
  Title: string;
  Level: "info" | "success" | "warning" | "error" | "danger" | undefined;
  Message?: string | undefined;
}

interface NotificationHistoryType {
  notifications: NotificationHistoryNotificationsType[];
  Time: Date;
}

const NotificationsHistoryContext = createContext<
  NotificationHistoryType[] | undefined
>(undefined);
const UpdateNotificationsHistoryContext = createContext<
  Dispatch<SetStateAction<NotificationHistoryType[] | undefined>>
>(emptyValueFunction);

export const useNotificationsHistoryContext = () => {
  return useContext(NotificationsHistoryContext);
};

export const useUpdateNotificationsHistoryContext = () => {
  return useContext(UpdateNotificationsHistoryContext);
};

export const NotificationsContextProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [messageHistory, setMessageHistory] = useState<
    NotificationHistoryType[] | undefined
  >(undefined);
  const botDomain = useBotDomainContext();

  const socketUrl =
    botDomain.replace("http://", "ws://").replace("https://", "wss://") +
    "/notifications";
  const setIsBotOnline = useUpdateIsBotOnlineContext();

  function onNewMessage(newMessage: WebsocketNotificationType) {
    if (newMessage?.notifications) {
      newMessage.notifications.forEach((notification) => {
        createNotification({
          title: notification.Title,
          type: notification.Level === "error" ? "danger" : notification.Level,
          message: (
            <>
              {notification.Message?.split("<br>")?.map((row, index) => (
                <div key={index}>{row}</div>
              ))}
            </>
          ),
        });
      });
      setMessageHistory((prevMessages) => [
        ...(prevMessages ? prevMessages : []),
        { ...newMessage, Time: new Date() },
      ]);
    }
  }
  const { socket, connected } = useSocket(socketUrl);
  useEffect(() => {
    if (socket?.active && connected) {
      onReconnect(setIsBotOnline);
    } else if (socket?.active && !connected && socket?.recovered !== false) {
      onConnectionLost(setIsBotOnline);
    } else {
      // console.log("Websocket is starting");
    }
  }, [connected, setIsBotOnline, socket?.active, socket?.recovered]);
  const { lastMessage } = useSocketEvent(socket, "update");
  useEffect(() => {
    if (lastMessage) {
      onNewMessage(lastMessage as WebsocketNotificationType);
    }
  }, [lastMessage]);

  return (
    <UpdateNotificationsHistoryContext.Provider value={setMessageHistory}>
      <NotificationsHistoryContext.Provider value={messageHistory}>
        {children}
      </NotificationsHistoryContext.Provider>
    </UpdateNotificationsHistoryContext.Provider>
  );
};

function onReconnect(setIsBotOnline: Dispatch<SetStateAction<boolean>>) {
  setIsBotOnline((prevState) => {
    if (!prevState) {
      createNotification({ title: "Your bot is now online again" });
    }
    return true;
  });
}
function onConnectionLost(setIsBotOnline: Dispatch<SetStateAction<boolean>>) {
  setIsBotOnline((prevState) => {
    if (prevState) {
      createNotification({ title: "Your bot is offline", type: "danger" });
    }
    return false;
  });
}
