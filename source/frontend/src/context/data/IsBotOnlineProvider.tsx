import { Dispatch, SetStateAction, useCallback } from "react";
import { useState, useContext, createContext } from "react";
import { restartBot } from "../../api/actions";
import { useBotDomainContext } from "../config/BotDomainProvider";

const IsBotOnlineContext = createContext<boolean>(true);
const UpdateIsBotOnlineContext = createContext<
  Dispatch<SetStateAction<boolean>>
>((_value) => {});

export const useIsBotOnlineContext = () => {
  return useContext(IsBotOnlineContext);
};

export const useUpdateIsBotOnlineContext = () => {
  return useContext(UpdateIsBotOnlineContext);
};

export function useRestartBot() {
  const updateIsOnline = useUpdateIsBotOnlineContext();
  const botDomain = useBotDomainContext();
  return useCallback(
    (notification = false) => {
      restartBot(botDomain, updateIsOnline, notification);
    },
    [botDomain, updateIsOnline]
  );
}

export const IsBotOnlineProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  // gets updated by NotifiactionContext
  const [isBotOnline, setIsBotOnline] = useState<boolean>(true);
  return (
    <IsBotOnlineContext.Provider value={isBotOnline}>
      <UpdateIsBotOnlineContext.Provider value={setIsBotOnline}>
        {children}
      </UpdateIsBotOnlineContext.Provider>
    </IsBotOnlineContext.Provider>
  );
};
