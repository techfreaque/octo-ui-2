import { backendRoutes } from "../constants/backendConstants"
import { useSaveBotConfig } from "./BotConfigProvider"

export default function fetchBotData (botDataManager) {
    fetch(botDataManager.botDomain + backendRoutes.botInfo, 
  {method: "GET", mode: 'cors', headers: {'Content-Type': 'application/json'}})
          .then(res => res.json())
          .then(data => {
            botDataManager.setMainBotData(data)
            fetchPlotData (botDataManager.setBotPlotData, data.exchange_id, 
                            data.symbols[0], data.traded_time_frames[0], botDataManager.botDomain)
          })
}

function fetchPlotData (setBotPlotData, exchange_id, symbol, time_frame, botDomain) {
  	fetch(`${botDomain+backendRoutes.plottedData}?exchange_id=${exchange_id}&symbol=${symbol}&time_frame=${time_frame}`, 
    {method: "GET", test: JSON.stringify({"exchange_id": "test"}),
    mode: 'cors', headers: {'Content-Type': 'application/json'}})
            .then(res => res.json())
            .then(data => {              
                setBotPlotData(data.data.sub_elements[0].data.elements)
            })
}

// function updateStrategyDesignerConfig(configKey, value){
//   return new Promise((resolve, reject) => {
//       const _designerConfigSaveSuccess = (updated_data, update_url, dom_root_element, msg, status) => {
//           resolve(updated_data);
//       }
//       const _designerConfigSaveFailure = (updated_data, update_url, dom_root_element, msg, status) => {
//           create_alert("error", "Error when updating config", msg.responseText);
//           reject(updated_data);
//       }
//       const newStrVal = JSON.stringify(value);
//       const currentStrVal = JSON.stringify(_strategyDesignConfig[configKey])
//       if (currentStrVal !== newStrVal) {
//           // only store a deepcopy of the updated value
//           _strategyDesignConfig[configKey] = JSON.parse(newStrVal);
//           send_and_interpret_bot_update(_strategyDesignConfig, $("#strategy_body").data("designer-config-url"),
//               null, _designerConfigSaveSuccess, _designerConfigSaveFailure);
//       }else{
//           resolve(_strategyDesignConfig[configKey]);
//       }
//   });
// }


export function FetchBotConfigs(setSaveBotConfig, botDataManager, configKeys){
  fetch(
    `${botDataManager.botDomain + backendRoutes.botConfig}?config_keys=${configKeys}`,
    {method: "GET", mode: 'cors', headers: {'Content-Type': 'application/json'}},
  ).then(res => res.json())
  .then(data => {
    setSaveBotConfig(data)
  }
  )
}
