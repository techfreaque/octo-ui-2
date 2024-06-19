import type { Dispatch, SetStateAction } from "react";

import createNotification from "../components/Notifications/Notification";
import {
  backendRoutes,
  OPTIMIZER_CAMPAIGNS_TO_LOAD_KEY,
} from "../constants/backendConstants";
import type {
  OptimizerCampaignsToLoadUiConfig,
  UiConfigType,
} from "../context/config/UiConfigProvider";
import type {
  AppStoreUserType,
  InstalledTentaclesInfoType,
} from "../context/data/AppStoreDataProvider";
import type { BacktestingRunsData } from "../context/data/BacktestingRunDataProvider";
import type { ExchangeInfoType } from "../context/data/BotExchangeInfoProvider";
import type { BotInfoType } from "../context/data/BotInfoProvider";
import type {
  PlottedElementBacktestingNameType,
  PlottedElementNameType,
  PlottedElementsType,
} from "../context/data/BotPlottedElementsProvider";
import type { PortfolioType } from "../context/data/BotPortfolioProvider";
import type { BotLogHistory } from "../widgets/AppWidgets/NotificationCenter/NotificationCenter";
import type { LoginSignupFormType } from "../widgets/AppWidgets/StrategyConfigurator/Dashboard/Login";
import type {
  errorResponseCallBackParams,
  successResponseCallBackParams,
} from "./fetchAndStoreFromBot";
import fetchAndStoreFromBot, {
  sendAndInterpretBotUpdate,
} from "./fetchAndStoreFromBot";

