import React, {
    useState,
    useContext,
    createContext,
    useCallback,
    useEffect
} from "react";
import {fetchBotInfo} from "../../api/data";
import {useBotDomainContext} from "../config/BotDomainProvider";
import {useUpdateVisibleTimeFramesContext} from "../config/VisibleTimeFrameProvider";
import {useUpdateVisiblePairsContext} from "../config/VisiblePairProvider";
import {useUpdateVisibleExchangesContext, useVisibleExchangesContext} from "../config/VisibleExchangesProvider";
import {useIsBotOnlineContext} from "./IsBotOnlineProvider";
import {BotExchangeInfoProvider} from "./BotExchangeInfoProvider";


const BotInfoContext = createContext();
const UpdateBotInfoContext = createContext();

export const useBotInfoContext = () => {
    return useContext(BotInfoContext);
};

export const useUpdateBotInfoContext = () => {
    return useContext(UpdateBotInfoContext);
};

export function useCurrentProfile() {
    const botInfo = useBotInfoContext()
    return botInfo?.current_profile
}

export const useFetchBotInfo = () => {
    const setBotInfo = useUpdateBotInfoContext();
    const botDomain = useBotDomainContext();
    const visibleExchanges = useVisibleExchangesContext();
    const logic = useCallback((successNotification = false, setIsFinished = undefined) => {
        setIsFinished && setIsFinished(false)
        fetchBotInfo(botDomain, setBotInfo, visibleExchanges, successNotification, setIsFinished);
    }, [setBotInfo, botDomain, visibleExchanges]);
    return logic;
};

export const BotInfoProvider = ({children}) => {
    const [botInfo, setBotInfo] = useState();
    const botDomain = useBotDomainContext();
    const isBotOnline = useIsBotOnlineContext();
    const setVisibleTimeframes = useUpdateVisibleTimeFramesContext();
    const setVisiblePairs = useUpdateVisiblePairsContext();
    const setVisibleExchanges = useUpdateVisibleExchangesContext();
    useEffect(() => {
        isBotOnline && fetchBotInfo(botDomain, setBotInfo);
    }, [botDomain, isBotOnline]);
    useEffect(() => {
        if (botInfo?.trigger_time_frames || botInfo?.traded_time_frames) {
            setVisibleTimeframes(prevTimeframes => {
                const availableTimeframes = (botInfo?.trigger_time_frames?.length && botInfo?.trigger_time_frames) || botInfo?.traded_time_frames;
                if (availableTimeframes?.includes(prevTimeframes)) {
                    return prevTimeframes
                } else {
                    return availableTimeframes?.[0]
                }
            });
            setVisiblePairs(prevPairs => {
                if (botInfo?.symbols?.includes(prevPairs)) {
                    return prevPairs
                } else {
                    return botInfo?.symbols?.[0]
                }
            });
            setVisibleExchanges(prevExchange => {
                if (botInfo?.exchange_names?.includes(prevExchange)) {
                    return prevExchange
                } else {
                    return botInfo?.exchange_name
                }
            });
        }
    }, [botInfo, setVisibleTimeframes, setVisiblePairs, setVisibleExchanges]);

    return (<BotInfoContext.Provider value={botInfo}>
        <UpdateBotInfoContext.Provider value={setBotInfo}>
            <BotExchangeInfoProvider> {children} </BotExchangeInfoProvider>
        </UpdateBotInfoContext.Provider>
    </BotInfoContext.Provider>);
};
