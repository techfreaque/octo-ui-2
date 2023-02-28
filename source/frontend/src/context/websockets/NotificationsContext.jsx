import {
    useState,
    useContext,
    createContext,
} from "react";
import createNotification from "../../components/Notifications/Notification";
import { useBotDomainContext } from "../config/BotDomainProvider";
import { useUpdateIsBotOnlineContext } from "../data/IsBotOnlineProvider";
import { AbstractWebsocketContext } from "./AbstractWebsocketContext";

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
    const socketUrl = botDomain + "/notifications"
    const setIsBotOnline = useUpdateIsBotOnlineContext()

    function onConnectionUpdate(data) {
        setIsBotOnline(prevState => {
            if (!prevState) {
                createNotification("Your bot is now online again")
            }
            return true
        })
        data && setMessageHistory(prevMessages => [...(prevMessages || []), data])
    }
    function onConnectionLost() {
        setIsBotOnline(prevState => {
            if (prevState) {
                createNotification("Your bot is offline", "danger")
            }
            return false
        })
    }

    return (
        <UpdateNotificationsHistoryContext.Provider value={setMessageHistory}>
            <NotificationsHistoryContext.Provider value={messageHistory}>
                <AbstractWebsocketContext
                    socketUrl={socketUrl}
                    onConnectionUpdate={onConnectionUpdate}
                    onConnectionLost={onConnectionLost} onKey={"update"}>
                    {children}
                </AbstractWebsocketContext>
            </NotificationsHistoryContext.Provider>
        </UpdateNotificationsHistoryContext.Provider>
    );
};
