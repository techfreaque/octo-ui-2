import React, {
    useState,
    useContext,
    createContext,
    useCallback,
    useEffect
} from "react";
import {fetchExchangeInfo} from "../../api/data";
import {useBotDomainContext} from "../config/BotDomainProvider";
import {useBotInfoContext} from "./BotInfoProvider";
import {updateConfig} from "../../api/actions";
import {parseSymbol} from "../../components/SymbolsUtil/SymbolsUtil";
import {backendRoutes} from "../../constants/backendConstants";
import fetchAndStoreFromBot from "../../api/fetchAndStoreFromBot";

const ExchangeInfoContext = createContext();
const UpdateExchangeInfoContext = createContext();
const UpdateToSaveCurrencySettingsContext = createContext();
const CurrentCurrencyListContext = createContext();
const UnsavedCurrencyListContext = createContext();
const PairSelectorMenuOpenContext = createContext();
const UpdatePairSelectorMenuOpenContext = createContext();
const NewConfigExchangesContext = createContext();
const UpdateNewConfigExchangesContext = createContext();

export const useExchangeInfoContext = () => {
    return useContext(ExchangeInfoContext);
};

const useUpdateToSaveCurrencySettings = () => {
    return useContext(UpdateToSaveCurrencySettingsContext);
};

export const useNewConfigExchangesContext = () => {
    return useContext(NewConfigExchangesContext);
};

