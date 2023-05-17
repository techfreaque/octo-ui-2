import createNotification from "../components/Notifications/Notification";
import {backendRoutes} from "../constants/backendConstants";
import fetchAndStoreFromBot, {fetchAndGetFromBot, sendAndInterpretBotUpdate, sendFile} from "./fetchAndStoreFromBot";

export async function fetchBotInfo(botDomain, setBotInfo, visibleExchanges, successNotification = false, setIsFinished = undefined) {
    await fetchAndStoreFromBot(botDomain + backendRoutes.botInfo + "/" + visibleExchanges, setBotInfo, "get", {}, successNotification, false, setIsFinished);
}

export async function fetchExchangeInfo(botDomain, setExchangeInfo, successNotification = false, setIsFinished = undefined) {
    await fetchAndStoreFromBot(botDomain + backendRoutes.exchangeInfo, setExchangeInfo, "get", {}, successNotification, false, setIsFinished);
}
export async function fetchServicesInfo(botDomain, setServicesInfo, successNotification = false, setIsFinished = undefined) {
    await fetchAndStoreFromBot(botDomain + backendRoutes.servicesInfo, setServicesInfo, "get", {}, successNotification, false, setIsFinished);
}

export async function getCurrencyLogos(botDomain, currencyIds, setCurrencyLogos) {
    await fetchAndStoreFromBot(botDomain + backendRoutes.currencyLogos, setCurrencyLogos, "post", {currency_ids: currencyIds});
}

export async function fetchPlotData(setBotPlotData, exchange_id, symbol, time_frame, botDomain) {
    await fetchAndStoreFromBot(botDomain + backendRoutes.plottedData, setBotPlotData, "post", {exchange_id, symbol, time_frame});
}

export async function fetchPlotlyPlotData(symbol, timeFrame, exchange_id, exchange_name, botDomain, setBotPlottedElements, botInfo, setHiddenMetadataFromInputs, isLive = true, optimization_campaign = undefined, backtesting_id = undefined, optimizer_id = undefined) {
    const data = {
        exchange_id,
        symbol,
        time_frame: timeFrame,
        exchange: exchange_name
    }
    if (isLive) {
        data.live_id = botInfo.live_id
        data.campaign_name = botInfo.optimization_campaign
    } else {
        data.campaign_name = optimization_campaign
        data.backtesting_id = backtesting_id
        data.optimizer_id = optimizer_id

    }
    const success = (updated_data, update_url, _undefined, msg, status) => {
        setBotPlottedElements(prevData => {
            const newData = {
                ...prevData
            }
            if (isLive) {
                // msg?.data?.data?.sub_elements?.forEach(sub_data => {
                // if (sub_data.type === "input") {
                //     newData.inputs = sub_data.data.elements
                //     setHiddenMetadataFromInputs(sub_data.data.elements)
                // }
                // })
                newData.live = {
                    [botInfo.live_id]: {
                        [symbol]: {
                            [timeFrame]: msg ?. data
                        }
                    }
                }
            } else if (! newData.backtesting) {
                newData.backtesting = {
                    [optimization_campaign]: {
                        [optimizer_id]: {
                            [backtesting_id]: {
                                [symbol]: {
                                    [timeFrame]: msg ?. data
                                }
                            }
                        }
                    }
                }
            } else if (! newData.backtesting[optimization_campaign]) {
                newData.backtesting[optimization_campaign] = {
                    [optimizer_id]: {
                        [backtesting_id]: {
                            [symbol]: {
                                [timeFrame]: msg ?. data
                            }
                        }
                    }
                }
            } else if (! newData.backtesting[optimization_campaign][optimizer_id]) {
                newData.backtesting[optimization_campaign][optimizer_id] = {
                    [backtesting_id]: {
                        [symbol]: {
                            [timeFrame]: msg ?. data
                        }
                    }
                }
            } else {
                newData.backtesting[optimization_campaign][optimizer_id][backtesting_id] = {
                    [symbol]: {
                        [timeFrame]: msg ?. data
                    }
                }
            }
            return newData
        })
    }
    const _failed = () => {
        createNotification("Failed to load chart data", "danger", `The data for ${exchange_name} - ${symbol} - ${timeFrame} is not available`);
    }
    fetchAndGetFromBot(botDomain + backendRoutes.plottedRunData, "post", data, success, _failed,)
}

