import React, {useState, useContext, createContext, useCallback} from "react";
import {sendAndInterpretBotUpdate} from "../../api/fetchAndStoreFromBot";
import createNotification from "../../components/Notifications/Notification";
import {backendRoutes} from "../../constants/backendConstants";
import {useBotInfoContext} from "../data/BotInfoProvider";
import {useFetchPlotData} from "../data/BotPlottedElementsProvider";
import {useBotDomainContext} from "./BotDomainProvider";


const TentaclesConfigContext = createContext();
const UpdateTentaclesConfigContext = createContext();
const HiddenBacktestingMetadataColumnsContext = createContext();
const UpdateHiddenBacktestingMetadataColumnsContext = createContext();
const IsSavingTentaclesConfigContext = createContext();
const UpdateIsSavingTentaclesConfigContext = createContext();


export const useIsSavingTentaclesConfigContext = () => {
    return useContext(IsSavingTentaclesConfigContext);
};
export const useUpdateIsSavingTentaclesConfigContext = () => {
    return useContext(UpdateIsSavingTentaclesConfigContext);
};
export const useTentaclesConfigContext = () => {
    return useContext(TentaclesConfigContext);
};
const useUpdateTentaclesConfigContext = () => {
    return useContext(UpdateTentaclesConfigContext);
};
export const useHiddenBacktestingMetadataColumnsContext = () => {
    return useContext(HiddenBacktestingMetadataColumnsContext);
};
export const useUpdateHiddenBacktestingMetadataColumnsContext = () => {
    return useContext(UpdateHiddenBacktestingMetadataColumnsContext);
};

export const tentacleConfigType = {
    tradingTentacles: "tradingTentacles",
    tentacles: "tentacles"
}

export const useFetchTentaclesConfig = () => {
    const updateTentaclesConfig = useUpdateTentaclesConfigContext();
    const botDomain = useBotDomainContext()
    return useCallback((tentacles, successCallback = null, isTradingTentacle = false) => {
        const failure = (updated_data, update_url, result, msg, status) => {
            createNotification("Failed to fetch tentacles config", "danger", msg ?. message)
        }
        const success = (updated_data, update_url, result, msg, status) => {
            if (msg ?. success) {
                updateTentaclesConfig(prevConfig => {
                    const newConfig = {
                        ...prevConfig
                    }
                    if (isTradingTentacle) {
                        newConfig[tentacleConfigType.tradingTentacles] = msg ?. data
                    } else {
                        const prevTentacles = newConfig[tentacleConfigType.tentacles] || {}
                        newConfig[tentacleConfigType.tentacles] = {
                            ... prevTentacles,
                            ...msg ?. data
                        }
                    }
                    return newConfig
                })
                successCallback ?. (updated_data, update_url, result, msg, status)
            } else {
                failure(updated_data, update_url, result, msg, status)
            }
        }
        sendAndInterpretBotUpdate({
            tentacles
        }, botDomain + backendRoutes.fetchTentaclesConfig, success, failure, "POST")
    }, [botDomain, updateTentaclesConfig]);
};

export function getEnabledTradingTentaclesList(botInfo) {
    const tentacles = []
    botInfo ?. strategy_names && tentacles.push(... botInfo.strategy_names)
    botInfo ?. evaluator_names && tentacles.push(... botInfo.evaluator_names)
    botInfo ?. trading_mode_name && tentacles.push(botInfo.trading_mode_name)
    return [...new Set(tentacles)]
}

export const useFetchCurrentTradingTentaclesConfig = () => {
    const loadTentaclesConfig = useFetchTentaclesConfig();
    const botInfo = useBotInfoContext()
    return useCallback((successCallback = null) => {
        const tentacles = getEnabledTradingTentaclesList(botInfo)
        loadTentaclesConfig(tentacles, successCallback, true)
    }, [botInfo, loadTentaclesConfig]);
};


export const useSaveTentaclesConfig = () => {
    const fetchPlotData = useFetchPlotData();
    const loadCurrentTradingTentaclesConfig = useFetchCurrentTradingTentaclesConfig();
    const loadTentaclesConfig = useFetchTentaclesConfig();
    const botDomain = useBotDomainContext()
    return useCallback((newConfigs, setIsSaving, reloadPlots = false, isTradingConfig = true, keepExisting = true, successNotification = true) => {
        const failure = (updated_data, update_url, result, msg, status) => {
            setIsSaving ?. (false)
            createNotification(msg)
        }
        const onFinish = (updated_data, update_url, result, msg, status) => {
            setIsSaving ?. (false)
            successNotification && createNotification("Successfully save tentacles config")
            if (reloadPlots) {
                fetchPlotData()
            };
        }
        const success = (updated_data, update_url, result, msg, status) => {
            if (isTradingConfig) {
                loadCurrentTradingTentaclesConfig(onFinish)
            } else {
                const tentacles = Object.keys(newConfigs)
                loadTentaclesConfig(tentacles, onFinish)
            }
        }
        sendAndInterpretBotUpdate(newConfigs, botDomain + (isTradingConfig ? `${
            reloadPlots ? backendRoutes.updateTentaclesConfigAndReRun : backendRoutes.updateTentaclesConfig
        }&keep_existing=${keepExisting}` : backendRoutes.updateTentaclesConfigNoReload), success, failure)
    }, [botDomain, fetchPlotData, loadCurrentTradingTentaclesConfig, loadTentaclesConfig]);
};

export const useSaveTentaclesConfigAndSendAction = () => {
    const fetchPlotData = useFetchPlotData();
    const botDomain = useBotDomainContext()
    return useCallback((newConfigs, actionType, setIsLoading, reloadPlots = false, successCallback = undefined, failureCallback = undefined) => {
        const fail = (updated_data, update_url, result, msg, status) => {
            setIsLoading(false)
            createNotification("Failed to executed trading mode", "danger")
        }
        const success = (updated_data, update_url, result, msg, status) => {
            if (reloadPlots) {
                fetchPlotData()
            };
            setIsLoading(false)
            createNotification("Successfully executed trading mode")
        }
        sendAndInterpretBotUpdate(newConfigs, `${
            botDomain + backendRoutes.updateTentaclesConfigAndSendCommand
        }/${actionType}`, successCallback || success, fail || failureCallback)
    }, [fetchPlotData, botDomain]);
};

export const TentaclesConfigProvider = ({children}) => {
    const [tentaclesConfig, setTentaclesConfig] = useState();
    const [isSaving, setIsSaving] = useState(false);
    return (
        <TentaclesConfigContext.Provider value={tentaclesConfig}>
            <UpdateTentaclesConfigContext.Provider value={setTentaclesConfig}>
                <IsSavingTentaclesConfigContext.Provider value={isSaving}>
                    <UpdateIsSavingTentaclesConfigContext.Provider value={setIsSaving}>
                        {children}
                    </UpdateIsSavingTentaclesConfigContext.Provider>
                </IsSavingTentaclesConfigContext.Provider>
            </UpdateTentaclesConfigContext.Provider>
        </TentaclesConfigContext.Provider>
    )
};
