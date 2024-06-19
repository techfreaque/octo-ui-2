import type { Dispatch, SetStateAction } from "react";

import createNotification from "../components/Notifications/Notification";
import { backendRoutes } from "../constants/backendConstants";
import { projectName } from "../constants/frontendConstants";
import type { StatBacktestingSettingsType } from "../context/actions/BotBacktestingProvider";
import type { StartOptimizerSettingsType } from "../context/actions/BotOptimizerProvider";
import type { OptimizerEditorInputsType } from "../context/config/OptimizerEditorProvider";
import type { OptimizerUiConfig } from "../context/config/UiConfigProvider";
import type { ExchangeConfigUpdateType } from "../context/data/BotExchangeInfoProvider";
import type { ProfileInfoUpdateType } from "../widgets/AppWidgets/Modals/ProfileModal/ProfileModalButton";
import type { ResetDataStorageInfoType } from "../widgets/AppWidgets/ResetConfigs/ResetConfigs";
import type {
  errorResponseCallBackParams,
  successResponseCallBackParams,
} from "./fetchAndStoreFromBot";
import { sendAndInterpretBotUpdate } from "./fetchAndStoreFromBot";

export async function startBacktesting(
  botDomain: string,
  backtestingSettings: StatBacktestingSettingsType,
  setBotIsBacktesting: Dispatch<SetStateAction<boolean>>,
) {
  function successCallback(payload: successResponseCallBackParams) {
    setBotIsBacktesting(true);
    createNotification({ title: payload.data });
  }
  function errorCallback(payload: errorResponseCallBackParams) {
    createNotification({ title: payload.data.responseText, type: "danger" });
    // todo check if running
    setBotIsBacktesting(true);
  }
  sendAndInterpretBotUpdate({
    updatedData: backtestingSettings,
    updateUrl: botDomain + backendRoutes.backtestingStart,
    successCallback,
    errorCallback,
  });
}

export async function restartBot(
  botDomain: string,
  updateIsOnline: Dispatch<SetStateAction<boolean>>,
  notification: boolean,
) {
  function successCallback() {
    updateIsOnline(false);
    if (notification) {
      createNotification({ title: "The bot is restarting..." });
    }
  }
  function errorCallback() {
    if (notification) {
      createNotification({ title: "Failed to restart bot", type: "danger" });
    }
  }
  sendAndInterpretBotUpdate({
    updatedData: {},
    updateUrl: botDomain + backendRoutes.restartBot,
    successCallback,
    errorCallback,
    method: "GET",
  });
}

export async function logOutBot(
  botDomain: string,
  updateIsOnline: Dispatch<SetStateAction<boolean>>,
  setIsloading: Dispatch<SetStateAction<boolean>>,
  onLoggedOut: () => void,
) {
  setIsloading(true);
  function successCallback() {
    updateIsOnline(false);
    createNotification({ title: "Logged out successfully" });
    setIsloading(false);
    onLoggedOut();
  }
  function errorCallback() {
    setIsloading(false);
    createNotification({ title: "Failed to log out from bot", type: "danger" });
  }
  sendAndInterpretBotUpdate({
    updatedData: {},
    updateUrl: botDomain + backendRoutes.logoutBot,
    successCallback,
    errorCallback,
    method: "GET",
  });
}

export async function stopBot(
  botDomain: string,
  updateIsOnline: Dispatch<SetStateAction<boolean>>,
  setIsloading: Dispatch<SetStateAction<boolean>>,
) {
  setIsloading(true);
  function successCallback() {
    updateIsOnline(false);
    createNotification({ title: "The bot is stopping..." });
    setIsloading(false);
  }
  function errorCallback() {
    setIsloading(false);
    createNotification({ title: "Failed to restart bot", type: "danger" });
  }
  sendAndInterpretBotUpdate({
    updatedData: {},
    updateUrl: botDomain + backendRoutes.stopBot,
    successCallback,
    errorCallback,
    method: "GET",
  });
}

