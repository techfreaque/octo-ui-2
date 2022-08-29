import { backendRoutes } from "../constants/backendConstants"

export async function postRequest(url, data){
  const res = await fetch(url, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  const response = await res.json();
  return response;
};

async function getRequest(url){
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

export function fetchBotData (botDataManager) {
  getRequest(botDataManager.botDomain + backendRoutes.botInfo).then(data =>{
    botDataManager.setMainBotData(data)
    fetchPlotData (botDataManager.setBotPlotData, data.exchange_id, 
                    data.symbols[0], data.traded_time_frames[0], botDataManager.botDomain)
  }
  )
};

export function fetchPlotData (setBotPlotData, exchange_id, symbol, time_frame, botDomain) {
  	postRequest(botDomain+backendRoutes.plottedData, 
                {exchange_id: exchange_id, symbol: symbol, time_frame: time_frame})
    .then(data => {              
      setBotPlotData(data.data.sub_elements[0].data.elements)
    })
}

export const fetchBotConfigs = (_useSaveBotConfig, botDataManager, configKeys) => {
  getRequest(`${botDataManager.botDomain + backendRoutes.botConfig}?config_keys=${configKeys}`)
  .then(data => {
    console.log(data)
    _useSaveBotConfig(prevData => {
      return {...prevData, ...data}
    })
  }
  )
}
