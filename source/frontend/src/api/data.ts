import { Dispatch, SetStateAction } from "react";
import createNotification from "../components/Notifications/Notification";
import {
  OPTIMIZER_CAMPAIGNS_TO_LOAD_KEY,
  backendRoutes,
} from "../constants/backendConstants";
import fetchAndStoreFromBot, {
  errorResponseCallBackParams,
  sendAndInterpretBotUpdate,
  successResponseCallBackParams,
} from "./fetchAndStoreFromBot";
import { BotInfoType } from "../context/data/BotInfoProvider";
import { BotLogHistory } from "../widgets/AppWidgets/NotificationCenter/NotificationCenter";
import { BacktestingRunsData } from "../context/data/BacktestingRunDataProvider";
import {
  OptimizerCampaignsToLoadUiConfig,
  UiConfigType,
} from "../context/config/UiConfigProvider";

export async function fetchBotInfo(
  botDomain: string,
  setBotInfo: Dispatch<SetStateAction<BotInfoType | undefined>>,
  visibleExchanges?: string,
  successNotification: boolean = false,
  setIsFinished?: Dispatch<SetStateAction<boolean>>
) {
  await fetchAndStoreFromBot({
    url: `${botDomain + backendRoutes.botInfo}/${visibleExchanges}`,
    setBotDataFunction: setBotInfo,
    dataToSend: {},
    successNotification,
    keepPreviousValues: false,
    setIsFinished,
  });
}

export async function fetchExchangeInfo(
  botDomain: string,
  setExchangeInfo,
  successNotification: boolean = false,
  setIsFinished?: Dispatch<SetStateAction<boolean>>
) {
  await fetchAndStoreFromBot({
    url: botDomain + backendRoutes.exchangeInfo,
    setBotDataFunction: setExchangeInfo,
    dataToSend: {},
    successNotification,
    keepPreviousValues: false,
    setIsFinished,
  });
}

export async function getCurrencyLogos(
  botDomain: string,
  currencyIds,
  setCurrencyLogos
) {
  await fetchAndStoreFromBot({
    url: botDomain + backendRoutes.currencyLogos,
    setBotDataFunction: setCurrencyLogos,
    method: "POST",
    dataToSend: { currency_ids: currencyIds },
  });
}

export async function fetchPlotData(
  setBotPlotData,
  exchange_id: string,
  symbol: string,
  time_frame: string,
  botDomain: string
) {
  await fetchAndStoreFromBot({
    url: botDomain + backendRoutes.plottedData,
    setBotDataFunction: setBotPlotData,
    method: "POST",
    dataToSend: { exchange_id, symbol, time_frame },
  });
}

type FetchPlotlyPlotDataProps = {
  symbol: string;
  timeFrame: string;
  exchange_id: string;
  exchange_name: string;
  botDomain: string;
  setBotPlottedElements;
  botInfo: BotInfoType;
  setHiddenMetadataFromInputs;
  isLive: boolean;
} & (FetchPlotlyPlotDataBacktestingProps | FetchPlotlyPlotDataLiveProps);

interface FetchPlotlyPlotDataBacktestingProps {
  optimization_campaign: string;
  backtesting_id;
  optimizer_id;
  isLive: false;
}

interface FetchPlotlyPlotDataLiveProps {
  isLive: true;
  optimization_campaign?: undefined;
  backtesting_id?: undefined;
  optimizer_id?: undefined;
}

export async function fetchPlotlyPlotData({
  symbol,
  timeFrame,
  exchange_id,
  exchange_name,
  botDomain,
  setBotPlottedElements,
  botInfo,
  setHiddenMetadataFromInputs,
  isLive = true,
  optimization_campaign = undefined,
  backtesting_id = undefined,
  optimizer_id = undefined,
}: FetchPlotlyPlotDataProps) {
  const data: {
    exchange_id: string;
    symbol: string;
    time_frame: string;
    exchange: string;
    live_id?;
    campaign_name?: string;
    backtesting_id?;
    optimizer_id?;
  } = {
    exchange_id,
    symbol,
    time_frame: timeFrame,
    exchange: exchange_name,
  };
  if (isLive) {
    data.live_id = botInfo.live_id;
    data.campaign_name = botInfo.optimization_campaign;
  } else {
    data.campaign_name = optimization_campaign;
    data.backtesting_id = backtesting_id;
    data.optimizer_id = optimizer_id;
  }
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    setBotPlottedElements((prevData) => {
      const newData = {
        ...prevData,
      };
      if (isLive) {
        // msg?.data?.data?.sub_elements?.forEach(sub_data => {
        // if (sub_data.type === "input") {
        //     newData.inputs = sub_data.data.elements
        //     setHiddenMetadataFromInputs(sub_data.data.elements)
        // }
        // })
        newData.live = {
          [botInfo.live_id]: {
            [symbol]: {
              [timeFrame]: data?.data,
            },
          },
        };
      } else if (optimization_campaign && backtesting_id && optimizer_id) {
        if (!newData.backtesting) {
          newData.backtesting = {
            [optimization_campaign]: {
              [optimizer_id]: {
                [backtesting_id]: {
                  [symbol]: {
                    [timeFrame]: data?.data,
                  },
                },
              },
            },
          };
        } else if (!newData.backtesting[optimization_campaign]) {
          newData.backtesting[optimization_campaign] = {
            [optimizer_id]: {
              [backtesting_id]: {
                [symbol]: {
                  [timeFrame]: data?.data,
                },
              },
            },
          };
        } else if (!newData.backtesting[optimization_campaign][optimizer_id]) {
          newData.backtesting[optimization_campaign][optimizer_id] = {
            [backtesting_id]: {
              [symbol]: {
                [timeFrame]: data?.data,
              },
            },
          };
        } else {
          newData.backtesting[optimization_campaign][optimizer_id][
            backtesting_id
          ] = {
            [symbol]: {
              [timeFrame]: data?.data,
            },
          };
        }
      }
      return newData;
    });
  }
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
    createNotification({
      title: "Failed to load chart data",
      type: "danger",
      message: `The data for ${exchange_name} - ${symbol} - ${timeFrame} is not available`,
    });
  }
  sendAndInterpretBotUpdate({
    updatedData: data,
    updateUrl: botDomain + backendRoutes.plottedRunData,
    successCallback,
    errorCallback,
  });
}