export const useUpdateNewConfigExchangesContext = () => {
    return useContext(UpdateNewConfigExchangesContext);
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

export const useCurrentCurrencyListContext = () => {
    return useContext(CurrentCurrencyListContext);
};

export const useUnsavedCurrencyListContext = () => {
    return useContext(UnsavedCurrencyListContext);
};

const ServicesInfoContext = createContext();
const UpdateServicesInfoContext = createContext();
const ExchangeConfigUpdateContext = createContext();
const UpdateExchangeConfigUpdateContext = createContext();

export const useServicesInfoContext = () => {
    return useContext(ServicesInfoContext);
};

export const useUpdateServicesInfoContext = () => {
    return useContext(UpdateServicesInfoContext);
};
export const useExchangeConfigUpdateContext = () => {
    return useContext(ExchangeConfigUpdateContext);
};

export const useUpdateExchangeConfigUpdateContext = () => {
    return useContext(UpdateExchangeConfigUpdateContext);
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

export const useFetchExchangesList = () => {
    const setServicesInfo = useUpdateServicesInfoContext();
    const botDomain = useBotDomainContext();
    const logic = useCallback((successNotification = false, setIsFinished = undefined) => {
        setIsFinished ?. (false)
        fetchAndStoreFromBot(botDomain + backendRoutes.exchangesList, setServicesInfo, "get", {}, successNotification, false, setIsFinished);

    }, [setServicesInfo, botDomain]);
    return logic;
};

export const useHandleProfileUpdate = () => {
    const botDomain = useBotDomainContext();
    const botInfo = useBotInfoContext();
    const currentCurrencyList = useCurrentCurrencyListContext()
    const unsavedCurrencyList = useUnsavedCurrencyListContext()
    const exchangeInfo = useExchangeInfoContext();
    const currencySettings = botInfo ?. current_profile ?. config ?. ["crypto-currencies"]
    const exchangeConfigUpdate = useExchangeConfigUpdateContext()

    const logic = useCallback((restartAfterSave = false) => {
        handleProfileUpdate({
            currentCurrencyList,
            unsavedCurrencyList,
            exchangeConfigUpdate,
            exchangeInfo,
            botDomain,
            currencySettings,
            restartAfterSave
        })
    }, [
        currentCurrencyList,
        unsavedCurrencyList,
        exchangeConfigUpdate,
        exchangeInfo,
        botDomain,
        currencySettings
    ]);
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


export const useHandleExchangeSettingChange = () => {
    const setNewConfigExchanges = useUpdateNewConfigExchangesContext()
    const setExchangeConfigUpdate = useUpdateExchangeConfigUpdateContext()
    const logic = useCallback((exchangeName, inputName, newSetting) => {
        setNewConfigExchanges(prevExchanges => {
            const newExchanges = {
                ...prevExchanges
            }
            if (! newExchanges ?. [exchangeName]) {
                newExchanges[exchangeName] = {}
            }
            newExchanges[exchangeName][inputName] = newSetting
            return newExchanges
        })
        setExchangeConfigUpdate(prevSettings => {
            const newSettings = {
                ...prevSettings
            }
            newSettings.global_config[`exchanges_${exchangeName}_${inputName}`] = newSetting
            return newSettings
        })
    }, [setExchangeConfigUpdate, setNewConfigExchanges]);
    return logic;
};

export const BotExchangeInfoProvider = ({children}) => {
    const [exchangeInfo, setExchangeInfo] = useState();
    const [servicesInfo, setServicesInfo] = useState();
    const [menuIsOpen, setMenuIsOpen] = useState({open: false, wantsClose: false});
    const botInfo = useBotInfoContext();
    const currencySettings = botInfo ?. current_profile ?. config ?. ["crypto-currencies"]
    const [toSaveCurrencySettings, setToSaveCurrencySettings] = useState();
    const [currentCurrencyList, setCurrentCurrencyList] = useState();
    const [unsavedCurrencyList, setUnsavedCurrencyList] = useState();
    const [exchangeConfigUpdate, setExchangeConfigUpdate] = useState({global_config: {}, removed_elements: []})
    const [newConfigExchanges, setNewConfigExchanges] = useState({})

    useEffect(() => {
        const {currencySettings: currentCurrencySettings} = convertSymbolSettingsToNewFormat(currencySettings, exchangeInfo)
        const currentCurrencySettingsJson = JSON.stringify(currentCurrencySettings)
        setToSaveCurrencySettings(JSON.parse(currentCurrencySettingsJson));
    }, [currencySettings, exchangeInfo])
    useEffect(() => {
        const {currencyList: _currentCurrencyList} = convertSymbolSettingsToNewFormat(currencySettings, exchangeInfo)
        const {currencyList: _unsavedCurrencyList} = convertSymbolSettingsToNewFormat(toSaveCurrencySettings, exchangeInfo)
        const currentCurrencyListJson = JSON.stringify(_currentCurrencyList)
        const unsavedCurrencyListJson = JSON.stringify(_unsavedCurrencyList)
        setUnsavedCurrencyList(JSON.parse(unsavedCurrencyListJson))
        setCurrentCurrencyList(JSON.parse(currentCurrencyListJson))
    }, [currencySettings, exchangeInfo, toSaveCurrencySettings])

    const configExchanges = servicesInfo ?. exchanges ? Object.keys(servicesInfo.exchanges) : []
    useEffect(() => {
        setExchangeConfigUpdate({global_config: {}, removed_elements: []})
        setNewConfigExchanges({})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(configExchanges)])

    return (
        <ExchangeInfoContext.Provider value={exchangeInfo}>
            <UpdateExchangeInfoContext.Provider value={setExchangeInfo}>
                <PairSelectorMenuOpenContext.Provider value={menuIsOpen}>
                    <UpdatePairSelectorMenuOpenContext.Provider value={setMenuIsOpen}>
                        <ServicesInfoContext.Provider value={servicesInfo}>
                            <UpdateServicesInfoContext.Provider value={setServicesInfo}>
                                <NewConfigExchangesContext.Provider value={newConfigExchanges}>
                                    <UpdateNewConfigExchangesContext.Provider value={setNewConfigExchanges}>
                                        <ExchangeConfigUpdateContext.Provider value={exchangeConfigUpdate}>
                                            <UpdateExchangeConfigUpdateContext.Provider value={setExchangeConfigUpdate}>
                                                <CurrentCurrencyListContext.Provider value={currentCurrencyList}>
                                                    <UnsavedCurrencyListContext.Provider value={unsavedCurrencyList}>
                                                        <UpdateToSaveCurrencySettingsContext.Provider value={setToSaveCurrencySettings}>
                                                            {children} </UpdateToSaveCurrencySettingsContext.Provider>
                                                    </UnsavedCurrencyListContext.Provider>
                                                </CurrentCurrencyListContext.Provider>
                                            </UpdateExchangeConfigUpdateContext.Provider>
                                        </ExchangeConfigUpdateContext.Provider>
                                    </UpdateNewConfigExchangesContext.Provider>
                                </NewConfigExchangesContext.Provider>
                            </UpdateServicesInfoContext.Provider>
                        </ServicesInfoContext.Provider>
                    </UpdatePairSelectorMenuOpenContext.Provider>
                </PairSelectorMenuOpenContext.Provider>
            </UpdateExchangeInfoContext.Provider>
        </ExchangeInfoContext.Provider>
    );
};

function handleProfileUpdate({
    currentCurrencyList,
    unsavedCurrencyList,
    exchangeInfo,
    botDomain,
    currencySettings,
    restartAfterSave,
    exchangeConfigUpdate

}) {
    const hasUnsavedChanges = JSON.stringify(unsavedCurrencyList) !== JSON.stringify(currentCurrencyList)
    const exchangeConfigUpdateHasChanged = Boolean(exchangeConfigUpdate.global_config && Object.keys(exchangeConfigUpdate.global_config).length)
    const configUpdate = {
        ...exchangeConfigUpdate,
        'restart_after_save': restartAfterSave
    }
    if (hasUnsavedChanges) {
        getProfileCurrencyUpdate({
            configUpdate,
            currentCurrencyList,
            currencySettings,
            unsavedCurrencyList,
            exchangeInfo
        })
    }
    if (exchangeConfigUpdateHasChanged || hasUnsavedChanges) {

        function onFail() { // setIsloading(false)
        }
        updateConfig(botDomain, configUpdate, "current profile", onFail)
    }
}

export function getProfileCurrencyUpdate({
    configUpdate,
    currentCurrencyList,
    currencySettings,
    unsavedCurrencyList,
    exchangeInfo
}) {
    new Set([
        ...currentCurrencyList,
        ...unsavedCurrencyList
    ]).forEach(symbol => {
        if (currentCurrencyList.includes(symbol) && !unsavedCurrencyList.includes(symbol)) {
            let pairKey
            if (currencySettings ?. [symbol]) {
                pairKey = symbol
            } else {
                const currencyName = exchangeInfo ?. currency_name_info ?. [parseSymbol(symbol).base] ?. n
                if (currencySettings[currencyName] ?. pairs ?. includes(symbol)) {
                    pairKey = currencyName
                } else {
                    for (const currency in currencySettings) {
                        if (currencySettings[currency].pairs ?. includes(symbol)) {
                            pairKey = currency
                            break
                        }
                    }
                }
            };
            pairKey && !configUpdate['removed_elements'].includes(`crypto-currencies_${pairKey}`) && configUpdate['removed_elements'].push(`crypto-currencies_${pairKey}`)
        } else if (!currentCurrencyList.includes(symbol) && unsavedCurrencyList.includes(symbol)) {
            configUpdate['global_config'][`crypto-currencies_${symbol}_pairs`] = [symbol]
            configUpdate['global_config'][`crypto-currencies_${symbol}_enabled`] = true
        }
    })
}

function convertSymbolSettingsToNewFormat(originalCurrencySettings, exchangeInfo) {
    const currencyList = []
    const currencySettings = {}
    originalCurrencySettings && Object.keys(originalCurrencySettings).forEach(currency => {
        if (originalCurrencySettings[currency] ?. enabled !== false) {
            originalCurrencySettings[currency] ?. pairs ?. forEach(pair => {
                currencyList.push(pair)
                currencySettings[pair] = {
                    enabled: true,
                    pairs: [pair],
                    currency: exchangeInfo ?. currency_name_info ?. [parseSymbol(pair).base] ?. n
                }
            })
        }
    })
    return {
        currencyList: currencyList ?. sort(
            (a, b) => a ?. localeCompare(b)
        ),
        currencySettings
    }
}
