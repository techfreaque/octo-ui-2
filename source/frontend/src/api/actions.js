import createNotification from "../components/Notifications/Notification"
import { backendRoutes } from "../constants/backendConstants"
import { sendAndInterpretBotUpdate } from "./fetchAndStoreFromBot"

export async function startBacktesting(botDomain, backtestingSettings, ids_by_exchange_name, setBotIsBacktesting) {
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
    {
      ...backtestingSettings,
      exchange_ids: backtestingSettings.exchange_names.map(exchangeName => (
        ids_by_exchange_name[exchangeName])
      ),

      // TODO remove when stock supports ids
      data_source: backtestingSettings.data_sources[0],
      exchange_id: ids_by_exchange_name[backtestingSettings.exchange_names[0]],
    },
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
  sendAndInterpretBotUpdate(
    {
      ...optimizerRunSettings,
      exchange_ids: optimizerRunSettings.exchange_names.map(exchangeName => (
        ids_by_exchange_name[exchangeName])
      ),
      config: optimizerSettingsForm,

      // TODO remove when stock supports ids
      data_source: optimizerRunSettings.data_sources[0],
      exchange_id: ids_by_exchange_name[optimizerRunSettings.exchange_names[0]],
    },
    botDomain + backendRoutes.optimizerStart,
    success, failure
  )
}

export async function addToOptimizerQueue(botDomain, optimizerRunSettings, optimizerSettingsForm, exchageId, setBotIsOptimizing, fetchOptimizerQueue) {
  const success = (updated_data, update_url, result, msg, status) => {
    fetchOptimizerQueue()
    createNotification(msg.message, "success")
  }
  const failure = (updated_data, update_url, result, status, error) => {
    createNotification(result.message, "danger")
  }
  sendAndInterpretBotUpdate(
    {
      ...optimizerRunSettings,
      // exchange_id: exchageId,
      optimizer_config: optimizerSettingsForm
    },
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
  sendAndInterpretBotUpdate(
    {},
    botDomain + backendRoutes.cancelAll_orders, success, fail, "GET")
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
  sendAndInterpretBotUpdate(
    {},
    botDomain + backendRoutes.closeAllPositions, success, fail, "GET")
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


