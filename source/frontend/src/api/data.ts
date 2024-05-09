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
import { ExchangeInfoType } from "../context/data/BotExchangeInfoProvider";
import { PortfolioType } from "../context/data/BotPortfolioProvider";
import {
  AppStoreUserType,
  InstalledTentaclesInfoType,
} from "../context/data/AppStoreDataProvider";
import { LoginSignupFormType } from "../widgets/AppWidgets/StrategyConfigurator/Dashboard/Login";
import {
  PlottedElementNameType,
  PlottedElementsType,
} from "../context/data/BotPlottedElementsProvider";

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
  setExchangeInfo: Dispatch<SetStateAction<ExchangeInfoType | undefined>>,
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

type FetchPlotlyPlotDataProps = {
  symbol: string;
  timeFrame: string;
  exchange_id: string;
  exchange_name: string;
  botDomain: string;
  setBotPlottedElements: Dispatch<
    SetStateAction<PlottedElementsType<PlottedElementNameType> | undefined>
  >;
  botInfo: BotInfoType;
  optimizationCampaign: string;
  isLive: boolean;
} & (FetchPlotlyPlotDataBacktestingProps | FetchPlotlyPlotDataLiveProps);

interface FetchPlotlyPlotDataBacktestingProps {
  backtesting_id: number;
  optimizer_id: number;
  isLive: false;
}

interface FetchPlotlyPlotDataLiveProps {
  isLive: true;
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
  isLive = true,
  optimizationCampaign,
  backtesting_id,
  optimizer_id,
}: FetchPlotlyPlotDataProps) {
  const data: {
    exchange_id: string;
    symbol: string;
    time_frame: string;
    exchange: string;
    live_id?: number;
    campaign_name?: string;
    backtesting_id?: number;
    optimizer_id?: number;
  } = {
    exchange_id,
    symbol,
    time_frame: timeFrame,
    exchange: exchange_name,
    campaign_name: optimizationCampaign,
  };
  if (isLive) {
    data.live_id = botInfo.live_id;
    if (!data.live_id) {
      createNotification({
        title: "Failed to get live plot data",
        message: "Live run id is not defined",
      });
      return;
    }
  } else {
    data.backtesting_id = backtesting_id;
    data.optimizer_id = optimizer_id;
  }

  const successCallback = ({ data }: successResponseCallBackParams) => {
    setBotPlottedElements((prevData) => {
      const newData: PlottedElementsType<PlottedElementNameType> = JSON.parse(
        JSON.stringify(prevData || {})
      );
      if (isLive) {
        newData.live = {
          [botInfo.live_id]: {
            [symbol]: {
              [timeFrame]: data?.data,
            },
          },
        };
        return newData;
      }
      if (!optimizationCampaign || optimizer_id) {
        createNotification({
          title: "Failed to get backtesting plot data",
          message: `Campaign: ${optimizationCampaign} or optimizer id: ${optimizer_id} is undefined`,
        });
        return newData;
      }
      if (!newData.backtesting) {
        newData.backtesting = {
          [optimizationCampaign]: {},
        };
      }
      if (!newData.backtesting[optimizationCampaign]) {
        newData.backtesting[optimizationCampaign] = {
          [optimizer_id]: {},
        };
      }
      if (!newData.backtesting[optimizationCampaign][optimizer_id]) {
        newData.backtesting[optimizationCampaign][optimizer_id] = {
          [backtesting_id]: {},
        };
      }
      newData.backtesting[optimizationCampaign][optimizer_id][
        backtesting_id
      ] = {
        [symbol]: {
          [timeFrame]: data?.data,
        },
      };
      return newData;
    });
  };
  function errorCallback() {
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

export async function fetchBotPortfolio(
  setBotPortfolio: Dispatch<SetStateAction<PortfolioType | undefined>>,
  botDomain: string,
  setIsFinished?: Dispatch<SetStateAction<boolean>>,
  successNotification?: boolean
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
  notification?: boolean
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
  onLoggedIn: () => void
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
  appStoreUser: AppStoreUserType | undefined
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
  onLoggedIn: () => void
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
  botDomain: string
) {
  await fetchAndStoreFromBot({
    url: botDomain + backendRoutes.getLogs,
    setBotDataFunction: saveLogs,
  });
}
