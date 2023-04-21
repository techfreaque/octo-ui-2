import React, {
    useState,
    useContext,
    createContext,
    useCallback,
    useEffect
} from "react";
import {fetchExchangeInfo, fetchServicesInfo} from "../../api/data";
import {useBotDomainContext} from "../config/BotDomainProvider";
import {useBotInfoContext} from "./BotInfoProvider";
import {updateConfig} from "../../api/actions";
import {parseSymbol} from "../../components/SymbolsUtil/SymbolsUtil";

const ExchangeInfoContext = createContext();
const UpdateExchangeInfoContext = createContext();
const UpdateToSaveCurrencySettingsContext = createContext();
const CurrenciesListsContext = createContext();
const PairSelectorMenuOpenContext = createContext();
const UpdatePairSelectorMenuOpenContext = createContext();

export const useExchangeInfoContext = () => {
    return useContext(ExchangeInfoContext);
};

const useUpdateToSaveCurrencySettings = () => {
    return useContext(UpdateToSaveCurrencySettingsContext);
};

export const usePairSelectorMenuOpenContext = () => {
    return useContext(PairSelectorMenuOpenContext);
};

export const useUpdatePairSelectorMenuOpenContext = () => {
    return useContext(UpdatePairSelectorMenuOpenContext);
};

export const useUpdateExchangeInfoContext = () => {
    return useContext(UpdateExchangeInfoContext);
};

