import type {
  Dispatch,
  SetStateAction} from "react";
import {
  createContext,
  useContext,
  useState,
} from "react";

import { isProduction } from "../../constants/frontendConstants";
import { emptyValueFunction } from "../../helpers/helpers";

const BotDomainContext = createContext<string>("");
const UpdateBotDomainContext = createContext<Dispatch<SetStateAction<string>>>(
  emptyValueFunction
);

export const useBotDomainContext = () => {
  return useContext(BotDomainContext);
};

export const useUpdateBotDomainContext = () => {
  return useContext(UpdateBotDomainContext);
};

export const BotDomainProvider = ({ children }: { children: JSX.Element }) => {
  const [botDomain, setBotDomain] = useState<string>(
    isProduction
      ? window.location.origin
      : process.env.REACT_APP_DEVELOPMENT_BOT_DOMAIN || ""
  );
  return (
    <BotDomainContext.Provider value={botDomain}>
      <UpdateBotDomainContext.Provider value={setBotDomain}>
        {children}
      </UpdateBotDomainContext.Provider>
    </BotDomainContext.Provider>
  );
};
