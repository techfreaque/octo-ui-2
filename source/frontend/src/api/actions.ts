import { Dispatch, SetStateAction } from "react";
import createNotification from "../components/Notifications/Notification";
import { backendRoutes } from "../constants/backendConstants";
import {
  errorResponseCallBackParams,
  sendAndInterpretBotUpdate,
  successResponseCallBackParams,
} from "./fetchAndStoreFromBot";
import { MuiDataTableRowType } from "../components/Tables/MuiDataTable";

export async function startBacktesting(
  botDomain: string,
  backtestingSettings,
  setBotIsBacktesting: Dispatch<SetStateAction<boolean>>
) {
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    setBotIsBacktesting(true);
    createNotification({ title: data });
  }
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
    createNotification({ title: data.responseText, type: "danger" });
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
  notification: boolean
) {
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    updateIsOnline(false);
    if (notification) createNotification({ title: "The bot is restarting..." });
  }
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
    if (notification)
      createNotification({ title: "Failed to restart bot", type: "danger" });
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
  onLoggedOut: () => void
) {
  setIsloading(true);
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    updateIsOnline(false);
    createNotification({ title: "Logged out successfully" });
    setIsloading(false);
    onLoggedOut();
  }
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
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
  setIsloading: Dispatch<SetStateAction<boolean>>
) {
  setIsloading(true);
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    updateIsOnline(false);
    createNotification({ title: "The bot is stopping..." });
    setIsloading(false);
  }
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
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
  setIsloading: Dispatch<SetStateAction<boolean>>
) {
  setIsloading(true);
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    updateIsOnline(false);
    createNotification({ title: "The bot is updating..." });
    setIsloading(false);
  }
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
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
  optimizerRunSettings,
  optimizerSettingsForm,
  ids_by_exchange_name,
  setBotIsOptimizing: Dispatch<SetStateAction<boolean | "isStopping">>
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
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
    createNotification({ title: data.message, type: "danger" });
  }
  sendAndInterpretBotUpdate({
    updatedData: {
      ...optimizerRunSettings,
      exchange_ids: optimizerRunSettings.exchange_names.map(
        (exchangeName) => ids_by_exchange_name[exchangeName]
      ),
      config: optimizerSettingsForm,

      // TODO remove when stock supports ids
      data_source: optimizerRunSettings?.data_files?.[0] || "current_bot_data",
      exchange_id: ids_by_exchange_name[optimizerRunSettings.exchange_names[0]],
    },
    updateUrl: botDomain + backendRoutes.optimizerStart,
    successCallback,
    errorCallback,
  });
}

export async function addToOptimizerQueue(
  botDomain: string,
  optimizerRunSettings,
  optimizerSettingsForm,
  exchageId: string,
  setBotIsOptimizing: Dispatch<SetStateAction<boolean | "isStopping">>,
  fetchOptimizerQueue
) {
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    fetchOptimizerQueue();
    createNotification({ title: data?.message || data });
  }
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
    createNotification({ title: data?.message || data, type: "danger" });
  }
  sendAndInterpretBotUpdate({
    updatedData: {
      ...optimizerRunSettings,
      // exchange_id: exchageId,
      optimizer_config: optimizerSettingsForm,
    },
    updateUrl: botDomain + backendRoutes.optimizerAddToQueue,
    successCallback,
    errorCallback,
  });
}

export async function stopBacktesting(
  botDomain: string,
  setBotIsBacktesting: Dispatch<SetStateAction<boolean>>
) {
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    setBotIsBacktesting(false);
    createNotification({ title: data });
  }
  sendAndInterpretBotUpdate({
    updatedData: {},
    updateUrl: botDomain + backendRoutes.backtestingStop,
    successCallback,
  });
}