export const useCurrenciesLists = () => {
    return useContext(CurrenciesListsContext);
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

export const useHandleProfileUpdate = () => {
    const botDomain = useBotDomainContext();
    const botInfo = useBotInfoContext();
    const currenciesLists = useCurrenciesLists()
    const exchangeInfo = useExchangeInfoContext();
    const currencySettings = botInfo?.current_profile?.config?.["crypto-currencies"]
    const logic = useCallback((restartAfterSave = false) => {
        const hasUnsavedChanges = JSON.stringify(currenciesLists.unsavedCurrencyList) !== JSON.stringify(currenciesLists.currentCurrencyList)
        handleProfileUpdate({
            hasUnsavedChanges,
            currentCurrencyList: currenciesLists.currentCurrencyList,
            unsavedCurrencyList: currenciesLists.unsavedCurrencyList,
            exchangeInfo,
            botDomain,
            currencySettings,
            restartAfterSave
        })
    }, [currenciesLists, exchangeInfo, botDomain, currencySettings]);
    return logic;
};

export const useHandleSettingChange = () => {
    const setToSaveCurrencySettings = useUpdateToSaveCurrencySettings()
    const logic = useCallback((enabled, exchange, symbol) => {
        setToSaveCurrencySettings(prevSettings => {
            const newSettings = {
                ...prevSettings
            }
            if (enabled) {
                newSettings[symbol] = {
                    enabled: true,
                    pairs: [symbol],
                    // currency: exchangeInfo ?. currency_name_info ?. [parseSymbol(symbol).base] ?. n
                }
            } else {
                delete newSettings[symbol]
            }
            return newSettings
        })
    }, [setToSaveCurrencySettings]);
    return logic;
};

export const BotExchangeInfoProvider = ({children}) => {
    const [exchangeInfo, setExchangeInfo] = useState();
    const [servicesInfo, setServicesInfo] = useState();
    const [menuIsOpen, setMenuIsOpen] = useState({open: false, wantsClose: false});
    const botInfo = useBotInfoContext();
    const currencySettings = botInfo?.current_profile?.config?.["crypto-currencies"]
    const [toSaveCurrencySettings, setToSaveCurrencySettings] = useState();
    const [currenciesLists, setCurrenciesLists] = useState();

    const {currencyList: currentCurrencyList, currencySettings: currentCurrencySettings} = convertSymbolSettingsToNewFormat(currencySettings, exchangeInfo)
    const {currencyList: unsavedCurrencyList} = convertSymbolSettingsToNewFormat(toSaveCurrencySettings, exchangeInfo)
    const currentCurrencySettingsJson = JSON.stringify(currentCurrencySettings)
    const currentCurrencyListJson = JSON.stringify(currentCurrencyList)
    const unsavedCurrencyListJson = JSON.stringify(unsavedCurrencyList)
    useEffect(() => {
        setToSaveCurrencySettings(JSON.parse(currentCurrencySettingsJson));
    }, [currentCurrencySettingsJson])
    useEffect(() => {
        setCurrenciesLists({currentCurrencyList: JSON.parse(currentCurrencyListJson), unsavedCurrencyList: JSON.parse(unsavedCurrencyListJson)})
    }, [currentCurrencyListJson, unsavedCurrencyListJson])

    return (
        <ExchangeInfoContext.Provider value={exchangeInfo}>
            <UpdateExchangeInfoContext.Provider value={setExchangeInfo}>
                <PairSelectorMenuOpenContext.Provider value={menuIsOpen}>
                    <UpdatePairSelectorMenuOpenContext.Provider value={setMenuIsOpen}>
                        <ServicesInfoContext.Provider value={servicesInfo}>
                            <UpdateServicesInfoContext.Provider value={setServicesInfo}>
                                <CurrenciesListsContext.Provider value={currenciesLists}>
                                    <UpdateToSaveCurrencySettingsContext.Provider value={setToSaveCurrencySettings}>
                                        {children} </UpdateToSaveCurrencySettingsContext.Provider>
                                </CurrenciesListsContext.Provider>
                            </UpdateServicesInfoContext.Provider>
                        </ServicesInfoContext.Provider>
                    </UpdatePairSelectorMenuOpenContext.Provider>
                </PairSelectorMenuOpenContext.Provider>
            </UpdateExchangeInfoContext.Provider>
        </ExchangeInfoContext.Provider>
    );
};

function handleProfileUpdate({
    hasUnsavedChanges,
    currentCurrencyList,
    unsavedCurrencyList,
    exchangeInfo,
    botDomain,
    currencySettings,
    restartAfterSave
}) {
    if (hasUnsavedChanges) {
        const configUpdate = {
            'global_config': {},
            removed_elements: [],
            'restart_after_save': restartAfterSave
        }
        new Set([
            ...currentCurrencyList,
            ...unsavedCurrencyList
        ]).forEach(symbol => {
            if (currentCurrencyList.includes(symbol) && !unsavedCurrencyList.includes(symbol)) {
                let pairKey
                if (currencySettings?.[symbol]) {
                    pairKey = symbol
                } else {
                    const currencyName = exchangeInfo?.currency_name_info?.[parseSymbol(symbol).base]?.n
                    if (currencySettings[currencyName]?.pairs?.includes(symbol)) {
                        pairKey = currencyName
                    } else {
                        for (const currency in currencySettings) {
                            if (currencySettings[currency].pairs?.includes(symbol)) {
                                pairKey = currency
                                break
                            }
                        }
                    }
                };
                pairKey && ! configUpdate['removed_elements'].includes(`crypto-currencies_${pairKey}`) && configUpdate['removed_elements'].push(`crypto-currencies_${pairKey}`)
            } else if (!currentCurrencyList.includes(symbol) && unsavedCurrencyList.includes(symbol)) {
                configUpdate['global_config'][`crypto-currencies_${symbol}_pairs`] = [symbol]
                configUpdate['global_config'][`crypto-currencies_${symbol}_enabled`] = true
            }
        })
        function onFail() { // setIsloading(false)
        }
        updateConfig(botDomain, configUpdate, "current profile", onFail)
    }
}

function convertSymbolSettingsToNewFormat(originalCurrencySettings, exchangeInfo) {
    const currencyList = []
    const currencySettings = {}
    originalCurrencySettings && Object.keys(originalCurrencySettings).forEach(currency => {
        if (originalCurrencySettings[currency]?.enabled !== false) {
            originalCurrencySettings[currency]?.pairs?.forEach(pair => {
                currencyList.push(pair)
                currencySettings[pair] = {
                    enabled: true,
                    pairs: [pair],
                    currency: exchangeInfo?.currency_name_info?.[parseSymbol(pair).base]?.n
                }
            })
        }
    })
    return {
        currencyList: currencyList?.sort(
            (a, b) => a?.localeCompare(b)
        ),
        currencySettings
    }
}
