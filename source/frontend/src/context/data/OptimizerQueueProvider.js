import {
  useState,
  useContext,
  createContext,
  useCallback,
} from "react";
import { sendAndInterpretBotUpdate } from "../../api/fetchAndStoreFromBot";
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
    // fetchAndStoreFromBot(
    //   botDomain + backendRoutes.optimizerQueueUpdate,
    //   setOptimizerQueue, "get", {}, false, false,
    // )
    const fail = (updated_data, update_url, result, msg, status) => {
      createNotification("Failed to load the optimizer queue", "danger")
    }
    const success = (updated_data, update_url, result, msg, status) => {
      if (!msg?.success) {
        return fail(updated_data, update_url, result, msg, status)
      }
      setOptimizerQueue(msg?.data)
    }
    sendAndInterpretBotUpdate({}, botDomain + backendRoutes.optimizerGetQueue, success, fail, "GET")
  }, [botDomain, setOptimizerQueue]);
  return logic;
};

export const useSaveOptimizerQueue = () => {
  const botDomain = useBotDomainContext();
  const logic = useCallback((updatedQueue) => {
    const fail = (updated_data, update_url, result, msg, status) => {
      createNotification("Failed to update Optimizer queue", "danger", msg?.message)
    }
    const success = (updated_data, update_url, result, msg, status) => {
      if (!msg?.success) {
        return fail(updated_data, update_url, result, msg, status)
      }
      createNotification("Optimizer queue updated", "success")
    }
    sendAndInterpretBotUpdate(updatedQueue, botDomain + backendRoutes.optimizerQueueUpdate, success, fail)
  }, [botDomain]);
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
