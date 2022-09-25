import { backendRoutes } from "../constants/backendConstants";
import fetchAndStoreFromBot from "./fetchAndStoreFromBot";

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
  await fetchAndStoreFromBot(botDomain + backendRoutes.botPortfolio, _useSaveBotPortfolio);
}

export async function fetchAppStoreData(_useSaveAppStoreData, botDomain) {
  await fetchAndStoreFromBot(botDomain + backendRoutes.appStore, _useSaveAppStoreData);
}