export async function stopOptimizer(
  botDomain: string,
  setBotIsOptimizing: Dispatch<SetStateAction<boolean | "isStopping">>
) {
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    // TODO check why streing
    setBotIsOptimizing("isStopping");
    createNotification({ title: data });
  }
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
    createNotification({ title: data.responseText || data, type: "danger" });
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
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    createNotification({ title: "Successfully cleared daemons storage" });
  }
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
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
  exchangeId: string
) {
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    createNotification({
      title: "Successfully deleted current trading mode cache",
    });
  }
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
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
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    createNotification({ title: "Successfully deleted all cached values" });
  }
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
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
  setIsCancelling: Dispatch<SetStateAction<boolean>>
) {
  setIsCancelling(true);
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    createNotification({ title: "Successfully canceled all orders" });
    setIsCancelling(false);
  }
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
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
  setIsCancelling: Dispatch<SetStateAction<boolean>>
) {
  setIsCancelling(true);
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    createNotification({ title: "Successfully canceled order" });
    setIsCancelling(false);
  }
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
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
  setIsCancelling?: Dispatch<SetStateAction<boolean>>
) {
  setIsCancelling?.(true);
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    createNotification({ title: "Successfully canceled orders" });
    setIsCancelling?.(false);
  }
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
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
  newProfileInfo,
  onFail?: (payload: errorResponseCallBackParams) => void,
  onSuccess?: (payload: successResponseCallBackParams) => void
) {
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    createNotification({ title: "Successfully updated profile info" });
  }
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
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
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    onSuccess?.();
    createNotification({
      title: `Successfully created ${newProfileName} strategy`,
    });
  }
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
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
  onFail?: () => void
) {
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    onSuccess?.();
    createNotification({
      title: `Successfully deleted ${profileName} profile`,
    });
  }
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
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
  profileName: string,
  onSuccess: (payload: successResponseCallBackParams) => void,
  onFail: (payload: errorResponseCallBackParams) => void
) {
  await sendAndInterpretBotUpdate({
    updatedData: {},
    updateUrl: botDomain + backendRoutes.selectProfile + profileId,
    successCallback: onSuccess,
    errorCallback: onFail,
    method: "GET",
  });
}

export async function getAllOrders(
  botDomain: string,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setOrders: Dispatch<SetStateAction<MuiDataTableRowType[] | undefined>>
) {
  setIsLoading(true);
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    setOrders(data);
    setIsLoading(false);
  }
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
    createNotification({ title: "Failed to load all orders", type: "danger" });
    setIsLoading(false);
  }
  sendAndInterpretBotUpdate({
    updatedData: {},
    updateUrl: botDomain + backendRoutes.getAllOrders,
    successCallback,
    errorCallback,
    method: "GET",
  });
}

export async function getAllTrades(
  botDomain: string,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setTrades: Dispatch<SetStateAction<MuiDataTableRowType[] | undefined>>
) {
  setIsLoading(true);
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    setTrades(data);
    setIsLoading(false);
  }
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
    createNotification({ title: "Failed to load all trades", type: "danger" });
    setIsLoading(false);
  }
  sendAndInterpretBotUpdate({
    updatedData: {},
    updateUrl: botDomain + backendRoutes.getAllTrades,
    successCallback,
    errorCallback,
    method: "GET",
  });
}
export async function getAllPositions(
  botDomain: string,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setPositions: Dispatch<SetStateAction<MuiDataTableRowType[] | undefined>>
) {
  setIsLoading(true);
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    setPositions(data);
    setIsLoading(false);
  }
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
    createNotification({ title: "Failed to load positions", type: "danger" });
    setIsLoading(false);
  }
  sendAndInterpretBotUpdate({
    updatedData: {},
    updateUrl: botDomain + backendRoutes.getAllPositions,
    successCallback,
    errorCallback,
    method: "GET",
  });
}

export async function closeAllPositions(
  botDomain: string,
  setIsClosing: Dispatch<SetStateAction<boolean>>
) {
  setIsClosing(true);
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    createNotification({ title: "Successfully closed all positions" });
    setIsClosing(false);
  }
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
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
  setIsClosing: Dispatch<SetStateAction<boolean>>
) {
  setIsClosing(true);
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    createNotification({ title: "Successfully closed position" });
    setIsClosing(false);
  }
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
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
  isRealTrading: boolean
) {
  const title = isRealTrading ? "real" : "simulated";
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    createNotification({
      title: `Successfully switched to ${title} trading`,
      message: "OctoBot will restart now",
    });
  }
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
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
  newConfig,
  profileName: string,
  onFail: () => void,
  onSuccess?: (payload: successResponseCallBackParams) => void
) {
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    createNotification({
      title: `Successfully updated ${profileName} config`,
      message: newConfig.restart_after_save && "OctoBot will restart now",
    });
  }
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
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
    successCallBack: (payload: successResponseCallBackParams) => void
  ) => void
) {
  await Promise.all(
    tentacles.map(async (tentacle) => {
      function errorCallback({
        updatedData,
        updateUrl,
        data,
        response,
      }: errorResponseCallBackParams) {
        createNotification({
          title: `Failed to reset ${tentacle} config`,
          type: "danger",
          message: data?.message || data,
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
    })
  );
  fetchCurrentTentaclesConfig(() => setIsResetting(false));
}

export async function resetStorage(
  storage,
  botDomain: string,
  setIsResetting: Dispatch<SetStateAction<boolean>>,
  reloadUiData: (
    successCallBack: (payload: successResponseCallBackParams) => void
  ) => void
) {
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
    createNotification({
      title: `Failed to clear ${storage.title} storage`,
      type: "danger",
      message: data?.message || data,
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