export async function updateBot(
  botDomain: string,
  updateIsOnline: Dispatch<SetStateAction<boolean>>,
  setIsloading: Dispatch<SetStateAction<boolean>>,
) {
  setIsloading(true);
  function successCallback() {
    updateIsOnline(false);
    createNotification({ title: "The bot is updating..." });
    setIsloading(false);
  }
  function errorCallback() {
    setIsloading(false);
    createNotification({ title: "Failed to update bot", type: "danger" });
  }
  sendAndInterpretBotUpdate({
    updatedData: {},
    updateUrl: botDomain + backendRoutes.updateBot,
    successCallback,
    errorCallback,
    method: "GET",
  });
}

export async function startOptimizer(
  botDomain: string,
  optimizerRunSettings: StartOptimizerSettingsType,
  setBotIsOptimizing: Dispatch<SetStateAction<boolean | "isStopping">>,
) {
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    if (data.success === true) {
      setBotIsOptimizing(true);
      createNotification({ title: data.message });
    } else {
      errorCallback({
        updatedData,
        updateUrl,
        data,
        response,
      });
    }
  }
  function errorCallback(payload: errorResponseCallBackParams) {
    createNotification({ title: payload.data.message, type: "danger" });
  }
  sendAndInterpretBotUpdate({
    updatedData: optimizerRunSettings,
    updateUrl: botDomain + backendRoutes.optimizerStart,
    successCallback,
    errorCallback,
  });
}

export async function addToOptimizerQueue(
  botDomain: string,
  optimizerRunSettings: OptimizerUiConfig,
  optimizerSettingsForm: OptimizerEditorInputsType,
  fetchOptimizerQueue: () => void,
) {
  function successCallback(payload: successResponseCallBackParams) {
    fetchOptimizerQueue();
    createNotification({ title: payload.data?.message || payload.data });
  }
  function errorCallback(payload: errorResponseCallBackParams) {
    createNotification({
      title: "Failed to add to the queue",
      type: "danger",
      message: payload.data?.message || payload.data,
    });
  }
  const updatedData = {
    ...optimizerRunSettings,
    optimizer_config: optimizerSettingsForm,
  };
  if (!updatedData.optimizer_config.filters_settings) {
    updatedData.optimizer_config.filters_settings = [];
  }

  sendAndInterpretBotUpdate({
    updatedData,
    updateUrl: botDomain + backendRoutes.optimizerAddToQueue,
    successCallback,
    errorCallback,
  });
}

export async function stopBacktesting(
  botDomain: string,
  setBotIsBacktesting: Dispatch<SetStateAction<boolean>>,
) {
  function successCallback(payload: successResponseCallBackParams) {
    setBotIsBacktesting(false);
    createNotification({ title: payload.data });
  }
  sendAndInterpretBotUpdate({
    updatedData: {},
    updateUrl: botDomain + backendRoutes.backtestingStop,
    successCallback,
  });
}

export async function stopOptimizer(
  botDomain: string,
  setBotIsOptimizing: Dispatch<SetStateAction<boolean | "isStopping">>,
) {
  function successCallback(payload: successResponseCallBackParams) {
    // TODO check why streing
    setBotIsOptimizing("isStopping");
    createNotification({ title: payload.data });
  }
  function errorCallback(payload: errorResponseCallBackParams) {
    createNotification({
      title: payload.data.responseText || payload.data,
      type: "danger",
    });
    // todo check if running
    setBotIsOptimizing(false);
  }
  sendAndInterpretBotUpdate({
    updatedData: {},
    updateUrl: botDomain + backendRoutes.optimizerStop,
    successCallback,
    errorCallback,
  });
}

export async function resetPingPongStorage(botDomain: string) {
  function successCallback() {
    createNotification({ title: "Successfully cleared daemons storage" });
  }
  function errorCallback() {
    createNotification({
      title: "Failed to reset daemons storage",
      type: "danger",
    });
  }
  sendAndInterpretBotUpdate({
    updatedData: {},
    updateUrl: botDomain + backendRoutes.resetDaemons,
    successCallback,
    errorCallback,
    method: "GET",
  });
}
export async function deleteCurrentCache(
  botDomain: string,
  exchangeId: string,
) {
  function successCallback() {
    createNotification({
      title: "Successfully deleted current trading mode cache",
    });
  }
  function errorCallback() {
    createNotification({
      title: "Failed to delete current trading mode cache",
      type: "danger",
    });
  }
  sendAndInterpretBotUpdate({
    updatedData: {
      exchange_id: exchangeId,
    },
    updateUrl: botDomain + backendRoutes.cacheActionDeleteCurrentCache,
    successCallback,
    errorCallback,
  });
}
export async function deleteAllCache(botDomain: string, exchangeId: string) {
  function successCallback() {
    createNotification({ title: "Successfully deleted all cached values" });
  }
  function errorCallback() {
    createNotification({
      title: "Failed to delete all cached values",
      type: "danger",
    });
  }
  sendAndInterpretBotUpdate({
    updatedData: {
      exchange_id: exchangeId,
    },
    updateUrl: botDomain + backendRoutes.cacheActionDeleteAllCache,
    successCallback,
    errorCallback,
  });
}