export async function fetchBacktestingRunData(
  saveBotConfig: Dispatch<SetStateAction<BacktestingRunsData | undefined>>,
  setUiConfig: Dispatch<SetStateAction<UiConfigType>>,
  botDomain: string,
  forceSelectLatestBacktesting: boolean,
  campaigns: OptimizerCampaignsToLoadUiConfig
) {
  function successCallback(payload: successResponseCallBackParams) {
    saveBotConfig(payload.data.data);
    setUiConfig((prevConfig) => {
      return {
        ...prevConfig,
        [OPTIMIZER_CAMPAIGNS_TO_LOAD_KEY]: payload.data.data.campaigns,
      };
    });
  }
  sendAndInterpretBotUpdate({
    updatedData: {
      forceSelectLatestBacktesting,
      campaigns,
    },
    updateUrl: botDomain + backendRoutes.backtestingRunData,
    successCallback,
  });
}

export async function fetchLiveRunData(
  liveId: string,
  setLiveRunData,
  botDomain: string
) {
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    setLiveRunData(data.data);
  }
  sendAndInterpretBotUpdate({
    updatedData: {
      live_id: liveId,
    },
    updateUrl: botDomain + backendRoutes.liveRunData,
    successCallback,
  });
}

export async function fetchBotPortfolio(setBotPortfolio, botDomain: string) {
  await fetchAndStoreFromBot({
    url: botDomain + backendRoutes.botPortfolio,
    setBotDataFunction: setBotPortfolio,
  });
}
export async function fetchSymbolsInfo(setSymbolsInfo, botDomain: string) {
  return await fetchAndStoreFromBot({
    url: botDomain + backendRoutes.symbolsInfo,
    setBotDataFunction: setSymbolsInfo,
    successNotification: false,
    keepPreviousValues: false,
    failNotification: false,
  });
}

export async function fetchPackagesData(
  saveAppStoreData,
  botDomain: string,
  notification: boolean
) {
  await fetchAndStoreFromBot({
    url: botDomain + backendRoutes.packagesData,
    setBotDataFunction: saveAppStoreData,
    successNotification: false,
    keepPreviousValues: false,
    failNotification: notification,
  });
}

export async function loginToAppStore(
  updateAppStoreUser,
  storeDomain: string,
  loginData,
  appStoreUser,
  onLoggedIn
) {
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
    createNotification({
      title: "Failed to log in to App Store",
      type: "danger",
      message: "Check your password or email",
    });
    updateAppStoreUser();
  }
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    if (data.success) {
      createNotification({ title: "Successfully logged in to App Store" });
      onLoggedIn(true);
      updateAppStoreUser(data.access_tokens);
    } else {
      errorCallback({
        updatedData,
        updateUrl,
        data,
        response,
      });
    }
  }
  sendAndInterpretBotUpdate({
    updatedData: loginData,
    updateUrl: storeDomain + backendRoutes.appStoreLogin,
    successCallback,
    errorCallback,
    withCredentials: true,
    token: appStoreUser?.token,
  });
}

export async function logoutFromAppStore(
  saveAppStoreData,
  storeDomain: string,
  appStoreUser
) {
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
    createNotification({
      title: "Failed to log out from App Store",
      type: "danger",
    });
    saveAppStoreData({});
  }
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    if (data.success) {
      saveAppStoreData({});
      createNotification({ title: "Successfully logged out from App Store" });
    } else {
      errorCallback({
        updatedData,
        updateUrl,
        data,
        response,
      });
    }
  }
  if (appStoreUser?.token) {
    sendAndInterpretBotUpdate({
      updatedData: {},
      updateUrl: storeDomain + backendRoutes.appStoreLogout,
      successCallback,
      errorCallback,
      withCredentials: true,
      token: appStoreUser.token,
    });
  } else {
    createNotification({
      title: "You are already logged out",
      type: "warning",
    });
    saveAppStoreData({});
  }
}

export async function signupToAppStore(
  saveAppStoreData,
  storeDomain: string,
  loginData,
  onLoggedIn
) {
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
    createNotification({
      title: "Failed to sign up to the App Store",
      type: "danger",
      message: "Check your password or email",
    });
    onLoggedIn(true);
    saveAppStoreData(data.data);
  }
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    if (data.success) {
      createNotification({
        title: "Successfully signed up to App Store",
        message: "You can now log in to the App Store",
      });
      saveAppStoreData(data.data);
    } else {
      errorCallback({
        updatedData,
        updateUrl,
        data,
        response,
      });
    }
  }
  sendAndInterpretBotUpdate({
    updatedData: loginData,
    updateUrl: storeDomain + backendRoutes.appStoreSignup,
    successCallback,
    errorCallback,
  });
}

export async function fetchBotLogs(
  saveLogs: Dispatch<SetStateAction<BotLogHistory[] | undefined>>,
  botDomain: string
) {
  await fetchAndStoreFromBot({
    url: botDomain + backendRoutes.getLogs,
    setBotDataFunction: saveLogs,
  });
}
