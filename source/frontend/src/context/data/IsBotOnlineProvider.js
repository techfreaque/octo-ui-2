import {
  useState,
  useContext,
  createContext,
} from "react";

const IsBotOnlineContext = createContext();
const UpdateIsBotOnlineContext = createContext();

export const useIsBotOnlineContext = () => {
  return useContext(IsBotOnlineContext);
};

export const useUpdateIsBotOnlineContext = () => {
  return useContext(UpdateIsBotOnlineContext);
};

export const IsBotOnlineProvider = ({ children }) => {
  // gets updated by NotifiactionContext
  const [isBotOnline, setIsBotOnline] = useState(true)
  return (
    <IsBotOnlineContext.Provider value={isBotOnline}>
      <UpdateIsBotOnlineContext.Provider value={setIsBotOnline}>
        {children}
      </UpdateIsBotOnlineContext.Provider>
    </IsBotOnlineContext.Provider>
  );
};
