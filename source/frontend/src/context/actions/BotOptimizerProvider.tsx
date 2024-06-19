import type { DefaultEventsMap } from "@socket.io/component-emitter";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useCallback, useContext, useState } from "react";
import type { Socket } from "socket.io-client";

import {
  addToOptimizerQueue,
  startOptimizer,
  stopOptimizer,
} from "../../api/actions";
import { sendAndInterpretBotUpdate } from "../../api/fetchAndStoreFromBot";
import createNotification from "../../components/Notifications/Notification";
import {
  backendRoutes,
  OPTIMIZER_RUN_SETTINGS_KEY,
} from "../../constants/backendConstants";
import { emptyValueFunction } from "../../helpers/helpers";
import { splitTentacleKey } from "../../widgets/AppWidgets/Configuration/OptimizerConfigForm/OptimizerConfigForm";
import { useBotDomainContext } from "../config/BotDomainProvider";
import type {
  OptimizerEditorInputsType,
  OptimizerEditorInputType,
} from "../config/OptimizerEditorProvider";
import {
  useFetchProConfig,
  useOptimizerEditorContext,
} from "../config/OptimizerEditorProvider";
import type {
  TentaclesConfigsRootType,
  TentaclesConfigValuesType,
} from "../config/TentaclesConfigProvider";
import {
  tentacleConfigTypes,
  useTentaclesConfigContext,
} from "../config/TentaclesConfigProvider";
import type { OptimizerUiConfig } from "../config/UiConfigProvider";
import { useUiConfigContext } from "../config/UiConfigProvider";
import type { IdsByExchangeType } from "../data/BotInfoProvider";
import { useBotInfoContext } from "../data/BotInfoProvider";
import { useFetchOptimizerQueue } from "../data/OptimizerQueueProvider";
import type { WebsocketDataType } from "../websockets/AbstractWebsocketContext";
import { AbstractWebsocketContext } from "../websockets/AbstractWebsocketContext";

const BotIsOptimizingContext = createContext<boolean | "isStopping">(false);
const UpdateBotIsOptimizingContext =
  createContext<Dispatch<SetStateAction<boolean | "isStopping">>>(
    emptyValueFunction,
  );

interface OptimizerProgressType extends WebsocketDataType {
  remaining_time?: number;
  overall_progress?: number;
}

const OptimizerProgressContext = createContext<OptimizerProgressType>({});

export const useOptimizerrogressContext = () => {
  return useContext(OptimizerProgressContext);
};

export const useBotIsOptimizingContext = () => {
  return useContext(BotIsOptimizingContext);
};
export const useUpdateBotIsOptimizingContext = () => {
  return useContext(UpdateBotIsOptimizingContext);
};

export const useStopOptimizer = () => {
  const setBotIsOptimizing = useUpdateBotIsOptimizingContext();
  const botDomain = useBotDomainContext();
  const logic = useCallback(() => {
    stopOptimizer(botDomain, setBotIsOptimizing);
  }, [setBotIsOptimizing, botDomain]);
  return logic;
};

export const useStopTraining = () => {
  const botDomain = useBotDomainContext();
  return useCallback(() => {
    function successCallback() {
      createNotification({
        title: "Successfully stopped training",
        message: "Training will stop once this generation has finished",
      });
    }
    function errorCallback() {
      createNotification({ title: "Failed to stop training", type: "danger" });
    }
    sendAndInterpretBotUpdate({
      updateUrl: botDomain + backendRoutes.trainingStop,
      successCallback,
      errorCallback,
    });
  }, [botDomain]);
};

export interface StartOptimizerSettingsType extends OptimizerUiConfig {
  exchange_ids: string[];
  config: OptimizerEditorInputsType;
}

function getOptimizerStartSettings(
  optimizerSettings: OptimizerUiConfig,
  idsByExchangeName: IdsByExchangeType,
  optimizerInputs: OptimizerEditorInputsType,
  exchangeNames: string[],
): StartOptimizerSettingsType {
  return {
    ...optimizerSettings,
    exchange_ids: exchangeNames.map((exchangeName) =>
      String(idsByExchangeName[exchangeName]),
    ),
    config: optimizerInputs,
  };
}

