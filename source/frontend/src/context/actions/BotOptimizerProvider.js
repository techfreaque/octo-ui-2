import React, {useState, useContext, createContext, useCallback} from "react";
import {addToOptimizerQueue, startOptimizer, stopOptimizer} from "../../api/actions";
import {OPTIMIZER_RUN_SETTINGS_KEY} from "../../constants/backendConstants";
import {useBotDomainContext} from "../config/BotDomainProvider";
import {useBotInfoContext} from "../data/BotInfoProvider";
import {useFetchOptimizerQueue} from "../data/OptimizerQueueProvider";
import {useGetAndSaveOptimizerForm} from "../config/OptimizerEditorProvider";
import {useUiConfigContext} from "../config/UiConfigProvider";
import {AbstractWebsocketContext} from "../websockets/AbstractWebsocketContext";

const BotIsOptimizingContext = createContext();
const UpdateBotIsOptimizingContext = createContext();
const OptimizerProgressContext = createContext();

export const useOptimizerrogressContext = () => {
    return useContext(OptimizerProgressContext);
};

export const useBotIsOptimizingContext = () => {
    return useContext(BotIsOptimizingContext);
};
export const useUpdateBotIsOptimizingContext = () => {
    return useContext(UpdateBotIsOptimizingContext);
};

export const useStopOptimizer = () => {
    const setBotIsOptimizing = useUpdateBotIsOptimizingContext();
    const botDomain = useBotDomainContext();
    const logic = useCallback(() => {
        stopOptimizer(botDomain, setBotIsOptimizing)
    }, [setBotIsOptimizing, botDomain]);
    return logic;
};

export const useStartOptimizer = () => {
    const setBotIsOptimizing = useUpdateBotIsOptimizingContext();
    const uiConfig = useUiConfigContext()
    const optimizerSettings = uiConfig[OPTIMIZER_RUN_SETTINGS_KEY]
    const botDomain = useBotDomainContext();
    const botInfo = useBotInfoContext()
    const idsByExchangeName = botInfo && botInfo.ids_by_exchange_name
    const getOptimizerForm = useGetAndSaveOptimizerForm();
    const logic = useCallback(() => { // TODO validate settings
        if (optimizerSettings && idsByExchangeName) {
            startOptimizer(botDomain, optimizerSettings, getOptimizerForm(false), idsByExchangeName, setBotIsOptimizing)
        }
    }, [
        setBotIsOptimizing,
        botDomain,
        optimizerSettings,
        idsByExchangeName,
        getOptimizerForm
    ]);
    return logic;
};

export const useAddToOptimizerQueue = () => {
    const setBotIsOptimizing = useUpdateBotIsOptimizingContext();
    const uiConfig = useUiConfigContext()
    const optimizerSettings = uiConfig[OPTIMIZER_RUN_SETTINGS_KEY]
    const botDomain = useBotDomainContext();
    const botInfo = useBotInfoContext()
    const exchageId = botInfo && botInfo.exchange_id
    const getOptimizerForm = useGetAndSaveOptimizerForm();
    const fetchOptimizerQueue = useFetchOptimizerQueue()
    const logic = useCallback(() => {
        if (optimizerSettings && exchageId) {
            addToOptimizerQueue(botDomain, optimizerSettings, getOptimizerForm(false), exchageId, setBotIsOptimizing, fetchOptimizerQueue)
        }
    }, [
        optimizerSettings,
        exchageId,
        botDomain,
        getOptimizerForm,
        setBotIsOptimizing,
        fetchOptimizerQueue
    ]);
    return logic;
};

export const BotOptimizerProvider = ({children}) => {
    const [botIsOptimizing, setBotIsOptimizing] = useState(false);
    const [optimizerProgress, setOptimizerProgress] = useState({});
    const botDomain = useBotDomainContext();
    const socketUrl = botDomain + "/strategy_optimizer"
    function onConnectionUpdate(data, socket) {
        if (data) {
            setOptimizerProgress(data)
        }
        if (data?.status === "starting" || data?.status === "computing") {
            setBotIsOptimizing(true);
            setTimeout(function () {
                socket.emit('backtesting_status')
            }, 50);
        } else {
            setBotIsOptimizing(prevState => {
                if (data?.status === "finished" && prevState) { // createNotification("Backtest finished successfully")
                }
                return false
            });
        }
    }
    function onConnectionLost() {
        setBotIsOptimizing(false)
    }
    return (<BotIsOptimizingContext.Provider value={botIsOptimizing}>
        <UpdateBotIsOptimizingContext.Provider value={setBotIsOptimizing}>
            <OptimizerProgressContext.Provider value={optimizerProgress}>
                <AbstractWebsocketContext socketUrl={socketUrl}
                    onConnectionUpdate={onConnectionUpdate}
                    onConnectionLost={onConnectionLost}
                    onKey={"strategy_optimizer_status"}> {children} </AbstractWebsocketContext>
            </OptimizerProgressContext.Provider>
        </UpdateBotIsOptimizingContext.Provider>
    </BotIsOptimizingContext.Provider>);
};
