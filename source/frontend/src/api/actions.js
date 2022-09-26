import createNotification from "../components/Notifications/Notification"
import { backendRoutes } from "../constants/backendConstants"
import { getOptimizerSettingsValues } from "../widgets/AppWidgets/Configuration/OptimizerConfigForm/OptimizerConfigForm"
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
  sendAndInterpretBotUpdate(
    { [appUrl]: "register_and_install" },
    botDomain + backendRoutes.installApp, success)
}