export const useStartOptimizer = () => {
  const setBotIsOptimizing = useUpdateBotIsOptimizingContext();
  const uiConfig = useUiConfigContext();
  const optimizerSettings = uiConfig?.[OPTIMIZER_RUN_SETTINGS_KEY];
  const botDomain = useBotDomainContext();
  const botInfo = useBotInfoContext();
  const idsByExchangeName = botInfo?.ids_by_exchange_name;
  const exchangeNames = optimizerSettings?.exchange_names;
  const optimizerForm = useOptimizerEditorContext();
  const fetchProConfig = useFetchProConfig();
  return useCallback(() => {
    if (exchangeNames && idsByExchangeName) {
      if (optimizerForm?.optimizer_inputs?.user_inputs) {
        startOptimizer(
          botDomain,
          getOptimizerStartSettings(
            optimizerSettings,
            idsByExchangeName,
            optimizerForm.optimizer_inputs,
            exchangeNames,
          ),
          setBotIsOptimizing,
        );
      } else {
        // settings not loaded yet, use directly from settings storage
        fetchProConfig((fetchedOptimizerForm) => {
          if (fetchedOptimizerForm?.optimizer_inputs?.user_inputs) {
            startOptimizer(
              botDomain,
              getOptimizerStartSettings(
                optimizerSettings,
                idsByExchangeName,
                fetchedOptimizerForm.optimizer_inputs,
                exchangeNames,
              ),
              setBotIsOptimizing,
            );
          } else {
            createNotification({
              title: "Failed to start the optimizer",
              type: "danger",
              message: "Check your optimizer run configuration",
            });
          }
        });
      }
    } else {
      createNotification({
        title: "Failed to start optimizer",
        type: "danger",
        message: "Exchange name(s) are missing from the run config.",
      });
    }
  }, [
    exchangeNames,
    idsByExchangeName,
    optimizerForm?.optimizer_inputs,
    botDomain,
    optimizerSettings,
    setBotIsOptimizing,
    fetchProConfig,
  ]);
};

export const useAddToOptimizerQueue = () => {
  const uiConfig = useUiConfigContext();
  const optimizerSettings = uiConfig?.[OPTIMIZER_RUN_SETTINGS_KEY];
  const botDomain = useBotDomainContext();
  const botInfo = useBotInfoContext();
  const exchageId = botInfo?.exchange_id;
  const optimizerForm = useOptimizerEditorContext();
  const fetchOptimizerQueue = useFetchOptimizerQueue();
  const fetchProConfig = useFetchProConfig();
  const currentTentaclesConfig = useTentaclesConfigContext();
  const currentTentaclesTradingConfig =
    currentTentaclesConfig?.[tentacleConfigTypes.tradingTentacles];
  return useCallback(() => {
    if (currentTentaclesTradingConfig) {
      if (exchageId) {
        if (optimizerSettings) {
          if (optimizerForm?.optimizer_inputs?.user_inputs) {
            addToOptimizerQueue(
              botDomain,
              optimizerSettings,
              filterActiveUserInputs(
                currentTentaclesTradingConfig,
                optimizerForm.optimizer_inputs,
              ),
              fetchOptimizerQueue,
            );
          } else {
            // settings not loaded yet, use directly from settings storage
            fetchProConfig((fetchedOptimizerForm) => {
              if (fetchedOptimizerForm?.optimizer_inputs?.user_inputs) {
                addToOptimizerQueue(
                  botDomain,
                  optimizerSettings,
                  filterActiveUserInputs(
                    currentTentaclesTradingConfig,
                    fetchedOptimizerForm.optimizer_inputs,
                  ),
                  fetchOptimizerQueue,
                );
              } else {
                createNotification({
                  title: "Failed to add to optimizer queue",
                  type: "danger",
                  message: "Check your optimizer run configuration",
                });
              }
            });
          }
        } else {
          createNotification({
            title: "Failed to add to the queue",
            type: "danger",
            message: "Optimizer settings arent initialized yet.",
          });
        }
      } else {
        createNotification({
          title: "Failed to add to the queue",
          type: "danger",
          message: "The exchange is not initialized",
        });
      }
    } else {
      createNotification({
        title: "Failed to add to the queue",
        type: "danger",
        message: "Trading config is not initialized yet",
      });
    }
  }, [
    exchageId,
    optimizerSettings,
    optimizerForm?.optimizer_inputs,
    botDomain,
    currentTentaclesTradingConfig,
    fetchOptimizerQueue,
    fetchProConfig,
  ]);
};

