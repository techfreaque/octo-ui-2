import React, {useState, useContext, createContext, useCallback} from "react";
import {addToOptimizerQueue, startOptimizer, stopOptimizer} from "../../api/actions";
import {OPTIMIZER_RUN_SETTINGS_KEY, backendRoutes} from "../../constants/backendConstants";
import {useBotDomainContext} from "../config/BotDomainProvider";
import {useBotInfoContext} from "../data/BotInfoProvider";
import {useFetchOptimizerQueue} from "../data/OptimizerQueueProvider";
import {useFetchProConfig, useOptimizerEditorContext} from "../config/OptimizerEditorProvider";
import {useUiConfigContext} from "../config/UiConfigProvider";
import {AbstractWebsocketContext} from "../websockets/AbstractWebsocketContext";
import createNotification from "../../components/Notifications/Notification";
import {sendAndInterpretBotUpdate} from "../../api/fetchAndStoreFromBot";

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

export const useStopTraining = () => {
    const botDomain = useBotDomainContext();
    const logic = useCallback(() => {
        const success = (updated_data, update_url, result, msg, status) => {
            createNotification("Successfully stopped training", "success", "Training will stop once this generation has finished");
        }
        const failure = (updated_data, update_url, result, status, error) => {
            createNotification("Failed to stop training", "danger")
        }
        sendAndInterpretBotUpdate({}, botDomain + backendRoutes.trainingStop, success, failure)
    }, [botDomain]);
    return logic;
};

export const useStartOptimizer = () => {
    const setBotIsOptimizing = useUpdateBotIsOptimizingContext();
    const uiConfig = useUiConfigContext()
    const optimizerSettings = uiConfig[OPTIMIZER_RUN_SETTINGS_KEY]
    const botDomain = useBotDomainContext();
    const botInfo = useBotInfoContext()
    const idsByExchangeName = botInfo && botInfo.ids_by_exchange_name
    const optimizerForm = useOptimizerEditorContext();
    const fetchProConfig = useFetchProConfig()
    const logic = useCallback(() => { // TODO validate settings
        if (optimizerSettings && idsByExchangeName) {
            if (! optimizerForm ?. optimizer_inputs ?. user_inputs) { // settings not loaded yet, use directly from settings storage
                fetchProConfig((fetchedOptimizerForm) => {
                    if (fetchedOptimizerForm ?. optimizer_inputs) {
                        startOptimizer(botDomain, optimizerSettings, fetchedOptimizerForm.optimizer_inputs, idsByExchangeName, setBotIsOptimizing)
                    } else {
                        createNotification("Failed to add to optimizer queue", "danger", "Check your optimizer run configuration")
                    }
                })
            } else {
                startOptimizer(botDomain, optimizerSettings, optimizerForm ?. optimizer_inputs, idsByExchangeName, setBotIsOptimizing)
            }
        }
    }, [
        optimizerSettings,
        idsByExchangeName,
        optimizerForm ?. optimizer_inputs,
        fetchProConfig,
        botDomain,
        setBotIsOptimizing
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
    const optimizerForm = useOptimizerEditorContext();
    const fetchOptimizerQueue = useFetchOptimizerQueue()
    const fetchProConfig = useFetchProConfig()
    const logic = useCallback(() => {
        if (optimizerSettings && exchageId) {
            if (! optimizerForm ?. optimizer_inputs ?. user_inputs) { // settings not loaded yet, use directly from settings storage
                fetchProConfig((fetchedOptimizerForm) => {
                    if (fetchedOptimizerForm ?. optimizer_inputs) {
                        addToOptimizerQueue(botDomain, optimizerSettings, fetchedOptimizerForm.optimizer_inputs, exchageId, setBotIsOptimizing, fetchOptimizerQueue)
                    } else {
                        createNotification("Failed to add to optimizer queue", "danger", "Check your optimizer run configuration")
                    }
                })
            } else {
                addToOptimizerQueue(botDomain, optimizerSettings, optimizerForm ?. optimizer_inputs, exchageId, setBotIsOptimizing, fetchOptimizerQueue)
            }
        } else {
            createNotification("Failed to add to the queue", "danger", "The exchange is not initialized")
        }
    }, [
        optimizerSettings,
        exchageId,
        optimizerForm,
        botDomain,
        setBotIsOptimizing,
        fetchOptimizerQueue,
        fetchProConfig
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
        if (data ?. status === "starting" || data ?. status === "computing") {
            setBotIsOptimizing(true);
            setTimeout(function () {
                socket.emit('strategy_optimizer_status')
            }, 2000);
        } else {
            setBotIsOptimizing(prevState => {
                if (data ?. status === "finished" && prevState) { // createNotification("Backtest finished successfully")
                }
                return false
            });
        }
    }
    function onConnectionLost() {
        setBotIsOptimizing(false)
    }
    return (
        <BotIsOptimizingContext.Provider value={botIsOptimizing}>
            <UpdateBotIsOptimizingContext.Provider value={setBotIsOptimizing}>
                <OptimizerProgressContext.Provider value={optimizerProgress}>
                    <AbstractWebsocketContext socketUrl={socketUrl}
                        onConnectionUpdate={onConnectionUpdate}
                        onConnectionLost={onConnectionLost}
                        onKey={"strategy_optimizer_status"}>
                        {children} </AbstractWebsocketContext>
                </OptimizerProgressContext.Provider>
            </UpdateBotIsOptimizingContext.Provider>
        </BotIsOptimizingContext.Provider>
    );
};
