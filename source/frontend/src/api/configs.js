import {backendRoutes, botLayoutKey} from "../constants/backendConstants";
import {defaultBotTemplate} from "../constants/uiTemplate/defaultPages/allPages";
import fetchAndStoreFromBot, {sendAndInterpretBotUpdate} from "./fetchAndStoreFromBot";

export async function fetchBotConfigs(useSaveBotConfig, botDomain, configKeys) {
    await fetchAndStoreFromBot(botDomain + backendRoutes.botConfig + `?config_keys=${configKeys}`, useSaveBotConfig);
}

export async function fetchUIConfig(botDomain, saveUIConfig, exchangeNames) {
    const success = (updated_data, update_url, result, msg, status) => {
        if (exchangeNames) {
            msg.backtesting_run_settings.exchange_names = filterByEnabledExchanges(msg.backtesting_run_settings.exchange_names, exchangeNames)
            if (!msg.backtesting_run_settings.exchange_names.length) {
                msg.backtesting_run_settings.exchange_names = exchangeNames
            }
            msg.optimizer_run_settings.exchange_names = filterByEnabledExchanges(msg.optimizer_run_settings.exchange_names, exchangeNames)
            if (!msg.optimizer_run_settings.exchange_names.length) {
                msg.optimizer_run_settings.exchange_names = exchangeNames
            }
        }
        if (!msg ?. [botLayoutKey] ?. isCustom) {
            msg[botLayoutKey] = defaultBotTemplate
        }
        saveUIConfig(msg)
    }
    sendAndInterpretBotUpdate({}, botDomain + backendRoutes.uIConfig, success, undefined, "get")
}

export async function saveUIConfig(botDomain, newConfig, callbackSucces, callbackFail) {
    sendAndInterpretBotUpdate(newConfig, botDomain + backendRoutes.uIConfig, callbackSucces ? callbackSucces : () => {}, callbackFail)
}

export async function saveProConfig(botDomain, newConfig, callbackSucces, callbackFail) {
    sendAndInterpretBotUpdate(newConfig, botDomain + backendRoutes.proConfig, callbackSucces ? callbackSucces : () => {}, callbackFail)
}

function filterByEnabledExchanges(settingsExchanges, currentExchanges) {
    return settingsExchanges.filter(exchange => currentExchanges.includes(exchange))
}