export async function fetchBotInfo(
  botDomain: string,
  setBotInfo: Dispatch<SetStateAction<BotInfoType | undefined>>,
  visibleExchanges?: string,
  successNotification = false,
  setIsFinished?: Dispatch<SetStateAction<boolean>>,
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
  setExchangeInfo: Dispatch<SetStateAction<ExchangeInfoType | undefined>>,
  successNotification = false,
  setIsFinished?: Dispatch<SetStateAction<boolean>>,
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

type FetchPlotlyPlotDataProps = {
  symbol: string;
  timeFrame: string;
  exchangeId: string;
  exchangeName: string;
  botDomain: string;
  setBotPlottedElements: Dispatch<
    SetStateAction<PlottedElementsType<PlottedElementNameType> | undefined>
  >;
  optimizationCampaign: string;
};

interface FetchPlotlyPlotDataBacktestingProps {
  backtestingId: string;
  optimizerId: string;
}

interface FetchPlotlyPlotDataLiveProps {
  liveId: number;
  onDone?: (() => void) | undefined;
}

export async function fetchPlotlyLivePlotData({
  symbol,
  timeFrame,
  exchangeId,
  exchangeName,
  botDomain,
  setBotPlottedElements,
  optimizationCampaign,
  liveId,
  onDone,
}: FetchPlotlyPlotDataProps & FetchPlotlyPlotDataLiveProps) {
  const data: {
    exchange_id: string;
    symbol: string;
    time_frame: string;
    exchange: string;
    live_id: number;
    campaign_name: string;
  } = {
    exchange_id: exchangeId,
    symbol,
    time_frame: timeFrame,
    exchange: exchangeName,
    campaign_name: optimizationCampaign,
    live_id: liveId,
  };
  const successCallback = ({ data }: successResponseCallBackParams) => {
    setBotPlottedElements((prevData) => {
      const newData: PlottedElementsType<PlottedElementNameType> = JSON.parse(
        JSON.stringify(prevData || {}),
      );
      newData.live = {
        [liveId]: {
          [symbol]: {
            [timeFrame]: data?.data,
          },
        },
      };
      return newData;
    });
    onDone?.();
  };
  function errorCallback() {
    createNotification({
      title: "Failed to load live chart data",
      type: "danger",
      message: `The data for ${exchangeName} - ${symbol} - ${timeFrame} is not available`,
    });
    onDone?.();
  }
  sendAndInterpretBotUpdate({
    updatedData: data,
    updateUrl: botDomain + backendRoutes.plottedRunData,
    successCallback,
    errorCallback,
  });
}

export async function fetchPlotlyBacktestingPlotData({
  symbol,
  timeFrame,
  exchangeId,
  exchangeName,
  botDomain,
  setBotPlottedElements,
  optimizationCampaign,
  backtestingId,
  optimizerId,
}: FetchPlotlyPlotDataProps & FetchPlotlyPlotDataBacktestingProps) {
  const data: {
    exchange_id: string;
    symbol: string;
    time_frame: string;
    exchange: string;
    campaign_name: string;
    backtesting_id: string;
    optimizer_id: string;
  } = {
    exchange_id: exchangeId,
    symbol,
    time_frame: timeFrame,
    exchange: exchangeName,
    campaign_name: optimizationCampaign,
    backtesting_id: backtestingId,
    optimizer_id: optimizerId,
  };
  const successCallback = ({ data }: successResponseCallBackParams) => {
    setBotPlottedElements((prevData) => {
      const newData: PlottedElementsType<PlottedElementBacktestingNameType> =
        JSON.parse(JSON.stringify(prevData || {}));
      newData.backtesting = {
        ...newData.backtesting,
        [optimizationCampaign]: {
          ...newData.backtesting?.[optimizationCampaign],
          [optimizerId]: {
            ...newData.backtesting?.[optimizationCampaign]?.[optimizerId],
            [backtestingId]: {
              ...newData.backtesting?.[optimizationCampaign]?.[optimizerId]?.[
                backtestingId
              ],
              [symbol]: {
                ...newData.backtesting?.[optimizationCampaign]?.[optimizerId]?.[
                  backtestingId
                ]?.[symbol],
                [timeFrame]: data?.data,
              },
            },
          },
        },
      };
      return newData;
    });
  };
  function errorCallback() {
    createNotification({
      title: "Failed to load backtesting chart data",
      type: "danger",
      message: `The data for ${exchangeName} - ${symbol} - ${timeFrame} is not available`,
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
  campaigns: OptimizerCampaignsToLoadUiConfig,
  onDone?: () => void,
) {
  function successCallback(payload: successResponseCallBackParams) {
    saveBotConfig(payload.data.data);
    setUiConfig((prevConfig) => {
      return {
        ...prevConfig,
        [OPTIMIZER_CAMPAIGNS_TO_LOAD_KEY]: payload.data.data.campaigns,
      };
    });
    onDone?.();
  }
  function errorCallback(payload: errorResponseCallBackParams) {
    createNotification({
      title: "Failed to load backtesting runs",
      message: `Error: ${payload.data}`,
      type: "danger",
    });
    onDone?.();
  }
  sendAndInterpretBotUpdate({
    updatedData: {
      forceSelectLatestBacktesting,
      campaigns,
    },
    updateUrl: botDomain + backendRoutes.backtestingRunData,
    successCallback,
    errorCallback,
  });
}

export async function fetchBotPortfolio(
  setBotPortfolio: Dispatch<SetStateAction<PortfolioType | undefined>>,
  botDomain: string,
  setIsFinished?: Dispatch<SetStateAction<boolean>>,
  successNotification?: boolean,
) {
  await fetchAndStoreFromBot({
    url: botDomain + backendRoutes.botPortfolio,
    setBotDataFunction: setBotPortfolio,
    setIsFinished,
    successNotification,
  });
}

export async function fetchPackagesData(
  saveAppStoreData: (newData: InstalledTentaclesInfoType) => void,
  botDomain: string,
  notification?: boolean,
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
  updateAppStoreUser: (tokens: AppStoreUserType | undefined) => void,
  storeDomain: string,
  loginData: LoginSignupFormType,
  appStoreUser: AppStoreUserType | undefined,
  onLoggedIn: () => void,
) {
  function errorCallback() {
    createNotification({
      title: "Failed to log in to App Store",
      type: "danger",
      message: "Check your password or email",
    });
    updateAppStoreUser(undefined);
  }
  function successCallback({ data }: successResponseCallBackParams) {
    if (data.success) {
      createNotification({ title: "Successfully logged in to App Store" });
      onLoggedIn();
      updateAppStoreUser(data.access_tokens);
    } else {
      errorCallback();
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
  saveAppStoreData: (tokens: AppStoreUserType | undefined) => void,
  storeDomain: string,
  appStoreUser: AppStoreUserType | undefined,
) {
  function errorCallback() {
    createNotification({
      title: "Failed to log out from App Store",
      type: "danger",
    });
    saveAppStoreData(undefined);
  }
  function successCallback({ data }: successResponseCallBackParams) {
    if (data.success) {
      saveAppStoreData(undefined);
      createNotification({ title: "Successfully logged out from App Store" });
    } else {
      errorCallback();
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
    saveAppStoreData(undefined);
  }
}

export async function signupToAppStore(
  saveAppStoreData: (tokens: AppStoreUserType | undefined) => void,
  storeDomain: string,
  loginData: LoginSignupFormType,
  onLoggedIn: () => void,
) {
  function errorCallback({ data }: errorResponseCallBackParams) {
    createNotification({
      title: "Failed to sign up to the App Store",
      type: "danger",
      message: "Check your password or email",
    });
    onLoggedIn();
    saveAppStoreData(data.data);
  }
  function successCallback(payload: successResponseCallBackParams) {
    if (payload.data.success) {
      createNotification({
        title: "Successfully signed up to App Store",
        message: "You can now log in to the App Store",
      });
      saveAppStoreData(payload.data.data);
    } else {
      errorCallback(payload);
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
  botDomain: string,
) {
  await fetchAndStoreFromBot({
    url: botDomain + backendRoutes.getLogs,
    setBotDataFunction: saveLogs,
  });
}
