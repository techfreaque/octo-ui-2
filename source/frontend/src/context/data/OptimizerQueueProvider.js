import {
  useState,
  useContext,
  createContext,
  useCallback,
} from "react";
import fetchAndStoreFromBot, { sendAndInterpretBotUpdate } from "../../api/fetchAndStoreFromBot";
import createNotification from "../../components/Notifications/Notification";
import { backendRoutes } from "../../constants/backendConstants";
import { useBotDomainContext } from "../config/BotDomainProvider";


const OptimizerQueueContext = createContext();
const UpdateOptimizerQueueContext = createContext();

const OptimizerQueueCounterContext = createContext();
const UpdateOptimizerQueueCounterContext = createContext();


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
  const logic = useCallback(() => {
    fetchAndStoreFromBot(
      botDomain + backendRoutes.optimizerQueueUpdate,
      setOptimizerQueue, "get", {}, false, false,
    )
  }, [botDomain, setOptimizerQueue]);
  return logic;
};

export const useSaveOptimizerQueue = () => {
  const setOptimizerQueue = useUpdateOptimizerQueueContext();
  const botDomain = useBotDomainContext();
  const logic = useCallback((updatedQueue) => {
    const success = (updated_data, update_url, result, msg, status) => {
      setOptimizerQueue(msg)
      createNotification("Optimizer queue updated", "success")
    }
    const fail = () => {
      createNotification("Failed to update Optimizer queue", "danger")
    }
    sendAndInterpretBotUpdate(updatedQueue, botDomain + backendRoutes.optimizerQueueUpdate, success, fail)
  }, [setOptimizerQueue, botDomain]);
  return logic;
};

export const OptimizerQueueProvider = ({ children }) => {
  const [optimizerQueue, setOptimizerQueue] = useState({});
  const [optimizerQueueCounter, setOptimizerQueueCounter] = useState(0);
  return (
    <OptimizerQueueContext.Provider value={optimizerQueue}>
      <UpdateOptimizerQueueContext.Provider value={setOptimizerQueue}>
        <OptimizerQueueCounterContext.Provider value={optimizerQueueCounter}>
          <UpdateOptimizerQueueCounterContext.Provider value={setOptimizerQueueCounter}>
            {children}
          </UpdateOptimizerQueueCounterContext.Provider>
        </OptimizerQueueCounterContext.Provider>
      </UpdateOptimizerQueueContext.Provider>
    </OptimizerQueueContext.Provider>
  );
};
