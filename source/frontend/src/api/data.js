import { backendRoutes } from "../constants/backendConstants";
import fetchAndStoreFromBot, { fetchAndGetFromBot, sendAndInterpretBotUpdate } from "./fetchAndStoreFromBot";
export async function fetchBotInfo(botDomain, setBotInfo, visibleExchanges, successNotification = false, setIsFinished = undefined) {
  await fetchAndStoreFromBot(botDomain + backendRoutes.botInfo + "/" + visibleExchanges, setBotInfo, "get", {}, successNotification, false, setIsFinished);
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
  setHiddenMetadataFromInputs,
  isLive = true,
  optimization_campaign = undefined,
  backtesting_id = undefined,
  optimizer_id = undefined,
) {
  const data = {
    exchange_id: botInfo.exchange_id,
    symbol: symbol,
    time_frame: timeFrame,
    exchange: botInfo.exchange_name,
    analysis_settings: analysisSettings,
  }
  if (isLive) {
    data.live_id = botInfo.live_id
    data.campaign_name = botInfo.optimization_campaign
  } else {
    data.campaign_name = optimization_campaign
    data.backtesting_id = backtesting_id
    data.optimizer_id = optimizer_id

  }
  const success = (updated_data, update_url, _undefined, msg, status) => {
    setBotPlottedElements(prevData => {
      const newData = { ...prevData }
      if (isLive) {
        msg.data.data.sub_elements.forEach(sub_data => {
          if (sub_data.type === "input") {
            newData.inputs = sub_data.data.elements
            setHiddenMetadataFromInputs(sub_data.data.elements)
          }
        })
        newData.live = {
          [botInfo.live_id]: { [symbol]: { [timeFrame]: msg.data } }
        }
      } else {
        if (!newData.backtesting) {
          newData.backtesting = {
            [optimization_campaign]: {
              [optimizer_id]: { [backtesting_id]: { [symbol]: { [timeFrame]: msg.data } } }
            }
          }
        } else if (!newData.backtesting[optimization_campaign]) {
          newData.backtesting[optimization_campaign] = {
            [optimizer_id]: { [backtesting_id]: { [symbol]: { [timeFrame]: msg.data } } }
          }
        } else if (!newData.backtesting[optimization_campaign][optimizer_id]) {
          newData.backtesting[optimization_campaign][optimizer_id] = {
            [backtesting_id]: { [symbol]: { [timeFrame]: msg.data } }
          }
        } else {
          newData.backtesting[optimization_campaign][optimizer_id][backtesting_id] = {
            [symbol]: { [timeFrame]: msg.data }
          }
        }
      }
      return newData
    })
  }
  fetchAndGetFromBot(
    botDomain + backendRoutes.plottedRunData,
    "post",
    data,
    success, undefined,
  )
}

export async function fetchBacktestingRunData(
  saveBotConfig,
  setUiConfig,
  botDomain,
  forceSelectLatestBacktesting,
  campaigns,
) {

  const success = (updated_data, update_url, result, msg, status) => {
    saveBotConfig(msg.data)
    setUiConfig(prevConfig => {
      return { ...prevConfig, optimizer_campaigns_to_load: msg.data.campaigns }
    })
  }
  sendAndInterpretBotUpdate(
    {
      forceSelectLatestBacktesting: forceSelectLatestBacktesting,
      campaigns: campaigns
    },
    botDomain + backendRoutes.backtestingRunData,
    success, undefined, "post")
}

export async function fetchLiveRunData(
  liveId,
  setLiveRunData,
  botDomain,
) {

  const success = (updated_data, update_url, result, msg, status) => {
    setLiveRunData(msg.data)
  }
  sendAndInterpretBotUpdate(
    { live_id: liveId },
    botDomain + backendRoutes.liveRunData,
    success, undefined, "post")
}

export async function fetchBotPortfolio(_useSaveBotPortfolio, botDomain) {
  await fetchAndStoreFromBot(botDomain + backendRoutes.botPortfolio, _useSaveBotPortfolio);
}

export async function fetchAppStoreData(_useSaveAppStoreData, botDomain) {
  await fetchAndStoreFromBot(botDomain + backendRoutes.appStore, _useSaveAppStoreData);
}




