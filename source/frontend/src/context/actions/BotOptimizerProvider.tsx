import {
  useState,
  useContext,
  createContext,
  useCallback,
  SetStateAction,
  Dispatch,
} from "react";
import {
  addToOptimizerQueue,
  startOptimizer,
  stopOptimizer,
} from "../../api/actions";
import {
  OPTIMIZER_RUN_SETTINGS_KEY,
  backendRoutes,
} from "../../constants/backendConstants";
import { useBotDomainContext } from "../config/BotDomainProvider";
import { useBotInfoContext } from "../data/BotInfoProvider";
import { useFetchOptimizerQueue } from "../data/OptimizerQueueProvider";
import {
  useFetchProConfig,
  useOptimizerEditorContext,
} from "../config/OptimizerEditorProvider";
import { useUiConfigContext } from "../config/UiConfigProvider";
import {
  AbstractWebsocketContext,
  WebsocketDataType,
} from "../websockets/AbstractWebsocketContext";
import createNotification from "../../components/Notifications/Notification";
import {
  errorResponseCallBackParams,
  sendAndInterpretBotUpdate,
  successResponseCallBackParams,
} from "../../api/fetchAndStoreFromBot";
import type { DefaultEventsMap } from "@socket.io/component-emitter";
import type { Socket } from "socket.io-client";

const BotIsOptimizingContext = createContext<boolean | "isStopping">(false);
const UpdateBotIsOptimizingContext = createContext<
  Dispatch<SetStateAction<boolean | "isStopping">>
>((_value) => {});

interface OptimizerProgressType extends WebsocketDataType {
  remaining_time?;
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
    function successCallback({
      updatedData,
      updateUrl,
      data,
      response,
    }: successResponseCallBackParams) {
      createNotification({
        title: "Successfully stopped training",
        message: "Training will stop once this generation has finished",
      });
    }
    function errorCallback({
      updatedData,
      updateUrl,
      data,
      response,
    }: errorResponseCallBackParams) {
      createNotification({ title: "Failed to stop training", type: "danger" });
    }
    sendAndInterpretBotUpdate({
      updateUrl: botDomain + backendRoutes.trainingStop,
      successCallback,
      errorCallback,
    });
  }, [botDomain]);
};

export const useStartOptimizer = () => {
  const setBotIsOptimizing = useUpdateBotIsOptimizingContext();
  const uiConfig = useUiConfigContext();
  const optimizerSettings = uiConfig?.[OPTIMIZER_RUN_SETTINGS_KEY];
  const botDomain = useBotDomainContext();
  const botInfo = useBotInfoContext();
  const idsByExchangeName = botInfo?.ids_by_exchange_name;
  const optimizerForm = useOptimizerEditorContext();
  const fetchProConfig = useFetchProConfig();
  const logic = useCallback(() => {
    // TODO validate settings
    if (optimizerSettings && idsByExchangeName) {
      if (!optimizerForm?.optimizer_inputs?.user_inputs) {
        // settings not loaded yet, use directly from settings storage
        fetchProConfig((fetchedOptimizerForm) => {
          if (fetchedOptimizerForm?.optimizer_inputs) {
            startOptimizer(
              botDomain,
              optimizerSettings,
              fetchedOptimizerForm.optimizer_inputs,
              idsByExchangeName,
              setBotIsOptimizing
            );
          } else {
            createNotification({
              title: "Failed to add to optimizer queue",
              type: "danger",
              message: "Check your optimizer run configuration",
            });
          }
        });
      } else {
        startOptimizer(
          botDomain,
          optimizerSettings,
          optimizerForm?.optimizer_inputs,
          idsByExchangeName,
          setBotIsOptimizing
        );
      }
    }
  }, [
    optimizerSettings,
    idsByExchangeName,
    optimizerForm?.optimizer_inputs,
    fetchProConfig,
    botDomain,
    setBotIsOptimizing,
  ]);
  return logic;
};

export const useAddToOptimizerQueue = () => {
  const setBotIsOptimizing = useUpdateBotIsOptimizingContext();
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
      if (!optimizerForm?.optimizer_inputs?.user_inputs) {
        // settings not loaded yet, use directly from settings storage
        fetchProConfig((fetchedOptimizerForm) => {
          if (fetchedOptimizerForm?.optimizer_inputs) {
            addToOptimizerQueue(
              botDomain,
              optimizerSettings,
              fetchedOptimizerForm.optimizer_inputs,
              exchageId,
              setBotIsOptimizing,
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
      } else {
        addToOptimizerQueue(
          botDomain,
          optimizerSettings,
          optimizerForm?.optimizer_inputs,
          exchageId,
          setBotIsOptimizing,
          fetchOptimizerQueue
        );
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
    setBotIsOptimizing,
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
