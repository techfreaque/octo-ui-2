import type { Dispatch, SetStateAction } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import type {
  errorResponseCallBackParams,
  successResponseCallBackParams,
} from "../../api/fetchAndStoreFromBot";
import { sendAndInterpretBotUpdate } from "../../api/fetchAndStoreFromBot";
import createNotification from "../../components/Notifications/Notification";
import { backendRoutes } from "../../constants/backendConstants";
import { emptyValueFunction } from "../../helpers/helpers";
import { useBotDomainContext } from "../config/BotDomainProvider";

export interface RunInputType {
  user_input: string;
  tentacle: string[];
  value: string | number | boolean;
}

export type RunType = RunInputType[];

export interface OptimizerQueueElementType {
  id: number;
  runs: { [key: number]: RunType };
}
export type OptimizerQueueType = OptimizerQueueElementType[];

export interface UpdatedRunInputType extends RunInputType {
  deleted: boolean;
}

export type UpdatedRunType = UpdatedRunInputType[];

export type OptimizerQueueUpdateType = {
  updatedQueue: {
    id: number;
    delete_every_run: boolean;
    runs: UpdatedRunType[];
  };
};

const OptimizerQueueContext = createContext<OptimizerQueueType | undefined>(
  undefined,
);
const UpdateOptimizerQueueContext =
  createContext<Dispatch<SetStateAction<OptimizerQueueType | undefined>>>(
    emptyValueFunction,
  );

const OptimizerQueueCounterContext = createContext<number>(0);
const UpdateOptimizerQueueCounterContext =
  createContext<Dispatch<SetStateAction<number>>>(emptyValueFunction);

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
    const errorCallback = () => {
      createNotification({
        title: "Failed to load the optimizer queue",
        type: "danger",
      });
    };
    const successCallback = (payload: successResponseCallBackParams) => {
      if (!payload.data?.success) {
        errorCallback();
        return;
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
  const fetchOptimizerQueue = useFetchOptimizerQueue();
  return useCallback(
    (
      updatedQueue: OptimizerQueueUpdateType,
      setIsUpdating: Dispatch<SetStateAction<boolean>>,
    ) => {
      setIsUpdating(true);
      const errorCallback = (payload: errorResponseCallBackParams) => {
        createNotification({
          title: "Failed to update Optimizer queue",
          type: "danger",
          message: payload.data?.message,
        });
        setIsUpdating(false);
      };
      const successCallback = (payload: successResponseCallBackParams) => {
        if (!payload.data?.success) {
          errorCallback(payload);
          return;
        }
        fetchOptimizerQueue();
        createNotification({ title: "Optimizer queue updated" });
        setIsUpdating(false);
      };
      sendAndInterpretBotUpdate({
        updatedData: updatedQueue,
        updateUrl: botDomain + backendRoutes.optimizerQueueUpdate,
        successCallback,
        errorCallback,
      });
    },
    [botDomain, fetchOptimizerQueue],
  );
};

export function updateOptimizerQueueCount(
  optimizerQueue: OptimizerQueueType | undefined,
  updateOptimizerQueueCounter: Dispatch<SetStateAction<number>>,
) {
  let count = 0;
  if (optimizerQueue?.length) {
    optimizerQueue.forEach((optimizerRun) => {
      count += Object.keys(optimizerRun.runs).length;
    });
  }
  updateOptimizerQueueCounter(count);
}

export const OptimizerQueueProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [optimizerQueue, setOptimizerQueue] = useState<OptimizerQueueType>();
  const [optimizerQueueCounter, setOptimizerQueueCounter] = useState<number>(0);
  useEffect(() => {
    updateOptimizerQueueCount(optimizerQueue, setOptimizerQueueCounter);
  }, [optimizerQueue]);
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
