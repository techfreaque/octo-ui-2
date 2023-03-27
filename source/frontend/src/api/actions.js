import createNotification from "../components/Notifications/Notification"
import {backendRoutes} from "../constants/backendConstants"
import {sendAndInterpretBotUpdate} from "./fetchAndStoreFromBot"

export async function startBacktesting(botDomain, backtestingSettings, setBotIsBacktesting) {
    const success = (updated_data, update_url, result, msg, status) => {
        setBotIsBacktesting(true)
        createNotification(msg, "success")
    }
    const failure = (updated_data, update_url, result, status, error) => {
        createNotification(result.responseText, "danger")
        // todo check if running
        setBotIsBacktesting(true)
    }
    sendAndInterpretBotUpdate(backtestingSettings, botDomain + backendRoutes.backtestingStart, success, failure)
}

export async function restartBot(botDomain, updateIsOnline, notification) {
    const success = (updated_data, update_url, result, msg, status) => {
        updateIsOnline(false)
        if (notification) createNotification("The bot is restarting...", "success");
    }
    const failure = (updated_data, update_url, result, status, error) => {
        if (notification) createNotification("Failed to restart bot", "danger",);
    }
    sendAndInterpretBotUpdate({}, botDomain + backendRoutes.restartBot, success, failure, "GET")
}

export async function logOutBot(botDomain, updateIsOnline, setIsloading, onLoggedOut) {
    setIsloading(true)
    const success = (updated_data, update_url, result, msg, status) => {
        updateIsOnline(false)
        createNotification("Logged out successfully", "success")
        setIsloading(false)
        onLoggedOut()
    }
    const failure = (updated_data, update_url, result, status, error) => {
        setIsloading(false)
        createNotification("Failed to log out from bot", "danger",)
    }
    sendAndInterpretBotUpdate({}, botDomain + backendRoutes.logoutBot, success, failure, "GET")
}

export async function stopBot(botDomain, updateIsOnline, setIsloading) {
    setIsloading(true)
    const success = (updated_data, update_url, result, msg, status) => {
        updateIsOnline(false)
        createNotification("The bot is stopping...", "success")
        setIsloading(false)
    }
    const failure = (updated_data, update_url, result, status, error) => {
        setIsloading(false)
        createNotification("Failed to restart bot", "danger",)
    }
    sendAndInterpretBotUpdate({}, botDomain + backendRoutes.stopBot, success, failure, "GET")
}

export async function updateBot(botDomain, updateIsOnline, setIsloading) {
    setIsloading(true)
    const success = (updated_data, update_url, result, msg, status) => {
        updateIsOnline(false)
        createNotification("The bot is updating...", "success")
        setIsloading(false)
    }
    const failure = (updated_data, update_url, result, status, error) => {
        setIsloading(false)
        createNotification("Failed to update bot", "danger",)
    }
    sendAndInterpretBotUpdate({}, botDomain + backendRoutes.updateBot, success, failure, "GET")
}

export async function startOptimizer(botDomain, optimizerRunSettings, optimizerSettingsForm, ids_by_exchange_name, setBotIsOptimizing) {
    const success = (updated_data, update_url, result, msg, status) => {
        setBotIsOptimizing(true)
        createNotification(msg, "success")
    }
    const failure = (updated_data, update_url, result, status, error) => {
        createNotification(result.responseText, "danger")
        // todo check if running
        setBotIsOptimizing(true)
    }
    sendAndInterpretBotUpdate({
        ...optimizerRunSettings,
        exchange_ids: optimizerRunSettings.exchange_names.map(exchangeName => (ids_by_exchange_name[exchangeName])),
        config: optimizerSettingsForm,

        // TODO remove when stock supports ids
        data_source: optimizerRunSettings.data_sources[0],
        exchange_id: ids_by_exchange_name[optimizerRunSettings.exchange_names[0]]
    }, botDomain + backendRoutes.optimizerStart, success, failure)
}

