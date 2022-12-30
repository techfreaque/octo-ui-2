import { backendRoutes } from "../constants/backendConstants";
import fetchAndStoreFromBot, { fetchAndGetFromBot } from "./fetchAndStoreFromBot";

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

export async function fetchPlotlyPlotData(
  symbol,
  timeFrame,
  botDomain,
  analysisSettings,
  setBotPlottedElements,
  botInfo,
) {
  const success = (updated_data, update_url, _undefined, msg, status) => {
    setBotPlottedElements(prevData => {
      const newData = { ...prevData }
      msg.data.sub_elements.forEach(data => {
        if (data.type === "input") {
          newData.inputs = data.data.elements
        }
      })
      newData.live = {
        [botInfo.live_id]: { [symbol]: { [timeFrame]: msg } }
      }
      return newData
    })
  }
  fetchAndGetFromBot(
    botDomain + backendRoutes.plottedRunData,
    "post",
    {
      exchange_id: botInfo.exchange_id,
      backtesting_id: botInfo.backtesting_id,
      optimizer_id: botInfo.optimizer_id,
      live_id: botInfo.live_id,
      symbol: symbol,
      time_frame: timeFrame,
      campaign_name: botInfo.optimization_campaign,
      exchange: botInfo.exchange_name,
      analysis_settings: analysisSettings,
    },
    success, undefined,
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