export async function fetchBacktestingRunData(saveBotConfig, setUiConfig, botDomain, forceSelectLatestBacktesting, campaigns) {

    const success = (updated_data, update_url, result, msg, status) => {
        saveBotConfig(msg.data)
        setUiConfig(prevConfig => {
            return {
                ...prevConfig,
                optimizer_campaigns_to_load: msg.data.campaigns
            }
        })
    }
    sendAndInterpretBotUpdate({
        forceSelectLatestBacktesting,
        campaigns
    }, botDomain + backendRoutes.backtestingRunData, success, undefined, "post")
}

export async function fetchLiveRunData(liveId, setLiveRunData, botDomain,) {

    const success = (updated_data, update_url, result, msg, status) => {
        setLiveRunData(msg.data)
    }
    sendAndInterpretBotUpdate({
        live_id: liveId
    }, botDomain + backendRoutes.liveRunData, success, undefined, "post")
}

export async function fetchBotPortfolio(setBotPortfolio, botDomain) {
    await fetchAndStoreFromBot(botDomain + backendRoutes.botPortfolio, setBotPortfolio);
}
export async function fetchSymbolsInfo(setSymbolsInfo, botDomain) {
    return await fetchAndStoreFromBot(botDomain + backendRoutes.symbolsInfo, setSymbolsInfo, "GET", {}, false, false, undefined, false);
}

export async function fetchAppStoreData(saveAppStoreData, storeDomain, installedTentaclesInfo, notification, appStoreUser) {
    function onSuccess(updated_data, update_url, result, msg, status) {
        saveAppStoreData(msg ?. data)
        notification && createNotification("Successfully fetched package manager repositories")
    }
    function onFail(updated_data, update_url, result, msg, status) {
        notification && createNotification("Failed to fetch package manager repositories")
        // TODO add fallback
    }
    await sendAndInterpretBotUpdate(installedTentaclesInfo, storeDomain + backendRoutes.appStoreFree, onSuccess, onFail, "POST", true, appStoreUser ?. token)
}

export async function fetchPackagesData(saveAppStoreData, botDomain, notification) {
    await fetchAndStoreFromBot(botDomain + backendRoutes.packagesData, saveAppStoreData, "get", {}, false, false, undefined, notification);
}

export async function loginToAppStore(updateAppStoreUser, storeDomain, loginData, appStoreUser, onLoggedIn) {
    function onFail(updated_data, update_url, result, msg, status) {
        createNotification("Failed to log in to App Store", "danger", "Check your password or email")
        updateAppStoreUser(msg.data);
    }
    function onSucces(updated_data, update_url, result, msg, status, request) {
        if (msg.success) {
            createNotification("Successfully logged in to App Store")
            onLoggedIn(true)
            // document.cookie = `storeToken=${msg.access_token}; expires=Sun, 1 Jan 2023 00:00:00 UTC; path=${storeDomain}`
            updateAppStoreUser(msg.access_tokens);
        } else {
            onFail(updated_data, update_url, result, msg, status)
        }
    }
    sendAndInterpretBotUpdate(loginData, storeDomain + backendRoutes.appStoreLogin, onSucces, onFail, "POST", true, appStoreUser ?. token)
}

export async function logoutFromAppStore(saveAppStoreData, storeDomain, appStoreUser) {
    function onFail(updated_data, update_url, result, msg, status) {
        createNotification("Failed to log out from App Store", "danger")
        saveAppStoreData({});
    }
    function onSucces(updated_data, update_url, result, msg, status, request) {
        if (msg.success) { 
            saveAppStoreData({})
            createNotification("Successfully logged out from App Store")
        } else {
            onFail(updated_data, update_url, result, msg, status)
        }
    }
    if (appStoreUser ?. token) {
        sendAndInterpretBotUpdate({}, storeDomain + backendRoutes.appStoreLogout, onSucces, onFail, "POST", true, appStoreUser.token)
    } else {
        createNotification("You are already logged out", "warning")
        saveAppStoreData({})
    }
}

export async function signupToAppStore(saveAppStoreData, storeDomain, loginData, onLoggedIn) {
    function onFail(updated_data, update_url, result, msg, status) {
        createNotification("Failed to sign up to the App Store", "danger", "Check your password or email")
        onLoggedIn(true)
        saveAppStoreData(msg.data);
    }
    function onSucces(updated_data, update_url, result, msg, status) {
        if (msg.success) {
            createNotification("Successfully signed up to App Store", "success", "You can now log in to the App Store")
            saveAppStoreData(msg.data);
        } else {
            onFail(updated_data, update_url, result, msg, status)
        }
    }
    sendAndInterpretBotUpdate(loginData, storeDomain + backendRoutes.appStoreSignup, onSucces, onFail, "POST")
}

export async function fetchBotLogs(saveLogs, botDomain) {
    await fetchAndStoreFromBot(botDomain + backendRoutes.getLogs, saveLogs);
}