export async function addToOptimizerQueue(botDomain, optimizerRunSettings, optimizerSettingsForm, exchageId, setBotIsOptimizing, fetchOptimizerQueue) {
    const success = (updated_data, update_url, result, msg, status) => {
        fetchOptimizerQueue()
        createNotification(msg.message, "success")
    }
    const failure = (updated_data, update_url, result, status, error) => {
        createNotification(result.message, "danger")
    }
    sendAndInterpretBotUpdate({
        ...optimizerRunSettings,
        // exchange_id: exchageId,
        optimizer_config: optimizerSettingsForm
    }, botDomain + backendRoutes.optimizerAddToQueue, success, failure)
}

export async function stopBacktesting(botDomain, setBotIsBacktesting) {
    const success = (updated_data, update_url, result, msg, status) => {
        setBotIsBacktesting(false)
        createNotification(msg);
    }

    sendAndInterpretBotUpdate({}, botDomain + backendRoutes.backtestingStop, success)
}

export async function stopOptimizer(botDomain, setBotIsOptimizing) {
    const success = (updated_data, update_url, result, msg, status) => { // TODO check why streing
        setBotIsOptimizing("isStopping")
        createNotification(msg);
    }
    const failure = (updated_data, update_url, result, status, error) => {
        createNotification(result.responseText, "danger")
        // todo check if running
        setBotIsOptimizing(false)
    }
    sendAndInterpretBotUpdate({}, botDomain + backendRoutes.optimizerStop, success, failure)
}

export async function installAppPackage(appUrl, appName, botDomain, token) {
    const success = (updated_data, update_url, result, msg, status) => {
        createNotification("Successfully installed " + appName)
    }
    const fail = (updated_data, update_url, result, msg, status) => {
        createNotification("Failed to install " + appName, "danger")
    }

    const requestData = {
        [appUrl]: "register_and_install"
    }
    if (token) { // requestData.token = token
    }
    sendAndInterpretBotUpdate(requestData, botDomain + backendRoutes.installApp, success, fail)
}

export async function deleteTrades(botDomain, exchange_id) {
    const success = (updated_data, update_url, result, msg, status) => {
        createNotification("Successfully deleted trades")
    }
    const fail = (updated_data, update_url, result, msg, status) => {
        createNotification("Failed to delete trades", "danger")
    }
    sendAndInterpretBotUpdate({
        exchange_id: exchange_id
    }, botDomain + backendRoutes.cacheActionDeleteTrades, success, fail)
}

export async function resetPingPongStorage(botDomain) {
    const success = (updated_data, update_url, result, msg, status) => {
        createNotification("Successfully cleared daemons storage")
    }
    const fail = (updated_data, update_url, result, msg, status) => {
        createNotification("Failed to reset daemons storage", "danger")
    }
    sendAndInterpretBotUpdate({}, botDomain + backendRoutes.resetDaemons, success, fail, "GET")
}
export async function deleteCurrentCache(botDomain, exchange_id) {
    const success = (updated_data, update_url, result, msg, status) => {
        createNotification("Successfully deleted current trading mode cache")
    }
    const fail = (updated_data, update_url, result, msg, status) => {
        createNotification("Failed to delete current trading mode cache", "danger")
    }
    sendAndInterpretBotUpdate({
        exchange_id: exchange_id
    }, botDomain + backendRoutes.cacheActionDeleteCurrentCache, success, fail)
}
export async function deleteAllCache(botDomain, exchange_id) {
    const success = (updated_data, update_url, result, msg, status) => {
        createNotification("Successfully deleted all cached values")
    }
    const fail = (updated_data, update_url, result, msg, status) => {
        createNotification("Failed to delete all cached values", "danger")
    }
    sendAndInterpretBotUpdate({
        exchange_id: exchange_id
    }, botDomain + backendRoutes.cacheActionDeleteAllCache, success, fail)
}
export async function deleteOrders(botDomain, exchange_id) {
    const success = (updated_data, update_url, result, msg, status) => {
        createNotification("Successfully deleted trades")
    }
    const fail = (updated_data, update_url, result, msg, status) => {
        createNotification("Failed to delete trades", "danger")
    }
    sendAndInterpretBotUpdate({
        exchange_id: exchange_id
    }, botDomain + backendRoutes.cacheActionDeleteOrders, success, fail)
}

