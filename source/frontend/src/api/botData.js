import { backendRoutes } from "../constants/backendConstants";
import fetchAndStoreFromBot, { postRequest } from "./fetchAndStoreFromBot";
import notification from "../components/Notifications/Notification";

export async function fetchBotInfo(botDomain, setBotInfo) {
  await fetchAndStoreFromBot(botDomain + backendRoutes.botInfo, setBotInfo);
}

export async function fetchPlotData(
  setBotPlotData,
  exchange_id,
  symbol,
  time_frame,
  botDomain
) {
  await fetchAndStoreFromBot(
    botDomain + backendRoutes.plottedData,
    setBotPlotData,
    "post",
    {
      exchange_id: exchange_id,
      symbol: symbol,
      time_frame: time_frame,
    }
  );
}

export async function fetchBotConfigs(
  _useSaveBotConfig,
  botDomain,
  configKeys
) {
  await fetchAndStoreFromBot(
    `${botDomain + backendRoutes.botConfig}?config_keys=${configKeys}`,
    _useSaveBotConfig
  );
}

export async function fetchBotPortfolio(_useSaveBotPortfolio, botDomain) {
  await fetchAndStoreFromBot(
    botDomain + backendRoutes.botPortfolio,
    _useSaveBotPortfolio
  );
}

export async function fetchAppStoreData(_useSaveAppStoreData, botDomain) {
  await fetchAndStoreFromBot(
    botDomain + backendRoutes.appStore,
    _useSaveAppStoreData
  );
}

export async function installAppPackage(appUrl, appName, botDomain) {
  postRequest(
    botDomain + backendRoutes.installApp + "?update_type=add_package",
    {
      [appUrl]: "register_and_install",
    }
  ).then((response) => {
    notification("Successfully installed " + appName);
  });
}

export async function saveTentaclesConfig(newConfigs, botDomain) {
  postRequest(
    botDomain + backendRoutes.updateTentaclesConfig + "?action=update",
    newConfigs
  ).then((response) => {
    notification(response);
  });
}
