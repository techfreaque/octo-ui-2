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

export async function fetchRunData(
  _useSaveBotConfig,
  botDomain,
  forceSelectLatestBacktesting,
  campaigns,
) {
  const data = JSON.stringify({ forceSelectLatestBacktesting: forceSelectLatestBacktesting, campaigns: campaigns })
  console.log(data)
  await fetchAndStoreFromBot(
    `${botDomain + backendRoutes.strategyDesignRunData}?${data}`,
    _useSaveBotConfig
  );
}

export async function fetchBotPortfolio(_useSaveBotPortfolio, botDomain) {
  await fetchAndStoreFromBot(
    botDomain + backendRoutes.botPortfolio,
    _useSaveBotPortfolio
  );
}

export async function fetchStrategyDesignConfig(botDomain, _useSaveStrategyDesignConfig) {
  await fetchAndStoreFromBot(
    botDomain + backendRoutes.strategyDesignConfig,
    _useSaveStrategyDesignConfig
  );
}

export async function saveStrategyDesignConfig(botDomain, _useSaveStrategyDesignConfig, newConfig) {
  postRequest(
    botDomain + backendRoutes.strategyDesignConfig,
    newConfig
  ).then((response) => {
    _useSaveStrategyDesignConfig(newConfig)
    notification(response);
  });
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