export async function cancelAllOrders(botDomain, setIsCancelling) {
    setIsCancelling(true)
    const success = (updated_data, update_url, result, msg, status) => {
        createNotification("Successfully canceled all orders")
        setIsCancelling(false)
    }
    const fail = (updated_data, update_url, result, msg, status) => {
        createNotification("Failed to cancel all orders", "danger")
        setIsCancelling(false)
    }
    sendAndInterpretBotUpdate({}, botDomain + backendRoutes.cancelAllOrders, success, fail, "GET")
}

export async function cancelOrder(botDomain, orderId, setIsCancelling) {
    setIsCancelling(true)
    const success = (updated_data, update_url, result, msg, status) => {
        createNotification("Successfully canceled order")
        setIsCancelling(false)
    }
    const fail = (updated_data, update_url, result, msg, status) => {
        createNotification("Failed to cancel order", "danger")
        setIsCancelling(false)
    }
    sendAndInterpretBotUpdate(orderId, botDomain + backendRoutes.cancelOrder, success, fail, "POST")
}

export async function updateProfileInfo(botDomain, newProfileInfo, onFail) {
    const success = (updated_data, update_url, result, msg, status) => {
        createNotification("Successfully updated profile info")
    }
    const fail = (updated_data, update_url, result, msg, status) => {
        onFail && onFail()
        createNotification("Failed to updated profile info", "danger")
    }
    await sendAndInterpretBotUpdate(newProfileInfo, botDomain + backendRoutes.updateProfileInfo, success, fail, "POST")
}

export async function duplicateProfile(botDomain, profileId, profileName, onSuccess, onFail) {
    const success = (updated_data, update_url, result, msg, status) => {
        onSuccess && onSuccess()
        createNotification(`Successfully duplicated ${profileName} profile`)
    }
    const fail = (updated_data, update_url, result, msg, status) => {
        onFail && onFail()
        createNotification(`Failed to duplicate ${profileName} profile`, "danger")
    }
    await sendAndInterpretBotUpdate({}, botDomain + backendRoutes.duplicateProfile + profileId, success, fail, "GET")
}

export async function exportProfile(botDomain, profileId, profileName, onSuccess, onFail) {
    const success = (updated_data, update_url, result, msg, status) => {
        onSuccess && onSuccess()
        createNotification(`Successfully exported ${profileName} profile`)
    }
    const fail = (updated_data, update_url, result, msg, status) => {
        onFail && onFail()
        createNotification(`Failed to export ${profileName} profile`, "danger")
    }
    await sendAndInterpretBotUpdate({}, botDomain + backendRoutes.exportProfile + profileId, success, fail, "GET")
}

export async function deleteProfile(botDomain, profileId, profileName, onSuccess, onFail) {
    const success = (updated_data, update_url, result, msg, status) => {
        onSuccess && onSuccess()
        createNotification(`Successfully deleted ${profileName} profile`)
    }
    const fail = (updated_data, update_url, result, msg, status) => {
        onFail && onFail()
        createNotification(`Failed to delete ${profileName} profile`, "danger")
    }
    await sendAndInterpretBotUpdate({
        id: profileId
    }, botDomain + backendRoutes.deleteProfile, success, fail, "POST")
}

export async function getAllOrders(botDomain, setIsLoading, setOrders) {
    setIsLoading(true)
    const success = (updated_data, update_url, result, msg, status) => {
        setOrders(msg)
        setIsLoading(false)
    }
    const fail = (updated_data, update_url, result, msg, status) => {
        createNotification("Failed to load all orders", "danger")
        setIsLoading(false)
    }
    sendAndInterpretBotUpdate({}, botDomain + backendRoutes.getAllOrders, success, fail, "GET")
}

export async function getAllTrades(botDomain, setIsLoading, setTrades) {
    setIsLoading(true)
    const success = (updated_data, update_url, result, msg, status) => {
        setTrades(msg)
        setIsLoading(false)
    }
    const fail = (updated_data, update_url, result, msg, status) => {
        createNotification("Failed to load all trades", "danger")
        setIsLoading(false)
    }
    sendAndInterpretBotUpdate({}, botDomain + backendRoutes.getAllTrades, success, fail, "GET")
}
export async function getAllPositions(botDomain, setIsLoading, setPositions) {
    setIsLoading(true)
    const success = (updated_data, update_url, result, msg, status) => {
        setPositions(msg)
        setIsLoading(false)
    }
    const fail = (updated_data, update_url, result, msg, status) => {
        createNotification("Failed to load positions", "danger")
        setIsLoading(false)
    }
    sendAndInterpretBotUpdate({}, botDomain + backendRoutes.getAllPositions, success, fail, "GET")
}

