import React, {useState, useContext, createContext, useCallback} from "react";
import {startBacktesting, stopBacktesting} from "../../api/actions";
import {BACKTESTING_RUN_SETTINGS_KEY, CURRENT_BOT_DATA} from "../../constants/backendConstants";
import {useBotDomainContext} from "../config/BotDomainProvider";
import {useBotInfoContext} from "../data/BotInfoProvider";
import {useUiConfigContext} from "../config/UiConfigProvider";
import {AbstractWebsocketContext} from "../websockets/AbstractWebsocketContext";
import createNotification from "../../components/Notifications/Notification";

const BotIsBacktestingContext = createContext();
const UpdateBotIsDataCollectingContext = createContext();
const BotIsDataCollectingContext = createContext();
const DataCollectingProgressContext = createContext();
const UpdateBotIsBacktestingContext = createContext();
const BacktestingProgressContext = createContext();

export const useBotIsBacktestingContext = () => {
    return useContext(BotIsBacktestingContext);
};
export const useDataCollectingProgressContext = () => {
    return useContext(DataCollectingProgressContext);
};

export const useUpdateBotIsDataCollectingContext = () => {
    return useContext(UpdateBotIsDataCollectingContext);
};
export const useBotIsDataCollectingContext = () => {
    return useContext(BotIsDataCollectingContext);
};

export const useUpdateBotIsBacktestingContext = () => {
    return useContext(UpdateBotIsBacktestingContext);
};

export const useBacktestingProgressContext = () => {
    return useContext(BacktestingProgressContext);
};

export const useStopBacktesting = () => {
    const setBotIsBacktesting = useUpdateBotIsBacktestingContext();
    const botDomain = useBotDomainContext();
    const logic = useCallback(() => {
        stopBacktesting(botDomain, setBotIsBacktesting)
    }, [setBotIsBacktesting, botDomain]);
    return logic;
};

export const useStartBacktesting = () => {
    const setBotIsBacktesting = useUpdateBotIsBacktestingContext();
    const uiSettigs = useUiConfigContext()
    const backtestingSettings = uiSettigs[BACKTESTING_RUN_SETTINGS_KEY]
    const botDomain = useBotDomainContext();
    const botInfo = useBotInfoContext()
    const defaultExchangeName = botInfo?.exchange_name
    const ids_by_exchange_name = botInfo?.ids_by_exchange_name
    const logic = useCallback(() => {
        if (backtestingSettings && ids_by_exchange_name) {
            const _backtestingSettings = {
                data_sources: [CURRENT_BOT_DATA],
                ...backtestingSettings,
                exchange_ids: backtestingSettings.exchange_names ? backtestingSettings.exchange_names.map(exchangeName => (ids_by_exchange_name[exchangeName])) : Object.values(ids_by_exchange_name).map(exchangeId => exchangeId),

                // TODO remove when stock supports ids sources
                data_source: backtestingSettings.data_sources ? backtestingSettings.data_sources[0] : CURRENT_BOT_DATA,
                exchange_id: ids_by_exchange_name[backtestingSettings.exchange_names ? backtestingSettings.exchange_names[0] : defaultExchangeName]
            }
            startBacktesting(botDomain, _backtestingSettings, setBotIsBacktesting)
        }
    }, [
        setBotIsBacktesting,
        botDomain,
        backtestingSettings,
        ids_by_exchange_name,
        defaultExchangeName
    ]);
    return logic;
};


function DataCollectorProgressProvider({setDataCollectorProgress, children}) {
    const botDomain = useBotDomainContext();
    const setBotIsCollectingData = useUpdateBotIsDataCollectingContext();
    const socketUrl = botDomain + "/data_collector"
    function onConnectionUpdate(data, socket) {
        if (data) {
            setDataCollectorProgress(data)
        }
        if (data?.status === "starting" || data?.status === "collecting") {
            setTimeout(function () {
                socket.emit('data_collector_status')
            }, 2000);
            setBotIsCollectingData(true);
        } else {
            setBotIsCollectingData(prevState => {
                if (data?.status === "finished" && prevState) {
                    createNotification("Data collector finished successfully")
                }
                return false
            });
        }
    }
    function onConnectionLost() {
        setBotIsCollectingData(false)
    }
    return (
        <AbstractWebsocketContext socketUrl={socketUrl}
            onConnectionUpdate={onConnectionUpdate}
            onConnectionLost={onConnectionLost}
            onKey={"data_collector_status"}>
            {children} </AbstractWebsocketContext>
    )
}

function BacktestingProgressProvider({setBacktestingProgress, children}) {
    const botDomain = useBotDomainContext();
    const setBotIsBacktesting = useUpdateBotIsBacktestingContext();
    const socketUrl = botDomain + "/backtesting"
    function onConnectionUpdate(data, socket) {
        if (data) {
            setBacktestingProgress(data)
        }
        if (data?.status === "starting" || data?.status === "computing") {
            setBotIsBacktesting(true);
            setTimeout(function () {
                socket.emit('backtesting_status')
            }, 2000);
        } else {
            setBotIsBacktesting(prevState => {
                if (data?.status === "finished" && prevState) {
                    createNotification("Backtest finished successfully")
                }
                return false
            });
        }
    }
    function onConnectionLost() {
        setBotIsBacktesting(false)
    }
    return (
        <AbstractWebsocketContext socketUrl={socketUrl}
            onConnectionUpdate={onConnectionUpdate}
            onConnectionLost={onConnectionLost}
            onKey={"backtesting_status"}>
            {children}
        </AbstractWebsocketContext>
    )
}

export const BotBacktestingProvider = ({children}) => {
    const [botIsBacktesting, setBotIsBacktesting] = useState(false);
    const [backtestingProgress, setBacktestingProgress] = useState(0);
    const [dataCollectorProgress, setDataCollectorProgress] = useState(0);
    const [isDataCollecting, setIsDataCollecting] = useState(false);
    return (
        <BotIsBacktestingContext.Provider value={botIsBacktesting}>
            <UpdateBotIsBacktestingContext.Provider value={setBotIsBacktesting}>
                <BacktestingProgressContext.Provider value={backtestingProgress}>
                    <DataCollectingProgressContext.Provider value={dataCollectorProgress}>
                        <UpdateBotIsDataCollectingContext.Provider value={setIsDataCollecting}>
                            <BotIsDataCollectingContext.Provider value={isDataCollecting}>
                                <BacktestingProgressProvider setBacktestingProgress={setBacktestingProgress}>
                                  <DataCollectorProgressProvider setDataCollectorProgress={setDataCollectorProgress}>
                                {children}
                                </DataCollectorProgressProvider>
                                </BacktestingProgressProvider>
                            </BotIsDataCollectingContext.Provider>
                        </UpdateBotIsDataCollectingContext.Provider>
                    </DataCollectingProgressContext.Provider>
                </BacktestingProgressContext.Provider>
            </UpdateBotIsBacktestingContext.Provider>
        </BotIsBacktestingContext.Provider>
    );
};