export async function cancelAllOrders(
  botDomain: string,
  setIsCancelling: Dispatch<SetStateAction<boolean>>,
) {
  setIsCancelling(true);
  function successCallback() {
    createNotification({ title: "Successfully canceled all orders" });
    setIsCancelling(false);
  }
  function errorCallback() {
    createNotification({
      title: "Failed to cancel all orders",
      type: "danger",
    });
    setIsCancelling(false);
  }
  sendAndInterpretBotUpdate({
    updatedData: {},
    updateUrl: botDomain + backendRoutes.cancelAllOrders,
    successCallback,
    errorCallback,
    method: "GET",
  });
}

export async function cancelOrder(
  botDomain: string,
  orderId: string,
  setIsCancelling: Dispatch<SetStateAction<boolean>>,
) {
  setIsCancelling(true);
  function successCallback() {
    createNotification({ title: "Successfully canceled order" });
    setIsCancelling(false);
  }
  function errorCallback() {
    createNotification({ title: "Failed to cancel order", type: "danger" });
    setIsCancelling(false);
  }
  sendAndInterpretBotUpdate({
    updatedData: orderId,
    updateUrl: botDomain + backendRoutes.cancelOrder,
    successCallback,
    errorCallback,
  });
}

export async function cancelOrders(
  botDomain: string,
  orderIdsArray: string[],
  setIsCancelling: Dispatch<SetStateAction<boolean>>,
  upDateOrders: () => void,
) {
  setIsCancelling?.(true);
  function successCallback(payload: successResponseCallBackParams) {
    if (payload.data === "0 orders cancelled") {
      errorCallback();
      return;
    }
    createNotification({ title: "Successfully canceled orders" });
    upDateOrders();
    setIsCancelling?.(false);
  }
  function errorCallback() {
    createNotification({ title: "Failed to cancel orders", type: "danger" });
    setIsCancelling?.(false);
  }
  sendAndInterpretBotUpdate({
    updatedData: orderIdsArray,
    updateUrl: botDomain + backendRoutes.cancelOrders,
    successCallback,
    errorCallback,
  });
}

export async function updateProfileInfo(
  botDomain: string,
  newProfileInfo: ProfileInfoUpdateType,
  onFail?: (payload: errorResponseCallBackParams) => void,
  onSuccess?: (payload: successResponseCallBackParams) => void,
) {
  function successCallback() {
    createNotification({ title: "Successfully updated profile info" });
  }
  function errorCallback() {
    createNotification({
      title: "Failed to updated profile info",
      type: "danger",
    });
  }
  await sendAndInterpretBotUpdate({
    updatedData: newProfileInfo,
    updateUrl: botDomain + backendRoutes.updateProfileInfo,
    successCallback: onSuccess || successCallback,
    errorCallback: onFail || errorCallback,
  });
}

export async function duplicateProfile({
  botDomain,
  profileId,
  profileName,
  newProfileName,
  selectNewProfile,
  onSuccess,
  onFail,
}: {
  botDomain: string;
  profileId: string;
  profileName: string;
  newProfileName: string;
  selectNewProfile: boolean;
  onFail?: () => void;
  onSuccess?: () => void;
}) {
  function successCallback() {
    onSuccess?.();
    createNotification({
      title: `Successfully created ${newProfileName} strategy`,
    });
  }
  function errorCallback() {
    onFail?.();
    createNotification({
      title: `Failed to duplicate ${profileName} profile`,
      type: "danger",
    });
  }
  await sendAndInterpretBotUpdate({
    updatedData: {
      new_profile_name: newProfileName,
      select_new_profile: selectNewProfile,
    },
    updateUrl: botDomain + backendRoutes.duplicateProfile + profileId,
    successCallback,
    errorCallback,
  });
}