export async function closeAllPositions(botDomain, setIsClosing) {
    setIsClosing(true)
    const success = (updated_data, update_url, result, msg, status) => {
        createNotification("Successfully closed all positions")
        setIsClosing(false)
    }
    const fail = (updated_data, update_url, result, msg, status) => {
        createNotification("Failed to close all positions", "danger")
        setIsClosing(false)
    }
    sendAndInterpretBotUpdate({}, botDomain + backendRoutes.closeAllPositions, success, fail, "GET")
}

export async function closePosition(botDomain, symbol, side, setIsClosing) {
    setIsClosing(true)
    const success = (updated_data, update_url, result, msg, status) => {
        createNotification("Successfully closed position")
        setIsClosing(false)
    }
    const fail = (updated_data, update_url, result, msg, status) => {
        createNotification("Failed to close position", "danger")
        setIsClosing(false)
    }
    sendAndInterpretBotUpdate({
        symbol,
        side
    }, botDomain + backendRoutes.closePosition, success, fail, "POST")
}

export async function realTradingSwitch(botDomain, isRealTrading) {
    const title = isRealTrading ? "real" : "simulated"
    const success = (updated_data, update_url, result, msg, status) => {
        createNotification(`Successfully switched to ${title} trading`, "success", "OctoBot will restart now")
    }
    const fail = (updated_data, update_url, result, msg, status) => {
        createNotification(`Failed to switch to ${title} trading`, "danger")
    }
    sendAndInterpretBotUpdate({
        global_config: {
            trader_enabled: ! isRealTrading,
            trader_simulator_enabled: isRealTrading
        },
        restart_after_save: true
    }, botDomain + backendRoutes.config, success, fail)
}

export async function updateConfig(botDomain, newConfig, profileName, onFail) {
    const success = (updated_data, update_url, result, msg, status) => {
        createNotification(`Successfully updated ${profileName} config`, "success", newConfig.restart_after_save && "OctoBot will restart now")
    }
    const fail = (updated_data, update_url, result, msg, status) => {
        onFail && onFail()
        createNotification(`Failed to update ${profileName} config`, "danger")
    }
    await sendAndInterpretBotUpdate(newConfig, botDomain + backendRoutes.config, success, fail)
}

export async function resetTentaclesConfig(tentacles, botDomain, setIsResetting, fetchCurrentTentaclesConfig) {
    Promise.all(tentacles.forEach(tentacle => {
        const failure = (updated_data, update_url, result, msg, status) => {
            createNotification(`Failed to reset ${tentacle} config`, "danger", msg?.message)
        }
        const success = (updated_data, update_url, result, msg, status) => {
            if (status === "success") {
                createNotification(`Sucessfully resetted ${tentacle} config`)
            } else {
                failure(updated_data, update_url, result, msg, status)
            }
        }
        sendAndInterpretBotUpdate({}, `${
            botDomain + backendRoutes.resetTentaclesConfig
        }&name=${tentacle}`, success, failure, "POST")
    }))
    await fetchCurrentTentaclesConfig()
    setIsResetting(false)
}

export async function resetStorage(storage, botDomain, setIsResetting, reloadUiData) {
    const failure = (updated_data, update_url, result, msg, status) => {
        createNotification(`Failed to clear ${
            storage.title
        } storage`, "danger", msg?.message)
        setIsResetting(false)
    }
    const success = (updated_data, update_url, result, msg, status) => {
        if (status === "success") {
            createNotification(`Sucessfully cleared ${
                storage.title
            } storage`)
            setIsResetting(false)
        } else {
            failure(updated_data, update_url, result, msg, status)
        }
    }
    await sendAndInterpretBotUpdate({}, botDomain + storage.api, success, failure, "POST")
    reloadUiData()
}
