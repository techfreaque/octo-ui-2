import { Dispatch, SetStateAction } from "react";
import { backendRoutes, botLayoutKey } from "../constants/backendConstants";
import { defaultBotTemplate } from "../constants/uiTemplate/defaultPages/allPages";
import { UiConfigType } from "../context/config/UiConfigProvider";
import {
  errorResponseCallBackParams,
  sendAndInterpretBotUpdate,
  successResponseCallBackParams,
} from "./fetchAndStoreFromBot";
import { OptimizerEditorType } from "../context/config/OptimizerEditorProvider";

export async function fetchUIConfig(
  botDomain: string,
  saveUIConfig: Dispatch<SetStateAction<UiConfigType>>,
  exchangeNames?: string[]
) {
  function successCallback({ data }: successResponseCallBackParams) {
    if (exchangeNames) {
      if (!data.backtesting_run_settings) {
        data.backtesting_run_settings = {};
      }
      data.backtesting_run_settings.exchange_names = filterByEnabledExchanges(
        data.backtesting_run_settings?.exchange_names || [],
        exchangeNames
      );
      if (!data.backtesting_run_settings.exchange_names.length) {
        data.backtesting_run_settings.exchange_names = exchangeNames;
      }
      if (!data.backtesting_run_settings) {
        data.optimizer_run_settings = {};
      }
      data.optimizer_run_settings.exchange_names = filterByEnabledExchanges(
        data.optimizer_run_settings?.exchange_names || [],
        exchangeNames
      );
      if (!data.optimizer_run_settings.exchange_names.length) {
        data.optimizer_run_settings.exchange_names = exchangeNames;
      }
    }
    if (!data?.[botLayoutKey]?.isCustom) {
      data[botLayoutKey] = defaultBotTemplate;
    }
    saveUIConfig(data);
  }
  sendAndInterpretBotUpdate({
    updatedData: {},
    updateUrl: botDomain + backendRoutes.uIConfig,
    successCallback,
    method: "GET",
  });
}

export async function saveUIConfig({
  botDomain,
  newConfig,
  successCallback,
  errorCallback,
}: {
  botDomain: string;
  newConfig: UiConfigType;
  successCallback?: (payload: successResponseCallBackParams) => void;
  errorCallback: (payload: errorResponseCallBackParams) => void;
}) {
  sendAndInterpretBotUpdate({
    updatedData: newConfig,
    updateUrl: botDomain + backendRoutes.uIConfig,
    successCallback: successCallback ? successCallback : undefined,
    errorCallback,
  });
}

export async function saveProConfig(
  botDomain: string,
  newConfig: OptimizerEditorType,
  successCallback: (payload: successResponseCallBackParams) => void,
  errorCallback: (payload: errorResponseCallBackParams) => void
) {
  sendAndInterpretBotUpdate({
    updatedData: newConfig,
    updateUrl: botDomain + backendRoutes.proConfig,
    successCallback,
    errorCallback,
  });
}

function filterByEnabledExchanges(
  settingsExchanges: string[],
  currentExchanges: string[]
) {
  return settingsExchanges.filter((exchange) =>
    currentExchanges.includes(exchange)
  );
}
