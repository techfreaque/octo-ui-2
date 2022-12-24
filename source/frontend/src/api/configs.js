import { useCallback } from "react";
import createNotification from "../components/Notifications/Notification";
import { backendRoutes, botLayoutKey } from "../constants/backendConstants";
import { defaultBotTemplate } from "../constants/LayoutTemplate";
import { useBotDomainContext } from "../context/config/BotDomainProvider";
import { useFetchPlotData } from "../context/data/BotPlottedElementsProvider";
import fetchAndStoreFromBot, { sendAndInterpretBotUpdate } from "./fetchAndStoreFromBot";

export async function fetchBotConfigs(
    useSaveBotConfig,
    botDomain,
    configKeys
) {
    await fetchAndStoreFromBot(
        botDomain + backendRoutes.botConfig + `?config_keys=${configKeys}`,
        useSaveBotConfig
    );
}

export async function fetchUIConfig(botDomain, saveUIConfig) {
    const success = (updated_data, update_url, result, msg, status) => {
        if (!msg[botLayoutKey]) msg[botLayoutKey] = defaultBotTemplate
        saveUIConfig(msg)
    }
    sendAndInterpretBotUpdate({}, botDomain + backendRoutes.UIConfig, success, undefined, "get")
}

export async function saveUIConfig(botDomain, newConfig, callback) {
    sendAndInterpretBotUpdate(newConfig, botDomain + backendRoutes.UIConfig, callback ? callback : () => { })
}

export const useSaveTentaclesConfig = () => {
    const _fetchPlotData = useFetchPlotData();
    const botDomain = useBotDomainContext()
    const logic = useCallback((newConfigs,) => {
        JSON.parse(
            JSON.stringify(newConfigs).replace(/ /g, "_")
        )
        const success = (updated_data, update_url, result, msg, status) => {
            _fetchPlotData()
            createNotification(msg)
        }
        sendAndInterpretBotUpdate(newConfigs, botDomain + backendRoutes.updateTentaclesConfig, success)
    }, [_fetchPlotData, botDomain]);
    return logic;
};