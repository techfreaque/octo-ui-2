import type { Dispatch, SetStateAction} from "react";
import { useCallback } from "react";
import { createContext, useContext, useState } from "react";

import { restartBot } from "../../api/actions";
import { emptyValueFunction } from "../../helpers/helpers";
import { useBotDomainContext } from "../config/BotDomainProvider";

const IsBotOnlineContext = createContext<boolean>(true);
const UpdateIsBotOnlineContext = createContext<
  Dispatch<SetStateAction<boolean>>
>(emptyValueFunction);

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
