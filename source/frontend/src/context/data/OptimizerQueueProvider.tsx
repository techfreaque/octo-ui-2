import {
  useState,
  useContext,
  createContext,
  useCallback,
  SetStateAction,
  Dispatch,
} from "react";
import {
  errorResponseCallBackParams,
  sendAndInterpretBotUpdate,
  successResponseCallBackParams,
} from "../../api/fetchAndStoreFromBot";
import createNotification from "../../components/Notifications/Notification";
import { backendRoutes } from "../../constants/backendConstants";
import { useBotDomainContext } from "../config/BotDomainProvider";

interface OptimizerQueueType {}

const OptimizerQueueContext = createContext<OptimizerQueueType | undefined>(
  undefined
);
const UpdateOptimizerQueueContext = createContext<
  Dispatch<SetStateAction<OptimizerQueueType | undefined>>
>((_value) => {});

const OptimizerQueueCounterContext = createContext<number>(0);
const UpdateOptimizerQueueCounterContext = createContext<
  Dispatch<SetStateAction<number>>
>((_value) => {});

export const useOptimizerQueueContext = () => {
  return useContext(OptimizerQueueContext);
};

export const useUpdateOptimizerQueueContext = () => {
  return useContext(UpdateOptimizerQueueContext);
};

export const useOptimizerQueueCounterContext = () => {
  return useContext(OptimizerQueueCounterContext);
};

export const useUpdateOptimizerQueueCounterContext = () => {
  return useContext(UpdateOptimizerQueueCounterContext);
};

export const useFetchOptimizerQueue = () => {
  const setOptimizerQueue = useUpdateOptimizerQueueContext();
  const botDomain = useBotDomainContext();
  return useCallback(() => {
    const errorCallback = (payload: errorResponseCallBackParams) => {
      createNotification({
        title: "Failed to load the optimizer queue",
        type: "danger",
      });
    };
    const successCallback = (payload: successResponseCallBackParams) => {
      if (!payload.data?.success) {
        return errorCallback(payload);
      }
      setOptimizerQueue(payload.data?.data);
    };
    sendAndInterpretBotUpdate({
      updateUrl: botDomain + backendRoutes.optimizerGetQueue,
      successCallback,
      errorCallback,
      method: "GET",
    });
  }, [botDomain, setOptimizerQueue]);
};

export const useSaveOptimizerQueue = () => {
  const botDomain = useBotDomainContext();
  return useCallback(
    (updatedQueue: OptimizerQueueType) => {
      const errorCallback = (payload: errorResponseCallBackParams) => {
        createNotification({
          title: "Failed to update Optimizer queue",
          type: "danger",
          message: payload.data?.message,
        });
      };
      const successCallback = (payload: successResponseCallBackParams) => {
        if (!payload.data?.success) {
          return errorCallback(payload);
        }
        createNotification({ title: "Optimizer queue updated" });
      };
      sendAndInterpretBotUpdate({
        updatedData: updatedQueue,
        updateUrl: botDomain + backendRoutes.optimizerQueueUpdate,
        successCallback,
        errorCallback,
      });
    },
    [botDomain]
  );
};

export const OptimizerQueueProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [optimizerQueue, setOptimizerQueue] = useState<OptimizerQueueType>();
  const [optimizerQueueCounter, setOptimizerQueueCounter] = useState<number>(0);
  return (
    <OptimizerQueueContext.Provider value={optimizerQueue}>
      <UpdateOptimizerQueueContext.Provider value={setOptimizerQueue}>
        <OptimizerQueueCounterContext.Provider value={optimizerQueueCounter}>
          <UpdateOptimizerQueueCounterContext.Provider
            value={setOptimizerQueueCounter}
          >
            {children}
          </UpdateOptimizerQueueCounterContext.Provider>
        </OptimizerQueueCounterContext.Provider>
      </UpdateOptimizerQueueContext.Provider>
    </OptimizerQueueContext.Provider>
  );
};
