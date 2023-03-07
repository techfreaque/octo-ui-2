import { useEffect } from "react";
import {
    useState,
    useContext,
    createContext,
} from "react";
import { useSocket, useSocketEvent } from "socket.io-react-hook";
import createNotification from "../../components/Notifications/Notification";
import { useBotDomainContext } from "../config/BotDomainProvider";
import { useUpdateIsBotOnlineContext } from "../data/IsBotOnlineProvider";

const NotificationsReadyStateContext = createContext();
const NotificationsHistoryContext = createContext();
const UpdateNotificationsReadyStateContext = createContext();
const UpdateNotificationsHistoryContext = createContext();

export const useNotificationsHistoryContext = () => {
    return useContext(NotificationsHistoryContext);
};

export const useUpdateNotificationsHistoryContext = () => {
    return useContext(UpdateNotificationsHistoryContext);
};
export const useNotificationsReadyStateContext = () => {
    return useContext(NotificationsReadyStateContext);
};

export const useUpdateNotificationsReadyStateContext = () => {
    return useContext(UpdateNotificationsReadyStateContext);
};

export const NotificationsContextProvider = ({ children }) => {
    const [messageHistory, setMessageHistory] = useState();
    const botDomain = useBotDomainContext()
    
    const socketUrl = botDomain.replace("http://", "ws://").replace("https://", "wss://") + "/notifications"
    const setIsBotOnline = useUpdateIsBotOnlineContext()
    function onReconnect() {
        console.log("Bot connected")
        setIsBotOnline(prevState => {
            if (!prevState) {
                createNotification("Your bot is now online again")
            }
            return true
        })
    }
    function onNewMessage(newMessage) {
        console.log("New notification")
        setMessageHistory(prevMessages => [...(prevMessages || []), newMessage])
    }
    function onConnectionLost() {
        console.log("Bot disconnected")
        setIsBotOnline(prevState => {
            if (prevState) {
                createNotification("Your bot is offline", "danger")
            }
            return false
        })
    }
    const { socket, connected, error } = useSocket(socketUrl);

    useEffect(() => {
        if (socket?.active && connected) {
            onReconnect && onReconnect()
        } else if (socket?.active && !connected) {
            onConnectionLost && onConnectionLost(error)
        } else {
            console.log("Websocket is starting")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connected]);
    const { lastMessage } = useSocketEvent(socket, "update")
    useEffect(() => {
        lastMessage && onNewMessage(lastMessage)
    }, [lastMessage]);

    return (
        <UpdateNotificationsHistoryContext.Provider value={setMessageHistory}>
            <NotificationsHistoryContext.Provider value={messageHistory}>
                {/* <AbstractReactWebsocketContext
                    socketUrl={socketUrl}
                    onReconnect={onReconnect} onNewMessage={onNewMessage}
                    onConnectionLost={onConnectionLost} onKey={"update"} > */}
                {children}
                {/* </AbstractReactWebsocketContext> */}
            </NotificationsHistoryContext.Provider>
        </UpdateNotificationsHistoryContext.Provider>
    );
};
