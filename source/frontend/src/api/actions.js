import createNotification from "../components/Notifications/Notification"
import { backendRoutes } from "../constants/backendConstants"
import { sendAndInterpretBotUpdate } from "./fetchAndStoreFromBot"

export async function startBacktesting(botDomain, backtestingSettings, exchageId, setBotIsBacktesting) {
  const success = (updated_data, update_url, result, msg, status) => {
    setBotIsBacktesting(true)
    createNotification(msg, "success")
  }
  const failure = (updated_data, update_url, result, status, error) => {
    createNotification(result.responseText, "danger")
    // todo check if running
    setBotIsBacktesting(true)
  }
  sendAndInterpretBotUpdate(
    { ...backtestingSettings, exchange_id: exchageId },
    botDomain + backendRoutes.backtestingStart,
    success, failure
  )
}

export async function restartBot(botDomain, updateIsOnline, setIsloading) {
  setIsloading(true)
  const success = (updated_data, update_url, result, msg, status) => {
    updateIsOnline(false)
    createNotification("The bot is restarting...", "success")
    setIsloading(false)
  }
  const failure = (updated_data, update_url, result, status, error) => {
    setIsloading(false)
    createNotification("Failed to restart bot", "danger",)

  }
  sendAndInterpretBotUpdate(
    {},
    botDomain + backendRoutes.restartBot,
    success, failure, "GET"
  )
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
  sendAndInterpretBotUpdate(
    {},
    botDomain + backendRoutes.stopBot,
    success, failure, "GET"
  )
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
  sendAndInterpretBotUpdate(
    {},
    botDomain + backendRoutes.updateBot,
    success, failure, "GET"
  )
}

export async function startOptimizer(botDomain, optimizerRunSettings, optimizerSettingsForm, exchageId, setBotIsOptimizing) {
  const success = (updated_data, update_url, result, msg, status) => {
    setBotIsOptimizing(true)
    createNotification(msg, "success")
  }
  const failure = (updated_data, update_url, result, status, error) => {
    createNotification(result.responseText, "danger")
    // todo check if running
    setBotIsOptimizing(true)
  }
  sendAndInterpretBotUpdate(
    { ...optimizerRunSettings, exchange_id: exchageId, config: optimizerSettingsForm },
    botDomain + backendRoutes.optimizerStart,
    success, failure
  )
}

export async function addToOptimizerQueue(botDomain, optimizerRunSettings, optimizerSettingsForm, exchageId, setBotIsOptimizing) {
  const success = (updated_data, update_url, result, msg, status) => {
    createNotification(msg, "success")
  }
  const failure = (updated_data, update_url, result, status, error) => {
    createNotification(result.responseText, "danger")
  }
  sendAndInterpretBotUpdate(
    { ...optimizerRunSettings, exchange_id: exchageId, config: optimizerSettingsForm },
    botDomain + backendRoutes.optimizerAddToQueue,
    success, failure
  )
}

export async function stopBacktesting(botDomain, setBotIsBacktesting) {
  const success = (updated_data, update_url, result, msg, status) => {
    setBotIsBacktesting(false)
    createNotification(msg);
  }

  sendAndInterpretBotUpdate({}, botDomain + backendRoutes.backtestingStop, success)
}

export async function stopOptimizer(botDomain, setBotIsOptimizing) {
  const success = (updated_data, update_url, result, msg, status) => {
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

export async function installAppPackage(appUrl, appName, botDomain) {
  const success = (updated_data, update_url, result, msg, status) => {
    createNotification("Successfully installed " + appName)
  }
  const fail = (updated_data, update_url, result, msg, status) => {
    createNotification("Failed to install " + appName, "danger")
  }
  sendAndInterpretBotUpdate(
    { [appUrl]: "register_and_install" },
    botDomain + backendRoutes.installApp, success, fail)
}

export async function deleteTrades(botDomain, exchange_id) {
  const success = (updated_data, update_url, result, msg, status) => {
    createNotification("Successfully deleted trades")
  }
  const fail = (updated_data, update_url, result, msg, status) => {
    createNotification("Failed to delete trades", "danger")
  }
  sendAndInterpretBotUpdate(
    { exchange_id: exchange_id },
    botDomain + backendRoutes.cacheActionDeleteTrades, success, fail)
}
export async function deleteCurrentCache(botDomain, exchange_id) {
  const success = (updated_data, update_url, result, msg, status) => {
    createNotification("Successfully deleted current trading mode cache")
  }
  const fail = (updated_data, update_url, result, msg, status) => {
    createNotification("Failed to delete current trading mode cache", "danger")
  }
  sendAndInterpretBotUpdate(
    { exchange_id: exchange_id },
    botDomain + backendRoutes.cacheActionDeleteCurrentCache, success, fail)
}
export async function deleteAllCache(botDomain, exchange_id) {
  const success = (updated_data, update_url, result, msg, status) => {
    createNotification("Successfully deleted all cached values")
  }
  const fail = (updated_data, update_url, result, msg, status) => {
    createNotification("Failed to delete all cached values", "danger")
  }
  sendAndInterpretBotUpdate(
    { exchange_id: exchange_id },
    botDomain + backendRoutes.cacheActionDeleteAllCache, success, fail)
}
export async function deleteOrders(botDomain, exchange_id) {
  const success = (updated_data, update_url, result, msg, status) => {
    createNotification("Successfully deleted trades")
  }
  const fail = (updated_data, update_url, result, msg, status) => {
    createNotification("Failed to delete trades", "danger")
  }
  sendAndInterpretBotUpdate(
    { exchange_id: exchange_id },
    botDomain + backendRoutes.cacheActionDeleteOrders, success, fail)
}
export async function realTradingSwitch(botDomain, isRealTrading) {
  const title = isRealTrading ? "real" : "simulated"
  const success = (updated_data, update_url, result, msg, status) => {
    createNotification(`Successfully switched to ${title} trading`, "success", "OctoBot will restart now")
  }
  const fail = (updated_data, update_url, result, msg, status) => {
    createNotification(`Failed to switch to ${title} trading`, "danger")
  }
  sendAndInterpretBotUpdate(
    { global_config: { trader_enabled: !isRealTrading, trader_simulator_enabled: isRealTrading }, restart_after_save: true },
    botDomain + backendRoutes.config, success, fail)
}


