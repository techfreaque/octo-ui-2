import React, {useState, useContext, createContext, useCallback} from "react";
import {fetchExchangeInfo, fetchServicesInfo} from "../../api/data";
import {useBotDomainContext} from "../config/BotDomainProvider";


const ExchangeInfoContext = createContext();
const UpdateExchangeInfoContext = createContext();

export const useExchangeInfoContext = () => {
    return useContext(ExchangeInfoContext);
};

export const useUpdateExchangeInfoContext = () => {
    return useContext(UpdateExchangeInfoContext);
};

const ServicesInfoContext = createContext();
const UpdateServicesInfoContext = createContext();

export const useServicesInfoContext = () => {
    return useContext(ServicesInfoContext);
};

export const useUpdateServicesInfoContext = () => {
    return useContext(UpdateServicesInfoContext);
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

export const useFetchServicesInfo = () => {
    const setServicesInfo = useUpdateServicesInfoContext();
    const botDomain = useBotDomainContext();
    const logic = useCallback((successNotification = false, setIsFinished = undefined) => {
        setIsFinished && setIsFinished(false)
        fetchServicesInfo(botDomain, setServicesInfo, successNotification, setIsFinished);
    }, [setServicesInfo, botDomain]);
    return logic;
};

export const BotExchangeInfoProvider = ({children}) => {
    const [exchangeInfo, setExchangeInfo] = useState();
    const [servicesInfo, setServicesInfo] = useState();
    return (<ExchangeInfoContext.Provider value={exchangeInfo}>
        <UpdateExchangeInfoContext.Provider value={setExchangeInfo}>
            <ServicesInfoContext.Provider value={servicesInfo}>
                <UpdateServicesInfoContext.Provider value={setServicesInfo}> {children} </UpdateServicesInfoContext.Provider>
            </ServicesInfoContext.Provider>
        </UpdateExchangeInfoContext.Provider>
    </ExchangeInfoContext.Provider>);
};
