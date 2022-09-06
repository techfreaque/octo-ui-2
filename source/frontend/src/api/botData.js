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
    console.log("response");
    console.log(response);

    notification("Successfully installed " + appName);
  });
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