export function filterActiveUserInputs(
  currentTentaclesTradingConfig: TentaclesConfigsRootType,
  optimizerForm: OptimizerEditorInputsType,
): OptimizerEditorInputsType {
  const filteredOptimizerInputs: OptimizerEditorInputType = {};
  optimizerForm.user_inputs &&
    Object.entries(optimizerForm.user_inputs).forEach(([inputKey, values]) => {
      if (values.enabled) {
        const { rootTentacle, tentacleKeys } = splitTentacleKey(
          values.tentacle,
        );
        const rootTentacleConfigs =
          currentTentaclesTradingConfig[rootTentacle]?.config;
        if (
          rootTentacleConfigs &&
          hasUserInput(rootTentacleConfigs, [
            ...tentacleKeys,
            values.user_input,
          ])
        ) {
          filteredOptimizerInputs[inputKey] = values;
        }
      }
    });
  return {
    filters_settings: [...(optimizerForm.filters_settings || [])],
    user_inputs: filteredOptimizerInputs,
  };
}

function hasUserInput(
  currentTentaclesTradingConfig: TentaclesConfigValuesType,
  tentacleKeys: string[],
): boolean {
  const [nextInputKey, ...nextTentacleKeys] = tentacleKeys;
  const thisConfig =
    nextInputKey && currentTentaclesTradingConfig?.[nextInputKey];
  if (nextTentacleKeys.length === 0) {
    return thisConfig !== undefined;
  } else {
    if (typeof thisConfig === "object") {
      return hasUserInput(
        thisConfig as TentaclesConfigValuesType,
        nextTentacleKeys,
      );
    }
    return false;
  }
}

export const BotOptimizerProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [botIsOptimizing, setBotIsOptimizing] = useState<
    boolean | "isStopping"
  >(false);
  const [optimizerProgress, setOptimizerProgress] =
    useState<OptimizerProgressType>({});
  const botDomain = useBotDomainContext();
  const socketUrl = `${botDomain}/strategy_optimizer`;
  function onConnectionUpdate(
    data: OptimizerProgressType,
    socket: Socket<DefaultEventsMap, DefaultEventsMap>,
  ) {
    if (data) {
      setOptimizerProgress(data);
    }
    if (data?.status === "starting" || data?.status === "computing") {
      setBotIsOptimizing(true);
      setTimeout(() => {
        socket.emit("strategy_optimizer_status");
      }, 2000);
    } else {
      setBotIsOptimizing((prevState) => {
        if (data?.status === "finished" && prevState) {
          createNotification({ title: "Optimizer finished successfully" });
        }
        return false;
      });
    }
  }
  function onConnectionLost() {
    setBotIsOptimizing(false);
  }
  return (
    <BotIsOptimizingContext.Provider value={botIsOptimizing}>
      <UpdateBotIsOptimizingContext.Provider value={setBotIsOptimizing}>
        <OptimizerProgressContext.Provider value={optimizerProgress}>
          <AbstractWebsocketContext
            socketUrl={socketUrl}
            onConnectionUpdate={onConnectionUpdate}
            onConnectionLost={onConnectionLost}
            onKey={"strategy_optimizer_status"}
          >
            {children}
          </AbstractWebsocketContext>
        </OptimizerProgressContext.Provider>
      </UpdateBotIsOptimizingContext.Provider>
    </BotIsOptimizingContext.Provider>
  );
};
