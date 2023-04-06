import React, {useState, useContext, createContext, useCallback} from "react";
import {fetchBacktestingRunData} from "../../api/data";
import {sendAndInterpretBotUpdate} from "../../api/fetchAndStoreFromBot";
import createNotification from "../../components/Notifications/Notification";
import {backendRoutes} from "../../constants/backendConstants";
import {useBotDomainContext} from "../config/BotDomainProvider";
import {useUiConfigContext, useUpdateUiConfigContext} from "../config/UiConfigProvider";


const BacktestingRunDataContext = createContext();
const UpdateBacktestingRunDataContext = createContext();

export const useBacktestingRunDataContext = () => {
    return useContext(BacktestingRunDataContext);
};

export const useUpdateBacktestingRunDataContext = () => {
    return useContext(UpdateBacktestingRunDataContext);
};

export const useFetchBacktestingRunData = () => {
    const setBacktestingRunData = useUpdateBacktestingRunDataContext();
    const botDomain = useBotDomainContext();
    const uiConfig = useUiConfigContext()
    const setUiConfig = useUpdateUiConfigContext()
    const logic = useCallback(() => {
        uiConfig.optimization_campaign && fetchBacktestingRunData(setBacktestingRunData, setUiConfig, botDomain, false, {
            ... uiConfig.optimizer_campaigns_to_load
        })
    }, [setBacktestingRunData, botDomain, uiConfig, setUiConfig]);
    return logic;
};

export const useDeleteBacktestingRunData = () => {
    const botDomain = useBotDomainContext();
    const reloadData = useFetchBacktestingRunData()
    const logic = useCallback((runsToDelete) => {
        const data = {
            runs: runsToDelete
        }
        const successCallback = () => {
            reloadData()
            createNotification("Runs successfully deleted")
        };
        sendAndInterpretBotUpdate(data, botDomain + backendRoutes.deleteRunData, successCallback);

    }, [botDomain, reloadData]);
    return logic;
};

export const BacktestingRunDataProvider = ({children}) => {
    const [backtestingRunData, setBacktestingRunData] = useState({});
    return (<BacktestingRunDataContext.Provider value={backtestingRunData}>
        <UpdateBacktestingRunDataContext.Provider value={setBacktestingRunData}> {children} </UpdateBacktestingRunDataContext.Provider>
    </BacktestingRunDataContext.Provider>);
};
