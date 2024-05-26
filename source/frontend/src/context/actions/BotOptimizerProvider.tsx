import type { DefaultEventsMap } from "@socket.io/component-emitter";
import type {
  Dispatch,
  SetStateAction} from "react";
import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
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
import { useBotDomainContext } from "../config/BotDomainProvider";
import type {
  OptimizerEditorInputsType} from "../config/OptimizerEditorProvider";
import {
  useFetchProConfig,
  useOptimizerEditorContext,
} from "../config/OptimizerEditorProvider";
import type {
  OptimizerUiConfig} from "../config/UiConfigProvider";
import {
  useUiConfigContext,
} from "../config/UiConfigProvider";
import type { IdsByExchangeType} from "../data/BotInfoProvider";
import { useBotInfoContext } from "../data/BotInfoProvider";
import { useFetchOptimizerQueue } from "../data/OptimizerQueueProvider";
import type {
  WebsocketDataType} from "../websockets/AbstractWebsocketContext";
import {
  AbstractWebsocketContext
} from "../websockets/AbstractWebsocketContext";

const BotIsOptimizingContext = createContext<boolean | "isStopping">(false);
const UpdateBotIsOptimizingContext = createContext<
  Dispatch<SetStateAction<boolean | "isStopping">>
>(emptyValueFunction);

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
  exchangeNames: string[]
): StartOptimizerSettingsType {
  return {
    ...optimizerSettings,
    exchange_ids: exchangeNames.map((exchangeName) =>
      String(idsByExchangeName[exchangeName])
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
            exchangeNames
          ),
          setBotIsOptimizing
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
                exchangeNames
              ),
              setBotIsOptimizing
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
  return useCallback(() => {
    if (exchageId) {
      if (optimizerSettings) {
        if (optimizerForm?.optimizer_inputs?.user_inputs) {
          addToOptimizerQueue(
            botDomain,
            optimizerSettings,
            optimizerForm?.optimizer_inputs,
            fetchOptimizerQueue
          );
        } else {
          // settings not loaded yet, use directly from settings storage
          fetchProConfig((fetchedOptimizerForm) => {
            if (fetchedOptimizerForm?.optimizer_inputs) {
              addToOptimizerQueue(
                botDomain,
                optimizerSettings,
                fetchedOptimizerForm.optimizer_inputs,
                fetchOptimizerQueue
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
  }, [
    optimizerSettings,
    exchageId,
    optimizerForm,
    botDomain,
    fetchOptimizerQueue,
    fetchProConfig,
  ]);
};

export const BotOptimizerProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [botIsOptimizing, setBotIsOptimizing] = useState<
    boolean | "isStopping"
  >(false);
  const [optimizerProgress, setOptimizerProgress] = useState<
    OptimizerProgressType
  >({});
  const botDomain = useBotDomainContext();
  const socketUrl = `${botDomain}/strategy_optimizer`;
  function onConnectionUpdate(
    data: OptimizerProgressType,
    socket: Socket<DefaultEventsMap, DefaultEventsMap>
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
