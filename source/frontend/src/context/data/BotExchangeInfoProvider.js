import React, {useState, useContext, createContext, useCallback} from "react";
import {fetchExchangeInfo} from "../../api/data";
import {useBotDomainContext} from "../config/BotDomainProvider";


const ExchangeInfoContext = createContext();
const UpdateExchangeInfoContext = createContext();

export const useExchangeInfoContext = () => {
    return useContext(ExchangeInfoContext);
};

export const useUpdateExchangeInfoContext = () => {
    return useContext(UpdateExchangeInfoContext);
};

export const useFetchExchangeInfo = () => {
    const setExchangeInfo = useUpdateExchangeInfoContext();
    const botDomain = useBotDomainContext();
    const logic = useCallback((successNotification = false, setIsFinished = undefined) => {
        setIsFinished && setIsFinished(false)
        fetchExchangeInfo(botDomain, setExchangeInfo, successNotification, setIsFinished);
    }, [setExchangeInfo, botDomain]);
    return logic;
};

export const BotExchangeInfoProvider = ({children}) => {
    const [exchangeInfo, setExchangeInfo] = useState();
    return (<ExchangeInfoContext.Provider value={exchangeInfo}>
        <UpdateExchangeInfoContext.Provider value={setExchangeInfo}> {children} </UpdateExchangeInfoContext.Provider>
    </ExchangeInfoContext.Provider>);
};