export async function deleteProfile(
  botDomain: string,
  profileId: string,
  profileName: string,
  onSuccess?: () => void,
  onFail?: () => void,
) {
  function successCallback() {
    onSuccess?.();
    createNotification({
      title: `Successfully deleted ${profileName} profile`,
    });
  }
  function errorCallback() {
    onFail?.();
    createNotification({
      title: `Failed to delete ${profileName} profile`,
      type: "danger",
    });
  }
  await sendAndInterpretBotUpdate({
    updatedData: {
      id: profileId,
    },
    updateUrl: botDomain + backendRoutes.deleteProfile,
    successCallback,
    errorCallback,
  });
}

export async function selectProfile(
  botDomain: string,
  profileId: string,
  onSuccess: (payload: successResponseCallBackParams) => void,
  onFail: (payload: errorResponseCallBackParams) => void,
) {
  await sendAndInterpretBotUpdate({
    updatedData: {},
    updateUrl: botDomain + backendRoutes.selectProfile + profileId,
    successCallback: onSuccess,
    errorCallback: onFail,
    method: "GET",
  });
}

// export async function getAllOrders(
//   botDomain: string,
//   setIsLoading: Dispatch<SetStateAction<boolean>>,
//   setOrders
// ) {
//   setIsLoading(true);
//   function successCallback(payload: successResponseCallBackParams) {
//     setOrders(payload.data);
//     setIsLoading(false);
//   }
//   function errorCallback() {
//     createNotification({ title: "Failed to load all orders", type: "danger" });
//     setIsLoading(false);
//   }
//   sendAndInterpretBotUpdate({
//     updatedData: {},
//     updateUrl: botDomain + backendRoutes.getAllOrders,
//     successCallback,
//     errorCallback,
//     method: "GET",
//   });
// }

// export async function getAllTrades(
//   botDomain: string,
//   setIsLoading: Dispatch<SetStateAction<boolean>>,
//   setTrades
// ) {
//   setIsLoading(true);
//   function successCallback(payload: successResponseCallBackParams) {
//     setTrades(payload.data);
//     setIsLoading(false);
//   }
//   function errorCallback() {
//     createNotification({ title: "Failed to load all trades", type: "danger" });
//     setIsLoading(false);
//   }
//   sendAndInterpretBotUpdate({
//     updatedData: {},
//     updateUrl: botDomain + backendRoutes.getAllTrades,
//     successCallback,
//     errorCallback,
//     method: "GET",
//   });
// }
// export async function getAllPositions(
//   botDomain: string,
//   setIsLoading: Dispatch<SetStateAction<boolean>>,
//   setPositions
// ) {
//   setIsLoading(true);
//   function successCallback(payload: successResponseCallBackParams) {
//     setPositions(payload.data);
//     setIsLoading(false);
//   }
//   function errorCallback() {
//     createNotification({ title: "Failed to load positions", type: "danger" });
//     setIsLoading(false);
//   }
//   sendAndInterpretBotUpdate({
//     updatedData: {},
//     updateUrl: botDomain + backendRoutes.getAllPositions,
//     successCallback,
//     errorCallback,
//     method: "GET",
//   });
// }

export async function closeAllPositions(
  botDomain: string,
  setIsClosing: Dispatch<SetStateAction<boolean>>,
) {
  setIsClosing(true);
  function successCallback() {
    createNotification({ title: "Successfully closed all positions" });
    setIsClosing(false);
  }
  function errorCallback() {
    createNotification({
      title: "Failed to close all positions",
      type: "danger",
    });
    setIsClosing(false);
  }
  sendAndInterpretBotUpdate({
    updatedData: {},
    updateUrl: botDomain + backendRoutes.closeAllPositions,
    successCallback,
    errorCallback,
    method: "GET",
  });
}

