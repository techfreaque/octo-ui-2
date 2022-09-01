import { backendRoutes } from "../constants/backendConstants";

export async function postRequest(url, data) {
  const res = await fetch(url, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const response = await res.json();
  return response;
}

async function getRequest(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

export function fetchBotInfo(botDomain, setBotInfo) {
  getRequest(botDomain + backendRoutes.botInfo).then((newData) => {
    setBotInfo(newData);
  });
}

export function fetchPlotData(
  setBotPlotData,
  exchange_id,
  symbol,
  time_frame,
  botDomain
) {
  postRequest(botDomain + backendRoutes.plottedData, {
    exchange_id: exchange_id,
    symbol: symbol,
    time_frame: time_frame,
  }).then((newData) => {
    setBotPlotData((prevPlottedElements) => {
      return { ...prevPlottedElements, ...newData };
    });
  });
}

export const fetchBotConfigs = (_useSaveBotConfig, botDomain, configKeys) => {
  getRequest(
    `${botDomain + backendRoutes.botConfig}?config_keys=${configKeys}`
  ).then((newData) => {
    _useSaveBotConfig((prevData) => {
      return { ...prevData, ...newData };
    });
  });
};
