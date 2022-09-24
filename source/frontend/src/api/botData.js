import { backendRoutes } from "../constants/backendConstants";
import fetchAndStoreFromBot, { postRequest } from "./fetchAndStoreFromBot";
import createNotification from "../components/Notifications/Notification";
import { useFetchPlotData } from "../context/BotPlottedElementsProvider";
import { useCallback } from "react";

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

export async function fetchBacktestingRunData(
  useSaveBotConfig,
  setUiConfig,
  botDomain,
  forceSelectLatestBacktesting,
  campaigns,
) {
  const data = JSON.stringify({ forceSelectLatestBacktesting: forceSelectLatestBacktesting, campaigns: campaigns })
  // todo save campaigns
  await fetchAndStoreFromBot(
    `${botDomain + backendRoutes.strategyDesignRunData}?${data}`,
    useSaveBotConfig
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
    createNotification(response);
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
    createNotification("Successfully installed " + appName);
  });
}

export const useSaveTentaclesConfig = () => {
  const _fetchPlotData = useFetchPlotData();

  const logic = useCallback((newConfigs, botDomain) => {
    JSON.parse(
      JSON.stringify(newConfigs).replace(/ /g, "_")
    )
    postRequest(
      botDomain + backendRoutes.updateTentaclesConfig + "?action=update&reload=true",
      newConfigs
    ).then((response) => {
      _fetchPlotData()  
      createNotification(response);
    });
  }, [_fetchPlotData]);
  return logic;
};