export async function closePosition(
  botDomain: string,
  symbol: string,
  side: string,
  setIsClosing: Dispatch<SetStateAction<boolean>>,
) {
  setIsClosing(true);
  function successCallback() {
    createNotification({ title: "Successfully closed position" });
    setIsClosing(false);
  }
  function errorCallback() {
    createNotification({ title: "Failed to close position", type: "danger" });
    setIsClosing(false);
  }
  sendAndInterpretBotUpdate({
    updatedData: {
      symbol,
      side,
    },
    updateUrl: botDomain + backendRoutes.closePosition,
    successCallback,
    errorCallback,
  });
}

export async function realTradingSwitch(
  botDomain: string,
  isRealTrading: boolean,
) {
  const title = isRealTrading ? "real" : "simulated";
  function successCallback() {
    createNotification({
      title: `Successfully switched to ${title} trading`,
      message: `${projectName} will restart now`,
    });
  }
  function errorCallback() {
    createNotification({
      title: `Failed to switch to ${title} trading`,
      type: "danger",
    });
  }
  const configUpdate = {
    global_config: {
      trader_enabled: !isRealTrading,
      "trader-simulator_enabled": isRealTrading,
    },
    removed_elements: [],
    restart_after_save: true,
  };
  sendAndInterpretBotUpdate({
    updatedData: configUpdate,
    updateUrl: botDomain + backendRoutes.config,
    successCallback,
    errorCallback,
  });
}

export async function updateConfig(
  botDomain: string,
  newConfig: ExchangeConfigUpdateType,
  profileName: string,
  onFail: () => void,
  onSuccess?: (payload: successResponseCallBackParams) => void,
) {
  function successCallback() {
    createNotification({
      title: `Successfully updated ${profileName} config`,
      message: newConfig.restart_after_save
        ? `${projectName} will restart now`
        : undefined,
    });
  }
  function errorCallback() {
    onFail?.();
    createNotification({
      title: `Failed to update ${profileName} config`,
      type: "danger",
    });
  }
  await sendAndInterpretBotUpdate({
    updatedData: newConfig,
    updateUrl: botDomain + backendRoutes.config,
    successCallback: onSuccess || successCallback,
    errorCallback: onFail || errorCallback,
  });
}

export async function resetTentaclesConfig(
  tentacles: string[],
  botDomain: string,
  setIsResetting: Dispatch<SetStateAction<boolean>>,
  fetchCurrentTentaclesConfig: (
    successCallBack: (payload: successResponseCallBackParams) => void,
  ) => void,
) {
  await Promise.all(
    tentacles.map(async (tentacle) => {
      function errorCallback(payload: errorResponseCallBackParams) {
        createNotification({
          title: `Failed to reset ${tentacle} config`,
          type: "danger",
          message: payload.data?.message || payload.data,
        });
      }
      function successCallback({
        updatedData,
        updateUrl,
        data,
        response,
      }: errorResponseCallBackParams) {
        if (data?.status === "success") {
          createNotification({
            title: `Sucessfully resetted ${tentacle} config`,
          });
        } else {
          errorCallback({
            updatedData,
            updateUrl,
            data,
            response,
          });
        }
      }
      await sendAndInterpretBotUpdate({
        updatedData: {},
        updateUrl: `${
          botDomain + backendRoutes.resetTentaclesConfig
        }&name=${tentacle}`,
        successCallback,
        errorCallback,
      });
      return undefined;
    }),
  );
  fetchCurrentTentaclesConfig(() => setIsResetting(false));
}

export async function resetStorage(
  storage: ResetDataStorageInfoType,
  botDomain: string,
  setIsResetting: Dispatch<SetStateAction<boolean>>,
  reloadUiData: (
    successCallBack: (payload: successResponseCallBackParams) => void,
  ) => void,
) {
  function errorCallback(payload: errorResponseCallBackParams) {
    createNotification({
      title: `Failed to clear ${storage.title} storage`,
      type: "danger",
      message: payload.data?.message || payload.data,
    });
  }
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    if (data?.status === "success") {
      createNotification({
        title: `Sucessfully cleared ${storage.title} storage`,
      });
    } else {
      errorCallback({
        updatedData,
        updateUrl,
        data,
        response,
      });
    }
  }
  await sendAndInterpretBotUpdate({
    updatedData: {},
    updateUrl: botDomain + storage.api,
    successCallback,
    errorCallback,
  });
  reloadUiData(() => setIsResetting(false));
}
